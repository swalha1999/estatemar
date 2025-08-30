# Server Architecture Documentation

## Overview

This document describes the refactored server architecture designed for large-scale applications. The architecture follows clean architecture principles with clear separation of concerns across multiple layers.

## Architecture Layers

```
┌─────────────────────┐
│   Router Layer      │ ← Thin controllers (input validation, response formatting)
├─────────────────────┤
│   Service Layer     │ ← Business logic, orchestration, authorization
├─────────────────────┤
│   Repository Layer  │ ← Data access abstraction
├─────────────────────┤
│   Database Layer    │ ← Drizzle ORM + raw queries
└─────────────────────┘
```

## Folder Structure

```
src/
├── routers/           # Thin route handlers
│   ├── properties-new.ts
│   └── ...
├── services/          # Business logic layer
│   ├── PropertyService.ts
│   ├── AuthorizationService.ts
│   └── ...
├── repositories/      # Data access layer
│   ├── interfaces/
│   │   └── PropertyRepository.ts
│   ├── DrizzlePropertyRepository.ts
│   └── ...
├── types/            # Shared TypeScript types
│   ├── common.ts
│   ├── property.ts
│   └── ...
├── errors/           # Custom error classes
│   └── base.ts
├── utils/            # Utility functions
│   └── result.ts
└── container.ts      # Dependency injection
```

## Layer Responsibilities

### 1. Router Layer (Controllers)
- **Purpose**: HTTP request/response handling
- **Responsibilities**:
  - Input validation using schemas
  - Authentication context extraction
  - Response formatting
  - Error handling at HTTP level

**Example**:
```typescript
createProperty: protectedProcedure
  .input(createPropertySchema)
  .handler(async ({ input, context }) => {
    const authContext = await authService.validateAuthContext(context.session);
    return await propertyService.createProperty(input, authContext);
  })
```

### 2. Service Layer (Business Logic)
- **Purpose**: Business rules and orchestration
- **Responsibilities**:
  - Business logic implementation
  - Authorization checks
  - Cross-domain operations
  - Transaction coordination
  - Result formatting

**Example**:
```typescript
async createProperty(
  data: Omit<CreatePropertyData, "userId">,
  authContext: AuthContext,
): Promise<ServiceResult<Property>> {
  // Authorization logic
  if (data.organizationId) {
    await this.authService.canEditOrganizationProperties(
      authContext,
      data.organizationId,
    );
  }
  
  // Business logic
  const propertyData: CreatePropertyData = {
    ...data,
    userId: authContext.userId,
  };
  
  // Repository call
  const property = await this.propertyRepo.create(propertyData);
  return createSuccessResult(property);
}
```

### 3. Repository Layer (Data Access)
- **Purpose**: Data persistence abstraction
- **Responsibilities**:
  - Database operations
  - Query optimization
  - Data mapping
  - Storage abstraction

**Example**:
```typescript
interface PropertyRepository {
  create(data: CreatePropertyData): Promise<Property>;
  findById(id: string): Promise<Property | null>;
  findByOrganization(orgId: string, filters: PropertyFilters): Promise<Property[]>;
  // ... other methods
}
```

## Key Components

### 1. Error Handling System
```typescript
// Custom error hierarchy
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly isOperational = true;
}
// ... other error types
```

### 2. Service Result Pattern
```typescript
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper functions
export function createSuccessResult<T>(data: T): ServiceResult<T>;
export function createErrorResult<T>(error: string): ServiceResult<T>;
```

### 3. Authorization Service
```typescript
export class AuthorizationService {
  async validateAuthContext(session: any): Promise<AuthContext>;
  async canEditOrganizationProperties(authContext: AuthContext, orgId: string): Promise<OrganizationContext>;
  async canViewProperty(authContext: AuthContext, ownership: PropertyOwnership): Promise<boolean>;
  // ... other authorization methods
}
```

### 4. Dependency Injection Container
```typescript
class Container {
  private services = new Map<string, unknown>();
  
  get<T>(serviceName: string): T;
}

// Typed getters
export const getPropertyService = () => container.get<PropertyService>("propertyService");
export const getAuthorizationService = () => container.get<AuthorizationService>("authorizationService");
```

## Benefits

### 1. **Testability**
- Each layer can be unit tested independently
- Easy to mock dependencies
- Clear interfaces for testing

### 2. **Maintainability**
- Single responsibility principle
- Clear separation of concerns
- Consistent patterns across domains

### 3. **Scalability**
- Easy to add caching layers
- Database connection pooling
- Horizontal scaling support

### 4. **Extensibility**
- New features follow established patterns
- Easy to add new repositories/services
- Plugin architecture support

### 5. **Type Safety**
- Strong typing throughout all layers
- Compile-time error detection
- Better IDE support

## API Usage

### From Frontend (UI)
```typescript
// Instead of direct database calls, you now have:
const result = await api.createProperty.mutate({
  name: "Beautiful Villa",
  description: "...",
  location: "...",
  price: 500000,
  type: "villa",
  status: "For Sale"
});

if (result.success) {
  // Handle success
  console.log("Property created:", result.data);
} else {
  // Handle error
  console.error("Error:", result.error);
}
```

## Migration Strategy

### Phase 1: Infrastructure ✅
- [x] Create base types and interfaces
- [x] Set up error handling system
- [x] Create repository interfaces

### Phase 2: Core Implementation ✅
- [x] Implement property repository
- [x] Create authorization service
- [x] Build property service layer

### Phase 3: Integration ✅
- [x] Refactor property router
- [x] Set up dependency injection
- [x] Update router index

### Phase 4: Next Steps
- [ ] Extend to other domains (organizations, files, etc.)
- [ ] Add caching layer
- [ ] Implement database connection pooling
- [ ] Add comprehensive unit tests
- [ ] Set up integration tests

## Best Practices

### 1. Repository Pattern
- Always use interfaces for repositories
- Keep repositories focused on data access
- Abstract storage implementation details

### 2. Service Layer
- Keep business logic in services
- Use dependency injection
- Return structured results

### 3. Error Handling
- Use custom error types
- Handle errors at appropriate layers
- Provide meaningful error messages

### 4. Authorization
- Centralize authorization logic
- Use context objects for auth state
- Validate permissions at service layer

### 5. Type Safety
- Define clear interfaces
- Use generic types where appropriate
- Leverage TypeScript's type system

## Example Usage Patterns

### Creating a New Domain

1. **Define Types**:
```typescript
// types/organization.ts
export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  description: string;
}
```

2. **Create Repository Interface**:
```typescript
// repositories/interfaces/OrganizationRepository.ts
export interface OrganizationRepository {
  create(data: CreateOrganizationData): Promise<Organization>;
  findBySlug(slug: string): Promise<Organization | null>;
}
```

3. **Implement Repository**:
```typescript
// repositories/DrizzleOrganizationRepository.ts
export class DrizzleOrganizationRepository implements OrganizationRepository {
  async create(data: CreateOrganizationData): Promise<Organization> {
    // Implementation
  }
}
```

4. **Create Service**:
```typescript
// services/OrganizationService.ts
export class OrganizationService {
  constructor(
    private orgRepo: OrganizationRepository,
    private authService: AuthorizationService,
  ) {}
}
```

5. **Create Router**:
```typescript
// routers/organizations-new.ts
export const organizationsRouterNew = {
  createOrganization: protectedProcedure
    .input(createOrganizationSchema)
    .handler(async ({ input, context }) => {
      const authContext = await authService.validateAuthContext(context.session);
      return await organizationService.createOrganization(input, authContext);
    }),
};
```

This architecture provides a solid foundation for scaling your application while maintaining code quality and developer experience.