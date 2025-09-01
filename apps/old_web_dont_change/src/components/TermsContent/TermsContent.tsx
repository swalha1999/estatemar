"use client";
import styles from "@/app/[lng]/(landing)/@modal/Modal.module.css";
import { useTranslation } from "@/app/i18n/client";

interface TermsContentProps {
	lng: string;
}

const TermsContent: React.FC<TermsContentProps> = ({ lng }) => {
	const { t } = useTranslation(lng, "terms", "");

	const sections = [
		"terms",
		"license",
		"responsibilities",
		"limitations",
		"availability",
		"thirdParty",
		"intellectual",
		"contributions",
		"modifications",
		"jurisdiction",
		"contact",
	];

	return (
		<div className={styles.content}>
			<h1>{t("title")}</h1>
			<p className={styles.lastModified}>{t("lastModified")}</p>
			<p className={styles.welcome}>{t("welcome")}</p>

			{sections.map((section) => (
				<div key={section} className={styles.section}>
					<h2>{t(`sections.${section}.title`)}</h2>
					<p>{t(`sections.${section}.content`)}</p>
				</div>
			))}
		</div>
	);
};

export default TermsContent;
