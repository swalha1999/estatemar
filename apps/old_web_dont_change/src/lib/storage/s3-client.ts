import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

export const s3 = new S3Client({
	forcePathStyle: false,
	endpoint: process.env.DO_SPACES_ENDPOINT,
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID!,
		secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY!,
	},
});

export const uploadFile = async (file: File, isPublic = false) => {
	const bucketName = process.env.DO_SPACES_BUCKET_NAME;
	if (!bucketName) throw new Error("DO_SPACES_BUCKET_NAME is not defined");

	const fileName = `${Date.now()}-${file.name}`;

	const arrayBuffer = await file.arrayBuffer();

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: fileName,
		Body: Buffer.from(arrayBuffer),
		ContentType: file.type,
		ACL: "public-read",
	});

	try {
		await s3.send(command);
		return `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileName}`;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
};

export const deleteFile = async (fileName: string) => {
	const bucketName = process.env.DO_SPACES_BUCKET_NAME;
	if (!bucketName) throw new Error("DO_SPACES_BUCKET_NAME is not defined");

	const deleteParams = {
		Bucket: bucketName,
		Key: fileName,
	};

	try {
		await s3.send(new DeleteObjectCommand(deleteParams));
	} catch (error) {
		console.error("Error deleting file:", error);
		throw error;
	}
};
