import { BaseRepository } from "./base";
import { propertiesFiles } from "@/data/access-layer-v2/schemas/properties-files.schema";
import { files } from "@/data/access-layer-v2/schemas/files.schema";
import { eq, and, desc } from "drizzle-orm";

export class PropertiesFilesRepository extends BaseRepository {
	async addFileToProperty(propertyId: number, fileId: number, isPrimary: boolean = false, displayOrder: number = 0) {
		const [propertyFile] = await this.db
			.insert(propertiesFiles)
			.values({
				propertyId,
				fileId,
				isPrimary,
				displayOrder,
			})
			.returning();
		return propertyFile;
	}

	async removeFileFromProperty(propertyId: number, fileId: number) {
		const [deleted] = await this.db
			.delete(propertiesFiles)
			.where(and(
				eq(propertiesFiles.propertyId, propertyId),
				eq(propertiesFiles.fileId, fileId)
			))
			.returning();
		return deleted;
	}

	async getPropertyFiles(propertyId: number) {
		return await this.db
			.select({
				id: propertiesFiles.id,
				propertyId: propertiesFiles.propertyId,
				fileId: propertiesFiles.fileId,
				isPrimary: propertiesFiles.isPrimary,
				displayOrder: propertiesFiles.displayOrder,
				createdAt: propertiesFiles.createdAt,
				fileName: files.fileName,
				uploadedAt: files.uploadedAt,
			})
			.from(propertiesFiles)
			.innerJoin(files, eq(propertiesFiles.fileId, files.id))
			.where(eq(propertiesFiles.propertyId, propertyId))
			.orderBy(desc(propertiesFiles.isPrimary), propertiesFiles.displayOrder);
	}

	async updateFileOrder(propertyId: number, fileId: number, displayOrder: number) {
		const [updated] = await this.db
			.update(propertiesFiles)
			.set({ displayOrder })
			.where(and(
				eq(propertiesFiles.propertyId, propertyId),
				eq(propertiesFiles.fileId, fileId)
			))
			.returning();
		return updated;
	}

	async setPrimaryImage(propertyId: number, fileId: number) {
		// First, set all images for this property to not primary
		await this.db
			.update(propertiesFiles)
			.set({ isPrimary: false })
			.where(eq(propertiesFiles.propertyId, propertyId));

		// Then set the selected image as primary
		const [updated] = await this.db
			.update(propertiesFiles)
			.set({ isPrimary: true })
			.where(and(
				eq(propertiesFiles.propertyId, propertyId),
				eq(propertiesFiles.fileId, fileId)
			))
			.returning();
		return updated;
	}

	async deleteAllPropertyFiles(propertyId: number) {
		return await this.db
			.delete(propertiesFiles)
			.where(eq(propertiesFiles.propertyId, propertyId))
			.returning();
	}
} 