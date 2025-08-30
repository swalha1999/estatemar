"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export function AndroidSmartBanner() {
	const [isVisible, setIsVisible] = useState(false);
	const [isAndroid, setIsAndroid] = useState(false);

	useEffect(() => {
		// Check if device is Android
		const userAgent = navigator.userAgent.toLowerCase();
		const isAndroidDevice = /android/.test(userAgent);
		setIsAndroid(isAndroidDevice);

		// Check if banner was previously dismissed
		const bannerDismissed = localStorage.getItem("android-banner-dismissed");

		if (isAndroidDevice && !bannerDismissed) {
			setIsVisible(true);
		}
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem("android-banner-dismissed", "true");
	};

	const handleInstall = () => {
		// Replace with your Android app's Play Store URL
		window.open(
			"#",
			"_blank",
		);
	};

	if (!isVisible || !isAndroid) {
		return null;
	}

	return (
		<div className="fixed top-0 right-0 left-0 z-50 border-gray-200 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center space-x-3">
					{/* App Icon */}
					<div className="flex h-12 w-12 items-center justify-center rounded-xl">
						<Image
							src="/blue_estatemar_logo.svg"
							alt="Estatemar App Icon"
							width={100}
							height={80}
							className="h-12 w-auto"
						/>
					</div>

					{/* App Info */}
					<div className="flex-1">
						<div className="font-semibold text-gray-900 text-sm dark:text-white">
							Estatemar
						</div>
						<div className="text-gray-500 text-xs dark:text-gray-400">
							Smarter Real Estate Platform
						</div>
						<div className="font-medium text-blue-600 text-xs dark:text-blue-400">
							FREE
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center space-x-2">
					<button
						type="button"
						onClick={handleInstall}
						className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
					>
						Install
					</button>
					<button
						type="button"
						onClick={handleDismiss}
						className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}
