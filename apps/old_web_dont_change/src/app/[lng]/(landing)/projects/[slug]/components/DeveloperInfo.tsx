import Image from "next/image";
import styles from "../styles.module.css";
import { ProjectDetails } from "@/utils/listings/project";

interface DeveloperInfoProps {
    developer: ProjectDetails["developer"];
}

export function DeveloperInfo({ developer }: DeveloperInfoProps) {
    return (
        <div className={styles.developerSection}>
            <div className={styles.developerLogoContainer}>
                <Image
                    src={developer.logo?.url ?? ""}
                    alt={developer.name}
                    width={150}
                    height={150}
                    className={styles.developerLogo}
                />
            </div>
            <div className={styles.developerInfo}>
                <h3 className={styles.developerName}>{developer.name}</h3>
                <p>{developer.description}</p>
            </div>
        </div>
    );
}
