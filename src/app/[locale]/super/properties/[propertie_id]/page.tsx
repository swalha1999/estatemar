import { PropertiesService } from "@/data/access-layer-v2/services";
import { getTranslations } from "next-intl/server";



export default async function PropertyPage({ params }: { params: { propertie_id: string } }) {
	const { propertie_id } = await params;
	const t = await getTranslations('properties');
    const propertiesService = new PropertiesService();
    const property = await propertiesService.getPropertyById(parseInt(propertie_id));

	return <div>{property?.title}</div>;
}