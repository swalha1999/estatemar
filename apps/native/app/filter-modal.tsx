import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { colors, spacing } from "@/lib/theme";

const PROPERTY_TYPES = [
	{ value: "apartment", label: "Apartment" },
	{ value: "villa", label: "Villa" },
	{ value: "house", label: "House" },
	{ value: "townhouse", label: "Townhouse" },
	{ value: "penthouse", label: "Penthouse" },
	{ value: "studio", label: "Studio" },
];

const LISTING_TYPES = [
	{ value: "buy", label: "For Sale" },
	{ value: "rent", label: "For Rent" },
];

export default function FilterModal() {
	const router = useRouter();
	const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
		[],
	);
	const [selectedListingType, setSelectedListingType] = useState<string | null>(
		null,
	);
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [bedrooms, setBedrooms] = useState<number | null>(null);
	const [bathrooms, setBathrooms] = useState<number | null>(null);
	const [city, setCity] = useState("");

	const togglePropertyType = (type: string) => {
		if (selectedPropertyTypes.includes(type)) {
			setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type));
		} else {
			setSelectedPropertyTypes([...selectedPropertyTypes, type]);
		}
	};

	const handleReset = () => {
		setSelectedPropertyTypes([]);
		setSelectedListingType(null);
		setMinPrice("");
		setMaxPrice("");
		setBedrooms(null);
		setBathrooms(null);
		setCity("");
	};

	const handleApply = () => {
		// TODO: Pass filters back to discover screen
		router.back();
	};

	const activeFiltersCount =
		selectedPropertyTypes.length +
		(selectedListingType ? 1 : 0) +
		(minPrice ? 1 : 0) +
		(maxPrice ? 1 : 0) +
		(bedrooms ? 1 : 0) +
		(bathrooms ? 1 : 0) +
		(city ? 1 : 0);

	return (
		<Container>
			<View className="flex-1">
				{/* Header */}
				<View className="flex-row items-center justify-between border-border border-b bg-card px-4 py-4">
					<TouchableOpacity onPress={() => router.back()}>
						<Text className="text-base text-primary">Cancel</Text>
					</TouchableOpacity>
					<Text className="font-bold text-foreground text-lg">
						Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
					</Text>
					<TouchableOpacity onPress={handleReset}>
						<Text className="text-base text-primary">Reset</Text>
					</TouchableOpacity>
				</View>

				<ScrollView className="flex-1">
					<View className="p-4">
						{/* City/Location */}
						<View className="mb-6">
							<Text className="mb-2 font-semibold text-foreground">
								Location
							</Text>
							<TextInput
								className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
								placeholder="Enter city or area"
								placeholderTextColor={colors.text.tertiary}
								value={city}
								onChangeText={setCity}
							/>
						</View>

						{/* Property Type */}
						<View className="mb-6">
							<Text className="mb-2 font-semibold text-foreground">
								Property Type
							</Text>
							<View className="flex-row flex-wrap gap-2">
								{PROPERTY_TYPES.map((type) => {
									const isSelected = selectedPropertyTypes.includes(type.value);
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
											onPress={() => togglePropertyType(type.value)}
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

						{/* Listing Type */}
						<View className="mb-6">
							<Text className="mb-2 font-semibold text-foreground">
								Listing Type
							</Text>
							<View className="flex-row gap-2">
								{LISTING_TYPES.map((type) => {
									const isSelected = selectedListingType === type.value;
									return (
										<TouchableOpacity
											key={type.value}
											className="flex-1 rounded-lg px-4 py-3"
											style={{
												backgroundColor: isSelected
													? colors.primary.main
													: colors.background.secondary,
												borderWidth: 1,
												borderColor: isSelected
													? colors.primary.main
													: colors.border.light,
											}}
											onPress={() =>
												setSelectedListingType(isSelected ? null : type.value)
											}
										>
											<Text
												className="text-center"
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

						{/* Price Range */}
						<View className="mb-6">
							<Text className="mb-2 font-semibold text-foreground">
								Price Range
							</Text>
							<View className="flex-row gap-3">
								<View className="flex-1">
									<Text className="mb-1 text-muted-foreground text-xs">
										Min Price
									</Text>
									<TextInput
										className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
										placeholder="0"
										placeholderTextColor={colors.text.tertiary}
										keyboardType="numeric"
										value={minPrice}
										onChangeText={setMinPrice}
									/>
								</View>
								<View className="flex-1">
									<Text className="mb-1 text-muted-foreground text-xs">
										Max Price
									</Text>
									<TextInput
										className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
										placeholder="Any"
										placeholderTextColor={colors.text.tertiary}
										keyboardType="numeric"
										value={maxPrice}
										onChangeText={setMaxPrice}
									/>
								</View>
							</View>
						</View>

						{/* Bedrooms */}
						<View className="mb-6">
							<Text className="mb-2 font-semibold text-foreground">
								Bedrooms
							</Text>
							<View className="flex-row gap-2">
								{[1, 2, 3, 4, 5].map((num) => {
									const isSelected = bedrooms === num;
									return (
										<TouchableOpacity
											key={num}
											className="flex-1 rounded-lg py-3"
											style={{
												backgroundColor: isSelected
													? colors.primary.main
													: colors.background.secondary,
												borderWidth: 1,
												borderColor: isSelected
													? colors.primary.main
													: colors.border.light,
											}}
											onPress={() => setBedrooms(isSelected ? null : num)}
										>
											<Text
												className="text-center font-semibold"
												style={{
													color: isSelected ? "#FFFFFF" : colors.text.primary,
												}}
											>
												{num}+
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						</View>

						{/* Bathrooms */}
						<View className="mb-6">
							<Text className="mb-2 font-semibold text-foreground">
								Bathrooms
							</Text>
							<View className="flex-row gap-2">
								{[1, 2, 3, 4, 5].map((num) => {
									const isSelected = bathrooms === num;
									return (
										<TouchableOpacity
											key={num}
											className="flex-1 rounded-lg py-3"
											style={{
												backgroundColor: isSelected
													? colors.primary.main
													: colors.background.secondary,
												borderWidth: 1,
												borderColor: isSelected
													? colors.primary.main
													: colors.border.light,
											}}
											onPress={() => setBathrooms(isSelected ? null : num)}
										>
											<Text
												className="text-center font-semibold"
												style={{
													color: isSelected ? "#FFFFFF" : colors.text.primary,
												}}
											>
												{num}+
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						</View>

						<View style={{ height: spacing.xxl }} />
					</View>
				</ScrollView>

				{/* Apply Button */}
				<View className="border-border border-t bg-card p-4">
					<TouchableOpacity
						className="rounded-lg bg-primary p-4"
						onPress={handleApply}
					>
						<Text className="text-center font-semibold text-lg text-white">
							Apply Filters{" "}
							{activeFiltersCount > 0 && `(${activeFiltersCount})`}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}
