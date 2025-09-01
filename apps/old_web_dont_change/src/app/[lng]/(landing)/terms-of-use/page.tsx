import TermsContent from "@/components/TermsContent/TermsContent";

export default async function TermsOfUsePage(props: {
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;
	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<TermsContent lng={params.lng} />
		</div>
	);
}
