"use client";
import { Layer, Map, Source } from "@vis.gl/react-maplibre";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { ProjectDetails } from "@/utils/listings/project";
import ProjectCard from "../PropertyCard/PropertyCard";

interface MapComponentProps {
	listings: ProjectDetails[];
}

const MapComponent: React.FC<MapComponentProps> = ({ listings }) => {
	const router = useRouter();
	const [hoveredListing, setHoveredListing] = useState<ProjectDetails | null>(
		null,
	);
	const [tooltipPosition, setTooltipPosition] = useState<
		[number, number] | null
	>(null);
	const [isLayerLoaded, setIsLayerLoaded] = useState(false);

	const geojsonData = useMemo(
		() => ({
			type: "FeatureCollection",
			features: listings.map((listing) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [Number(listing.longitude), Number(listing.latitude)],
				},
				properties: {
					...JSON.parse(JSON.stringify(listing)),
				},
			})),
		}),
		[listings],
	);

	const handleMouseMove = useCallback(
		(event: any) => {
			if (!isLayerLoaded) return;

			const features = event.target.queryRenderedFeatures(event.point, {
				layers: ["listing-points"],
			});

			if (features.length > 0) {
				const properties = features[0].properties;
				setHoveredListing(properties as ProjectDetails);
				setTooltipPosition([event.point.x, event.point.y]);
			} else {
				setHoveredListing(null);
				setTooltipPosition(null);
			}
		},
		[isLayerLoaded],
	);

	const handleMapClick = useCallback(
		(event: any) => {
			if (!isLayerLoaded) return;

			const features = event.target.queryRenderedFeatures(event.point, {
				layers: ["listing-points"],
			});
			if (features.length > 0) {
				const properties = features[0].properties as ProjectDetails;
				console.log(`Selected Listing: ${properties.name}`);
				router.push(`/projects/${properties.slug}`);
			}
		},
		[isLayerLoaded, router],
	);

	const MemoizedProjectCard = useMemo(
		() =>
			hoveredListing &&
			tooltipPosition && (
				<div
					style={{
						position: "absolute",
						left: tooltipPosition[0],
						top: tooltipPosition[1],
						backgroundColor: "white",
						padding: "8px",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						pointerEvents: "none",
						fontSize: "12px",
						zIndex: 2,
					}}
				>
					<ProjectCard listing={hoveredListing} lng="en" />
				</div>
			),
		[hoveredListing, tooltipPosition],
	);

	return (
		<div className="map-container">
			<Map
				mapStyle="/maps-styles/solletics.json"
				style={{ width: "100%", height: "30rem" }}
				attributionControl={false}
				initialViewState={{
					longitude: 44.7939,
					latitude: 41.7151,
					zoom: 2,
					pitch: 45,
				}}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => {
					setHoveredListing(null);
					setTooltipPosition(null);
				}}
				onClick={handleMapClick}
				interactive={true}
				onLoad={() => setIsLayerLoaded(true)}
			>
				<Source id="listings" type="geojson" data={geojsonData}>
					<Layer
						id="listing-points"
						type="circle"
						paint={{
							"circle-radius": 6,
							"circle-color": "#007bff",
							"circle-stroke-width": 2,
							"circle-stroke-color": "#ffffff",
						}}
					/>
				</Source>
			</Map>

			{MemoizedProjectCard}
		</div>
	);
};

export default MapComponent;
