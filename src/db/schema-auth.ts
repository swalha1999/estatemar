import { InferSelectModel, relations, sql } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
	unique,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		is_admin: boolean('is_admin').default(false).notNull(), // this user can see the admin panel
		is_super_admin: boolean('is_super_admin').default(false).notNull(), // this most powerful user and can be seen by the UI
		is_developer: boolean('is_developer').default(false).notNull(), // this most powerful user and its hidden from the UI

		// user data
		email: varchar('email', { length: 255 }).notNull().unique(),
		username: varchar('username', { length: 255 }).notNull(),
		phone: varchar('phone', { length: 255 }),

		// in house auth
		password_hash: varchar('password_hash', { length: 255 }),
		recovery_code: varchar('recovery_code', { length: 255 }),
		totp_key: varchar('totp_key', { length: 255 }),
		email_verified: boolean('email_verified').default(false).notNull(),
		registered_2fa: boolean('registered_2fa').default(false).notNull(),

		// GOOGLE AUTH
		google_id: varchar('google_id', { length: 255 }).unique(),
		photo_url: varchar('photo_url', { length: 255 }), // TODO: update to file table

		// TODO: Add apple auth
	},
	(table) => [
		index('email_index').on(table.email),
		index('username_index').on(table.username),
		index('google_id_index').on(table.google_id),
	]
);

export const users_relations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	emailVerificationRequests: many(email_verification_requests),
	passwordResetSessions: many(password_reset_sessions),
	approvedContacts: many(contacts, { relationName: 'approved_by' }),
	addedContacts: many(contacts, { relationName: 'added_by' }),
	uploadedFiles: many(files, { relationName: 'uploaded_by' }),
	invites: many(invites),
}));

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	two_factor_verified: boolean('two_factor_verified').default(false).notNull(),
});

export const sessions_relations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const email_verification_requests = pgTable('email_verification_requests', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	email: varchar('email', { length: 255 }).notNull(),
	code: varchar('code', { length: 255 }).notNull(),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export const email_verification_requests_relations = relations(
	email_verification_requests,
	({ one }) => ({
		user: one(users, {
			fields: [email_verification_requests.userId],
			references: [users.id],
		}),
	})
);

export const password_reset_sessions = pgTable('password_reset_sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	email: varchar('email', { length: 255 }).notNull(),
	code: varchar('code', { length: 255 }).notNull(),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	twoFactorVerified: boolean('two_factor_verified').default(false).notNull(),
});

export const password_reset_sessions_relations = relations(password_reset_sessions, ({ one }) => ({
	user: one(users, {
		fields: [password_reset_sessions.userId],
		references: [users.id],
	}),
}));

export const families = pgTable(
	'families',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
	},
	(table) => [index('name_index').on(table.name), unique('name_unique').on(table.name)]
);

export const families_relations = relations(families, ({ many }) => ({
	contacts: many(contacts),
}));

export const households = pgTable(
	'households',
	{
		id: serial('id').primaryKey(),
		number: integer('number').notNull(),
		street: varchar('street', { length: 255 }).notNull(),
		town: varchar('town', { length: 255 }).notNull(),
	},
	(table) => [
		unique('number_street_town_unique').on(table.number, table.street, table.town),
		index('number_index').on(table.number),
		index('street_index').on(table.street),
		index('town_index').on(table.town),
	]
);

export const households_relations = relations(households, ({ many }) => ({
	contacts: many(contacts),
}));

export const contacts = pgTable(
	'contacts',
	{
		id: serial('id').primaryKey(),
		title: varchar('title', { length: 255 }),
		firstName: varchar('first_name', { length: 255 }).notNull(),
		middleName: varchar('middle_name', { length: 255 }),
		previousFamilyName: varchar('previous_family_name', { length: 255 }),
		birthYear: integer('birth_year'),
		gender: varchar('gender', { length: 20 }),
		phone: varchar('phone', { length: 255 }),
		personalNumber: integer('personal_number'),
		familyId: integer('family_id').references(() => families.id, { onDelete: 'set null' }),
		approved: boolean('approved').default(false).notNull(), // if the contact is approved by admin
		approvedAt: timestamp('approved_at', {
			withTimezone: true,
			mode: 'date',
		}),
		concentMessageSent: boolean('concent_message_sent').default(false).notNull(), // if the contact consent to be contacted
		concentMessageFailed: boolean('concent_message_failed').default(false).notNull(), // if the contact consent to be contacted
		contactConsent: boolean('contact_consent').default(false).notNull(), // if the contact consent to be contacted
		contactConsentAt: timestamp('contact_consent_at', {
			withTimezone: true,
			mode: 'date',
		}),

		optOut: boolean('opt_out').default(false).notNull(), // if the contact opt out from being contacted
		optOutAt: timestamp('opt_out_at', {
			withTimezone: true,
			mode: 'date',
		}),

		householdId: integer('household_id').references(() => households.id, {
			onDelete: 'set null',
		}),
		approvedBy: integer('approved_by').references(() => users.id, { onDelete: 'set null' }),
		addedBy: integer('added_by').references(() => users.id, { onDelete: 'set null' }),
	},
	(table) => [
		index('opt_out_index').on(table.optOut),
		index('phone_index').on(table.phone),
		index('approved_index').on(table.approved),
		// Search performance indexes
		index('first_name_index').on(table.firstName),
		index('middle_name_index').on(table.middleName),
		index('previous_family_name_index').on(table.previousFamilyName),
		index('birth_year_index').on(table.birthYear),
		index('gender_index').on(table.gender),
		index('personal_number_index').on(table.personalNumber),
		// Foreign key indexes for joins
		index('household_id_index').on(table.householdId),
		index('family_id_index').on(table.familyId),
		// Composite indexes for common query patterns
		index('household_personal_number_index').on(table.householdId, table.personalNumber),
		index('consent_status_index').on(
			table.contactConsent,
			table.optOut,
			table.concentMessageSent,
			table.concentMessageFailed
		),
	]
);

export const contacts_relations = relations(contacts, ({ one, many }) => ({
	household: one(households, {
		fields: [contacts.householdId],
		references: [households.id],
	}),
	approvedBy: one(users, {
		fields: [contacts.approvedBy],
		references: [users.id],
		relationName: 'approved_by',
	}),
	addedBy: one(users, {
		fields: [contacts.addedBy],
		references: [users.id],
		relationName: 'added_by',
	}),
	whatsappMessages: many(whatsapp_messages),
	family: one(families, {
		fields: [contacts.familyId],
		references: [families.id],
	}),
}));

export const invites = pgTable('invites', {
	id: serial('id').primaryKey(),
	groomName: varchar('groom_name', { length: 255 }).notNull(),
	brideName: varchar('bride_name', { length: 255 }).notNull(),
	date: timestamp('date', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	location: varchar('location', { length: 255 }).notNull(),
	inviter: varchar('inviter', { length: 255 }),
	whatsappTemplate: varchar('whatsapp_template', { length: 255 }).notNull(),
	weddingCardFileId: integer('wedding_card_file_id').references(() => files.id, {
		onDelete: 'set null',
	}),
	userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
	AdminApproved: boolean('admin_approved').default(false).notNull(),
	isCanceled: boolean('is_canceled').default(false).notNull(),
	scheduledSendAt: timestamp('scheduled_send_at', {
		withTimezone: true,
		mode: 'date',
	}),
});

export const invites_relations = relations(invites, ({ one, many }) => ({
	weddingCardFile: one(files, {
		fields: [invites.weddingCardFileId],
		references: [files.id],
	}),
	whatsappMessages: many(whatsapp_messages),
	user: one(users, {
		fields: [invites.userId],
		references: [users.id],
	}),
}));

export const whatsapp_messages = pgTable('whatsapp_messages', {
	id: serial('id').primaryKey(),
	message_id: varchar('message_id', { length: 255 }),
	message_sent: boolean('message_sent').default(false).notNull(),
	message_delivered: boolean('message_delivered').default(false).notNull(),
	message_read: boolean('message_read').default(false).notNull(),
	message_failed: boolean('message_failed').default(false),
	message_template: varchar('message_template', { length: 255 }),
	approved: boolean('approved').default(false).notNull(),
	declined: boolean('declined').default(false).notNull(),
	phone: varchar('phone', { length: 255 }),
	message_content: text('message_content'),
	contactId: integer('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
	inviteId: integer('invite_id').references(() => invites.id, { onDelete: 'set null' }),
	sentAt: timestamp('sent_at', {
		withTimezone: true,
		mode: 'date',
	}),
	deliveredAt: timestamp('delivered_at', {
		withTimezone: true,
		mode: 'date',
	}),
	readAt: timestamp('read_at', {
		withTimezone: true,
		mode: 'date',
	}),
}, (table) => [
	index('message_sent_index').on(table.message_sent),
	index('message_delivered_index').on(table.message_delivered),
	index('message_read_index').on(table.message_read),
	index('message_failed_index').on(table.message_failed),
	index('message_template_index').on(table.message_template),
	index('contact_id_index').on(table.contactId),
	index('invite_id_index').on(table.inviteId),

	// Composite indexes for common query patterns
	index('contact_invite_index').on(table.contactId, table.inviteId),
	index('contact_invite_template_index').on(table.contactId, table.message_template),
	index('invite_message_template_index').on(table.inviteId, table.message_template),
	index('contact_invite_message_id_index').on(table.contactId, table.inviteId, table.message_id),
	// Foreign key indexes for joins
]);

export const whatsapp_messages_relations = relations(whatsapp_messages, ({ one }) => ({
	contact: one(contacts, {
		fields: [whatsapp_messages.contactId],
		references: [contacts.id],
	}),
	invite: one(invites, {
		fields: [whatsapp_messages.inviteId],
		references: [invites.id],
	}),
}));

export const files = pgTable('files', {
	id: serial('id').primaryKey(),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
	uploadedAt: timestamp('uploaded_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export const files_relations = relations(files, ({ one, many }) => ({
	uploadedBy: one(users, {
		fields: [files.uploadedBy],
		references: [users.id],
		relationName: 'uploaded_by',
	}),
	invites: many(invites),
}));

export const leads = pgTable('leads', {
	id: serial('id').primaryKey(),
	brideName: varchar('bride_name', { length: 255 }).notNull(),
	groomName: varchar('groom_name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow(),
});

//Auth
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type EmailVerificationRequest = InferSelectModel<typeof email_verification_requests>;
export type PasswordResetSession = InferSelectModel<typeof password_reset_sessions>;

//Data
export type Household = InferSelectModel<typeof households>;
export type Contact = InferSelectModel<typeof contacts>;
export type WhatsAppMessage = InferSelectModel<typeof whatsapp_messages>;
export type Family = InferSelectModel<typeof families>;
export type Invite = InferSelectModel<typeof invites>;
export type File = InferSelectModel<typeof files>;
export type Lead = InferSelectModel<typeof leads>;

//Safe Types
export type SafeUser = Pick<
	User,
	| 'id'
	| 'email'
	| 'username'
	| 'email_verified'
	| 'registered_2fa'
	| 'google_id'
	| 'photo_url'
	| 'is_admin'
	| 'is_super_admin'
	| 'is_developer'
>;
