import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
	ActivityIndicator,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SafeImage } from "@/components/ui/safe-image";
import { authClient } from "@/lib/auth-client";
import { colors, spacing } from "@/lib/theme";
import { orpc } from "@/utils/orpc";

export default function PropertiesScreen() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const { data, isLoading, refetch } = useQuery(
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
						My Properties
					</Text>
					<Text className="mt-2 mb-6 text-muted-foreground">
						Sign in to manage your property portfolio
					</Text>
					<SignIn />
				</View>
			</Container>
		);
	}

	const properties = data?.data?.properties || [];

	const calculateMetrics = () => {
		const totalProperties = properties.length;
		let totalInvestment = 0;
		let totalCurrentValue = 0;
		let totalRent = 0;

		for (const prop of properties) {
			const purchasePrice = prop.purchasePrice
				? Number.parseFloat(prop.purchasePrice)
				: 0;
			const marketValue = prop.marketValue
				? Number.parseFloat(prop.marketValue)
				: purchasePrice;
			const rent = prop.currentRentalIncome
				? Number.parseFloat(prop.currentRentalIncome)
				: 0;

			totalInvestment += purchasePrice;
			totalCurrentValue += marketValue;
			totalRent += rent * 12;
		}

		const totalProfitLoss = totalCurrentValue - totalInvestment;
		const totalProfitLossPercentage =
			totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;
		const averageRentalYield =
			totalInvestment > 0 ? (totalRent / totalInvestment) * 100 : 0;

		return {
			totalProperties,
			totalInvestment,
			totalCurrentValue,
			totalProfitLoss,
			totalProfitLossPercentage,
			totalRent,
			averageRentalYield,
		};
	};

	const metrics = calculateMetrics();

	const formatCurrency = (amount: number, currency = "AED") => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const renderPropertyCard = ({ item }: { item: (typeof properties)[0] }) => {
		const purchasePrice = item.purchasePrice
			? Number.parseFloat(item.purchasePrice)
			: 0;
		const marketValue = item.marketValue
			? Number.parseFloat(item.marketValue)
			: purchasePrice;
		const profitLoss = marketValue - purchasePrice;
		const profitLossPercentage =
			purchasePrice > 0 ? (profitLoss / purchasePrice) * 100 : 0;

		const images = (item.images as string[] | null) || [];

		return (
			<TouchableOpacity
				className="mx-4 mb-4 rounded-xl bg-card shadow-sm"
				style={{ borderWidth: 1, borderColor: colors.border.light }}
				onPress={() => router.push(`/property/${item.id}`)}
			>
				<SafeImage
					uri={images[0] || null}
					style={{
						width: "100%",
						height: 180,
						borderTopLeftRadius: 12,
						borderTopRightRadius: 12,
					}}
				/>
				<View className="p-4">
					<Text
						className="font-semibold text-foreground text-lg"
						numberOfLines={1}
					>
						{item.title}
					</Text>
					<View className="mt-3 flex-row items-center justify-between">
						<View>
							<Text className="text-muted-foreground text-xs">
								Purchase Price
							</Text>
							<Text className="font-semibold text-foreground">
								{formatCurrency(purchasePrice, item.currency)}
							</Text>
						</View>
						<View>
							<Text className="text-right text-muted-foreground text-xs">
								Current Value
							</Text>
							<Text className="text-right font-semibold text-foreground">
								{formatCurrency(marketValue, item.currency)}
							</Text>
						</View>
					</View>
					<View
						className="mt-3 rounded-lg p-3"
						style={{
							backgroundColor:
								profitLoss >= 0
									? colors.status.successLight
									: colors.status.errorLight,
						}}
					>
						<Text
							className="text-center font-bold text-sm"
							style={{
								color:
									profitLoss >= 0 ? colors.status.success : colors.status.error,
							}}
						>
							{profitLoss >= 0 ? "📈" : "📉"}{" "}
							{formatCurrency(profitLoss, item.currency)} (
							{profitLossPercentage.toFixed(2)}%)
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<Container>
			<View className="flex-1">
				<View className="flex-row items-center justify-between border-border border-b bg-card px-4 py-4">
					<Text className="font-bold text-2xl text-foreground">
						My Properties
					</Text>
					<TouchableOpacity
						className="items-center justify-center rounded-full bg-primary"
						style={{ width: 40, height: 40 }}
						onPress={() => router.push("/add-property")}
					>
						<Text className="font-bold text-2xl text-white">+</Text>
					</TouchableOpacity>
				</View>

				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				) : (
					<FlatList
						data={properties}
						renderItem={renderPropertyCard}
						keyExtractor={(item) => item.id}
						ListHeaderComponent={
							properties.length > 0 ? (
								<View className="mx-4 mt-4 mb-2 rounded-xl bg-primary p-4">
									<Text className="mb-4 text-center font-bold text-white text-xl">
										Portfolio Overview
									</Text>
									<View className="flex-row flex-wrap gap-4">
										<View className="min-w-[45%] flex-1">
											<Text className="text-white text-xs opacity-80">
												Properties
											</Text>
											<Text className="font-bold text-lg text-white">
												{metrics.totalProperties}
											</Text>
										</View>
										<View className="min-w-[45%] flex-1">
											<Text className="text-white text-xs opacity-80">
												Total Investment
											</Text>
											<Text className="font-bold text-lg text-white">
												{formatCurrency(metrics.totalInvestment)}
											</Text>
										</View>
										<View className="min-w-[45%] flex-1">
											<Text className="text-white text-xs opacity-80">
												Current Value
											</Text>
											<Text className="font-bold text-lg text-white">
												{formatCurrency(metrics.totalCurrentValue)}
											</Text>
										</View>
										<View className="min-w-[45%] flex-1">
											<Text className="text-white text-xs opacity-80">
												Total Profit/Loss
											</Text>
											<Text className="font-bold text-lg text-white">
												{formatCurrency(metrics.totalProfitLoss)} (
												{metrics.totalProfitLossPercentage.toFixed(2)}%)
											</Text>
										</View>
									</View>
								</View>
							) : null
						}
						ListEmptyComponent={
							<View className="flex-1 items-center justify-center p-4">
								<Text className="mb-2 text-center font-semibold text-foreground text-lg">
									No properties yet
								</Text>
								<Text className="text-center text-muted-foreground">
									Add properties to track your portfolio
								</Text>
							</View>
						}
						contentContainerStyle={{ paddingBottom: spacing.base }}
						onRefresh={refetch}
						refreshing={isLoading}
					/>
				)}
			</View>
		</Container>
	);
}
