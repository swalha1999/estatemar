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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

	// Step management
	const [currentStep, setCurrentStep] = useState(1);
	const totalSteps = 3;

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

	// Step validation
	const validateStep1 = () => {
		if (!title.trim()) {
			Alert.alert("Required Field", "Please enter a property name");
			return false;
		}
		if (!city.trim()) {
			Alert.alert("Required Field", "Please enter a city");
			return false;
		}
		if (!area.trim()) {
			Alert.alert("Required Field", "Please enter an area");
			return false;
		}
		return true;
	};

	const validateStep2 = () => {
		// All fields in step 2 are optional, so always return true
		return true;
	};

	const validateStep3 = () => {
		if (!purchasePrice.trim()) {
			Alert.alert("Required Field", "Please enter the purchase price");
			return false;
		}
		return true;
	};

	const handleNext = () => {
		if (currentStep === 1 && !validateStep1()) return;
		if (currentStep === 2 && !validateStep2()) return;
		
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		if (!validateStep3()) return;

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

	// Step indicator component
	const StepIndicator = () => (
		<View className="mb-6 px-6">
			<View className="flex-row items-center justify-center gap-2">
				{[1, 2, 3].map((step) => (
					<View key={step} className="flex-1 flex-row items-center">
						<View
							className="items-center justify-center rounded-full"
							style={{
								width: 40,
								height: 40,
								backgroundColor:
									step === currentStep
										? colors.primary.main
										: step < currentStep
											? colors.status.success
											: colors.grey[200],
								shadowColor:
									step === currentStep ? colors.shadow.md : "transparent",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: step === currentStep ? 1 : 0,
								shadowRadius: 4,
								elevation: step === currentStep ? 3 : 0,
							}}
						>
							{step < currentStep ? (
								<Ionicons name="checkmark" size={24} color="#fff" />
							) : (
								<Text
									className="font-bold text-base"
									style={{
										color: step === currentStep ? "#FFFFFF" : colors.text.tertiary,
										fontFamily: "Montserrat_700Bold",
									}}
								>
									{step}
								</Text>
							)}
						</View>
						{step < 3 && (
							<View
								className="mx-2 h-1 flex-1 rounded-full"
								style={{
									backgroundColor:
										step < currentStep ? colors.status.success : colors.grey[200],
								}}
							/>
						)}
					</View>
				))}
			</View>
			<View className="mt-2 flex-row justify-between px-1">
				{["Basic Info", "Details", "Financial"].map((label, index) => (
					<Text
						key={label}
						className="text-xs"
						style={{
							color:
								index + 1 === currentStep
									? colors.primary.main
									: index + 1 < currentStep
										? colors.status.success
										: colors.text.tertiary,
							fontFamily:
								index + 1 === currentStep
									? "Montserrat_600SemiBold"
									: "Montserrat_500Medium",
							flex: 1,
							textAlign: index === 0 ? "left" : index === 1 ? "center" : "right",
						}}
					>
						{label}
					</Text>
				))}
			</View>
		</View>
	);

	// Render step content
	const renderStepContent = () => {
		const inputStyle = {
			borderRadius: 12,
			borderWidth: 1.5,
			borderColor: colors.border.light,
			backgroundColor: colors.background.card,
			paddingHorizontal: 14,
			paddingVertical: 12,
			fontSize: 14,
			fontFamily: "Montserrat_400Regular",
			color: colors.text.primary,
		};

		const labelStyle = {
			fontFamily: "Montserrat_600SemiBold",
			fontSize: 13,
			color: colors.text.primary,
			marginBottom: 6,
		};

		switch (currentStep) {
			case 1:
				return (
					<View style={{ paddingHorizontal: 20 }}>
						<Text
							style={{
								fontFamily: "Montserrat_500Medium",
								fontSize: 12,
								color: colors.text.tertiary,
								textAlign: "center",
								marginBottom: 20,
							}}
						>
							Basic Information
						</Text>

						{/* Property Title */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>
								Property Name <Text style={{ color: colors.status.error }}>*</Text>
							</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., My Downtown Apartment"
								placeholderTextColor={colors.text.tertiary}
								value={title}
								onChangeText={setTitle}
							/>
						</View>

						{/* Location */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>
								City <Text style={{ color: colors.status.error }}>*</Text>
							</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., Dubai"
								placeholderTextColor={colors.text.tertiary}
								value={city}
								onChangeText={setCity}
							/>
						</View>

						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>
								Area <Text style={{ color: colors.status.error }}>*</Text>
							</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., Downtown"
								placeholderTextColor={colors.text.tertiary}
								value={area}
								onChangeText={setArea}
							/>
						</View>

						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>Street Address</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., Sheikh Zayed Road"
								placeholderTextColor={colors.text.tertiary}
								value={streetAddress}
								onChangeText={setStreetAddress}
							/>
						</View>

						{/* Property Type */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>Property Type</Text>
							<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
								{PROPERTY_TYPES.map((type) => {
									const isSelected = propertyType === type.value;
									return (
										<TouchableOpacity
											key={type.value}
											style={{
												paddingHorizontal: 16,
												paddingVertical: 10,
												borderRadius: 10,
												backgroundColor: isSelected
													? colors.primary.main
													: colors.background.secondary,
												borderWidth: 1.5,
												borderColor: isSelected
													? colors.primary.main
													: colors.border.light,
											}}
											onPress={() => setPropertyType(type.value)}
										>
											<Text
												style={{
													color: isSelected ? "#FFFFFF" : colors.text.primary,
													fontFamily: isSelected
														? "Montserrat_600SemiBold"
														: "Montserrat_500Medium",
													fontSize: 13,
												}}
											>
												{type.label}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						</View>
					</View>
				);
			case 2:
				return (
					<View style={{ paddingHorizontal: 20 }}>
						<Text
							style={{
								fontFamily: "Montserrat_500Medium",
								fontSize: 12,
								color: colors.text.tertiary,
								textAlign: "center",
								marginBottom: 20,
							}}
						>
							Property Details
						</Text>

						{/* Bedrooms & Bathrooms */}
						<View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
							<View style={{ flex: 1 }}>
								<Text style={labelStyle}>Bedrooms</Text>
								<TextInput
									style={inputStyle}
									placeholder="0"
									placeholderTextColor={colors.text.tertiary}
									keyboardType="numeric"
									value={bedrooms}
									onChangeText={setBedrooms}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={labelStyle}>Bathrooms</Text>
								<TextInput
									style={inputStyle}
									placeholder="0"
									placeholderTextColor={colors.text.tertiary}
									keyboardType="numeric"
									value={bathrooms}
									onChangeText={setBathrooms}
								/>
							</View>
						</View>

						{/* Size */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>Size (m²)</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., 120"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={size}
								onChangeText={setSize}
							/>
						</View>

						<View
							style={{
								marginTop: 16,
								borderRadius: 12,
								backgroundColor: colors.primary.lighter,
								padding: 14,
								borderWidth: 1,
								borderColor: colors.primary.light,
							}}
						>
							<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
								<Ionicons name="information-circle" size={16} color={colors.primary.main} />
								<Text
									style={{
										marginLeft: 8,
										textAlign: "center",
										fontFamily: "Montserrat_500Medium",
										fontSize: 12,
										color: colors.primary.dark,
									}}
								>
									All fields on this screen are optional
								</Text>
							</View>
						</View>
					</View>
				);
			case 3:
				return (
					<View style={{ paddingHorizontal: 20 }}>
						<Text
							style={{
								fontFamily: "Montserrat_500Medium",
								fontSize: 12,
								color: colors.text.tertiary,
								textAlign: "center",
								marginBottom: 20,
							}}
						>
							Financial Information
						</Text>

						{/* Purchase Price */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>
								Purchase Price (AED) <Text style={{ color: colors.status.error }}>*</Text>
							</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., 500000"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={purchasePrice}
								onChangeText={setPurchasePrice}
							/>
						</View>

						{/* Market Value */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>Current Market Value (AED)</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., 550000"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={marketValue}
								onChangeText={setMarketValue}
							/>
						</View>

						{/* Monthly Rent */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>Monthly Rental Income (AED)</Text>
							<TextInput
								style={inputStyle}
								placeholder="e.g., 5000"
								placeholderTextColor={colors.text.tertiary}
								keyboardType="numeric"
								value={monthlyRent}
								onChangeText={setMonthlyRent}
							/>
						</View>

						{/* Description */}
						<View style={{ marginBottom: 16 }}>
							<Text style={labelStyle}>Description</Text>
							<TextInput
								style={{
									...inputStyle,
									minHeight: 90,
									textAlignVertical: "top",
									paddingTop: 12,
								}}
								placeholder="Additional notes about the property"
								placeholderTextColor={colors.text.tertiary}
								multiline
								numberOfLines={4}
								value={description}
								onChangeText={setDescription}
							/>
						</View>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<Container>
			<View className="flex-1 bg-background">
				{/* Header */}
				<LinearGradient
					colors={[colors.primary.main, colors.primary.dark]}
					style={{
						paddingHorizontal: 20,
						paddingTop: 20,
						paddingBottom: 20,
						shadowColor: colors.shadow.md,
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 1,
						shadowRadius: 8,
						elevation: 4,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<TouchableOpacity
							style={{ flexDirection: "row", alignItems: "center", padding: 4 }}
							onPress={() => router.back()}
						>
							<Ionicons name="arrow-back" size={24} color="#fff" />
							<Text
								style={{ 
									marginLeft: 8, 
									fontFamily: "Montserrat_600SemiBold", 
									fontSize: 15, 
									color: "#fff"
								}}
							>
								Cancel
							</Text>
						</TouchableOpacity>
						<Text
							style={{ 
								fontFamily: "Montserrat_700Bold", 
								fontSize: 20, 
								color: "#fff",
								flex: 1,
								textAlign: "center",
								marginHorizontal: 16
							}}
						>
							Add Property
						</Text>
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 20,
								backgroundColor: "rgba(255,255,255,0.25)",
								paddingHorizontal: 14,
								paddingVertical: 6,
								minWidth: 50,
							}}
						>
							<Text
								style={{ 
									fontFamily: "Montserrat_700Bold", 
									fontSize: 13, 
									color: "#fff"
								}}
							>
								{currentStep}/{totalSteps}
							</Text>
						</View>
					</View>
				</LinearGradient>

				<ScrollView className="flex-1">
					<View className="pt-4">
						<StepIndicator />
						{renderStepContent()}
						<View style={{ height: spacing.base }} />
					</View>
				</ScrollView>

				{/* Navigation Buttons */}
				<View
					className="bg-card px-6 py-4"
					style={{
						shadowColor: colors.shadow.lg,
						shadowOffset: { width: 0, height: -4 },
						shadowOpacity: 1,
						shadowRadius: 12,
						elevation: 8,
					}}
				>
					{currentStep < totalSteps ? (
						<View className="flex-row gap-3">
							{currentStep > 1 && (
								<TouchableOpacity
									className="flex-1 items-center justify-center rounded-xl border-2 border-primary bg-white p-4"
									onPress={handleBack}
								>
									<View className="flex-row items-center">
										<Ionicons name="arrow-back" size={20} color={colors.primary.main} />
										<Text
											className="ml-2 font-bold text-base"
											style={{
												color: colors.primary.main,
												fontFamily: "Montserrat_700Bold",
											}}
										>
											Back
										</Text>
									</View>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								className="flex-1 items-center justify-center rounded-xl p-4"
								onPress={handleNext}
								style={{
									flex: currentStep === 1 ? 1 : undefined,
									backgroundColor: colors.primary.main,
									shadowColor: colors.primary.dark,
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 4,
								}}
							>
								<View className="flex-row items-center">
									<Text
										className="font-bold text-base text-white"
										style={{ fontFamily: "Montserrat_700Bold" }}
									>
										Next
									</Text>
									<Ionicons name="arrow-forward" size={20} color="#fff" className="ml-2" />
								</View>
							</TouchableOpacity>
						</View>
					) : (
						<View className="flex-row gap-3">
							<TouchableOpacity
								className="flex-1 items-center justify-center rounded-xl border-2 border-primary bg-white p-4"
								onPress={handleBack}
							>
								<View className="flex-row items-center">
									<Ionicons name="arrow-back" size={20} color={colors.primary.main} />
									<Text
										className="ml-2 font-bold text-base"
										style={{
											color: colors.primary.main,
											fontFamily: "Montserrat_700Bold",
										}}
									>
										Back
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 items-center justify-center rounded-xl p-4"
								onPress={handleSubmit}
								disabled={createPropertyMutation.isPending}
								style={{
									backgroundColor: colors.status.success,
									shadowColor: colors.status.success,
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 4,
									opacity: createPropertyMutation.isPending ? 0.7 : 1,
								}}
							>
								<View className="flex-row items-center">
									<Text
										className="font-bold text-base text-white"
										style={{ fontFamily: "Montserrat_700Bold" }}
									>
										{createPropertyMutation.isPending ? "Completing..." : "Complete"}
									</Text>
									{!createPropertyMutation.isPending && (
										<Ionicons name="checkmark-circle" size={22} color="#fff" className="ml-2" />
									)}
								</View>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</Container>
	);
}
