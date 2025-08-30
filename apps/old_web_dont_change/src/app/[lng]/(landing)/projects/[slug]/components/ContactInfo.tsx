import styles from "../styles.module.css";
import { ProjectDetails } from "@/utils/listings/project";
import { Icon } from "@/components/icon";
interface ContactInfoProps {
    developer: ProjectDetails["developer"];
}

export function ContactInfo({ developer }: ContactInfoProps) {
    return (
        <div className={styles.contactInfo}>
            <p>
                <Icon name="FaPhone" />{" "}
                <span>
                    <a href={`tel:${developer.phone}`}>{developer.phone}</a>
                </span>
            </p>
            <p>
                <Icon name="FaWhatsapp" />{" "}
                <span>
                    <a
                        href={`https://wa.me/${developer.whatsapp?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {developer.whatsapp}
                    </a>
                </span>
            </p>
            <p>
                <Icon name="FaEnvelope" />{" "}
                <span>
                    <a href={`mailto:${developer.email}`}>{developer.email}</a>
                </span>
            </p>
            <p>
                <Icon name="FaGlobe" />{" "}
                <span>
                    <a
                        href={
                            developer.website?.startsWith("http")
                                ? developer.website
                                : `https://${developer.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {developer.website}
                    </a>
                </span>
            </p>
        </div>
    );
}
