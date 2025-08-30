"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

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
			"https://play.google.com/store/apps/details?id=net.nadsoft.salati",
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
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-green-500">
						<svg
							className="h-6 w-6 text-white"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
					</div>

					{/* App Info */}
					<div className="flex-1">
						<div className="font-semibold text-gray-900 text-sm dark:text-white">
							Salati
						</div>
						<div className="text-gray-500 text-xs dark:text-gray-400">
							Islamic Prayer Times & Qibla
						</div>
						<div className="font-medium text-blue-600 text-xs dark:text-blue-400">
							FREE
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center space-x-2">
					<button
						onClick={handleInstall}
						className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
					>
						Install
					</button>
					<button
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
