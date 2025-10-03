import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { SafeImage } from "@/components/ui/safe-image";
import { colors, spacing } from "@/lib/theme";
import { orpc } from "@/utils/orpc";

export default function DiscoverScreen() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [page] = useState(1);

	const { data, isLoading, refetch } = useQuery(
		orpc.realEstate.property.list.queryOptions({
			input: {
				page,
				limit: 20,
				search: search || undefined,
				sortBy: "createdAt",
				sortOrder: "desc",
			},
		}),
	);

	const properties = data?.data?.properties || [];

	const renderPropertyCard = ({ item }: { item: (typeof properties)[0] }) => {
		const price = Number.parseFloat(item.price);
		const formattedPrice = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: item.currency,
			maximumFractionDigits: 0,
		}).format(price);

		const images = (item.images as string[] | null) || [];

		return (
			<TouchableOpacity
				className="mx-4 mb-4 rounded-xl bg-card shadow-sm"
				style={{ borderWidth: 1, borderColor: colors.border.light }}
				onPress={() => router.push(`/property/${item.id}`)}
			>
				<SafeImage uri={images[0] || null}
					style={{
						width: "100%",
						height: 200,
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
					<Text className="mt-1 font-bold text-primary text-xl">
						{formattedPrice}
					</Text>
					<Text
						className="mt-1 text-muted-foreground text-sm"
						numberOfLines={1}
					>
						📍 {item.city}, {item.area}
					</Text>
					<View className="mt-3 flex-row gap-4">
						{item.bedrooms && (
							<Text className="text-muted-foreground text-sm">
								🛏️ {item.bedrooms}
							</Text>
						)}
						{item.bathrooms && (
							<Text className="text-muted-foreground text-sm">
								🛁 {item.bathrooms}
							</Text>
						)}
						{item.size && (
							<Text className="text-muted-foreground text-sm">
								📐 {item.size} m²
							</Text>
						)}
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<Container>
			<View className="flex-1">
				<View className="border-border border-b bg-card px-4 py-3">
					<Text className="mb-3 font-bold text-2xl text-foreground">
						Discover Properties
					</Text>
					<View className="flex-row gap-2">
						<TextInput
							className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground"
							placeholder="Search properties..."
							placeholderTextColor={colors.text.tertiary}
							value={search}
							onChangeText={setSearch}
						/>
						<TouchableOpacity
							className="items-center justify-center rounded-lg bg-primary px-4"
							onPress={() => router.push("/filter-modal")}
						>
							<Text className="text-xl">🔍</Text>
						</TouchableOpacity>
					</View>
				</View>

				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				) : properties.length === 0 ? (
					<View className="flex-1 items-center justify-center p-4">
						<Text className="text-center text-muted-foreground">
							No properties found
						</Text>
					</View>
				) : (
					<FlatList
						data={properties}
						renderItem={renderPropertyCard}
						keyExtractor={(item) => item.id}
						contentContainerStyle={{ paddingTop: spacing.base }}
						onRefresh={refetch}
						refreshing={isLoading}
					/>
				)}
			</View>
		</Container>
	);
}
