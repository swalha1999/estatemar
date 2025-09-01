"use client";

import { useQuery } from "@tanstack/react-query";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { orpc, setOrpcHeaders } from "@/utils/orpc";

export interface Organization {
	id: string;
	name: string;
	slug: string;
	type: "personal" | "team";
	role: "owner" | "admin" | "member";
	image?: string | null;
}

interface OrganizationContextType {
	currentOrg: Organization | null;
	organizations: Organization[];
	switchOrganization: (orgId: string) => void;
	isLoading: boolean;
	refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
	const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const switchOrganization = (orgId: string) => {
		const org = organizations.find((o) => o.id === orgId);
		if (org) {
			setCurrentOrg(org);
			localStorage.setItem("current-org-id", orgId);

			// Update headers for future requests
			setOrpcHeaders({
				"x-organization-id": orgId,
			});
		}
	};

	const {
		data: userOrgs = [],
		isLoading: orgsLoading,
		refetch: refetchOrganizations,
	} = useQuery(orpc.organization.getUserOrganizations.queryOptions());

	const refreshOrganizations = async () => {
		await refetchOrganizations();
	};

	// Update organizations state when query data changes
	useEffect(() => {
		if (userOrgs && userOrgs.length > 0) {
			setOrganizations(userOrgs);

			// Only set current org if we don't have one yet
			if (!currentOrg) {
				const savedOrgId = localStorage.getItem("current-org-id");
				const targetOrg = savedOrgId
					? userOrgs.find((o) => o.id === savedOrgId)
					: userOrgs.find((o) => o.type === "personal");

				if (targetOrg) {
					setCurrentOrg(targetOrg);
					setOrpcHeaders({
						"x-organization-id": targetOrg.id,
					});
				}
			}
		}
	}, [userOrgs, currentOrg]);

	// Update loading state
	useEffect(() => {
		setIsLoading(orgsLoading);
	}, [orgsLoading]);

	return (
		<OrganizationContext.Provider
			value={{
				currentOrg,
				organizations,
				switchOrganization,
				isLoading,
				refreshOrganizations,
			}}
		>
			{children}
		</OrganizationContext.Provider>
	);
}

export const useOrganization = () => {
	const context = useContext(OrganizationContext);
	if (!context) {
		throw new Error("useOrganization must be used within OrganizationProvider");
	}
	return context;
};
