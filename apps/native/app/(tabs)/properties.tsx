import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
	ActivityIndicator,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
				style={{
					marginHorizontal: 20,
					marginBottom: 16,
					borderRadius: 16,
					backgroundColor: colors.background.card,
					shadowColor: colors.shadow.lg,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 1,
					shadowRadius: 8,
					elevation: 3,
					overflow: "hidden",
				}}
				onPress={() => router.push(`/property/${item.id}`)}
			>
				<View>
					<SafeImage
						uri={images[0] || null}
						style={{
							width: "100%",
							height: 180,
						}}
					/>
					<LinearGradient
						colors={["transparent", "rgba(0,0,0,0.75)"]}
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							height: 70,
							justifyContent: "flex-end",
							paddingHorizontal: 16,
							paddingBottom: 12,
						}}
					>
						<Text
							numberOfLines={1}
							style={{ 
								fontFamily: "Montserrat_700Bold", 
								fontSize: 15, 
								color: "#fff",
								marginBottom: 4 
							}}
						>
							{item.title}
						</Text>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Ionicons name="location" size={11} color="#fff" />
							<Text style={{ 
								marginLeft: 4, 
								color: "#fff", 
								fontSize: 11,
								fontFamily: "Montserrat_500Medium",
								opacity: 0.9
							}}>
								{item.area}, {item.city}
							</Text>
						</View>
					</LinearGradient>
				</View>

					<View style={{ padding: 14 }}>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<View style={{ flex: 1, marginRight: 8 }}>
							<Text
								style={{ 
									fontFamily: "Montserrat_500Medium", 
									fontSize: 10, 
									color: colors.text.tertiary,
									marginBottom: 3
								}}
							>
								Purchase Price
							</Text>
							<Text
								numberOfLines={1}
								style={{ 
									fontFamily: "Montserrat_700Bold", 
									fontSize: 14, 
									color: colors.text.primary
								}}
							>
								{formatCurrency(purchasePrice, item.currency)}
							</Text>
						</View>
						<View style={{ flex: 1, marginLeft: 8, alignItems: "flex-end" }}>
							<Text
								style={{ 
									fontFamily: "Montserrat_500Medium", 
									fontSize: 10, 
									color: colors.text.tertiary,
									marginBottom: 3
								}}
							>
								Current Value
							</Text>
							<Text
								numberOfLines={1}
								style={{ 
									fontFamily: "Montserrat_700Bold", 
									fontSize: 14, 
									color: colors.text.primary
								}}
							>
								{formatCurrency(marketValue, item.currency)}
							</Text>
						</View>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							backgroundColor:
								profitLoss >= 0
									? colors.status.successLight
									: colors.status.errorLight,
							borderRadius: 10,
							padding: 10,
						}}
					>
						<View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
							<Ionicons
								name={profitLoss >= 0 ? "trending-up" : "trending-down"}
								size={16}
								color={profitLoss >= 0 ? colors.status.success : colors.status.error}
							/>
							<Text
								numberOfLines={1}
								style={{
									marginLeft: 6,
									color: profitLoss >= 0 ? colors.status.success : colors.status.error,
									fontFamily: "Montserrat_700Bold",
									fontSize: 13,
									flex: 1
								}}
							>
								{formatCurrency(profitLoss, item.currency)}
							</Text>
						</View>
						<Text
							style={{
								color: profitLoss >= 0 ? colors.status.success : colors.status.error,
								fontFamily: "Montserrat_600SemiBold",
								fontSize: 13,
								marginLeft: 6
							}}
						>
							{profitLossPercentage >= 0 ? "+" : ""}{profitLossPercentage.toFixed(2)}%
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<Container>
			<View className="flex-1 bg-background">
				<LinearGradient
					colors={[colors.primary.main, colors.primary.dark]}
					style={{
						paddingHorizontal: 20,
						paddingTop: 56,
						paddingBottom: 20,
						shadowColor: colors.shadow.md,
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 1,
						shadowRadius: 8,
						elevation: 4,
					}}
				>
					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Text
								className="font-bold text-white"
								style={{ fontFamily: "Montserrat_700Bold", fontSize: 24, lineHeight: 30 }}
							>
								My Properties
							</Text>
							<Text 
								className="mt-1 text-white"
								style={{ fontFamily: "Montserrat_500Medium", fontSize: 13, opacity: 0.9 }}
							>
								Manage your portfolio
							</Text>
						</View>
						<TouchableOpacity
							className="items-center justify-center rounded-2xl bg-white"
							style={{ 
								width: 52, 
								height: 52, 
								shadowColor: "#000", 
								shadowOffset: { width: 0, height: 3 }, 
								shadowOpacity: 0.15, 
								shadowRadius: 6, 
								elevation: 4,
								marginLeft: 16 
							}}
							onPress={() => router.push("/add-property")}
						>
							<Ionicons name="add" size={28} color={colors.primary.main} />
						</TouchableOpacity>
					</View>
				</LinearGradient>

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
								<View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 8 }}>
									<Text
										style={{ 
											fontFamily: "Montserrat_700Bold", 
											fontSize: 18, 
											color: colors.text.primary,
											marginBottom: 14
										}}
									>
										Portfolio Overview
									</Text>
									<View
										style={{
											borderRadius: 16,
											overflow: "hidden",
											shadowColor: colors.shadow.md,
											shadowOffset: { width: 0, height: 2 },
											shadowOpacity: 1,
											shadowRadius: 8,
											elevation: 3,
										}}
									>
										<LinearGradient
											colors={[colors.primary.main, colors.secondary.main]}
											style={{ padding: 14 }}
										>
											<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
												<View style={{ flex: 1, minWidth: "45%", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 12 }}>
													<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
														<Ionicons name="home" size={14} color="#fff" />
														<Text
															style={{ 
																marginLeft: 5, 
																color: "#fff", 
																fontSize: 11,
																fontFamily: "Montserrat_500Medium",
																opacity: 0.95
															}}
														>
															Properties
														</Text>
													</View>
													<Text
														style={{ 
															fontFamily: "Montserrat_700Bold", 
															fontSize: 22, 
															color: "#fff"
														}}
													>
														{metrics.totalProperties}
													</Text>
												</View>
												<View style={{ flex: 1, minWidth: "45%", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 12 }}>
													<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
														<Ionicons name="wallet" size={14} color="#fff" />
														<Text
															style={{ 
																marginLeft: 5, 
																color: "#fff", 
																fontSize: 11,
																fontFamily: "Montserrat_500Medium",
																opacity: 0.95
															}}
														>
															Investment
														</Text>
													</View>
													<Text
														numberOfLines={1}
														style={{ 
															fontFamily: "Montserrat_700Bold", 
															fontSize: 15, 
															color: "#fff"
														}}
													>
														{formatCurrency(metrics.totalInvestment)}
													</Text>
												</View>
												<View style={{ flex: 1, minWidth: "45%", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 12 }}>
													<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
														<Ionicons name="trending-up" size={14} color="#fff" />
														<Text
															style={{ 
																marginLeft: 5, 
																color: "#fff", 
																fontSize: 11,
																fontFamily: "Montserrat_500Medium",
																opacity: 0.95
															}}
														>
															Current Value
														</Text>
													</View>
													<Text
														numberOfLines={1}
														style={{ 
															fontFamily: "Montserrat_700Bold", 
															fontSize: 15, 
															color: "#fff"
														}}
													>
														{formatCurrency(metrics.totalCurrentValue)}
													</Text>
												</View>
												<View style={{ flex: 1, minWidth: "45%", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 12 }}>
													<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
														<Ionicons name="stats-chart" size={14} color="#fff" />
														<Text
															style={{ 
																marginLeft: 5, 
																color: "#fff", 
																fontSize: 11,
																fontFamily: "Montserrat_500Medium",
																opacity: 0.95
															}}
														>
															Profit/Loss
														</Text>
													</View>
													<Text
														numberOfLines={1}
														style={{ 
															fontFamily: "Montserrat_700Bold", 
															fontSize: 14, 
															color: "#fff"
														}}
													>
														{formatCurrency(metrics.totalProfitLoss)}
													</Text>
													<Text
														style={{ 
															color: "#fff", 
															fontSize: 12,
															fontFamily: "Montserrat_600SemiBold",
															marginTop: 2,
															opacity: 0.9
														}}
													>
														{metrics.totalProfitLossPercentage >= 0 ? "+" : ""}
														{metrics.totalProfitLossPercentage.toFixed(2)}%
													</Text>
												</View>
											</View>
										</LinearGradient>
									</View>
								</View>
							) : null
						}
						ListEmptyComponent={
							<View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingVertical: 60 }}>
								<View
									style={{ 
										width: 100, 
										height: 100, 
										borderRadius: 50,
										backgroundColor: colors.primary.lighter,
										alignItems: "center",
										justifyContent: "center",
										marginBottom: 20
									}}
								>
									<Ionicons name="home-outline" size={48} color={colors.primary.main} />
								</View>
								<Text
									style={{ 
										fontFamily: "Montserrat_700Bold", 
										fontSize: 20, 
										color: colors.text.primary,
										textAlign: "center",
										marginBottom: 10
									}}
								>
									No Properties Yet
								</Text>
								<Text
									style={{ 
										fontFamily: "Montserrat_400Regular", 
										fontSize: 14, 
										color: colors.text.secondary,
										textAlign: "center",
										lineHeight: 20,
										maxWidth: 280,
										marginBottom: 28
									}}
								>
									Start building your property portfolio by adding your first property
								</Text>
								<TouchableOpacity
									style={{
										backgroundColor: colors.primary.main,
										borderRadius: 12,
										paddingHorizontal: 24,
										paddingVertical: 14,
										flexDirection: "row",
										alignItems: "center",
										shadowColor: colors.shadow.md,
										shadowOffset: { width: 0, height: 3 },
										shadowOpacity: 1,
										shadowRadius: 8,
										elevation: 4,
									}}
									onPress={() => router.push("/add-property")}
								>
									<Ionicons name="add-circle" size={20} color="#fff" />
									<Text
										style={{ 
											marginLeft: 8, 
											fontFamily: "Montserrat_600SemiBold", 
											fontSize: 15, 
											color: "#fff"
										}}
									>
										Add Your First Property
									</Text>
								</TouchableOpacity>
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
