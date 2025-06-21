'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { FileObject } from '@/lib/storage/r2';
import { useTranslations } from 'next-intl';

export default function FileManager() {
	const t = useTranslations('super.debug.upload');
	const [files, setFiles] = useState<FileObject[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		fetchFiles();
	}, []);

	const fetchFiles = async () => {
		try {
			const response = await fetch('/api/files');
			const data = await response.json();
			setFiles(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error(t('error_fetching_files'), error);
			setFiles([]);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!file) return;

		setIsUploading(true);
		setUploadProgress(0);
		abortControllerRef.current = new AbortController();

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileName: file.name, fileType: file.type }),
			});
			const { signedUrl } = await response.json();

			await uploadFileWithProgress(file, signedUrl, abortControllerRef.current.signal);

			alert(t('file_uploaded_success'));
			setFile(null);
			fetchFiles();
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				console.log(t('upload_cancelled'));
			} else {
				console.error(t('error_uploading_file'), error);
				alert(t('error_uploading_file'));
			}
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
			abortControllerRef.current = null;
		}
	};

	const uploadFileWithProgress = (
		file: File,
		signedUrl: string,
		signal: AbortSignal
	): Promise<void> => {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open('PUT', signedUrl);
			xhr.setRequestHeader('Content-Type', file.type);

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100;
					setUploadProgress(percentComplete);
				}
			};

			xhr.onload = () => {
				if (xhr.status === 200) {
					resolve();
				} else {
					reject(new Error(t('upload_failed_status', { status: xhr.status })));
				}
			};

			xhr.onerror = () => {
				reject(new Error(t('upload_failed')));
			};

			xhr.send(file);

			signal.addEventListener('abort', () => {
				xhr.abort();
				reject(new Error(t('upload_cancelled')));
			});
		});
	};

	const handleCancelUpload = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	};

	const handleDownload = async (key: string) => {
		try {
			const response = await fetch('/api/files', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key }),
			});
			const { signedUrl } = await response.json();
			window.open(signedUrl, '_blank');
		} catch (error) {
			console.error(t('error_downloading_file'), error);
			alert(t('error_downloading_file'));
		}
	};

	const handleDelete = async (key: string) => {
		try {
			await fetch('/api/files', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key }),
			});
			alert(t('file_deleted_success'));
			fetchFiles();
		} catch (error) {
			console.error(t('error_deleting_file'), error);
			alert(t('error_deleting_file'));
		}
	};

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl">
				<h1 className="mb-8 text-center text-4xl font-bold text-gray-800">{t('title')}</h1>
				<h2 className="mb-8 text-center text-3xl font-semibold text-gray-700">
					{t('upload_file')}
				</h2>

				<form onSubmit={handleUpload} className="mb-12">
					<div className="flex items-center gap-6">
						<label className="flex-1">
							<input
								type="file"
								onChange={handleFileChange}
								disabled={isUploading}
								className="hidden"
								id="file-upload"
							/>
							<div className="cursor-pointer rounded-xl border-2 border-blue-300 bg-blue-50 px-6 py-4 text-center text-lg text-blue-600 transition duration-300 hover:bg-blue-100">
								{file ? file.name : t('choose_file')}
							</div>
						</label>
						<button
							type="submit"
							disabled={!file || isUploading}
							className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-medium text-white transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isUploading ? t('uploading') : t('upload')}
						</button>
					</div>
				</form>

				{isUploading && (
					<div className="mb-12">
						<div className="mb-6 h-4 w-full rounded-full bg-gray-200">
							<div
								className="h-4 rounded-full bg-blue-600 transition-all duration-300"
								style={{ width: `${uploadProgress}%` }}
							></div>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-lg text-gray-700">
								{uploadProgress.toFixed(2)}% {t('uploaded')}
							</p>
							<button
								onClick={handleCancelUpload}
								className="text-lg font-medium text-red-500 transition duration-300 hover:text-red-600"
							>
								{t('cancel_upload')}
							</button>
						</div>
					</div>
				)}

				<h2 className="mb-6 text-3xl font-semibold text-gray-700">{t('files')}</h2>
				{files.length === 0 ? (
					<p className="text-center text-xl italic text-gray-500">{t('no_files')}</p>
				) : (
					<ul className="space-y-6">
						{files.map((file) => (
							<li
								key={file.Key}
								className="flex items-center justify-between rounded-xl bg-gray-50 p-6"
							>
								<span className="flex-1 truncate text-xl text-gray-700">
									{file.Key}
								</span>
								<div className="flex gap-4">
									<button
										onClick={() => file.Key && handleDownload(file.Key)}
										className="text-lg font-medium text-blue-600 transition duration-300 hover:text-blue-700"
									>
										{t('download')}
									</button>
									<button
										onClick={() => file.Key && handleDelete(file.Key)}
										className="text-lg font-medium text-red-500 transition duration-300 hover:text-red-600"
									>
										{t('delete')}
									</button>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
