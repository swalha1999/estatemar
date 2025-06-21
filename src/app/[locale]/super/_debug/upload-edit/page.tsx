import { ImageUploader } from '@/components/uploads/image-uploader';
import { getTranslations } from 'next-intl/server';

export default async function UploadDebugPage() {
	const t = await getTranslations('super.debug.upload');

	return <ImageUploader fileKey="example-1746295312661.jpeg" />;
}
