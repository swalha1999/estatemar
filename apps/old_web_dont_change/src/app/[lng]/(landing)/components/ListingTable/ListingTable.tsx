"use client";

import React from "react";
import "./ListingTable.css";
import { useTranslation } from "@/app/i18n/client";
import PropertyCard from "@/app/[lng]/(landing)/components/PropertyCard/PropertyCard";
import type { ProjectDetails } from "@/utils/listings/project";

interface ListingTableProps {
    listings: ProjectDetails[];
    lng: string;
}

const ListingTable: React.FC<ListingTableProps> = ({ listings, lng }) => {
    const { t } = useTranslation(lng, "landing-page", {});

    // Filter for featured listings (best sellers or recommended)
    const featuredListings = listings.filter(
        (listing) => listing.is_best_seller || listing.is_recommended
    );

    return (
        <div className="listing-table-container">
            {featuredListings.length > 0 && (
                <div className="most-popular-section">
                    <h2 className="most-popular-title">{t("listingTable.mostPopular")}</h2>
                    <div className="most-popular-container">
                        {featuredListings.map((listing) => (
                            <PropertyCard
                                key={listing.id}
                                listing={listing}
                                showPopularLabel={true}
                                lng={lng}
                            />
                        ))}
                    </div>
                </div>
            )}
            <div className="most-popular-container">
                {listings.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} lng={lng} />
                ))}
            </div>
        </div>
    );
};

export default ListingTable;
