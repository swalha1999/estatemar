import Image from "next/image";
import type { ProjectDetails } from "@/utils/listings/project";

interface ProjectImagesProps {
	images: ProjectDetails["images"];
	projectName: string;
	t: (key: string) => string;
}

export function ProjectImages({ images, projectName, t }: ProjectImagesProps) {
	return (
		<div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
			{images.map((image, index) => (
				<div
					key={index}
					className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]"
				>
					<Image
						src={image.image.url}
						alt={`${projectName} - ${t("image")} ${index + 1}`}
						width={image.image.width ?? 1920}
						height={image.image.height ?? 1080}
						className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
						priority={index < 3}
					/>
					{process.env.DEBUG === "true" && (
						<div className="absolute right-0 bottom-0 left-0 bg-black/50 p-2 text-white">
							[DEBUG] {image.image.width} x {image.image.height}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
