import { Ionicons } from "@expo/vector-icons";

export const TabBarIcon = (props: {
	name: React.ComponentProps<typeof Ionicons>["name"];
	color: string;
	focused?: boolean;
}) => {
	return (
		<Ionicons
			size={26}
			style={{ marginBottom: -3 }}
			{...props}
		/>
	);
};
