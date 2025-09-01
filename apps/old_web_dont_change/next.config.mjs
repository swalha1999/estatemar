/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "estatemar-ejasdlkj1456s.fra1.cdn.digitaloceanspaces.com",
			},
			{
				hostname: "images.pexels.com",
			},
			{
				hostname: "example.com",
			},
			{
				hostname: "mil.solletics.com",
			},
		],
	},
	serverExternalPackages: ["@node-rs/argon2", "probe-image-size"],
	// output: "standalone"
};

export default nextConfig;
