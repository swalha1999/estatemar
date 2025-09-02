// CSS imports
declare module "*.css" {
	const content: string;
	export default content;
}

// CSS modules
declare module "*.module.css" {
	const classes: { [key: string]: string };
	export default classes;
}
