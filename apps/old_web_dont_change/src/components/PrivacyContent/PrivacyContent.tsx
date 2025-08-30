"use client";
import { useTranslation } from "@/app/i18n/client";
import styles from "@/app/[lng]/(landing)/@modal/Modal.module.css";

interface PrivacyContentProps {
    lng: string;
}

const PrivacyContent: React.FC<PrivacyContentProps> = ({ lng }) => {
    const { t } = useTranslation(lng, "privacy", "");

    const sections = [
        "information",
        "usage",
        "sharing",
        "security",
        "rights",
        "cookies",
        "thirdParty",
        "changes",
        "contact",
    ];

    return (
        <div className={styles.privacyContent}>
            <h1>{t("title")}</h1>
            <p className={styles.lastModified}>{t("lastUpdated")}</p>
            <p className={styles.introduction}>{t("introduction")}</p>

            <div className={styles.sectionsContainer}>
                {sections.map((section, index) => (
                    <section key={section} className={styles.section}>
                        <h2>{`${index + 1}. ${t(`sections.${section}.title`)}`}</h2>
                        <div className={styles.sectionContent}>
                            {t(`sections.${section}.content`)
                                .split("\n\n")
                                .map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default PrivacyContent;
