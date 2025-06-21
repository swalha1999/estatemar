import { getCurrentSession } from '@/core/auth/session';
import { db } from '@/db';
import { files } from '@/db/schema-auth';
import { sanitize } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export const createFile = async (address: string) => {
	const [sessionData, SessionError] = await sanitize(getCurrentSession());

	if (SessionError) {
		throw new Error(SessionError.message);
	}

	const { user } = sessionData;

	if (!user) {
		throw new Error('User not authenticated');
	}

	const [fileExists, fileError] = await sanitize(
		db.query.files.findFirst({
			where: eq(files.fileName, address),
		})
	);

	if (fileError) {
		throw new Error(fileError.message);
	}

	if (fileExists) {
		return fileExists;
	}

	const file = await db
		.insert(files)
		.values({
			fileName: address,
			uploadedAt: new Date(),
			uploadedBy: user.id,
		})
		.returning();

	return file[0];
};

const editFile = async (fileId: number, address: string) => {
	const file = await db
		.update(files)
		.set({
			fileName: address,
			uploadedAt: new Date(),
			uploadedBy: 1,
		})
		.where(eq(files.id, fileId));
	return file;
};

export const getFileById = async (fileId: number) => {
	const file = await db
		.query.files.findFirst({
			where: eq(files.id, fileId),
		});
	return file;
};