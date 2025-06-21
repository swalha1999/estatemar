import { getCurrentSession } from '@/core/auth/session';
import { db } from '@/db';
import { contacts, families, households, invites, whatsapp_messages, type Contact, Invite } from '@/db/schema-auth';
import { and, asc, count, eq, not, sql, like, or } from 'drizzle-orm';
import { cache } from 'react';

// Types moved to v2 access layer

export const getAllContacts = cache(async () => {
	return await db.query.contacts.findMany({
		with: {
			household: true,
			family: true,
		},
		orderBy: [asc(contacts.id)],
	});
});

export type ContactWithHousehold = NonNullable<Awaited<ReturnType<typeof getAllContacts>>>[number];

export type ConsentStatus =
	| 'gave_consent'
	| 'no_response'
	| 'declined'
	| 'concent_message_not_sent'
	| 'concent_message_failed';

export interface ContactSearchParams {
	title?: string;
	firstName?: string;
	middleName?: string;
	familyName?: string;
	previousFamilyName?: string;
	phone?: string;
	village?: string;
	personalNumber?: string;
	homeNumber?: string;
	hood?: string;
}

const getConsentFilter = (status: ConsentStatus) => {
	switch (status) {
		case 'gave_consent':
			return eq(contacts.contactConsent, true);
		case 'declined':
			return eq(contacts.optOut, true);
		case 'concent_message_failed':
			return eq(contacts.concentMessageFailed, true);
		case 'concent_message_not_sent':
			return and(
				eq(contacts.contactConsent, false),
				eq(contacts.concentMessageSent, false),
				eq(contacts.concentMessageFailed, false)
			);
		case 'no_response':
			return and(
				eq(contacts.contactConsent, false),
				eq(contacts.concentMessageSent, true),
				eq(contacts.concentMessageFailed, false),
				eq(contacts.optOut, false)
			);
		default:
			return undefined;
	}
};

// Moved to v2 access layer

export const getContactsStats = cache(
	async (
		street?: string,
		town?: string,
		consentStatus?: ConsentStatus,
		searchParams?: ContactSearchParams,
		familyName?: string
	) => {
		const { session, user } = await getCurrentSession();

		if (session === null || user === null) {
			return {
				totalContacts: 0,
				totalHouseholds: 0,
				totalOptedIn: 0,
				totalDeclined: 0,
				totalDidntRespond: 0,
				totalFailed: 0,
				totalDidntSend: 0,
			};
		}

		if (!user.is_super_admin && !user.is_admin) {
			return {
				totalContacts: 0,
				totalHouseholds: 0,
				totalOptedIn: 0,
				totalDeclined: 0,
				totalDidntRespond: 0,
				totalFailed: 0,
				totalDidntSend: 0,
			};
		}

		const conditions = [];

		if (town) {
			conditions.push(eq(households.town, town));
		}

		if (street) {
			conditions.push(eq(households.street, street));
		}

		if (familyName) {
			conditions.push(eq(families.name, familyName));
		}

		if (consentStatus) {
			const consentFilter = getConsentFilter(consentStatus);
			if (consentFilter) {
				conditions.push(consentFilter);
			}
		}

		// Add search filters
		if (searchParams) {
			if (searchParams.title) {
				conditions.push(like(contacts.title, `%${searchParams.title}%`));
			}
			if (searchParams.firstName) {
				conditions.push(like(contacts.firstName, `%${searchParams.firstName}%`));
			}
			if (searchParams.middleName) {
				conditions.push(like(contacts.middleName, `%${searchParams.middleName}%`));
			}
			if (searchParams.familyName) {
				conditions.push(like(families.name, `%${searchParams.familyName}%`));
			}
			if (searchParams.previousFamilyName) {
				conditions.push(
					like(contacts.previousFamilyName, `%${searchParams.previousFamilyName}%`)
				);
			}
			if (searchParams.phone) {
				conditions.push(like(contacts.phone, `%${searchParams.phone}%`));
			}
			if (searchParams.village) {
				conditions.push(like(households.town, `%${searchParams.village}%`));
			}
			if (searchParams.personalNumber) {
				conditions.push(
					sql`CAST(${contacts.personalNumber} AS TEXT) LIKE ${`%${searchParams.personalNumber}%`}`
				);
			}
			if (searchParams.homeNumber) {
				conditions.push(
					sql`CAST(${households.number} AS TEXT) LIKE ${`%${searchParams.homeNumber}%`}`
				);
			}
			if (searchParams.hood) {
				conditions.push(like(households.street, `%${searchParams.hood}%`));
			}
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		// Get all stats in parallel
		const [
			totalContacts,
			totalHouseholds,
			totalOptedIn,
			totalDeclined,
			totalDidntRespond,
			totalFailed,
			totalDidntSend,
		] = await Promise.all([
			// Total contacts
			db
				.select({ count: count() })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(whereClause),

			// Total households
			db
				.select({ count: count(sql.raw('DISTINCT households.id')) })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(whereClause),

			// Total opted in
			db
				.select({ count: count() })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(
					whereClause
						? and(whereClause, eq(contacts.contactConsent, true))
						: eq(contacts.contactConsent, true)
				),

			// Total declined
			db
				.select({ count: count() })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(
					whereClause
						? and(whereClause, eq(contacts.optOut, true))
						: eq(contacts.optOut, true)
				),

			// Total didn't respond
			db
				.select({ count: count() })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(
					whereClause
						? and(
								whereClause,
								eq(contacts.contactConsent, false),
								eq(contacts.concentMessageSent, true),
								eq(contacts.concentMessageFailed, false),
								eq(contacts.optOut, false)
							)
						: and(
								eq(contacts.contactConsent, false),
								eq(contacts.concentMessageSent, true),
								eq(contacts.concentMessageFailed, false),
								eq(contacts.optOut, false)
							)
				),

			// Total failed
			db
				.select({ count: count() })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(
					whereClause
						? and(whereClause, eq(contacts.concentMessageFailed, true))
						: eq(contacts.concentMessageFailed, true)
				),

			// Total didn't send
			db
				.select({ count: count() })
				.from(contacts)
				.leftJoin(households, eq(contacts.householdId, households.id))
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(
					whereClause
						? and(
								whereClause,
								eq(contacts.contactConsent, false),
								eq(contacts.concentMessageSent, false),
								eq(contacts.concentMessageFailed, false)
							)
						: and(
								eq(contacts.contactConsent, false),
								eq(contacts.concentMessageSent, false),
								eq(contacts.concentMessageFailed, false)
							)
				),
		]);

		return {
			totalContacts: totalContacts[0]?.count || 0,
			totalHouseholds: totalHouseholds[0]?.count || 0,
			totalOptedIn: totalOptedIn[0]?.count || 0,
			totalDeclined: totalDeclined[0]?.count || 0,
			totalDidntRespond: totalDidntRespond[0]?.count || 0,
			totalFailed: totalFailed[0]?.count || 0,
			totalDidntSend: totalDidntSend[0]?.count || 0,
		};
	}
);

export async function getContactById(id: number) {
	return await db.query.contacts.findFirst({
		where: eq(contacts.id, id),
		with: {
			household: true,
			family: true,
		},
	});
}

export async function getContactByPhoneNumber(phoneNumber: string) {
	return await db.query.contacts.findFirst({
		where: eq(contacts.phone, phoneNumber),
	});
}

export async function getContactsByHousehold(householdId: number) {
	return await db.select().from(contacts).where(eq(contacts.householdId, householdId));
}

export async function createContact(
	data: Omit<
		Contact,
		'id' | 'approvedAt' | 'approvedBy' | 'contactConsentAt' | 'optOutAt' | 'concentMessageSent'
	>
) {
	// check if the phone number is already in use by another contact
	const { user } = await getCurrentSession();
	if (data.phone && user?.email !== 'malkabusaleh@azimh.com') {
		const existingContact = await db.query.contacts.findFirst({
			where: eq(contacts.phone, data.phone),
		});
		if (existingContact) {
			throw new Error('Phone number already in use');
		}
	}

	if (data.householdId && data.personalNumber) {
		const existingContact = await db.query.contacts.findFirst({
			where: and(
				eq(contacts.householdId, data.householdId),
				eq(contacts.personalNumber, data.personalNumber)
			),
		});

		if (existingContact && existingContact.id) {
			throw new Error('Contact already exists');
		}
	}
	return await db.insert(contacts).values(data);
}

export async function updateContact(id: number, data: Partial<Contact>) {
	// check if the phone number is already in use by another contact
	const { user } = await getCurrentSession();
	if (data.phone && user?.email !== 'malkabusaleh@azimh.com') {
		const existingContact = await db.query.contacts.findFirst({
			where: and(eq(contacts.phone, data.phone), not(eq(contacts.id, id))),
		});
		if (existingContact) {
			throw new Error('Phone number already in use');
		}
	}

	if (data.householdId && data.personalNumber) {
		const existingContact = await db.query.contacts.findFirst({
			where: and(
				eq(contacts.householdId, data.householdId),
				eq(contacts.personalNumber, data.personalNumber),
				not(eq(contacts.id, id))
			),
		});

		if (existingContact && existingContact.id) {
			throw new Error('Contact with this household and personal number already exists');
		}
	}

	return await db.update(contacts).set(data).where(eq(contacts.id, id));
}

export async function deleteContact(id: number) {
	const deletedContact = (await db.delete(contacts).where(eq(contacts.id, id)).returning())[0];
	if (deletedContact?.householdId) {
		const household = await db.query.households.findFirst({
			where: eq(households.id, deletedContact.householdId),
			with: {
				contacts: true,
			},
		});
		if (household?.contacts.length === 0) {
			await db.delete(households).where(eq(households.id, deletedContact.householdId));
		}
	}
	return deletedContact;
}

export async function updateContactConsent(id: number, consent: boolean) {
	return await db
		.update(contacts)
		.set({
			contactConsent: consent,
			contactConsentAt: consent ? new Date() : null,
		})
		.where(eq(contacts.id, id));
}

export async function updateContactOptOut(id: number, optOut: boolean) {
	return await db
		.update(contacts)
		.set({
			optOut,
			optOutAt: optOut ? new Date() : null,
		})
		.where(eq(contacts.id, id));
}

export const getAllUniqueTowns = cache(async () => {
	const result = await db
		.selectDistinct({ town: households.town })
		.from(households)
		.orderBy(asc(households.town));

	return result.map((item) => item.town).filter(Boolean);
});

export const getAllUniqueStreets = cache(async () => {
	const result = await db
		.selectDistinct({ street: households.street })
		.from(households)
		.orderBy(asc(households.street));

	return result.map((item) => item.street).filter(Boolean);
});

export const getAllUniqueFamilies = cache(async () => {
	const result = await db
		.selectDistinct({ name: families.name })
		.from(families)
		.orderBy(asc(families.name));

	return result.map((item) => item.name).filter(Boolean);
});

const userFields = {
	firstName: contacts.firstName,
	middleName: contacts.middleName,
	previousFamilyName: contacts.previousFamilyName,
	phone: contacts.phone,
	contactConsent: contacts.contactConsent,
	optOut: contacts.optOut,
	concentMessageSent: contacts.concentMessageSent,
	contactConsentAt: contacts.contactConsentAt,
	optOutAt: contacts.optOutAt,
	approved: contacts.approved,
};

const userHouseholdFields = {
	street: households.street,
	town: households.town,
};

const userFamilyFields = {
	family: families.name,
};

/**
 * Retrieves the current user's invite (wedding info)
 * @returns The latest invite for the current user, or null if not found
 */
export async function getCurrentUserInvite() {
	const { user } = await getCurrentSession();

	if (!user) {
		return [];
	}

	return await db.query.invites.findMany({
		where: eq(invites.userId, user.id),
	});
}

export type UserInvite = NonNullable<Awaited<ReturnType<typeof getCurrentUserInvite>>>[number];

/**
 * Retrieves contacts with their invitation status for the current user
 * This shows contacts that are prepared for invitations (not necessarily sent yet)
 * @returns Object with contacts grouped by invitation method (hall, home, traditional)
 */
// Use unstable_cache for this function to enable revalidation tags
export const getContactsWithInvitationStatus = cache(async () => {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			hall: [],
			home: [],
			keran: [],
			traditional: [],
		};
	}

	// Get user's invites
	const userInvites = await db.query.invites.findMany({
		where: eq(invites.userId, user.id),
	});

	// Create invite lookup map
	const inviteMap = new Map();
	userInvites.forEach((invite) => {
		const method = invite.whatsappTemplate.replace('_invite', '');
		inviteMap.set(method, invite.id);
	});

	// Get all contacts with their whatsapp messages - use a more efficient query
	// with selective fields and limit the related data
	const contactsWithMessages = await db.query.contacts.findMany({
		with: {
			household: true, // Need to fetch all fields to match the ContactWithHousehold type
			family: true,
			whatsappMessages: {
				where: (whatsappMessages, { eq, inArray }) => {
					const inviteIds = Array.from(inviteMap.values());
					return inviteIds.length > 0
						? inArray(whatsappMessages.inviteId, inviteIds)
						: eq(whatsappMessages.id, -1);
				},
				with: {
					invite: {
						columns: {
							id: true,
							whatsappTemplate: true,
						},
					},
				},
			},
		},
		orderBy: [asc(contacts.id)],
	});

	// Group contacts by invitation method
	const result = {
		hall: [] as Array<ContactWithInvitationStatus>,
		home: [] as Array<ContactWithInvitationStatus>,
		keran: [] as Array<ContactWithInvitationStatus>,
		traditional: [] as Array<ContactWithInvitationStatus>,
	};

	contactsWithMessages.forEach((contact) => {
		contact.whatsappMessages.forEach((message) => {
			// Show all prepared invitations (whether sent or not)
			if (message.invite) {
							const method = message.invite.whatsappTemplate.replace('_invite', '') as
				| 'hall'
				| 'home'
				| 'keran'
				| 'traditional';

				const contactWithStatus: ContactWithInvitationStatus = {
					...contact,
					invitationStatus: {
						sent: message.message_sent,
						delivered: message.message_delivered,
						read: message.message_read,
						failed: message.message_failed || false,
						approved: message.approved,
						declined: message.declined,
						messageId: message.message_id || undefined,
						template: message.message_template || undefined,
					},
				};

				result[method].push(contactWithStatus);
			}
		});
	});

	return result;
});

export type ContactWithInvitationStatus = ContactWithHousehold & {
	invitationStatus: {
		sent: boolean;
		delivered: boolean;
		read: boolean;
		failed: boolean;
		approved: boolean;
		declined: boolean;
		messageId?: string;
		template?: string;
	};
};

/**
 * Retrieves all households with contacts and their current invitation status
 * @returns Array of households with contacts that include their invitation status
 */
export async function getAllHouseholdsWithInvitationStatus() {
	const { user } = await getCurrentSession();

	if (!user) {
		return [];
	}

	// Get user's invites first
	const userInvites = await db.query.invites.findMany({
		where: eq(invites.userId, user.id),
	});

	// Create invite lookup map
	const inviteMap = new Map();
	userInvites.forEach((invite) => {
		const method = invite.whatsappTemplate.replace('_invite', '');
		inviteMap.set(method, invite.id);
	});

	// Get households with contacts and their whatsapp messages
	const households = await db.query.households.findMany({
		with: {
			contacts: {
				with: {
					family: true,
					whatsappMessages: {
						where: (whatsappMessages, { inArray, eq }) => {
							const inviteIds = Array.from(inviteMap.values());
							return inviteIds.length > 0
								? inArray(whatsappMessages.inviteId, inviteIds)
								: eq(whatsappMessages.id, -1);
						},
						with: {
							invite: true,
						},
					},
				},
				orderBy: [asc(contacts.personalNumber)],
			},
		},
	});

	return households;
}

/**
 * Retrieves households with pagination and their current invitation status
 * @param page Current page number
 * @param limit Number of households per page
 * @param townFilter Filter by specific town
 * @param streetFilter Filter by specific street
 * @returns Object with households array and total count
 */
export interface HouseholdSearchParams {
	firstName?: string;
	middleName?: string;
	lastName?: string;
	pastLastName?: string;
}

export async function getAllHouseholdsWithInvitationStatusPaginated(
	page: number = 1,
	limit: number = 50,
	townFilter?: string,
	streetFilter?: string,
	familyFilter?: string,
	searchParams?: HouseholdSearchParams
) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { households: [], total: 0 };
	}

	// Get user's invites first
	const userInvites = await db.query.invites.findMany({
		where: eq(invites.userId, user.id),
	});

	// Create invite lookup map
	const inviteMap = new Map();
	userInvites.forEach((invite) => {
		const method = invite.whatsappTemplate.replace('_invite', '');
		inviteMap.set(method, invite.id);
	});

	// Build where conditions for filtering
	const conditions = [];

	if (townFilter && townFilter !== 'all') {
		conditions.push(eq(households.town, townFilter));
	}

	if (streetFilter && streetFilter !== 'all') {
		conditions.push(eq(households.street, streetFilter));
	}



	let whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	let householdsToInclude: number[] | undefined;

	// Handle family filter separately since it requires joining through contacts
	if (familyFilter && familyFilter !== 'all') {
		const householdsWithFamily = await db
			.selectDistinct({ householdId: contacts.householdId })
			.from(contacts)
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(eq(families.name, familyFilter));
		
		householdsToInclude = householdsWithFamily.map(h => h.householdId).filter((id): id is number => id !== null);
		
		if (householdsToInclude.length === 0) {
			return { households: [], total: 0 };
		}
		
		const inClause = sql`${households.id} IN (${sql.join(householdsToInclude, sql`, `)})`;
		if (whereClause) {
			whereClause = and(whereClause, inClause);
		} else {
			whereClause = inClause;
		}
	}

	// Handle contact-level search parameters with AND logic (all conditions must match)
	if (searchParams?.firstName || searchParams?.middleName || searchParams?.lastName || searchParams?.pastLastName) {
		const contactSearchConditions = [];
		
		if (searchParams.firstName) {
			contactSearchConditions.push(like(contacts.firstName, `%${searchParams.firstName}%`));
		}
		
		if (searchParams.middleName) {
			contactSearchConditions.push(like(contacts.middleName, `%${searchParams.middleName}%`));
		}
		
		if (searchParams.lastName) {
			contactSearchConditions.push(like(families.name, `%${searchParams.lastName}%`));
		}
		
		if (searchParams.pastLastName) {
			contactSearchConditions.push(like(contacts.previousFamilyName, `%${searchParams.pastLastName}%`));
		}

		// Build a query that requires ALL search conditions to match
		const searchCondition = and(...contactSearchConditions);
		
		// If we already have household restrictions, combine them efficiently
		if (householdsToInclude && householdsToInclude.length > 0) {
			const householdInClause = sql`${contacts.householdId} IN (${sql.join(householdsToInclude, sql`, `)})`;
			const combinedSearchCondition = and(searchCondition, householdInClause);
			
			const householdsWithMatchingContacts = await db
				.selectDistinct({ householdId: contacts.householdId })
				.from(contacts)
				.leftJoin(families, eq(contacts.familyId, families.id))
				.where(combinedSearchCondition);
			
			householdsToInclude = householdsWithMatchingContacts
				.map(h => h.householdId)
				.filter((id): id is number => id !== null);
		} else {
					const householdsWithMatchingContacts = await db
			.selectDistinct({ householdId: contacts.householdId })
			.from(contacts)
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(searchCondition);
		
		householdsToInclude = householdsWithMatchingContacts
			.map(h => h.householdId)
			.filter((id): id is number => id !== null);
		}
		
		if (householdsToInclude.length === 0) {
			return { households: [], total: 0 };
		}
		
		const inClause = sql`${households.id} IN (${sql.join(householdsToInclude, sql`, `)})`;
		if (whereClause) {
			whereClause = and(whereClause, inClause);
		} else {
			whereClause = inClause;
		}
	}

	// Get total count of households with filters
	const totalResult = await db.select({ count: count() }).from(households).where(whereClause);
	const total = totalResult[0]?.count || 0;

	// Get households with pagination and filters
	const householdsData = await db.query.households.findMany({
		where: whereClause,
		with: {
			contacts: {
				with: {
					family: true,
					whatsappMessages: {
						where: (whatsappMessages, { inArray, eq }) => {
							const inviteIds = Array.from(inviteMap.values());
							return inviteIds.length > 0
								? inArray(whatsappMessages.inviteId, inviteIds)
								: eq(whatsappMessages.id, -1);
						},
						with: {
							invite: true,
						},
					},
				},
				orderBy: [asc(contacts.personalNumber)],
			},
		},
		orderBy: [asc(households.town), asc(households.street), asc(households.number)],
		limit: limit,
		offset: (page - 1) * limit,
	});

	return {
		households: householdsData,
		total,
	};
}

/**
 * More efficient version that combines all search conditions into a single query
 */
export async function getAllHouseholdsWithInvitationStatusPaginatedOptimized(
	page: number = 1,
	limit: number = 50,
	townFilter?: string,
	streetFilter?: string,
	familyFilter?: string,
	searchParams?: HouseholdSearchParams
) {
	const { user } = await getCurrentSession();

	if (!user) {
		return { households: [], total: 0 };
	}

	// Get user's invites first
	const userInvites = await db.query.invites.findMany({
		where: eq(invites.userId, user.id),
	});

	// Create invite lookup map
	const inviteMap = new Map();
	userInvites.forEach((invite) => {
		const method = invite.whatsappTemplate.replace('_invite', '');
		inviteMap.set(method, invite.id);
	});

	// Build a single comprehensive query with all conditions
	const conditions = [];

	// Household-level filters
	if (townFilter && townFilter !== 'all') {
		conditions.push(eq(households.town, townFilter));
	}

	if (streetFilter && streetFilter !== 'all') {
		conditions.push(eq(households.street, streetFilter));
	}

	// Family filter
	if (familyFilter && familyFilter !== 'all') {
		conditions.push(eq(families.name, familyFilter));
	}

	// Search conditions - use AND for different fields, requiring all to match
	if (searchParams?.firstName) {
		conditions.push(like(contacts.firstName, `%${searchParams.firstName}%`));
	}
	if (searchParams?.middleName) {
		conditions.push(like(contacts.middleName, `%${searchParams.middleName}%`));
	}
	if (searchParams?.lastName) {
		conditions.push(like(families.name, `%${searchParams.lastName}%`));
	}
	if (searchParams?.pastLastName) {
		conditions.push(like(contacts.previousFamilyName, `%${searchParams.pastLastName}%`));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// Single query to get matching household IDs with all conditions
	const matchingHouseholds = await db
		.selectDistinct({ 
			householdId: contacts.householdId,
			town: households.town,
			street: households.street,
			number: households.number
		})
		.from(contacts)
		.leftJoin(households, eq(contacts.householdId, households.id))
		.leftJoin(families, eq(contacts.familyId, families.id))
		.where(whereClause)
		.orderBy(asc(households.town), asc(households.street), asc(households.number));

	const householdIds = matchingHouseholds
		.map(h => h.householdId)
		.filter((id): id is number => id !== null);

	if (householdIds.length === 0) {
		return { households: [], total: 0 };
	}

	const total = householdIds.length;

	// Get paginated household IDs
	const paginatedHouseholdIds = householdIds.slice((page - 1) * limit, page * limit);

	if (paginatedHouseholdIds.length === 0) {
		return { households: [], total };
	}

	// Single query to get full household data for the paginated results
	const householdsData = await db.query.households.findMany({
		where: sql`${households.id} IN (${sql.join(paginatedHouseholdIds, sql`, `)})`,
		with: {
			contacts: {
				with: {
					family: true,
					whatsappMessages: {
						where: (whatsappMessages, { inArray, eq }) => {
							const inviteIds = Array.from(inviteMap.values());
							return inviteIds.length > 0
								? inArray(whatsappMessages.inviteId, inviteIds)
								: eq(whatsappMessages.id, -1);
						},
						with: {
							invite: true,
						},
					},
				},
				orderBy: [asc(contacts.personalNumber)],
			},
		},
		orderBy: [asc(households.town), asc(households.street), asc(households.number)],
	});

	// Ensure the results are in the same order as our paginated IDs
	const orderedHouseholds = paginatedHouseholdIds
		.map((id: number) => householdsData.find((h: any) => h.id === id))
		.filter((household): household is NonNullable<typeof household> => household !== undefined);

	return {
		households: orderedHouseholds,
		total,
	};
}

/**
 * Get unique towns for the current user's households
 * @returns Array of unique town names
 */
export async function getUniqueTownsForUser() {
	const { user } = await getCurrentSession();

	if (!user) {
		return [];
	}

	const result = await db
		.selectDistinct({ town: households.town })
		.from(households)
		.orderBy(asc(households.town));

	return result.map((item) => item.town).filter(Boolean);
}

/**
 * Get unique streets for the current user's households, optionally filtered by town
 * @param townFilter Optional town filter to get streets only for a specific town
 * @returns Array of unique street names
 */
export async function getUniqueStreetsForUser(townFilter?: string) {
	const { user } = await getCurrentSession();

	if (!user) {
		return [];
	}

	const conditions = [];
	if (townFilter && townFilter !== 'all') {
		conditions.push(eq(households.town, townFilter));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const result = await db
		.selectDistinct({ street: households.street })
		.from(households)
		.where(whereClause)
		.orderBy(asc(households.street));

	return result.map((item) => item.street).filter(Boolean);
}

/**
 * Get unique families for the dashboard 
 * @returns Array of unique family names
 */
export async function getUniqueFamiliesForUser() {
	const { user } = await getCurrentSession();

	if (!user) {
		return [];
	}

	const result = await db
		.selectDistinct({ name: families.name })
		.from(families)
		.innerJoin(contacts, eq(families.id, contacts.familyId))
		.orderBy(asc(families.name));

	return result.map((item) => item.name).filter(Boolean);
}

export type HouseholdWithInvitationStatus = NonNullable<
	Awaited<ReturnType<typeof getAllHouseholdsWithInvitationStatus>>
>[number];

/**
 * Get invitation statistics for the contacts stats dashboard
 * Uses the existing getContactsWithInvitationStatus function to get counts
 * @returns Object containing total contacts and invitation counts by type
 */
export const getInvitationStats = cache(async () => {
	const { user } = await getCurrentSession();

	if (!user) {
		return {
			totalContacts: 0,
			hallInvitations: 0,
			homeInvitations: 0,
			traditionalInvitations: 0,
		};
	}

	// Get total contacts count (unfiltered)
	const totalContactsResult = await db
		.select({ count: count() })
		.from(contacts);
	
	const totalContacts = totalContactsResult[0]?.count || 0;

	// Use the existing function to get invitation data
	const invitationData = await getContactsWithInvitationStatus();

	return {
		totalContacts,
		hallInvitations: invitationData.hall.length,
		homeInvitations: invitationData.home.length,
		traditionalInvitations: invitationData.traditional.length,
	};
});