import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { authClient } from "@/lib/auth-client";
import { colors } from "@/lib/theme";
import { orpc, queryClient } from "@/utils/orpc";

export default function ProfileScreen() {
	const { data: session } = authClient.useSession();

	const { data: propertiesData, isLoading: propertiesLoading } = useQuery(
		orpc.realEstate.property.getMyProperties.queryOptions({
			input: {
				page: 1,
				limit: 100,
			},
		}),
	);

	const { data: favoritesData, isLoading: favoritesLoading } = useQuery(
		orpc.realEstate.property.getMyFavorites.queryOptions({
			input: {
				page: 1,
				limit: 100,
			},
		}),
	);

	if (!session?.user) {
		return (
			<Container>
				<View className="flex-1 p-4">
					<Text className="font-bold text-2xl text-foreground">Profile</Text>
					<Text className="mt-2 mb-6 text-muted-foreground">
						Sign in to view your profile
					</Text>
					<SignIn />
				</View>
			</Container>
		);
	}

	const properties = propertiesData?.data?.properties || [];
	const favorites = favoritesData?.data?.favorites || [];

	const calculateTotalValue = () => {
		let total = 0;
		for (const prop of properties) {
			const value = prop.marketValue
				? Number.parseFloat(prop.marketValue)
				: prop.purchasePrice
					? Number.parseFloat(prop.purchasePrice)
					: 0;
			total += value;
		}
		return total;
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "AED",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const isLoading = propertiesLoading || favoritesLoading;

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="border-border border-b bg-primary px-4 pt-6 pb-8">
					<Text className="font-bold text-2xl text-white">Profile</Text>
					<View className="mt-4 flex-row items-center">
						<View className="h-16 w-16 items-center justify-center rounded-full bg-white">
							<Text className="font-bold text-2xl text-primary">
								{session.user.name?.[0]?.toUpperCase() || "U"}
							</Text>
						</View>
						<View className="ml-4 flex-1">
							<Text className="font-bold text-white text-xl">
								{session.user.name}
							</Text>
							<Text className="mt-1 text-sm text-white opacity-90">
								{session.user.email}
							</Text>
						</View>
					</View>
				</View>

				{isLoading ? (
					<View className="items-center justify-center p-8">
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				) : (
					<View className="p-4">
						<Text className="mb-3 font-semibold text-foreground">
							Statistics
						</Text>
						<View className="mb-6 flex-row gap-3">
							<View className="flex-1 rounded-lg border border-border bg-card p-4">
								<Text className="text-muted-foreground text-xs">
									Properties
								</Text>
								<Text className="mt-1 font-bold text-2xl text-foreground">
									{properties.length}
								</Text>
							</View>
							<View className="flex-1 rounded-lg border border-border bg-card p-4">
								<Text className="text-muted-foreground text-xs">Favorites</Text>
								<Text className="mt-1 font-bold text-2xl text-foreground">
									{favorites.length}
								</Text>
							</View>
						</View>

						{properties.length > 0 && (
							<View className="mb-6 rounded-lg border border-border bg-card p-4">
								<Text className="mb-2 font-semibold text-foreground">
									Portfolio Value
								</Text>
								<Text className="font-bold text-3xl text-primary">
									{formatCurrency(calculateTotalValue())}
								</Text>
							</View>
						)}

						<Text className="mb-3 font-semibold text-foreground">Settings</Text>

						<TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
							<View className="flex-row items-center">
								<Text className="mr-3 text-xl">👤</Text>
								<Text className="text-foreground">Edit Profile</Text>
							</View>
							<Text className="text-muted-foreground">›</Text>
						</TouchableOpacity>

						<TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
							<View className="flex-row items-center">
								<Text className="mr-3 text-xl">🔔</Text>
								<Text className="text-foreground">Notifications</Text>
							</View>
							<Text className="text-muted-foreground">›</Text>
						</TouchableOpacity>

						<TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
							<View className="flex-row items-center">
								<Text className="mr-3 text-xl">❓</Text>
								<Text className="text-foreground">Help & Support</Text>
							</View>
							<Text className="text-muted-foreground">›</Text>
						</TouchableOpacity>

						<TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
							<View className="flex-row items-center">
								<Text className="mr-3 text-xl">ℹ️</Text>
								<Text className="text-foreground">About</Text>
							</View>
							<Text className="text-muted-foreground">›</Text>
						</TouchableOpacity>

						<TouchableOpacity
							className="mt-4 rounded-lg bg-destructive p-4"
							onPress={() => {
								authClient.signOut();
								queryClient.invalidateQueries();
							}}
						>
							<Text className="text-center font-semibold text-white">
								Sign Out
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</Container>
	);
}
