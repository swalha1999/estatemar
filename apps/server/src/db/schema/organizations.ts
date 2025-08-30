import {
	boolean,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// Organization roles enum
export const organizationRoleEnum = pgEnum("organization_role", [
	"owner",
	"admin",
	"member",
	"viewer",
]);

// Organizations table
export const organization = pgTable("organization", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	image: text("image"), // Organization logo/avatar
	settings: jsonb("settings").default({}), // Organization-wide settings
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Organization memberships (many-to-many users-orgs)
export const organizationMember = pgTable(
	"organization_member",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: organizationRoleEnum("role").notNull().default("member"),
		joinedAt: timestamp("joined_at").notNull().defaultNow(),
		invitedBy: uuid("invited_by").references(() => user.id),
	},
	(table) => [unique().on(table.userId, table.organizationId)],
);

// Organization invitations (for pending invites)
export const organizationInvitation = pgTable("organization_invitation", {
	id: uuid("id").primaryKey().defaultRandom(),
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	email: text("email").notNull(),
	role: organizationRoleEnum("role").notNull().default("member"),
	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	invitedBy: uuid("invited_by")
		.notNull()
		.references(() => user.id),
	acceptedAt: timestamp("accepted_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Organization settings for future extensibility
export const organizationSettings = pgTable("organization_settings", {
	id: uuid("id").primaryKey().defaultRandom(),
	organizationId: uuid("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" })
		.unique(),
	allowMemberInvites: boolean("allow_member_invites").notNull().default(true),
	requireApproval: boolean("require_approval").notNull().default(false),
	defaultRole: organizationRoleEnum("default_role").notNull().default("member"),
	customBranding: jsonb("custom_branding").default({}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
