"use client";

import type { OrganizationWithMember } from "@estatemar/schemas/organizations";
import { useQuery } from "@tanstack/react-query";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { orpc } from "@/utils/orpc";

interface OrganizationContextType {
	currentOrg: OrganizationWithMember | null;
	userOrgs: OrganizationWithMember[];
	switchOrg: (orgId: string | null) => void;
	isPersonal: boolean;
	isLoading: boolean;
	refetchOrgs: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function useOrganization() {
	const context = useContext(OrganizationContext);
	if (!context) {
		throw new Error("useOrganization must be used within OrganizationProvider");
	}
	return context;
}

interface OrganizationProviderProps {
	children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
	const [currentOrg, setCurrentOrg] = useState<OrganizationWithMember | null>(
		null,
	);

	const {
		data: orgsResponse,
		isLoading,
		refetch,
	} = useQuery({
		...orpc.organizations.getUserOrganizations.queryOptions({
			input: { limit: 25, offset: 0 },
		}),
		staleTime: 5 * 60 * 1000,
	});

	const userOrgs =
		orgsResponse?.success && orgsResponse.data
			? orgsResponse.data.map((org) => ({
					...org,
					settings: org.settings as Record<string, unknown>,
					description: org.description || undefined,
					image: org.image || undefined,
				}))
			: [];

	// Initialize current organization from localStorage
	useEffect(() => {
		if (!userOrgs?.length) {
			setCurrentOrg(null);
			return;
		}

		if (currentOrg) return;

		const savedOrgId = localStorage.getItem("currentOrganizationId");
		if (savedOrgId && savedOrgId !== "null") {
			const savedOrg = userOrgs.find((org) => org.id === savedOrgId);
			if (savedOrg) {
				setCurrentOrg(savedOrg);
				return;
			}
		}

		// Default to first organization
		setCurrentOrg(userOrgs[0]);
	}, [userOrgs, currentOrg]);

	const switchOrg = (orgId: string | null) => {
		if (!userOrgs) return;

		const selectedOrg = userOrgs.find((org) => org.id === orgId);
		if (selectedOrg) {
			setCurrentOrg(selectedOrg);
			localStorage.setItem("currentOrganizationId", orgId || "null");
		}
	};

	const isPersonal = false;

	const refetchOrgs = () => {
		refetch();
	};

	const value: OrganizationContextType = {
		currentOrg,
		userOrgs: userOrgs || [],
		switchOrg,
		isPersonal,
		isLoading,
		refetchOrgs,
	};

	return (
		<OrganizationContext.Provider value={value}>
			{children}
		</OrganizationContext.Provider>
	);
}
