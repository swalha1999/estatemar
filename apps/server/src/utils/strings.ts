// make the string look good and start with Big letter
export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateSlug = (str: string) => {
	return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};