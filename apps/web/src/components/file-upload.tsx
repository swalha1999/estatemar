"use client";

import { IconUpload, IconX } from "@tabler/icons-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { client } from "@/utils/orpc";

interface FileUploadProps {
	files: File[];
	onFilesChange: (files: File[]) => void;
	onUploadSuccess?: (
		uploadedFiles: Array<{ objectKey: string; publicUrl: string | null }>,
	) => void;
	onUploadError?: (error: string) => void;
	accept?: string;
	multiple?: boolean;
	maxSize?: number; // in MB
	className?: string;
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
			publicUrl: string | null;
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
						publicUrl: result.data.publicUrl,
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
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
						{files.map((file, index) => (
							<div
								key={file.name}
								className="flex items-center justify-between rounded-lg border p-2"
							>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium text-sm">{file.name}</p>
									<p className="text-muted-foreground text-xs">
										{(file.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0"
									onClick={() => removeFile(index)}
								>
									<IconX className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
