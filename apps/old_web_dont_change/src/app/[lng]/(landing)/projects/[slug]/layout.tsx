import { getTranslation } from "@/app/i18n";
import Link from "next/link";
import styles from "./styles.module.css";
import { Icon } from "@/components/icon";

export default async function ProjectLayout(props: {
    children: React.ReactNode;
    params: Promise<{ lng: string }>;
}) {
    const params = await props.params;

    const { lng } = params;

    const { children } = props;

    const { t } = await getTranslation(lng, "common");
    const isRTL = ["ar", "he"].includes(lng);

    return (
        <div className={`${styles.layout} ${styles[lng]}`}>
            <nav className={styles.nav}>
                <Link href={`/${lng}`} className={styles.backLink} prefetch={true}>
                    {isRTL ? (
                        <>
                            <Icon name="IoIosArrowBack" className={`${styles.backIcon} ${styles.rtlIcon}`} />
                            {t("backToHome")}
                        </>
                    ) : (
                        <>
                            <Icon name="IoIosArrowBack" className={styles.backIcon} />
                            {t("backToHome")}
                        </>
                    )}
                </Link>
            </nav>
            <main className={styles.main}>{children}</main>
        </div>
    );
}
