'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { exportFamiliesCSV } from '../actions';
import { useState } from 'react';

export function CSVDownloadButton() {
	const t = useTranslations('super.families');
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = async () => {
		try {
			setIsDownloading(true);
			const csvContent = await exportFamiliesCSV();
			
			// Create UTF-8 encoded content with BOM using byte array for better Arabic support
			const utf8BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
			const contentBytes = new TextEncoder().encode(csvContent);
			
			// Combine BOM and content
			const finalContent = new Uint8Array(utf8BOM.length + contentBytes.length);
			finalContent.set(utf8BOM, 0);
			finalContent.set(contentBytes, utf8BOM.length);
			
			const blob = new Blob([finalContent], { 
				type: 'text/csv;charset=utf-8' 
			});
			
			// Create a download link
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', `families-${new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}.csv`);
			link.style.visibility = 'hidden';
			
			// Trigger the download
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
			// Clean up the URL object
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading CSV:', error);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<Button 
			onClick={handleDownload} 
			variant="outline"
			disabled={isDownloading}
		>
			<Download className="mr-2 h-4 w-4" />
			{isDownloading ? t('downloading') : t('downloadCSV')}
		</Button>
	);
} 