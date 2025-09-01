"use client"; // This is correct, placed at the top for client-side rendering

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useTranslation } from "@/app/i18n/client";
import LanguagePicker from "@/components/i18n/languagePicker";
import logo from "$/logo.png";

export default function Navbar({
	params: { lng },
}: {
	params: { lng: string };
}) {
	const { t } = useTranslation(lng, "landing-page", "");
	const [scrolled, setScrolled] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		document.addEventListener("scroll", handleScroll);
		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, [scrolled]);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	return (
		<nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
			<div className="navbar-content">
				<div className="navbar-logo">
					<Link href={`/${lng}`} prefetch={true}>
						<Image src={logo} alt={t("logoAlt")} height={30} />
					</Link>
				</div>
				{/* <div className="navbar-center">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder={t("searchPlaceholder")}
                    />
                </div> */}
				<div className="navbar-links-container">
					<Link href={`/${lng}`} prefetch={true}>
						<button className="add-listing-button">{t("addListing")}</button>
					</Link>
					<div className="navbar-links">
						<Link
							href={`/${lng}/articles`}
							className="nav-link"
							prefetch={true}
						>
							{t("navigationBar.articles")}
						</Link>
						<Link
							href={`/${lng}/partners`}
							className="nav-link"
							prefetch={true}
						>
							{t("navigationBar.partners")}
						</Link>
						<Link href={`/${lng}/about`} className="nav-link" prefetch={true}>
							{t("navigationBar.about")}
						</Link>
					</div>
					<LanguagePicker lng={lng} />
				</div>
			</div>
			<div
				className={`hamburger ${isDrawerOpen ? "hidden" : ""}`}
				onClick={toggleDrawer}
			>
				<div />
				<div />
				<div />
			</div>
			<div className={`drawer ${isDrawerOpen ? "show" : ""}`}>
				<button className="close-button" onClick={toggleDrawer}>
					&times;
				</button>
				<Link href={`/${lng}`} onClick={toggleDrawer} prefetch={true}>
					<button className="add-listing-button">{t("addListing")}</button>
				</Link>
				<Link
					href={`/${lng}/partners`}
					className="nav-link"
					onClick={toggleDrawer}
					prefetch={true}
				>
					{t("navigationBar.partners")}
				</Link>
				<Link
					href={`/${lng}/articles`}
					className="nav-link"
					onClick={toggleDrawer}
					prefetch={true}
				>
					{t("navigationBar.articles")}
				</Link>
				<Link
					href={`/${lng}/about`}
					className="nav-link"
					onClick={toggleDrawer}
					prefetch={true}
				>
					{t("navigationBar.about")}
				</Link>
				<LanguagePicker lng={lng} />
			</div>
		</nav>
	);
}
