// pages/index.tsx

import ListingTable from "@/app/[lng]/(landing)/components/ListingTable/ListingTable";
import MapComponent from "@/app/[lng]/(landing)/components/MapComponent/MapComponent";
import SearchFilters from "@/app/[lng]/(landing)/components/SearchFilters/SearchFilters";
import ViewCollector from "@/components/metricsCollection/viewCollector";
import "./index.css";
import { getProjects, ProjectDetails } from "@/utils/listings/project";

interface HomeProps {
    params: Promise<{
        lng: string;
    }>;
    searchParams: Promise<{
        location?: string;
        lowestPrice?: string;
        highestPrice?: string;
    }>;
}

export default async function Home(props: HomeProps) {
    const params = await props.params;
    const { lng = "" } = params;
    const listings = await getProjects();

    listings.forEach((listing) => {
        listing.min_price =
            listing.min_price
                ?.toString()
                .replace(/\.\d+/, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || null;
        listing.max_price =
            listing.max_price
                ?.toString()
                .replace(/\.\d+/, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || null;
    });

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-center w-full bg-[#ffffff] ${lng === "ar" ? "rtl" : "ltr"}`}
        >
            <ViewCollector metricKey={`/${lng}`} />
            <a id="home"></a>
            <div className="w-full">
                <div className="w-full">
                    <div className="w-full relative">
                        <MapComponent listings={listings} />
                        <div className="search-filters-container">
                            <SearchFilters lng={lng} />
                        </div>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto px-4">
                    <ListingTable listings={listings} lng={lng} />
                </div>
            </div>
        </main>
    );
}
