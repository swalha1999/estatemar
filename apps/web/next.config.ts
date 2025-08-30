import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname:
					"estatemar.d97515014e92cd4f04045d814b2679c4.r2.cloudflarestorage.com",
			},
		],
	},
};

export default nextConfig;
