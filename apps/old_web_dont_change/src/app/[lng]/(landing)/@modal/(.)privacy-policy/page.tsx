import Modal from "@/app/[lng]/(landing)/@modal/Modal";
import PrivacyContent from "@/components/PrivacyContent/PrivacyContent";

export default async function InterceptedPrivacyPolicy(props: {
    params: Promise<{ lng: string }>;
}) {
    const params = await props.params;

    return (
        <Modal lng={params.lng}>
            <PrivacyContent lng={params.lng} />
        </Modal>
    );
}
