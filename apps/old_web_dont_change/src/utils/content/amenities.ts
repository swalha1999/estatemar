import { db } from "@/db";
import { amenities, type Amenity } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createAmenityDB(data: { name: string; description?: string; icon: string }) {
    const amenity = await db.insert(amenities).values(data).returning();
    return amenity[0];
}

export async function getAmenityDB(id: number) {
    const amenity = await db.select().from(amenities).where(eq(amenities.id, id)).limit(1);

    if (!amenity.length) {
        throw new Error("Amenity not found");
    }

    return amenity[0];
}

export async function updateAmenityDB(
    id: number,
    data: {
        name: string;
        description: string;
        icon: string;
    }
) {
    const updated = await db.update(amenities).set(data).where(eq(amenities.id, id)).returning();

    if (!updated.length) {
        throw new Error("Amenity not found");
    }

    return updated[0];
}

export async function deleteAmenityDB(id: number) {
    await db.delete(amenities).where(eq(amenities.id, id));
}

export async function getAmenities(): Promise<Amenity[]> {
    const amenitiesFromDb = await db.select().from(amenities);
    return amenitiesFromDb;
}
