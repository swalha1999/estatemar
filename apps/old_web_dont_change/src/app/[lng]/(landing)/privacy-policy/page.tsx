import PrivacyContent from "@/components/PrivacyContent/PrivacyContent";

export default async function PrivacyPolicyPage(props: { params: Promise<{ lng: string }> }) {
    const params = await props.params;
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PrivacyContent lng={params.lng} />
        </div>
    );
}
