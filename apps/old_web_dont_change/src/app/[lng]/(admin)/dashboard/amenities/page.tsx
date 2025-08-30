import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAmenities } from "@/utils/content/amenities";
import Link from "next/link";
import { AmenitiesTable } from "./components/amenities-table";

export default async function AmenitiesPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = await params;

    const amenities = await getAmenities();

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Amenities</CardTitle>
                    <Button asChild>
                        <Link href={`/${lng}/dashboard/amenities/new`}>Add New Amenity</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <AmenitiesTable amenities={amenities} lng={lng} />
                </CardContent>
            </Card>
        </div>
    );
}
