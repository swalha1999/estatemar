import { getIconNames } from "@/components/icon";
import { IconBrowser } from "./icon-browser";

export default async function IconsPage() {
    const iconNames = getIconNames();
    
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Icon Browser</h1>
            <IconBrowser icons={iconNames} />
        </div>
    );
}
