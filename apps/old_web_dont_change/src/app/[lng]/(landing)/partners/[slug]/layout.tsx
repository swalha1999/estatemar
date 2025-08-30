import { getTranslation } from "@/app/i18n";
import Link from "next/link";
import styles from "./partner.module.css";
import { Icon } from "@/components/icon";

export default async function PartnerLayout(props: {
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
                <Link href={`/${lng}/partners`} className={styles.backLink} prefetch={true}>
                    {isRTL ? (
                        <>
                            <Icon name="IoIosArrowBack" className={`${styles.backIcon} ${styles.rtlIcon}`} />
                            {t("backToPartners")}
                        </>
                    ) : (
                        <>
                            <Icon name="IoIosArrowBack" className={styles.backIcon} />
                            {t("backToPartners")}
                        </>
                    )}
                </Link>
            </nav>
            <main className={styles.main}>{children}</main>
        </div>
    );
}
