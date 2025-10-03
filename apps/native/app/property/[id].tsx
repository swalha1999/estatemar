import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	ActivityIndicator,
	Dimensions,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { SafeImage } from "@/components/ui/safe-image";
import { colors, spacing } from "@/lib/theme";
import { orpc } from "@/utils/orpc";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PropertyDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data, isLoading } = useQuery(
		orpc.realEstate.property.getById.queryOptions({
			input: {
				id: id || "",
			},
		}),
	);

	const property = data?.data;

	const formatCurrency = (amount: string | number, currency = "AED") => {
		const numAmount =
			typeof amount === "string" ? Number.parseFloat(amount) : amount;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(numAmount);
	};

	if (isLoading) {
		return (
			<Container>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={colors.primary.main} />
				</View>
			</Container>
		);
	}

	if (!property) {
		return (
			<Container>
				<View className="flex-1 items-center justify-center p-4">
					<Text className="text-center font-semibold text-foreground text-lg">
						Property not found
					</Text>
					<TouchableOpacity
						className="mt-4 rounded-lg bg-primary px-6 py-3"
						onPress={() => router.back()}
					>
						<Text className="font-semibold text-white">Go Back</Text>
					</TouchableOpacity>
				</View>
			</Container>
		);
	}

	const images = (property.images as string[] | null) || [];
	const price = Number.parseFloat(property.price);

	return (
		<Container>
			<ScrollView className="flex-1">
				{/* Header with back button */}
				<View className="absolute top-4 left-4 z-10">
					<TouchableOpacity
						className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
						onPress={() => router.back()}
					>
						<Text className="text-xl">←</Text>
					</TouchableOpacity>
				</View>

				{/* Image Gallery */}
				<ScrollView
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					style={{ height: 300 }}
				>
					{images.length > 0 ? (
						images.map((imageUrl, index) => (
							<SafeImage
								key={index}
								uri={imageUrl}
								style={{ width: SCREEN_WIDTH, height: 300 }}
							/>
						))
					) : (
						<View
							style={{
								width: SCREEN_WIDTH,
								height: 300,
								backgroundColor: colors.background.tertiary,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text className="text-muted-foreground">No images available</Text>
						</View>
					)}
				</ScrollView>

				{/* Image indicators */}
				{images.length > 1 && (
					<View className="flex-row items-center justify-center py-2">
						{images.map((_, index) => (
							<View
								key={index}
								className="mx-1 h-2 w-2 rounded-full"
								style={{ backgroundColor: colors.grey[400] }}
							/>
						))}
					</View>
				)}

				{/* Property Details */}
				<View className="p-4">
					{/* Title and Price */}
					<Text className="font-bold text-2xl text-foreground">
						{property.title}
					</Text>
					<Text className="mt-2 font-bold text-3xl text-primary">
						{formatCurrency(price, property.currency)}
					</Text>

					{/* Location */}
					<View className="mt-3 flex-row items-center">
						<Text className="text-base text-muted-foreground">
							📍 {property.city}, {property.area}
						</Text>
					</View>

					{/* Key Features */}
					<View className="mt-4 flex-row flex-wrap gap-3">
						{property.bedrooms && (
							<View className="rounded-lg bg-card p-3" style={{ minWidth: 80 }}>
								<Text className="text-center text-muted-foreground text-xs">
									Bedrooms
								</Text>
								<Text className="mt-1 text-center font-bold text-foreground text-lg">
									{property.bedrooms}
								</Text>
							</View>
						)}
						{property.bathrooms && (
							<View className="rounded-lg bg-card p-3" style={{ minWidth: 80 }}>
								<Text className="text-center text-muted-foreground text-xs">
									Bathrooms
								</Text>
								<Text className="mt-1 text-center font-bold text-foreground text-lg">
									{property.bathrooms}
								</Text>
							</View>
						)}
						{property.size && (
							<View className="rounded-lg bg-card p-3" style={{ minWidth: 80 }}>
								<Text className="text-center text-muted-foreground text-xs">
									Area
								</Text>
								<Text className="mt-1 text-center font-bold text-foreground text-lg">
									{property.size} m²
								</Text>
							</View>
						)}
						{property.parkingSpaces && property.parkingSpaces > 0 && (
							<View className="rounded-lg bg-card p-3" style={{ minWidth: 80 }}>
								<Text className="text-center text-muted-foreground text-xs">
									Parking
								</Text>
								<Text className="mt-1 text-center font-bold text-foreground text-lg">
									{property.parkingSpaces}
								</Text>
							</View>
						)}
					</View>

					{/* Description */}
					{property.description && (
						<View className="mt-6">
							<Text className="mb-2 font-semibold text-foreground text-lg">
								Description
							</Text>
							<Text className="text-muted-foreground leading-6">
								{property.description}
							</Text>
						</View>
					)}

					{/* Property Type & Status */}
					<View className="mt-6">
						<Text className="mb-2 font-semibold text-foreground text-lg">
							Property Details
						</Text>
						<View className="rounded-lg border border-border bg-card p-4">
							<View className="mb-3 flex-row items-center justify-between">
								<Text className="text-muted-foreground">Type</Text>
								<Text className="font-semibold text-foreground capitalize">
									{property.propertyType.replace("_", " ")}
								</Text>
							</View>
							<View className="mb-3 flex-row items-center justify-between">
								<Text className="text-muted-foreground">Listing Type</Text>
								<Text className="font-semibold text-foreground capitalize">
									{property.listingType === "buy" ? "For Sale" : "For Rent"}
								</Text>
							</View>
							<View className="mb-3 flex-row items-center justify-between">
								<Text className="text-muted-foreground">Status</Text>
								<Text className="font-semibold text-foreground capitalize">
									{property.propertyStatus.replace("_", " ")}
								</Text>
							</View>
							{property.furnishing && (
								<View className="flex-row items-center justify-between">
									<Text className="text-muted-foreground">Furnishing</Text>
									<Text className="font-semibold text-foreground capitalize">
										{property.furnishing.replace("_", " ")}
									</Text>
								</View>
							)}
						</View>
					</View>

					{/* Additional Info */}
					{property.yearBuilt && (
						<View className="mt-6">
							<Text className="mb-2 font-semibold text-foreground text-lg">
								Additional Information
							</Text>
							<View className="rounded-lg border border-border bg-card p-4">
								<View className="flex-row items-center justify-between">
									<Text className="text-muted-foreground">Year Built</Text>
									<Text className="font-semibold text-foreground">
										{property.yearBuilt}
									</Text>
								</View>
							</View>
						</View>
					)}

					{/* Contact Button */}
					<TouchableOpacity
						className="mt-6 rounded-lg bg-primary p-4"
						onPress={() => {
							// TODO: Implement contact functionality
						}}
					>
						<Text className="text-center font-semibold text-lg text-white">
							Contact Agent
						</Text>
					</TouchableOpacity>

					<View style={{ height: spacing.xxl }} />
				</View>
			</ScrollView>
		</Container>
	);
}
