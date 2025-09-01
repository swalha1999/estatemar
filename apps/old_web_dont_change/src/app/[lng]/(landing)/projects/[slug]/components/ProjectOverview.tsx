import { Icon } from "@/components/icon";
import type { ProjectDetails } from "@/utils/listings/project";
import styles from "../styles.module.css";

interface ProjectOverviewProps {
	project: ProjectDetails;
	t: (key: string) => string;
}

export function ProjectOverview({ project, t }: ProjectOverviewProps) {
	return (
		<div className={styles.details}>
			<p>
				<Icon name="FaBuilding" /> <strong>{t("developer")}:</strong>{" "}
				{project.developer.name}
			</p>
			<p>
				<Icon name="FaDollarSign" /> <strong>{t("priceRange")}:</strong>{" "}
				{project.min_price} - {project.max_price}
			</p>
			<p>
				<Icon name="FaCalendarAlt" /> <strong>{t("completionDate")}:</strong>{" "}
				{project.date_of_completion
					? project.date_of_completion.toLocaleDateString()
					: t("notAvailable")}
			</p>
			{/* <p>
                <FaHome /> <strong>{t("status")}:</strong> {project.project_status}
            </p>
            <p>
                <FaCheck /> <strong>{t("type")}:</strong> {project.project_type}
            </p>
            <p>
                <strong>{t("totalUnits")}:</strong> {project.total_units}
            </p>
            <p>
                <strong>{t("availableUnits")}:</strong> {project.available_units}
            </p> */}
		</div>
	);
}
