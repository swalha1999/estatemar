import { getTranslation } from "@/app/i18n";
import styles from "./about.module.css";

export default async function About(props: {
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;

	const { lng } = params;

	const { t } = await getTranslation(lng, "about");

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>{t("title")}</h1>

			<section className={styles.section}>
				<p className={styles.description}>{t("description")}</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("visionTitle")}</h2>
				<p className={styles.sectionText}>{t("visionDescription")}</p>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("goalsTitle")}</h2>
				<div className={styles.goalsList}>
					{["trust", "sustainable", "insights", "partnerships"].map((goal) => (
						<div key={goal} className={styles.goalItem}>
							<h3 className={styles.goalTitle}>{t(`goals.${goal}.title`)}</h3>
							<p className={styles.goalDescription}>
								{t(`goals.${goal}.description`)}
							</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
