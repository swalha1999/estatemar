import { getTranslation } from "@/app/i18n";
import { getDeveloperBySlug } from "@/utils/listings/developer";
import styles from "./partner.module.css";

interface PageProps {
    params: Promise<{ slug: string; lng: string }>;
}

export default async function PartnerDetailPage({ params }: PageProps) {
    const { slug, lng } = await params;

    const { t } = await getTranslation(lng, "partners-page");

    const partner = await getDeveloperBySlug(slug);

    if (!partner) {
        return <div>Partner not found</div>;
    }

    return (
        <div className={styles.partnerDetail}>
            <div className={styles.header}>
                <h1>{partner.name}</h1>
            </div>

            {/* <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>100+</span>
                    <span className={styles.statLabel}>Projects Completed</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>15</span>
                    <span className={styles.statLabel}>Active Projects</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>20</span>
                    <span className={styles.statLabel}>Years in Business</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>$2.5B</span>
                    <span className={styles.statLabel}>Total Investment Value</span>
                </div>
            </div> */}

            <div className={styles.description}>
                <p>{partner.description}</p>
            </div>

            <div className={styles.featuredProjects}>
                <h2>{t("featuredProjects")}</h2>
                {/* TODO: Add featured projects */}
                {/* <div className={styles.projectsGrid}>
                    {partner.featuredProjects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <Image
                                src={project.image}
                                alt={project.name}
                                width={300}
                                height={200}
                                className={styles.projectImage}
                            />
                            <h3>{project.name}</h3>
                            <p>
                                {t("location")}: {project.location}
                            </p>
                            <span className={styles.status}>
                                {t("status")}: {project.status}
                            </span>
                        </div>
                    ))}
                </div> */}
            </div>

            <div className={styles.contact}>
                <h2>{t("contactInformation")}</h2>
                <div className={styles.contactInfo}>
                    <p>
                        {t("email")}: {partner.email}
                    </p>
                    <p>
                        {t("phone")}: {partner.phone}
                    </p>
                    <p>
                        {t("address")}: {partner.website}
                    </p>
                </div>
            </div>
        </div>
    );
}
