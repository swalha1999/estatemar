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

export default function FavoritesScreen() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const { data, isLoading, refetch } = useQuery(
		orpc.realEstate.property.getMyFavorites.queryOptions({
			input: {
				page: 1,
				limit: 50,
			},
		}),
	);

	if (!session?.user) {
		return (
			<Container>
				<View className="flex-1 p-4">
					<Text className="font-bold text-2xl text-foreground">Favorites</Text>
					<Text className="mt-2 mb-6 text-muted-foreground">
						Sign in to view your saved properties
					</Text>
					<SignIn />
				</View>
			</Container>
		);
	}

	const favorites = data?.data?.favorites || [];

	const renderFavoriteCard = ({ item }: { item: (typeof favorites)[0] }) => {
		const property = item.property as {
			id: string;
			title: string;
			price: string;
			currency: string;
			city: string;
			area: string;
			bedrooms: number | null;
			bathrooms: number | null;
			size: number | null;
			images: string[] | null;
		};
		if (!property) return null;

		const price = Number.parseFloat(property.price);
		const formattedPrice = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: property.currency,
			maximumFractionDigits: 0,
		}).format(price);

		const images = property.images || [];

		return (
			<TouchableOpacity
				className="mx-4 mb-4 rounded-xl bg-card shadow-sm"
				style={{ borderWidth: 1, borderColor: colors.border.light }}
				onPress={() => router.push(`/property/${property.id}`)}
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
						{property.title}
					</Text>
					<Text className="mt-1 font-bold text-primary text-xl">
						{formattedPrice}
					</Text>
					<Text
						className="mt-1 text-muted-foreground text-sm"
						numberOfLines={1}
					>
						📍 {property.city}, {property.area}
					</Text>
					<View className="mt-3 flex-row gap-4">
						{property.bedrooms && (
							<Text className="text-muted-foreground text-sm">
								🛏️ {property.bedrooms}
							</Text>
						)}
						{property.bathrooms && (
							<Text className="text-muted-foreground text-sm">
								🛁 {property.bathrooms}
							</Text>
						)}
						{property.size && (
							<Text className="text-muted-foreground text-sm">
								📐 {property.size} m²
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
				<View className="border-border border-b bg-card px-4 py-4">
					<Text className="font-bold text-2xl text-foreground">Favorites</Text>
					<Text className="mt-1 text-muted-foreground text-sm">
						{favorites.length}{" "}
						{favorites.length === 1 ? "property" : "properties"} saved
					</Text>
				</View>

				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color={colors.primary.main} />
					</View>
				) : favorites.length === 0 ? (
					<View className="flex-1 items-center justify-center p-4">
						<Text className="mb-2 text-center font-semibold text-foreground text-lg">
							No favorites yet
						</Text>
						<Text className="text-center text-muted-foreground">
							Properties you save will appear here
						</Text>
					</View>
				) : (
					<FlatList
						data={favorites}
						renderItem={renderFavoriteCard}
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
