'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { saveUploadedFile } from '../actions';

interface UploadedImage {
	id: number;
	fileName: string;
	preview: string;
	isPrimary: boolean;
	displayOrder: number;
}

interface MultiImageUploaderProps {
	onImagesChange: (fileIds: number[]) => void;
	maxImages?: number;
	maxSizeMB?: number;
	acceptedFileTypes?: string;
	existingImages?: Array<{
		id: number;
		fileName: string;
		url: string;
		isPrimary: boolean;
		displayOrder: number;
	}>;
}

export function MultiImageUploader({
	onImagesChange,
	maxImages = 10,
	maxSizeMB = 5,
	acceptedFileTypes = 'image/*',
	existingImages = [],
}: MultiImageUploaderProps) {
	const [images, setImages] = useState<UploadedImage[]>(() => 
		existingImages.map(img => ({
			id: img.id,
			fileName: img.fileName,
			preview: img.url,
			isPrimary: img.isPrimary,
			displayOrder: img.displayOrder,
		}))
	);
	const [uploadingCount, setUploadingCount] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Update images when existingImages prop changes
	useEffect(() => {
		const mappedImages = existingImages.map(img => ({
			id: img.id,
			fileName: img.fileName,
			preview: img.url,
			isPrimary: img.isPrimary,
			displayOrder: img.displayOrder,
		}));
		setImages(mappedImages);
		onImagesChange(mappedImages.map(img => img.id));
	}, [existingImages, onImagesChange]);

	const maxSizeBytes = maxSizeMB * 1024 * 1024;

	const validateFile = (file: File): boolean => {
		const fileTypeIsValid = file.type.startsWith(acceptedFileTypes.replace('/*', '/'));
		if (!fileTypeIsValid) {
			toast({
				title: 'Invalid file type',
				description: `Please upload only ${acceptedFileTypes.replace('/*', '')} files`,
				variant: 'destructive',
			});
			return false;
		}

		if (file.size > maxSizeBytes) {
			toast({
				title: 'File too large',
				description: `Please upload files smaller than ${maxSizeMB}MB`,
				variant: 'destructive',
			});
			return false;
		}

		return true;
	};

	const uploadFile = async (file: File): Promise<UploadedImage | null> => {
		if (!validateFile(file)) return null;

		try {
			// Get signed URL for upload
			const uploadResponse = await fetch('/api/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileName: file.name,
					fileType: file.type,
				}),
			});

			if (!uploadResponse.ok) {
				throw new Error('Failed to get upload URL');
			}

			const { signedUrl, key } = await uploadResponse.json();

			// Upload file to R2
			const putResponse = await fetch(signedUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type,
				},
			});

			if (!putResponse.ok) {
				throw new Error('Failed to upload file');
			}

			// Save file record to database
			let saveResult;
			try {
				saveResult = await saveUploadedFile(key);
				
				if (!saveResult.success || !saveResult.fileId) {
					throw new Error(saveResult.error || 'Failed to save file');
				}
			} catch (saveError) {
				throw new Error(`Failed to save file to database: ${saveError instanceof Error ? saveError.message : 'Unknown error'}`);
			}

			// Create preview
			const reader = new FileReader();
			const preview = await new Promise<string>((resolve) => {
				reader.onload = (e) => resolve(e.target?.result as string);
				reader.readAsDataURL(file);
			});

			return {
				id: saveResult.fileId,
				fileName: key,
				preview,
				isPrimary: images.length === 0, // First image is primary
				displayOrder: images.length,
			};
		} catch (error) {
			console.error('Error uploading file:', error);
			toast({
				title: 'Upload failed',
				description: error instanceof Error ? error.message : 'An error occurred during upload',
				variant: 'destructive',
			});
			return null;
		}
	};

	const handleFileSelection = async (files: FileList) => {
		const filesToUpload = Array.from(files).slice(0, maxImages - images.length);
		
		if (filesToUpload.length === 0) {
			toast({
				title: 'Maximum images reached',
				description: `You can only upload up to ${maxImages} images`,
				variant: 'destructive',
			});
			return;
		}

		setUploadingCount(filesToUpload.length);

		const uploadPromises = filesToUpload.map(uploadFile);
		const results = await Promise.all(uploadPromises);
		const successfulUploads = results.filter((r): r is UploadedImage => r !== null);

		if (successfulUploads.length > 0) {
			const newImages = [...images, ...successfulUploads];
			setImages(newImages);
			onImagesChange(newImages.map(img => img.id));
			
			toast({
				title: 'Success',
				description: `${successfulUploads.length} image(s) uploaded successfully`,
			});
		}

		setUploadingCount(0);
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			await handleFileSelection(e.target.files);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			await handleFileSelection(e.dataTransfer.files);
		}
	};

	const removeImage = async (id: number) => {
		const newImages = images.filter(img => img.id !== id);
		
		// Reorder and set new primary if needed
		if (newImages.length > 0 && images.find(img => img.id === id)?.isPrimary) {
			newImages[0].isPrimary = true;
		}
		
		// Update display order
		newImages.forEach((img, index) => {
			img.displayOrder = index;
		});

		setImages(newImages);
		onImagesChange(newImages.map(img => img.id));
	};

	const setPrimaryImage = (id: number) => {
		const newImages = images.map(img => ({
			...img,
			isPrimary: img.id === id,
		}));
		setImages(newImages);
	};

	const moveImage = (fromIndex: number, toIndex: number) => {
		const newImages = [...images];
		const [movedImage] = newImages.splice(fromIndex, 1);
		newImages.splice(toIndex, 0, movedImage);
		
		// Update display order
		newImages.forEach((img, index) => {
			img.displayOrder = index;
		});
		
		setImages(newImages);
		onImagesChange(newImages.map(img => img.id));
	};

	return (
		<div className="space-y-4">
			{/* Upload Area */}
			{images.length < maxImages && (
				<div
					className={cn(
						'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
						isDragging
							? 'border-primary bg-primary/5'
							: 'border-muted-foreground/25',
						uploadingCount > 0 && 'opacity-50 pointer-events-none'
					)}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<div className="mb-4 rounded-full bg-primary/10 p-4">
						<Upload className="h-6 w-6 text-primary" />
					</div>
					<h3 className="mb-2 text-sm font-semibold">
						Click to upload or drag and drop
					</h3>
					<p className="mb-4 text-sm text-muted-foreground">
						{images.length} of {maxImages} images • Max {maxSizeMB}MB per file
					</p>
					<Button
						variant="outline"
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={uploadingCount > 0}
					>
						{uploadingCount > 0 ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading {uploadingCount} files...
							</>
						) : (
							'Select Images'
						)}
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept={acceptedFileTypes}
						multiple
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>
			)}

			{/* Image Grid */}
			{images.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{images.sort((a, b) => a.displayOrder - b.displayOrder).map((image, index) => (
						<Card key={image.id} className="relative group overflow-hidden">
							<CardContent className="p-0">
								<div className="relative aspect-square">
									<Image
										src={image.preview}
										alt={image.fileName}
										fill
										className="object-cover"
									/>
									
									{/* Overlay Controls */}
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
										<Button
											size="sm"
											variant={image.isPrimary ? 'default' : 'outline'}
											onClick={() => setPrimaryImage(image.id)}
											type="button"
											className="text-xs"
										>
											{image.isPrimary ? 'Primary' : 'Set Primary'}
										</Button>
										<Button
											size="icon"
											variant="destructive"
											onClick={() => removeImage(image.id)}
											type="button"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>

									{/* Primary Badge */}
									{image.isPrimary && (
										<div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
											Primary
										</div>
									)}

									{/* Drag Handle */}
									<div className="absolute top-2 right-2 bg-background/80 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
										<GripVertical className="h-4 w-4" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
} 