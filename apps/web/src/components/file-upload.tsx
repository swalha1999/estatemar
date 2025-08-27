"use client";

import { IconUpload, IconX } from "@tabler/icons-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { client } from "@/utils/orpc";

interface FileUploadProps {
	files: File[];
	onFilesChange: (files: File[]) => void;
	onUploadSuccess?: (
		uploadedFiles: Array<{ objectKey: string; signedUrl: string }>,
	) => void;
	onUploadError?: (error: string) => void;
	accept?: string;
	multiple?: boolean;
	maxSize?: number; // in MB
	className?: string;
	showPreview?: boolean;
}

export function FileUpload({
	files,
	onFilesChange,
	onUploadSuccess,
	onUploadError,
	accept = "image/*",
	multiple = true,
	maxSize = 10,
	className = "",
	showPreview = true,
}: FileUploadProps) {
	const uploadId = useId();

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);

		// Validate file sizes
		const validFiles = selectedFiles.filter((file) => {
			if (file.size > maxSize * 1024 * 1024) {
				onUploadError?.(
					`File ${file.name} is too large. Maximum size is ${maxSize}MB.`,
				);
				return false;
			}
			return true;
		});

		onFilesChange(multiple ? [...files, ...validFiles] : validFiles);
	};

	const removeFile = (index: number) => {
		onFilesChange(files.filter((_, i) => i !== index));
	};

	const uploadFiles = async () => {
		const uploadedFiles: Array<{
			objectKey: string;
			signedUrl: string;
		}> = [];

		for (const file of files) {
			try {
				const result = await client.uploadFile({
					file,
					fileName: `${Date.now()}-${file.name}`,
				});

				if (result.success && result.data) {
					uploadedFiles.push({
						objectKey: result.data.objectKey,
						signedUrl: result.data.signedUrl,
					});
				} else {
					onUploadError?.(`Failed to upload ${file.name}: ${result.error}`);
				}
			} catch (error) {
				onUploadError?.(
					`Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}

		if (uploadedFiles.length > 0) {
			onUploadSuccess?.(uploadedFiles);
		}
	};

	return (
		<div className={`space-y-4 ${className}`}>
			<div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-6 text-center">
				<input
					type="file"
					accept={accept}
					multiple={multiple}
					onChange={handleFileSelect}
					className="hidden"
					id={uploadId}
				/>
				<label htmlFor={uploadId} className="cursor-pointer">
					<IconUpload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
					<p className="text-muted-foreground text-sm">
						Click to upload files or drag and drop
					</p>
					<p className="mt-1 text-muted-foreground text-xs">
						{accept} up to {maxSize}MB each
					</p>
				</label>
			</div>

			{files.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm">
							Selected Files ({files.length})
						</h4>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={uploadFiles}
						>
							Upload All
						</Button>
					</div>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{files.map((file, index) => (
							<div key={file.name} className="group relative">
								{showPreview && file.type.startsWith("image/") ? (
									<div className="aspect-video overflow-hidden rounded-lg bg-muted">
										<img
											src={URL.createObjectURL(file)}
											alt={file.name}
											className="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
									</div>
								) : (
									<div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
										<span className="px-2 text-center text-muted-foreground text-sm">
											{file.name}
										</span>
									</div>
								)}
								<Button
									type="button"
									variant="destructive"
									size="sm"
									className="-top-2 -right-2 absolute h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
									onClick={() => removeFile(index)}
								>
									<IconX className="h-4 w-4" />
								</Button>
								<div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 p-1 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
									{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
