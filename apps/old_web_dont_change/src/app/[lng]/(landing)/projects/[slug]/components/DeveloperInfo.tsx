import Image from "next/image";
import type { ProjectDetails } from "@/utils/listings/project";
import styles from "../styles.module.css";

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
