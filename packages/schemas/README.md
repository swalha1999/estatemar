# @estatemar/schemas

Shared Zod schemas package for the EstateMar application. This package contains all the Zod validation schemas used across the server and web applications to ensure consistency and reusability.

## Installation

This package is automatically available in the workspace via the monorepo setup.

## Usage

Import the schemas you need:

```typescript
import {
  signInSchema,
  signUpSchema,
  createPropertySchema,
  uploadFileSchema
} from "@estatemar/schemas";
```

## Available Schemas

### Auth Schemas (`/auth`)
- `signInSchema` - Schema for user sign-in
- `signUpSchema` - Schema for user registration
- `userSchema` - User data structure
- `sessionSchema` - Session data structure
- `accountSchema` - Account data structure
- `verificationSchema` - Verification data structure

### File Schemas (`/files`)
- `uploadFileSchema` - Schema for file uploads
- `getSignedUrlSchema` - Schema for requesting signed URLs
- `deleteFileSchema` - Schema for file deletion
- Response schemas for file operations

### Property Schemas (`/properties`)
- `createPropertySchema` - Schema for creating properties
- `addPropertyImageSchema` - Schema for adding property images
- `addPropertyAmenitySchema` - Schema for adding property amenities
- `getPropertiesSchema` - Schema for property listing queries
- `getPropertySchema` - Schema for single property queries
- Property data structure schemas

### Common Schemas (`/common`)
- `dataTableItemSchema` - Schema for data table items

## Types

All schemas export their corresponding TypeScript types:

```typescript
import type {
  SignInInput,
  CreatePropertyInput,
  Property
} from "@estatemar/schemas";
```

## Development

When adding new schemas:

1. Create the schema in the appropriate subdirectory
2. Export it from the subdirectory's `index.ts`
3. Export it from the main `src/index.ts`
4. Update this README if needed

## Validation

All schemas include proper validation rules and error messages to provide good user experience.