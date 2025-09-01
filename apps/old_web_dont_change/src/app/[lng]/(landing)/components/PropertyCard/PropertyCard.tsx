"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Icon } from "@/components/icon";
import "./PropertyCard.css";
import type { ProjectDetails } from "@/utils/listings/project";

interface PropertyCardProps {
	listing: ProjectDetails;
	showPopularLabel?: boolean;
	lng: string;
}

const TruncatedText: React.FC<{ text: string; className?: string }> = ({
	text,
	className,
}) => {
	const spanRef = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	useEffect(() => {
		const checkTruncation = () => {
			if (spanRef.current) {
				setIsTruncated(
					spanRef.current.scrollWidth > spanRef.current.clientWidth,
				);
			}
		};

		checkTruncation();
		window.addEventListener("resize", checkTruncation);
		return () => window.removeEventListener("resize", checkTruncation);
	}, [text]);

	return (
		<span
			ref={spanRef}
			className={`truncate ${className || ""}`}
			title={isTruncated ? text : undefined}
		>
			{text}
		</span>
	);
};

function PropertyCard({
	listing,
	showPopularLabel = false,
	lng,
}: PropertyCardProps) {
	const { t } = useTranslation(lng, "landing-page", {});

	const parsedImages =
		typeof listing.images === "string"
			? JSON.parse(listing.images)
			: listing.images;

	const firstImage = Array.isArray(parsedImages)
		? parsedImages[0]?.image?.url
		: undefined;

	return (
		<Link href={`/${lng}/projects/${listing.slug}`} prefetch={true}>
			<div className="most-popular-item">
				<div className="most-popular-image">
					<div className="badge-container">
						{listing.is_best_seller && (
							<span className="card-badge best-seller-badge">
								<Icon name="FaFire" className="badge-icon" />{" "}
								{t("listingTable.bestSellers")}
							</span>
						)}
						{listing.is_recommended && (
							<span className="card-badge recommended-badge">
								<Icon name="FaAward" className="badge-icon" />{" "}
								{t("listingTable.recommended")}
							</span>
						)}
					</div>
					{firstImage && (
						<Image
							src={firstImage}
							alt={listing.name}
							width={400}
							height={200}
							className="most-popular-img"
							priority={true}
						/>
					)}
				</div>
				<div className="units-status-container">
					<div className="units-status">
						<Icon name="FaHome" className="units-icon" />
						<span className="units-available">{listing.available_units}</span>
						<span className="units-separator">/</span>
						<span className="units-total">{listing.total_units}</span>
						<span className="units-label">
							{t("listingTable.unitsAvailable")}
						</span>
					</div>
				</div>
				<div className="most-popular-content">
					<TruncatedText text={listing.name} className="most-popular-header" />
					<div className="info-row">
						<Icon name="FaMapMarkerAlt" className="info-icon location-icon" />
						<p className="most-popular-location">
							<TruncatedText text={`${listing.city}, ${listing.country}`} />
						</p>
					</div>
					<div className="info-row">
						<Icon name="FaDollarSign" className="info-icon" />
						<p className="most-popular-price">
							{listing.available_units === 0 ? (
								<span className="sold-out">{t("listingTable.soldOut")}</span>
							) : (
								<TruncatedText
									text={`${listing.min_price} - ${listing.max_price}`}
								/>
							)}
						</p>
					</div>
					<div className="info-row">
						<Icon name="FaCalendarAlt" className="info-icon" />
						<p className="most-popular-finish-date">
							<TruncatedText
								text={
									listing.date_of_completion
										? new Date(listing.date_of_completion).toLocaleDateString()
										: ""
								}
							/>
						</p>
					</div>
					{/* <div className="status-container">
                        <span className={`project-status ${getStatusColor(listing.status)}`}>
                            {t(`listingTable.status.${listing.status}`)}
                        </span>
                    </div> */}
				</div>
			</div>
		</Link>
	);
}

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
