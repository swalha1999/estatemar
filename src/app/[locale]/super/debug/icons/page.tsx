import { getIconNames } from '@/components/icon';
import { IconBrowser } from './icon-browser';

export default async function IconsPage() {
	const iconNames = getIconNames();

	return (
		<div className="container mx-auto min-h-screen p-6">
			<h1 className="mb-6 text-2xl font-bold ">Icon Browser</h1>
			<IconBrowser icons={iconNames} />
		</div>
	);
}
