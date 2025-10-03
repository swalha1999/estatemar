import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { authClient } from "@/lib/auth-client";
import { colors, spacing } from "@/lib/theme";
import { orpc } from "@/utils/orpc";

export default function SellScreen() {
	const { data: session } = authClient.useSession();

	const { data: propertiesData, isLoading } = useQuery(
		orpc.realEstate.property.getMyProperties.queryOptions({
			input: {
				page: 1,
				limit: 50,
				listingType: "track",
			},
		}),
	);

	if (!session?.user) {
		return (
			<Container>
				<View className="flex-1 p-4">
					<Text className="font-bold text-2xl text-foreground">
						Sell Your Property
					</Text>
					<Text className="mt-2 mb-6 text-muted-foreground">
						Sign in to list your properties for sale
					</Text>
					<SignIn />
				</View>
			</Container>
		);
	}

	const properties = propertiesData?.data?.properties || [];

	const formatCurrency = (amount: string | number, currency = "AED") => {
		const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(numAmount);
	};

	const renderPropertyItem = ({
		item,
	}: {
		item: (typeof properties)[0];
	}) => {
		const marketValue = item.marketValue
			? Number.parseFloat(item.marketValue)
			: item.purchasePrice
				? Number.parseFloat(item.purchasePrice)
				: 0;

		return (
			<TouchableOpacity
				className="mx-4 mb-3 rounded-lg border border-border bg-card p-4"
				onPress={() => {
					// TODO: Navigate to listing request form
				}}
			>
				<Text className="font-semibold text-foreground text-lg" numberOfLines={1}>
					{item.title}
				</Text>
				<Text className="mt-1 text-muted-foreground text-sm" numberOfLines={1}>
					📍 {item.city}, {item.area}
				</Text>
				<View className="mt-3 flex-row items-center justify-between">
					<View>
						<Text className="text-muted-foreground text-xs">Market Value</Text>
						<Text className="font-bold text-foreground">
							{formatCurrency(marketValue, item.currency)}
						</Text>
					</View>
					<TouchableOpacity
						className="rounded-lg bg-primary px-4 py-2"
						onPress={() => {
							// TODO: Open listing form
						}}
					>
						<Text className="font-semibold text-white">List for Sale</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<Container>
			<View className="flex-1">
				<View className="border-border border-b bg-card px-4 py-4">
					<Text className="font-bold text-2xl text-foreground">
						Sell Your Property
					</Text>
					<Text className="mt-1 text-muted-foreground text-sm">
						Select a property to list for sale
					</Text>
				</View>

				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				) : properties.length === 0 ? (
					<ScrollView className="flex-1" contentContainerStyle={{ flex: 1 }}>
						<View className="flex-1 items-center justify-center p-4">
							<Text className="mb-2 text-center font-semibold text-foreground text-lg">
								No properties to list
							</Text>
							<Text className="text-center text-muted-foreground">
								Add properties to your portfolio first in the "My Properties" tab
							</Text>
						</View>
					</ScrollView>
				) : (
					<FlatList
						data={properties}
						renderItem={renderPropertyItem}
						keyExtractor={(item) => item.id}
						contentContainerStyle={{ paddingTop: spacing.base, paddingBottom: spacing.base }}
						ListHeaderComponent={
							<View className="mx-4 mb-4 rounded-lg bg-info-light p-4">
								<Text className="font-semibold text-info text-sm">
									ℹ️ Select a property below to create a listing request. Once approved,
									your property will be listed for sale on the marketplace.
								</Text>
							</View>
						}
					/>
				)}
			</View>
		</Container>
	);
}
