import {
	deleteFileSchema,
	getSignedUrlSchema,
	uploadFileSchema,
} from "@estatemar/schemas/files";
import { protectedProcedure } from "../lib/orpc";
import { bucket } from "../lib/r2";

export const filesRouter = {
	uploadFile: protectedProcedure
		.input(uploadFileSchema)
		.handler(async ({ input }) => {
			try {
				const { file, fileName } = input;
				const destination = fileName || file.name;

				// Convert File to Buffer for upload
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				const result = await bucket.upload(
					buffer,
					destination,
					undefined,
					file.type,
				);

				// Generate signed URL for the uploaded file
				const signedUrl = await bucket.getObjectSignedUrl(
					result.objectKey,
					3600,
				); // 1 hour

				return {
					success: true,
					data: {
						objectKey: result.objectKey,
						uri: result.uri,
						signedUrl,
						etag: result.etag,
						versionId: result.versionId,
					},
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : "Upload failed",
				};
			}
		}),
	getSignedUrl: protectedProcedure
		.input(getSignedUrlSchema)
		.handler(async ({ input }) => {
			try {
				const { fileName, expiresIn } = input;
				const signedUrl = await bucket.putObjectSignedUrl(fileName, expiresIn);

				return {
					success: true,
					data: {
						signedUrl,
						fileName,
						expiresIn,
					},
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to generate signed URL",
				};
			}
		}),
	deleteFile: protectedProcedure
		.input(deleteFileSchema)
		.handler(async ({ input }) => {
			try {
				const { fileName } = input;
				const success = await bucket.deleteObject(fileName);

				return {
					success,
					message: success
						? "File deleted successfully"
						: "Failed to delete file",
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : "Delete failed",
				};
			}
		}),
	listFiles: protectedProcedure.handler(async () => {
		try {
			const result = await bucket.listObjects();

			return {
				success: true,
				data: result.objects,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to list files",
			};
		}
	}),
};
