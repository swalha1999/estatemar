"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const languages = ["en", "ar", "he"];

const flagUrls: Record<string, string> = {
	en: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/gb.svg",
	ar: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/ae.svg",
	he: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/il.svg",
	fr: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/fr.svg",
	es: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/es.svg",
	de: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/de.svg",
};

export default function LanguagePicker({ lng }: { lng: string }) {
	const router = useRouter();
	const { t } = useTranslation("common");
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLanguageChange = (newLng: string) => {
		const currentPath = window.location.pathname;
		const newPath = currentPath.replace(`/${lng}`, `/${newLng}`);
		router.push(newPath);
		setIsOpen(false);
	};

	return (
		<div className="language-picker" ref={dropdownRef}>
			<button
				className="language-picker-button"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Image
					src={flagUrls[lng]}
					alt={lng}
					width={24}
					height={18}
					className="language-flag"
				/>
				<span>{t(`language-name-${lng}`)}</span>
				<svg
					className="dropdown-arrow"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M2.5 4.5L6 8L9.5 4.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			{isOpen && (
				<div className="language-picker-dropdown">
					{languages
						.filter((l) => l !== lng)
						.map((l) => (
							<div
								key={l}
								className="language-option"
								onClick={() => handleLanguageChange(l)}
							>
								<Image
									src={flagUrls[l]}
									alt={l}
									width={24}
									height={18}
									className="language-flag"
								/>
								<span>{t(`language-name-${l}`)}</span>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
