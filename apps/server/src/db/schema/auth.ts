import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

// Better Auth core tables
export const user = pgTable(
	"user",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		username: text("username"),
		displayUsername: text("display_username"),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified")
			.$defaultFn(() => false)
			.notNull(),
		image: text("image"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => /* @__PURE__ */ new Date())
			.notNull(),
		role: text("role").default("user"),
		banned: boolean("banned").default(false),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires"),
	},
	(table) => [
		index("user_username_idx").on(table.username),
		index("user_name_idx").on(table.name),
		index("user_created_at_idx").on(table.createdAt),
		index("user_email_verified_idx").on(table.emailVerified),
	],
);

export const session = pgTable(
	"session",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at").notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		activeOrganizationId: uuid("active_organization_id").references(
			() => organization.id,
			{ onDelete: "set null" },
		),
		impersonatedBy: text("impersonated_by"),
	},
	(table) => [
		index("session_user_id_idx").on(table.userId),
		index("session_expires_at_idx").on(table.expiresAt),
		index("session_active_organization_id_idx").on(table.activeOrganizationId),
		index("session_created_at_idx").on(table.createdAt),
	],
);

export const account = pgTable(
	"account",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at").notNull(),
	},
	(table) => [
		index("account_user_id_idx").on(table.userId),
		index("account_provider_id_idx").on(table.providerId),
		index("account_account_id_idx").on(table.accountId),
		index("account_user_provider_idx").on(table.userId, table.providerId),
		index("account_access_token_expires_at_idx").on(table.accessTokenExpiresAt),
	],
);

export const verification = pgTable(
	"verification",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").$defaultFn(
			() => /* @__PURE__ */ new Date(),
		),
		updatedAt: timestamp("updated_at").$defaultFn(
			() => /* @__PURE__ */ new Date(),
		),
	},
	(table) => [
		index("verification_identifier_idx").on(table.identifier),
		index("verification_value_idx").on(table.value),
		index("verification_expires_at_idx").on(table.expiresAt),
		index("verification_identifier_value_idx").on(
			table.identifier,
			table.value,
		),
	],
);

// Better Auth organization plugin tables
export const organization = pgTable(
	"organization",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		logo: text("logo"),
		metadata: text("metadata"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		index("organization_name_idx").on(table.name),
		index("organization_created_at_idx").on(table.createdAt),
	],
);

export const member = pgTable(
	"member",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		role: text("role").notNull().default("member"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("member_unique").on(table.organizationId, table.userId),
		index("member_user_id_idx").on(table.userId),
		index("member_organization_id_idx").on(table.organizationId),
		index("member_role_idx").on(table.role),
		index("member_created_at_idx").on(table.createdAt),
		index("member_organization_role_idx").on(table.organizationId, table.role),
	],
);

export const invitation = pgTable(
	"invitation",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: text("email").notNull(),
		inviterId: uuid("inviter_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		role: text("role").notNull().default("member"),
		status: text("status").notNull().default("pending"),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		index("invitation_email_idx").on(table.email),
		index("invitation_organization_id_idx").on(table.organizationId),
		index("invitation_status_idx").on(table.status),
		index("invitation_expires_at_idx").on(table.expiresAt),
		index("invitation_inviter_id_idx").on(table.inviterId),
		index("invitation_email_organization_idx").on(
			table.email,
			table.organizationId,
		),
		index("invitation_organization_status_idx").on(
			table.organizationId,
			table.status,
		),
	],
);
