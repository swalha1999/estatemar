"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { File as DBFile } from "@/db/schema";

interface FileUploadProps {
	onUploadComplete?: (data: DBFile) => void;
	accept?: string;
	maxSize?: number;
}

export function FileUpload({
	onUploadComplete,
	accept = "image/*",
	maxSize = 5242880,
}: FileUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (maxSize && file.size > maxSize) {
			setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
			return;
		}

		setUploading(true);
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) throw new Error("Upload failed");

			const data = await response.json();
			if (onUploadComplete) {
				onUploadComplete(data as DBFile);
			}
		} catch (err) {
			setError("Failed to upload file");
			console.error("Upload error:", err);
		} finally {
			setUploading(false);
		}
	};

	return (
		<Card>
			<CardContent className="space-y-4 p-6">
				<div className="flex flex-col items-center gap-1 rounded-lg border-2 border-gray-200 border-dashed p-6">
					<FileIcon className="h-12 w-12" />
					<span className="font-medium text-gray-500 text-sm">
						{uploading
							? "Uploading..."
							: "Drag and drop a file or click to browse"}
					</span>
					<span className="text-gray-500 text-xs">
						Maximum file size: {maxSize / 1024 / 1024}MB
					</span>
					{error && <span className="text-red-500 text-xs">{error}</span>}
				</div>
				<div className="space-y-2 text-sm">
					<Input
						id="file"
						type="file"
						onChange={handleUpload}
						accept={accept}
						disabled={uploading}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function FileIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		</svg>
	);
}
