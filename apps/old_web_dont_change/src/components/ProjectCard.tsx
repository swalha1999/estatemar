import Link from "next/link";
import styles from "./ProjectCard.module.css"; // Make sure this file exists

interface Project {
	id: number;
	title: string;
	// Add other properties that your project object has
}

interface ProjectCardProps {
	project: Project;
	lng: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, lng }) => {
	return (
		<Link
			href={`/${lng}/projects/${project.id}`}
			className={styles.card}
			prefetch={true}
		>
			<h3>{project.title}</h3>
			{/* Add other project details you want to display */}
		</Link>
	);
};

export default ProjectCard;
