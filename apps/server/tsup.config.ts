import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	target: "node22",
	outDir: "dist",
	clean: true,
	sourcemap: true,
	minify: false,
	splitting: false,
	treeshake: true,
	dts: false,
	external: [],
	noExternal: [],
	platform: "node",
});
