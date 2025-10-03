import { Tabs } from "expo-router";
import { Platform } from "react-native";
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
					borderTopWidth: 0.5,
					elevation: 0,
					shadowColor: colors.shadow.md,
					shadowOffset: { width: 0, height: -4 },
					shadowOpacity: 1,
					shadowRadius: 8,
					height: Platform.OS === "ios" ? 100 : 56,
					paddingBottom: Platform.OS === "ios" ? 50 : 6,
					paddingTop: 6,
				},
				tabBarLabelStyle: {
					fontSize: 10,
					fontWeight: "600",
					fontFamily: "Montserrat_600SemiBold",
					marginBottom: Platform.OS === "ios" ? 0 : 4,
					marginTop: 6,
				},
				tabBarIconStyle: {
					marginTop: 4,
					marginBottom: 0,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Discover",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "search" : "search-outline"}
							color={color}
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: "Favorites",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "heart" : "heart-outline"}
							color={color}
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="properties"
				options={{
					title: "Properties",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "home" : "home-outline"}
							color={color}
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="sell"
				options={{
					title: "Sell",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "pricetag" : "pricetag-outline"}
							color={color}
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "person" : "person-outline"}
							color={color}
							focused={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
