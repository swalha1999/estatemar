import type React from "react";

interface StructuredDataProps {
	type: string;
	name: string;
	description: string;
	url: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
	type,
	name,
	description,
	url,
}) => {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": type,
		name,
		description,
		url,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
};

export default StructuredData;
