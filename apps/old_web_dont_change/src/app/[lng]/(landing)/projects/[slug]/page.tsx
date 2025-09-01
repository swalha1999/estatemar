import { getTranslation } from "@/app/i18n";
import { Icon } from "@/components/icon";
import { getProject } from "@/utils/listings/project";
import { ContactInfo } from "./components/ContactInfo";
import { DeveloperInfo } from "./components/DeveloperInfo";
import { ProjectImages } from "./components/ProjectImages";
import { ProjectOverview } from "./components/ProjectOverview";
import styles from "./styles.module.css";

export default async function ProjectPage(props: {
	params: Promise<{ lng: string; slug: string }>;
}) {
	const params = await props.params;
	const { lng, slug } = params;

	const { t } = await getTranslation(lng, "project");
	const project = await getProject(undefined, slug);

	if (!project) {
		return <div className={styles.notFound}>{t("projectNotFound")}</div>;
	}

	return (
		<div className={`${styles.container} ${styles[lng]}`}>
			<div className={styles.titleContainer}>
				<h1 className={styles.title}>{project.name}</h1>
			</div>

			{/* <div className={styles.badgesContainer}>
                {project.is_best_seller && (
                    <div className={styles.bestSeller}>
                        <FaFire className={styles.fireIcon} />
                        <span>{t("bestSeller")}</span>
                    </div>
                )}
                {project.is_recommended && (
                    <div className={styles.recommended}>
                        <FaAward className={styles.awardIcon} />
                        <span>{t("recommended")}</span>
                    </div>
                )}
            </div> */}

			<p className={styles.description}>
				<Icon name="FaMapMarkerAlt" /> {project.city}
			</p>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("projectImages")}</h2>
				<ProjectImages
					images={project.images}
					projectName={project.name}
					t={t}
				/>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("projectOverview")}</h2>
				<ProjectOverview project={project} t={t} />
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("description")}</h2>
				<p>{project.description}</p>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("amenities")}</h2>
				<ul className={styles.list}>
					{project.amenities.map((amenity, index) => (
						<li
							key={index}
							className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
						>
							<Icon
								name={amenity.amenity.icon}
								className="h-5 w-5 text-primary-500"
							/>
							<span className="text-gray-800 dark:text-gray-200">
								{amenity.amenity.name}
							</span>
						</li>
					))}
				</ul>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>{t("aboutDeveloper")}</h2>
				<DeveloperInfo developer={project.developer} />
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>
					<Icon name="FaMapMarkerAlt" /> {t("contactInfo")}
				</h2>
				<ContactInfo developer={project.developer} />
			</div>
		</div>
	);
}
