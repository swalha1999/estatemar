import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "estatemar",
		short_name: "estatemar",
		description: "my pwa app",
		start_url: "/new",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#ffffff",
		icons: [
			{
				src: "/favicon/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/favicon/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
