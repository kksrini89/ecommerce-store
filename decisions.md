# Technical Decisions Log

This document tracks all technical decisions made during the implementation of the E-Commerce Backend API.

---

## Date: 2026-02-03

### Decision 1: Framework Selection
**Decision:** Use NestJS v10+ instead of Express

**Rationale:**
- NestJS provides better structure with modules, controllers, and services
- Built-in support for TypeScript
- Native integration with Swagger for API documentation
- Built-in JWT and Passport.js support
- Better maintainability for larger applications

**Impact:**
- Project will use NestJS CLI for scaffolding
- Follows NestJS conventions (modules, dependency injection)
- Requires learning NestJS-specific decorators and patterns

**Status:** ✅ Confirmed

---

### Decision 2: In-Memory Storage
**Decision:** Use JavaScript Maps for in-memory storage instead of a database

**Rationale:**
- Assignment explicitly requires in-memory storage
- Maps provide O(1) lookup by ID
- No external dependencies or setup required
- Sufficient for the scope of this assignment

**Implementation Details:**
- Single StoreService managing all Maps
- StoreModule for dependency injection
- Static 5 users seeded on application startup

**Status:** ✅ Confirmed

---

### Decision 3: JWT Authentication Strategy
**Decision:** Use @nestjs/jwt with Passport.js

**Rationale:**
- Industry standard for stateless authentication
- NestJS has excellent built-in support
- Token contains userId and role for authorization

**Implementation Details:**
- Secret key stored in environment variable
- Token expiration: 24 hours
- Bearer token format: `Authorization: Bearer <token>`
- JWT payload: `{ userId: string, role: string }`

**Status:** ✅ Confirmed

---

### Decision 4: Role-Based Access Control
**Decision:** Use Guards and Decorators for RBAC

**Implementation Details:**
- JwtAuthGuard: Validates JWT token
- RolesGuard: Checks user role permissions
- @Roles() decorator to specify required roles on endpoints
- @CurrentUser() decorator to inject user from request

**Role Hierarchy:**
- Customer: Can browse products, manage cart, place orders
- Seller: Can manage products, update order status, generate discounts
- Admin: Can configure settings, view all analytics

**Status:** ✅ Confirmed

---

### Decision 5: Static Users
**Decision:** 5 pre-created users with no registration endpoint

**Users:**
| User ID | Role | Password |
|---------|------|----------|
| customer1 | customer | password123 |
| customer2 | customer | password123 |
| seller1 | seller | password123 |
| seller2 | seller | password123 |
| admin1 | admin | password123 |

**Rationale:**
- Requirement from client
- Simplifies authentication flow
- No need for user management APIs

**Status:** ✅ Confirmed

---

### Decision 6: Discount Code Logic
**Decision:** User-specific, single-use discount codes with seller generation

**Rules:**
1. Every nth (default: 3) completed order auto-generates discount code
2. Only the customer who earned it can use the code
3. Code expires immediately after use on any order (any status)
4. Seller sets expiration date when generating
5. Seller who marks order "completed" generates the code
6. Discount percentage: 10% (configurable by admin)

**Implementation:**
- DiscountCode entity: code, customerId, generatedBySellerId, isUsed, usedOnOrderId, expiresAt
- Validation: Check ownership, expiry, and usage status
- Auto-generation triggered in OrderService when status changes to "completed"

**Status:** ✅ Confirmed

---

### Decision 7: Seller-Controlled Discount Generation (NEW)
**Decision:** Only sellers can generate discount codes, not admins

**Rationale:**
- Gives sellers complete control over their business and promotional strategies
- Sellers own their products and customer relationships
- Platform (admin) provides infrastructure but doesn't control seller pricing/promotions
- Enables seller autonomy in managing customer retention and loyalty programs
- Aligns with marketplace model where sellers operate independently

**Implementation Details:**
- `POST /seller/discounts/generate` - Seller manually generates discount codes
- Auto-generation triggered when seller marks order as "completed"
- `generatedBySellerId` field tracks which seller created the code
- Admin can VIEW all discount codes but cannot CREATE them
- Admin configures global settings (n value, percentage) but execution is seller-driven

**Business Impact:**
- Seller has flexibility to set expiration dates
- Seller decides when to reward loyal customers
- Platform remains neutral and doesn't interfere with seller business decisions

**Status:** ✅ Confirmed

---

### Decision 8: Seller Autonomy in Order Management (NEW)
**Decision:** Sellers have exclusive control over order status updates

**Rationale:**
- Sellers manage their own fulfillment process
- Platform admin does not interfere with order processing
- Sellers have direct visibility into their product orders
- Reduces platform liability by keeping order management seller-centric

**Implementation Details:**
- Only `PUT /seller/orders/:id/status` endpoint can update order status
- Admin cannot change order status (read-only access via `GET /admin/orders`)
- Validation ensures seller can only update orders containing their products
- Status transitions: pending → confirmed → shipped → delivered → completed

**Business Impact:**
- Clear ownership of order fulfillment
- Sellers manage customer communication around shipping
- Platform provides infrastructure, sellers execute operations

**Status:** ✅ Confirmed

---

### Decision 10: Order Status Flow
**Decision:** Strict status flow with seller-only updates

**Statuses:**
- pending (initial)
- confirmed
- shipped
- delivered
- completed (triggers discount generation)
- cancelled

**Rules:**
- Only sellers can update status (not admin)
- Seller must own products in the order to update
- Auto-generate discount only when transitioning to "completed"

**Status:** ✅ Confirmed

---

### Decision 11: Swagger/OpenAPI Documentation
**Decision:** Use @nestjs/swagger for auto-generated API docs

**Implementation:**
- Swagger UI available at `/api-docs`
- Bearer authentication configured
- All DTOs documented with @ApiProperty()
- All endpoints documented with @ApiOperation() and @ApiResponse()
- Enums documented with examples

**Status:** ✅ Confirmed

---

### Decision 12: Project Structure
**Decision:** Follow NestJS modular architecture

```
src/
├── auth/              # Login, JWT
├── users/             # Static user management
├── products/          # Product CRUD
├── cart/              # Shopping cart
├── orders/            # Order management
├── discounts/         # Discount codes
├── analytics/         # Reporting
├── config/            # Store settings
├── common/            # Guards, decorators, utils
├── store/             # In-memory data store
└── main.ts            # Bootstrap
```

**Rationale:**
- Clear separation of concerns
- Each module is self-contained
- Easy to test and maintain
- Follows NestJS best practices

**Status:** ✅ Confirmed

---

### Decision 13: Validation Strategy
**Decision:** Use class-validator with ValidationPipe

**Implementation:**
- DTOs defined with class-validator decorators
- Global ValidationPipe configured in main.ts
- Automatic validation of request bodies
- Transform plain objects to class instances

**Status:** ✅ Confirmed

---

## Pending Decisions

These decisions will be made during implementation as needed:

### TBD 1: Discount Code Format
**Options:**
1. `DISCOUNT-{customerId}-{timestamp}` (e.g., DISCOUNT-customer1-1706947200)
2. `SAVE{percentage}-{random}` (e.g., SAVE10-ABC123)
3. `{sellerId}-{customerId}-{sequence}` (e.g., seller1-customer1-001)

**Considerations:**
- Uniqueness
- Readability
- Traceability

---

### TBD 2: Cart Storage Strategy
**Options:**
1. Store cart items in-memory Map (userId -> CartItem[])
2. Store cart items in Order document (temporary state)

**Considerations:**
- Simplicity vs. data consistency
- Cart persistence on server restart

---

### TBD 3: ID Generation
**Options:**
1. Auto-incrementing numbers (1, 2, 3...)
2. UUID v4
3. Timestamp-based with random suffix

**Considerations:**
- Uniqueness
- Readability
- Performance

---

### TBD 4: Error Response Format
**Options:**
1. NestJS default exception format
2. Custom consistent format: `{ success: false, message: string, errors?: string[] }`
3. RFC 7807 Problem Details

**Considerations:**
- Consistency across all endpoints
- Client-side handling
- Swagger documentation

---

### TBD 5: Date Handling
**Options:**
1. Native JavaScript Date
2. date-fns library
3. Day.js library

**Considerations:**
- Timezone handling
- Date arithmetic (expiration checks)
- Library size

---

### Decision 14: Unit Testing with Jest (NEW)
**Decision:** Use Jest for unit testing with happy path focus only

**Rationale:**
- Jest is the default testing framework for NestJS
- Comes pre-configured with NestJS CLI
- Fast execution with in-memory storage
- Happy path testing ensures core functionality works

**Implementation Details:**
- Unit tests for all services (happy path only)
- No e2e tests required
- Tests located alongside source files (*.spec.ts)
- Mock external dependencies

**Services to Test:**
- AuthService: login, JWT generation
- UsersService: getUserById, validateCredentials
- ProductsService: CRUD operations
- CartService: add, get, remove
- OrdersService: checkout, status updates
- DiscountsService: code generation, validation
- AnalyticsService: metrics calculation
- StoreService: data operations

**Status:** ✅ Confirmed

---

## Decision History Log

| Date | Decision | Status | Notes |
|------|----------|--------|-------|
| 2026-02-03 | Use NestJS framework | ✅ Confirmed | v10+ with TypeScript |
| 2026-02-03 | In-memory Maps storage | ✅ Confirmed | No database |
| 2026-02-03 | JWT authentication | ✅ Confirmed | Bearer token |
| 2026-02-03 | Static 5 users | ✅ Confirmed | No registration |
| 2026-02-03 | User-specific discounts | ✅ Confirmed | Single-use |
| 2026-02-03 | **Seller-controlled discount generation** | ✅ Confirmed | Not admin |
| 2026-02-03 | **Seller autonomy in order management** | ✅ Confirmed | Platform doesn't interfere |
| 2026-02-03 | Order status flow | ✅ Confirmed | Strict transitions |
| 2026-02-03 | Swagger documentation | ✅ Confirmed | At /api-docs |
| 2026-02-03 | Modular architecture | ✅ Confirmed | NestJS modules |
| 2026-02-03 | class-validator | ✅ Confirmed | DTO validation |
| 2026-02-03 | **Jest unit testing** | ✅ Confirmed | Happy path only |

---

## Notes for Future Reference

- Keep all decisions documented here
- Update status when decisions change
- Link to relevant code when implementing
- Document trade-offs considered
