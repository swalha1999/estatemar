import React from "react";
import "./Footer.css";
import { getTranslation } from "@/app/i18n";
import Link from "next/link";
import { Icon } from "@/components/icon";
interface FooterProps {
    params: {
        lng: string;
    };
}

async function Footer(props: FooterProps) {
    const params = props.params;
    const { lng } = params;

    const { t } = await getTranslation(lng, "landing-page", {});

    return (
        <>
            <footer className="footer">
                <div className="footer-content">
                    {/* Legal Section */}
                    <div className="footer-contact">
                        <h3>{t("footer.legal")}</h3>
                        <p>
                            <Link href={`/${lng}/terms-of-use`}>{t("footer.terms")}</Link>
                        </p>
                        <p>
                            <Link href={`/${lng}/privacy-policy`}>{t("footer.privacy")}</Link>
                        </p>
                    </div>


                    {/* Social Media Section */}
                    <div className="footer-socials">
                        <h3>{t("footer.socials")}</h3>
                        <p>
                            <Icon name="FaInstagram" className="footer-icon" />
                            <a href="https://www.instagram.com/estatemar_official">
                                {t("footer.instagramValue")}
                            </a>
                        </p>
                        <p>
                            <Icon name="FaFacebook" className="footer-icon" />
                            <a href="https://www.facebook.com/profile.php?id=61567160023305">
                                {t("footer.facebookValue")}
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
