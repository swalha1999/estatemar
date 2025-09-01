import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { uploadFile } from "@/lib/storage/s3-client";
import { getImageMetadata } from "@/utils/images";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Upload to S3
		const fileUrl = await uploadFile(file);

		let width = null;
		let height = null;
		let type = null;

		if (file.type.startsWith("image/")) {
			const image = await getImageMetadata(fileUrl);
			width = image?.width;
			height = image?.height;
			type = image?.type;
		}

		// TODO: remove this and move it the data layer
		// Store file reference in database
		const [newFile] = await db
			.insert(files)
			.values({
				url: fileUrl,
				file_type: file.type,
				width: width,
				height: height,
				size: file.size,
			})
			.returning();

		return NextResponse.json(newFile);
	} catch (error) {
		console.error("Error handling file upload:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
