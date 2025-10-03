import { useState } from "react";
import { Image, type ImageProps, View } from "react-native";
import { colors } from "@/lib/theme";

interface SafeImageProps extends Omit<ImageProps, "source"> {
	uri: string | null | undefined;
	placeholderIcon?: React.ReactNode;
}

export function SafeImage({
	uri,
	placeholderIcon,
	style,
	...props
}: SafeImageProps) {
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	if (!uri || isError) {
		return (
			<View
				style={[
					{
						backgroundColor: colors.background.tertiary,
						justifyContent: "center",
						alignItems: "center",
					},
					style,
				]}
			>
				{placeholderIcon}
			</View>
		);
	}

	return (
		<>
			{isLoading && (
				<View
					style={[
						{
							backgroundColor: colors.grey[200],
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						},
						style,
					]}
				/>
			)}
			<Image
				{...props}
				source={{ uri }}
				style={style}
				onError={() => setIsError(true)}
				onLoadEnd={() => setIsLoading(false)}
			/>
		</>
	);
}
