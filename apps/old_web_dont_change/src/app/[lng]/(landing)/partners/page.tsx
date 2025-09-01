import Image from "next/image";
import Link from "next/link";
import React from "react";

import { getTranslation } from "@/app/i18n";
import PartnerApplicationForm from "@/components/PartnerApplicationForm/PartnerApplicationForm";
import { getDevelopers } from "@/utils/listings/developer";
import styles from "./partners.module.css";
export async function generateMetadata(props: {
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;

	const { lng } = params;

	const { t } = await getTranslation(lng, "partners-page");
	return {
		title: t("metaTitle", "Our Partners | Estatemar"),
		description: t(
			"metaDescription",
			"Discover our network of trusted partners in the real estate industry. Learn how you can become a partner and benefit from our collaborative platform.",
		),
	};
}

export default async function PartnersPage(props: {
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;

	const { lng } = params;

	const { t } = await getTranslation(lng, "partners-page");

	const developers = await getDevelopers();

	const benefits = t("partnerBenefits", { returnObjects: true }) as string[];

	return (
		<div className={styles.partnersPage}>
			<h1 className={styles.pageTitle}>{t("partnersTitle")}</h1>
			<p className={styles.pageDescription}>{t("partnersDescription")}</p>

			<div className={styles.partnersList}>
				{developers.map((developer) => (
					<Link
						key={developer.id}
						href={`/${lng}/partners/${developer.slug || developer.name.toLowerCase().replace(/\s/g, "-")}`}
						className={styles.partnerCardLink}
					>
						<div className={styles.partnerCard}>
							<Image
								src={developer.logo?.url || ""}
								alt={developer.name}
								width={developer.logo?.width || 100}
								height={developer.logo?.height || 100}
								className={styles.partnerLogo}
							/>
							<h2 className={styles.partnerName}>{developer.name}</h2>
							<p className={styles.partnerDescription}>
								{developer.description}
							</p>
						</div>
					</Link>
				))}
			</div>

			<div className={styles.becomePartner}>
				<h2>{t("becomePartnerTitle")}</h2>
				<p>{t("becomePartnerDescription")}</p>
				<ul>
					{benefits.map((benefit: string, index: number) => (
						<li key={index}>{benefit}</li>
					))}
				</ul>
			</div>
			<div className={styles.partnerApplicationForm}>
				<h2 className={styles.formTitle}>{t("partnerApplicationFormTitle")}</h2>
				<PartnerApplicationForm lng={lng} />
			</div>
		</div>
	);
}
