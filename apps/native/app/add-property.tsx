import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { colors, spacing } from "@/lib/theme";
import { orpc } from "@/utils/orpc";

const PROPERTY_TYPES = [
	{ value: "apartment", label: "Apartment" },
	{ value: "villa", label: "Villa" },
	{ value: "house", label: "House" },
	{ value: "townhouse", label: "Townhouse" },
	{ value: "penthouse", label: "Penthouse" },
	{ value: "studio", label: "Studio" },
];

export default function AddPropertyScreen() {
	const router = useRouter();
	const queryClient = useQueryClient();

	// Form state
	const [title, setTitle] = useState("");
	const [city, setCity] = useState("");
	const [area, setArea] = useState("");
	const [streetAddress, setStreetAddress] = useState("");
	const [propertyType, setPropertyType] = useState("apartment");
	const [bedrooms, setBedrooms] = useState("");
	const [bathrooms, setBathrooms] = useState("");
	const [size, setSize] = useState("");
	const [purchasePrice, setPurchasePrice] = useState("");
	const [marketValue, setMarketValue] = useState("");
	const [monthlyRent, setMonthlyRent] = useState("");
	const [description, setDescription] = useState("");

	const createPropertyMutation = useMutation(
		orpc.realEstate.property.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries();
				Alert.alert("Success", "Property added successfully", [
					{
						text: "OK",
						onPress: () => router.back(),
					},
				]);
			},
			onError: () => {
				Alert.alert("Error", "Failed to add property. Please try again.");
			},
		}),
	);

	const handleSubmit = () => {
		if (!title || !city || !area || !purchasePrice) {
			Alert.alert("Error", "Please fill in all required fields");
			return;
		}

		createPropertyMutation.mutate({
			title,
			city,
			area,
			streetAddress: streetAddress || null,
			propertyType: propertyType as any,
			listingType: "track",
			propertyStatus: "ready",
			country: "UAE",
			currency: "AED",
			price: purchasePrice,
			bedrooms: bedrooms ? Number.parseInt(bedrooms) : null,
			bathrooms: bathrooms ? Number.parseInt(bathrooms) : null,
			size: size ? Number.parseFloat(size) : null,
			purchasePrice: purchasePrice,
			marketValue: marketValue || null,
			currentRentalIncome: monthlyRent || null,
			description: description || null,
			isActive: true,
			parkingSpaces: 0,
			mortgageAvailable: false,
			trackingEnabled: true,
			furnishing: "unfurnished",
		} as any);
	};

	return (
		<Container>
			<View className="flex-1">
				{/* Header */}
				<View className="flex-row items-center justify-between border-border border-b bg-card px-4 py-4">
					<TouchableOpacity onPress={() => router.back()}>
						<Text className="text-base text-primary">Cancel</Text>
					</TouchableOpacity>
					<Text className="font-bold text-foreground text-lg">
						Add Property
					</Text>
					<View style={{ width: 60 }} />
				</View>

				<ScrollView className="flex-1">
					<View className="p-4">
						{/* Property Title */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Property Name <Text className="text-destructive">*</Text>
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., My Downtown Apartment"
								placeholderTextColor={colors.text.tertiary}
								value={title}
								onChangeText={setTitle}
							/>
						</View>

						{/* Location */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								City <Text className="text-destructive">*</Text>
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., Dubai"
								placeholderTextColor={colors.text.tertiary}
								value={city}
								onChangeText={setCity}
							/>
						</View>

						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Area <Text className="text-destructive">*</Text>
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., Downtown"
								placeholderTextColor={colors.text.tertiary}
								value={area}
								onChangeText={setArea}
							/>
						</View>

						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Street Address
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., Sheikh Zayed Road"
								placeholderTextColor={colors.text.tertiary}
								value={streetAddress}
								onChangeText={setStreetAddress}
							/>
						</View>

						{/* Property Type */}
						<View className="mb-4">
							<Text className="mb-2 font-semibold text-foreground">
								Property Type
							</Text>
							<View className="flex-row flex-wrap gap-2">
								{PROPERTY_TYPES.map((type) => {
									const isSelected = propertyType === type.value;
									return (
										<TouchableOpacity
											key={type.value}
											className="rounded-lg px-4 py-2"
											style={{
												backgroundColor: isSelected
													? colors.primary.main
													: colors.background.secondary,
												borderWidth: 1,
												borderColor: isSelected
													? colors.primary.main
													: colors.border.light,
											}}
											onPress={() => setPropertyType(type.value)}
										>
											<Text
												style={{
													color: isSelected ? "#FFFFFF" : colors.text.primary,
												}}
											>
												{type.label}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						</View>

						{/* Bedrooms & Bathrooms */}
						<View className="mb-4 flex-row gap-3">
							<View className="flex-1">
								<Text className="mb-1 font-semibold text-foreground">
									Bedrooms
								</Text>
								<TextInput
									className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
									placeholder="0"
									placeholderTextColor={colors.text.tertiary}
									keyboardType="numeric"
									value={bedrooms}
									onChangeText={setBedrooms}
								/>
							</View>
							<View className="flex-1">
								<Text className="mb-1 font-semibold text-foreground">
									Bathrooms
								</Text>
								<TextInput
									className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
									placeholder="0"
									placeholderTextColor={colors.text.tertiary}
									keyboardType="numeric"
									value={bathrooms}
									onChangeText={setBathrooms}
								/>
							</View>
						</View>

						{/* Size */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Size (m²)
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., 120"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={size}
								onChangeText={setSize}
							/>
						</View>

						{/* Purchase Price */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Purchase Price (AED) <Text className="text-destructive">*</Text>
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., 500000"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={purchasePrice}
								onChangeText={setPurchasePrice}
							/>
						</View>

						{/* Market Value */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Current Market Value (AED)
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., 550000"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={marketValue}
								onChangeText={setMarketValue}
							/>
						</View>

						{/* Monthly Rent */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Monthly Rental Income (AED)
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="e.g., 5000"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={monthlyRent}
								onChangeText={setMonthlyRent}
							/>
						</View>

						{/* Description */}
						<View className="mb-4">
							<Text className="mb-1 font-semibold text-foreground">
								Description
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="Additional notes about the property"
								placeholderTextColor={colors.text.tertiary}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
								value={description}
								onChangeText={setDescription}
							/>
						</View>

						<View style={{ height: spacing.base }} />
					</View>
				</ScrollView>

				{/* Add Button */}
				<View className="border-border border-t bg-card p-4">
					<TouchableOpacity
						className="rounded-lg bg-primary p-4"
						onPress={handleSubmit}
						disabled={createPropertyMutation.isPending}
					>
						<Text className="text-center font-semibold text-lg text-white">
							{createPropertyMutation.isPending ? "Adding..." : "Add Property"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}
