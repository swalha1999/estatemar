import { R2 } from "@repo/cloudflare-r2";

if (!process.env.R2_ACCOUNT_ID) {
	throw new Error("R2_ACCOUNT_ID is required");
}
if (!process.env.R2_ACCESS_KEY_ID) {
	throw new Error("R2_ACCESS_KEY_ID is required");
}
if (!process.env.R2_SECRET_ACCESS_KEY) {
	throw new Error("R2_SECRET_ACCESS_KEY is required");
}
if (!process.env.R2_BUCKET_NAME) {
	throw new Error("R2_BUCKET_NAME is required");
}

export const r2 = new R2({
	accountId: process.env.R2_ACCOUNT_ID,
	accessKeyId: process.env.R2_ACCESS_KEY_ID,
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
});

export const bucket = r2.bucket(process.env.R2_BUCKET_NAME);
