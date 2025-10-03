import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/tabbar-icon";
import { colors } from "@/lib/theme";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.primary.main,
				tabBarInactiveTintColor: colors.grey[400],
				tabBarStyle: {
					backgroundColor: colors.background.main,
					borderTopColor: colors.border.light,
					borderTopWidth: 1,
					elevation: 8,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: -2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Discover",
					tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: "Favorites",
					tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="properties"
				options={{
					title: "My Properties",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="sell"
				options={{
					title: "Sell",
					tabBarIcon: ({ color }) => <TabBarIcon name="tag" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
