import { db } from '@/db';
import { users, type User } from '@/db/schema-auth';
import { eq, asc, desc, not } from 'drizzle-orm';

/**
 * Retrieves all users from the database
 * @returns Array of all users
 */
export async function getAllUsers() {
	return await db.select().from(users);
}

/**
 * Retrieves all users from the database without developers
 * @returns Array of all users without developers
 */
export async function getAllUsersWithoutDevelopers() {
	return await db
		.select()
		.from(users)
		.where(not(eq(users.is_developer, true)));
}

/**
 * Retrieves users with pagination and sorting
 * @param sort Sort direction ("asc" or "desc")
 * @param page Current page number
 * @param limit Number of items per page
 * @returns Array of users for the specified page
 */
export async function getAllUsersWithPagination(sort: 'asc' | 'desc', page: number, limit: number) {
	return await db
		.select()
		.from(users)
		.orderBy(sort === 'asc' ? asc(users.id) : desc(users.id))
		.limit(limit)
		.offset((page - 1) * limit);
}

/**
 * Retrieves a user by their ID
 * @param id The ID of the user to retrieve
 * @returns Array containing the user if found, empty array if not found
 */
export async function getUserById(id: number) {
	return await db.select().from(users).where(eq(users.id, id));
}

/**
 * Retrieves a user by their email
 * @param email The email of the user to retrieve
 * @returns Array containing the user if found, empty array if not found
 */
export async function getUserByEmail(email: string) {
	return await db.select().from(users).where(eq(users.email, email));
}

/**
 * Creates a new user
 * @param data The user data without the ID
 * @returns The created user
 */
export async function createUser(data: Omit<User, 'id'>) {
	return await db.insert(users).values(data);
}

/**
 * Updates an existing user
 * @param id The ID of the user to update
 * @param data The updated user data
 * @returns The updated user
 */
export async function updateUser(id: number, data: Partial<User>) {
	return await db.update(users).set(data).where(eq(users.id, id));
}

/**
 * Deletes a user by their ID
 * @param id The ID of the user to delete
 * @returns The deleted user
 */
export async function deleteUser(id: number) {
	return await db.delete(users).where(eq(users.id, id));
}

/**
 * Toggles the admin status of a user
 * @param id The ID of the user to toggle admin status for
 * @returns The updated user with toggled admin status or null if user not found
 */
export async function toggleUserAdmin(id: number) {
	const user = await getUserById(id);
	if (!user.length) return null;

	const currentAdminStatus = user[0].is_admin;
	return await updateUser(id, {
		is_admin: !currentAdminStatus,
	});
}

/**
 * Toggles the super admin status of a user
 * @param id The ID of the user to toggle super admin status for
 * @returns The updated user with toggled super admin status or null if user not found
 */
export async function toggleUserSuperAdmin(id: number) {
	const user = await getUserById(id);
	if (!user.length) return null;

	const currentSuperAdminStatus = user[0].is_super_admin;
	return await updateUser(id, {
		is_super_admin: !currentSuperAdminStatus,
	});
}

/**
 * Searches for users by email or username
 * @param query The search query to match against email or username
 * @returns Array of matching users
 */
export async function searchUsers(query: string) {
	return await db
		.select()
		.from(users)
		.where(eq(users.email, query) || eq(users.username, query));
}