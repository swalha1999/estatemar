import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { getUpdatesLeads } from "@/utils/leads/updates_leads";
import { UpdatesLeadsTable } from "./components/updates-leads-table";

interface LeadsPageProps {
	params: Promise<{ lng: string }>;
}

export default async function LeadsPage({ params }: LeadsPageProps) {
	const { lng } = await params;
	const leads = await getUpdatesLeads();
	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-bold text-2xl">Leads</h1>
				<Button asChild>
					<a href={`/api/leads/export?lng=${lng}`}>
						<Icon name="Download" className="mr-2 h-4 w-4" />
						Export Leads
					</a>
				</Button>
			</div>

			<UpdatesLeadsTable leads={leads} lng={lng} />
		</div>
	);
}
