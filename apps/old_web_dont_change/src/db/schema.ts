import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
    boolean,
    decimal,
    index,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),

        // user data
        email: varchar("email", { length: 255 }).notNull().unique(),
        username: varchar("username", { length: 255 }).notNull(),

        // in house auth
        password_hash: varchar("password_hash", { length: 255 }),
        recovery_code: varchar("recovery_code", { length: 255 }),
        totp_key: varchar("totp_key", { length: 255 }),
        email_verified: boolean("email_verified").default(false).notNull(),
        registered_2fa: boolean("registered_2fa").default(false).notNull(),

        // GOOGLE AUTH
        google_id: varchar("google_id", { length: 255 }).unique(),
        photo_url: varchar("photo_url", { length: 255 }), // TODO: update to file table

        // TODO: Add apple auth
    },
    (table) => ({
        emailIndex: index("email_index").on(table.email),
        usernameIndex: index("username_index").on(table.username),
        googleIdIndex: index("google_id_index").on(table.google_id),
    })
);

export const users_relations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    emailVerificationRequests: many(email_verification_requests),
    passwordResetSessions: many(password_reset_sessions),
}));

export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    two_factor_verified: boolean("two_factor_verified").default(false).notNull(),
});

export const sessions_relations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const email_verification_requests = pgTable("email_verification_requests", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
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

export const password_reset_sessions = pgTable("password_reset_sessions", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    twoFactorVerified: boolean("two_factor_verified").default(false).notNull(),
});

export const password_reset_sessions_relations = relations(password_reset_sessions, ({ one }) => ({
    user: one(users, {
        fields: [password_reset_sessions.userId],
        references: [users.id],
    }),
}));

export const articles = pgTable("articles", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    language: varchar("language", { length: 10 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    image_id: integer("image_id").references(() => files.id),
    is_published: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const articles_relations = relations(articles, ({ one }) => ({
    image: one(files, {
        fields: [articles.image_id],
        references: [files.id],
    }),
}));

// Agents (real estate agents)
export const agents = pgTable("agents", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
        .notNull()
        .references(() => users.id),
    license_number: varchar("license_number", { length: 100 }),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    whatsapp: varchar("whatsapp", { length: 20 }),
    bio: text("bio"),
    years_of_experience: integer("years_of_experience"),
});

export const agents_relations = relations(agents, ({ one }) => ({
    user: one(users, {
        fields: [agents.user_id],
        references: [users.id],
    }),
}));

export const updates_leads = pgTable("updates_leads", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const partner_leads = pgTable("partner_leads", {
    id: serial("id").primaryKey(),
    company_name: varchar("company_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

// Developers (real estate developers)
export const developers = pgTable(
    "developers",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        slug: varchar("slug", { length: 255 })
            .default(sql`gen_random_uuid()`)
            .notNull(),
        description: text("description"),
        phone: varchar("phone", { length: 20 }),
        whatsapp: varchar("whatsapp", { length: 20 }),
        email: varchar("email", { length: 255 }),
        logo: integer("logo").references(() => files.id),
        website: varchar("website", { length: 255 }),
        facebook: varchar("facebook", { length: 255 }),
        instagram: varchar("instagram", { length: 255 }),
        linkedin: varchar("linkedin", { length: 255 }),
        twitter: varchar("twitter", { length: 255 }),
    },
    (table) => ({
        slugIndex: index("slug_index").on(table.slug),
        nameIndex: index("name_index").on(table.name),
    })
);

export const developers_relations = relations(developers, ({ one, many }) => ({
    logo: one(files, {
        fields: [developers.logo],
        references: [files.id],
        relationName: "logo",
    }),
    projects: many(projects),
}));

// Amenities (pool, gym, parking, etc.)
export const amenities = pgTable("amenities", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 100 }).notNull(),
    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const amenities_relations = relations(amenities, ({ many }) => ({
    properties: many(property_amenities),
    projects: many(project_amenities),
}));

// ---------------------------------------<Property>-------------------------------------------
export const properties = pgTable("properties", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    square_meter: integer("square_meter").notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),

    latitude: decimal("latitude", { precision: 12, scale: 8 }),
    longitude: decimal("longitude", { precision: 12, scale: 8 }),

    type: integer("type")
        .notNull()
        .references(() => property_types.id),

    status: integer("status")
        .notNull()
        .references(() => property_statuses.id),

    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),

    updated_at: timestamp("updated_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const properties_relations = relations(properties, ({ one, many }) => ({
    type: one(property_types, {
        fields: [properties.type],
        references: [property_types.id],
    }),
    status: one(property_statuses, {
        fields: [properties.status],
        references: [property_statuses.id],
    }),
    images: many(property_images),
    amenities: many(property_amenities),
    agents: many(property_agents),
}));

// Property types (house, apartment, condo, industrial, etc.)
export const property_types = pgTable("property_types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
});

export const property_types_relations = relations(property_types, ({ many }) => ({
    properties: many(properties),
}));

// Property statuses (for_sale, for_rent, under_development, etc.)
export const property_statuses = pgTable("property_statuses", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
});

export const property_statuses_relations = relations(property_statuses, ({ many }) => ({
    properties: many(properties),
}));

export const property_amenities = pgTable("property_amenities", {
    property_id: integer("property_id")
        .notNull()
        .references(() => properties.id),
    amenity_id: integer("amenity_id")
        .notNull()
        .references(() => amenities.id),
});

export const property_amenities_relations = relations(property_amenities, ({ one }) => ({
    property: one(properties, {
        fields: [property_amenities.property_id],
        references: [properties.id],
    }),
    amenity: one(amenities, {
        fields: [property_amenities.amenity_id],
        references: [amenities.id],
    }),
}));

export const property_images = pgTable("property_images", {
    property_id: integer("property_id")
        .notNull()
        .references(() => properties.id),
    image_id: integer("image_id")
        .notNull()
        .references(() => files.id),
    is_primary: boolean("is_primary").default(false).notNull(),
});

export const property_images_relations = relations(property_images, ({ one }) => ({
    property: one(properties, {
        fields: [property_images.property_id],
        references: [properties.id],
    }),
    image: one(files, {
        fields: [property_images.image_id],
        references: [files.id],
    }),
}));

export const property_agents = pgTable("property_agents", {
    property_id: integer("property_id")
        .notNull()
        .references(() => properties.id),
    agent_id: integer("agent_id")
        .notNull()
        .references(() => agents.id),
});

export const property_agents_relations = relations(property_agents, ({ one }) => ({
    property: one(properties, {
        fields: [property_agents.property_id],
        references: [properties.id],
    }),
    agent: one(agents, {
        fields: [property_agents.agent_id],
        references: [agents.id],
    }),
}));

// ---------------------------------------</Property>-----------------------------------------
// ---------------------------------------<Project>-------------------------------------------

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),

    min_price: decimal("min_price", { precision: 12, scale: 2 }),
    max_price: decimal("max_price", { precision: 12, scale: 2 }),
    show_price: boolean("show_price").default(true).notNull(),

    total_units: integer("total_units").notNull().default(0),
    available_units: integer("available_units").notNull().default(0),

    latitude: decimal("latitude", { precision: 12, scale: 8 }),
    longitude: decimal("longitude", { precision: 12, scale: 8 }),

    is_best_seller: boolean("is_best_seller").default(false).notNull(),
    is_recommended: boolean("is_recommended").default(false).notNull(),

    date_of_completion: timestamp("date_of_completion", {
        withTimezone: true,
        mode: "date",
    }),
    developer_id: integer("developer_id")
        .notNull()
        .references(() => developers.id, { onDelete: "cascade" }),

    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const projects_relations = relations(projects, ({ one, many }) => ({
    developer: one(developers, {
        fields: [projects.developer_id],
        references: [developers.id],
    }),
    images: many(project_images),
    files: many(project_files),
    amenities: many(project_amenities),
    units: many(project_units),
}));

export const project_units = pgTable("project_units", {
    project_id: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    unit_type: varchar("unit_type", { length: 100 }).notNull(), // apartment, studio, penthouse, etc.
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    rooms: integer("rooms").notNull(),
    square_meter: integer("square_meter").notNull(),
    description: text("description").notNull(),
    is_available: boolean("is_available").default(true).notNull(),
    number_of_units: integer("number_of_units").notNull(),
    available_units: integer("available_units").notNull(),

    unit_image_id: integer("unit_image_id").references(() => files.id, { onDelete: "set null" }),

    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const project_units_relations = relations(project_units, ({ one }) => ({
    project: one(projects, {
        fields: [project_units.project_id],
        references: [projects.id],
    }),
    unit_image: one(files, {
        fields: [project_units.unit_image_id],
        references: [files.id],
    }),
}));

// Project images (jpg, png, etc.)
export const project_images = pgTable("project_images", {
    project_id: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    image_id: integer("image_id")
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
    order_index: integer("order_index").default(0).notNull(),
});

export const project_images_relations = relations(project_images, ({ one }) => ({
    project: one(projects, {
        fields: [project_images.project_id],
        references: [projects.id],
    }),
    image: one(files, {
        fields: [project_images.image_id],
        references: [files.id],
    }),
}));

// Project files (pdf, doc, etc.)
export const project_files = pgTable("project_files", {
    title: varchar("title", { length: 255 }).notNull(),
    project_id: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    file_id: integer("file_id")
        .notNull()
        .references(() => files.id),
});

export const project_files_relations = relations(project_files, ({ one }) => ({
    project: one(projects, {
        fields: [project_files.project_id],
        references: [projects.id],
    }),
    file: one(files, {
        fields: [project_files.file_id],
        references: [files.id],
    }),
}));

export const project_amenities = pgTable(
    "project_amenities",
    {
        project_id: integer("project_id")
            .notNull()
            .references(() => projects.id, { onDelete: "cascade" }),
        amenity_id: integer("amenity_id")
            .notNull()
            .references(() => amenities.id, { onDelete: "cascade" }),
    },
    (table) => ({
        // Add composite primary key
        pk: primaryKey({ columns: [table.project_id, table.amenity_id] }),
        // Add indexes for better query performance
        projectIdIdx: index("project_amenities_project_id_idx").on(table.project_id),
        amenityIdIdx: index("project_amenities_amenity_id_idx").on(table.amenity_id),
    })
);

export const project_amenities_relations = relations(project_amenities, ({ one }) => ({
    project: one(projects, {
        fields: [project_amenities.project_id],
        references: [projects.id],
    }),
    amenity: one(amenities, {
        fields: [project_amenities.amenity_id],
        references: [amenities.id],
    }),
}));

// ---------------------------------------</Project>-----------------------------------------

export const files = pgTable("files", {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    file_type: varchar("file_type", { length: 100 }),
    caption: varchar("caption", { length: 255 }),
    size: integer("size"),
    width: integer("width").default(100),
    height: integer("height").default(100),
    created_at: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const files_relations = relations(files, ({ many }) => ({
    project_images: many(project_images),
    property_images: many(property_images),
    project_files: many(project_files),
    articles: many(articles),
    developer_logos: many(developers, { relationName: "logo" }),
    project_unit_images: many(project_units),
}));

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type EmailVerificationRequest = InferSelectModel<typeof email_verification_requests>;
export type PasswordResetSession = InferSelectModel<typeof password_reset_sessions>;
export type Article = InferSelectModel<typeof articles>;
export type Property = InferSelectModel<typeof properties>;
export type Amenity = InferSelectModel<typeof amenities>;
export type PropertyAmenity = InferSelectModel<typeof property_amenities>;
export type Agent = InferSelectModel<typeof agents>;
export type PropertyImage = InferSelectModel<typeof property_images>;
export type PropertyAgent = InferSelectModel<typeof property_agents>;
export type PropertyType = InferSelectModel<typeof property_types>;
export type PropertyStatus = InferSelectModel<typeof property_statuses>;
export type File = InferSelectModel<typeof files>;
export type Developer = InferSelectModel<typeof developers>;
export type Project = InferSelectModel<typeof projects>;
export type ProjectImage = InferSelectModel<typeof project_images>;
export type ProjectFile = InferSelectModel<typeof project_files>;
export type UpdatesLead = InferSelectModel<typeof updates_leads>;
export type PartnerLead = InferSelectModel<typeof partner_leads>;
