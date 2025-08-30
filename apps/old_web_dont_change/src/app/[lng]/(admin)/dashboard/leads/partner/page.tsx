import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { PartnersLeadsTable } from "./components/partners-leads-table";
import { getPartnerLeads } from "@/utils/leads/partner_leads";

interface LeadsPageProps {
    params: Promise<{ lng: string }>;
}

export default async function LeadsPage({ params }: LeadsPageProps) {
    const { lng } = await params;
    const leads = await getPartnerLeads();
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Leads</h1>
                <Button asChild>
                    <a href={`/api/leads/export?lng=${lng}`}>
                        <Icon name="Download" className="w-4 h-4 mr-2" />
                        Export Leads
                    </a>
                </Button>
            </div>

            <PartnersLeadsTable leads={leads} lng={lng} />
        </div>
    );
}
