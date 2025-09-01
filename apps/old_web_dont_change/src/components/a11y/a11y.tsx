"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import disabledIcon from "$/a11y/disability.png";

const AccessibilityButton = ({
	params: { lng },
}: {
	params: { lng: string };
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [fontSize, setFontSize] = useState(16);
	const [isGrayscale, setIsGrayscale] = useState(false);
	const [isHighContrast, setIsHighContrast] = useState(false);
	const [isInverted, setIsInverted] = useState(false);
	const [isLinksHighlighted, setIsLinksHighlighted] = useState(false);
	const [isReadableFont, setIsReadableFont] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const { t } = useTranslation(lng, "landing-page", {});

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const increaseTextSize = () => {
		setFontSize((prevSize) => prevSize + 2);
	};

	const decreaseTextSize = () => {
		setFontSize((prevSize) => Math.max(prevSize - 2, 12));
	};

	const toggleGrayscale = () => {
		setIsGrayscale(!isGrayscale);
	};

	const toggleHighContrast = () => {
		setIsHighContrast(!isHighContrast);
	};

	const toggleInvertColors = () => {
		setIsInverted(!isInverted);
	};

	const toggleHighlightLinks = () => {
		setIsLinksHighlighted(!isLinksHighlighted);
	};

	const toggleReadableFont = () => {
		setIsReadableFont(!isReadableFont);
	};

	const toggleTextToSpeech = () => {
		setIsSpeaking(!isSpeaking);
		if (!isSpeaking) {
			const text = document.body.innerText;
			const utterance = new SpeechSynthesisUtterance(text);
			window.speechSynthesis.speak(utterance);
		} else {
			window.speechSynthesis.cancel();
		}
	};

	useEffect(() => {
		const applyStyles = () => {
			document.documentElement.style.fontSize = `${fontSize}px`;
			document.documentElement.style.filter = `
        ${isGrayscale ? "grayscale(100%)" : ""}
        ${isHighContrast ? "contrast(150%)" : ""}
        ${isInverted ? "invert(100%)" : ""}
      `;
			if (isReadableFont) {
				document.documentElement.style.setProperty(
					"--font-family",
					"Arial, sans-serif",
				);
			} else {
				document.documentElement.style.removeProperty("--font-family");
			}

			const links = document.getElementsByTagName("a");
			Array.from(links).forEach((link) => {
				link.style.textDecoration = isLinksHighlighted ? "underline" : "";
				link.style.fontWeight = isLinksHighlighted ? "bold" : "";
			});
		};

		applyStyles();

		return () => {
			document.documentElement.style.fontSize = "";
			document.documentElement.style.filter = "";
			document.documentElement.style.removeProperty("--font-family");
			const links = document.getElementsByTagName("a");
			Array.from(links).forEach((link) => {
				link.style.textDecoration = "";
				link.style.fontWeight = "";
			});
		};
	}, [
		fontSize,
		isGrayscale,
		isHighContrast,
		isInverted,
		isLinksHighlighted,
		isReadableFont,
	]);

	return (
		<div className="-translate-y-1/2 fixed top-1/2 left-0 z-50 flex flex-col">
			<button
				onClick={toggleMenu}
				className="rounded-r bg-black p-2 text-white"
			>
				<Image src={disabledIcon} alt="Accessibility" width={16} height={16} />
			</button>
			{isOpen && (
				<div className="mt-1.5 rounded-r border border-black bg-white p-2.5">
					<ul className="m-0 list-none p-0">
						<li>
							<button
								onClick={increaseTextSize}
								className="w-full text-left text-black"
							>
								{t("a11y.increaseTextSize")}
							</button>
						</li>
						<li>
							<button
								onClick={decreaseTextSize}
								className="w-full text-left text-black"
							>
								{t("a11y.decreaseTextSize")}
							</button>
						</li>
						<li>
							<button
								onClick={toggleGrayscale}
								className="w-full text-left text-black"
							>
								{t("a11y.grayscale")}
							</button>
						</li>
						<li>
							<button
								onClick={toggleHighContrast}
								className="w-full text-left text-black"
							>
								{t("a11y.highContrast")}
							</button>
						</li>
						<li>
							<button
								onClick={toggleInvertColors}
								className="w-full text-left text-black"
							>
								{t("a11y.invertColors")}
							</button>
						</li>
						<li>
							<button
								onClick={toggleHighlightLinks}
								className="w-full text-left text-black"
							>
								{t("a11y.highlightLinks")}
							</button>
						</li>
						<li>
							<button
								onClick={toggleReadableFont}
								className="w-full text-left text-black"
							>
								{t("a11y.readableFont")}
							</button>
						</li>
						<li>
							<button
								onClick={toggleTextToSpeech}
								className="w-full text-left text-black"
							>
								{t("a11y.textToSpeech")}
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default AccessibilityButton;
