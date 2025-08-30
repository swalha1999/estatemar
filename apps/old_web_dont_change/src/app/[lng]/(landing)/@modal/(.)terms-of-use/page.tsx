import Modal from "@/app/[lng]/(landing)/@modal/Modal";
import TermsContent from "@/components/TermsContent/TermsContent";

export default async function InterceptedTermsOfUse(props: { params: Promise<{ lng: string }> }) {
    const params = await props.params;

    return (
        <Modal lng={params.lng}>
            <TermsContent lng={params.lng} />
        </Modal>
    );
}
