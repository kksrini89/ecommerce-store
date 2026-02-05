# E-Commerce Backend Implementation Tasks

## Overview
This document lists all tasks required to complete the NestJS-based e-commerce backend implementation.

---

## Phase 1: Project Setup & Configuration

### Task 1.1: NestJS Project Initialization
- [x] Install NestJS CLI globally
- [x] Generate new NestJS project using `nest new`
- [x] Configure TypeScript settings (tsconfig.json)
- [x] Set up project folder structure following NestJS conventions

### Task 1.2: Dependency Installation
- [x] Install core NestJS packages (@nestjs/common, @nestjs/core, @nestjs/platform-express)
- [x] Install Swagger dependencies (@nestjs/swagger, swagger-ui-express)
- [x] Install JWT dependencies (@nestjs/jwt, @nestjs/passport, passport-jwt)
- [x] Install validation dependencies (class-validator, class-transformer)
- [x] Install Jest testing dependencies (@nestjs/testing, jest, @types/jest, ts-jest)
- [x] Install development dependencies (@types/node, ts-node, nodemon)

### Task 1.3: Application Configuration
- [x] Configure main.ts (bootstrap, Swagger setup, global pipes)
- [x] Set up environment configuration
- [x] Configure Swagger documentation (title, description, version, Bearer auth)
- [x] Set up global validation pipe

---

## Phase 2: Core Infrastructure

### Task 2.1: In-Memory Store Setup
- [x] Create StoreModule
- [x] Define TypeScript interfaces for all entities
- [x] Implement StoreService with Map-based storage
- [x] Seed 5 static users (2 customers, 2 sellers, 1 admin)
- [x] Initialize store configuration (n=3, percentage=10%)
- [x] Create ID generation utilities

### Task 2.2: Entity Interfaces
- [x] User interface (id, name, email, role, password)
- [x] Product interface (id, sellerId, name, description, price, stock, createdAt)
- [x] CartItem interface (id, userId, productId, quantity)
- [x] Order interface (id, userId, subtotal, discount, total, status, discountCodeId, timestamps)
- [x] OrderItem interface (id, orderId, productId, quantity, unitPrice, totalPrice)
- [x] DiscountCode interface (id, code, percentage, customerId, generatedBySellerId, isUsed, usedOnOrderId, timestamps)
- [x] StoreConfig interface (discountNValue, discountPercentage)

---

## Phase 3: Authentication & Authorization

### Task 3.1: Auth Module
- [x] Create AuthModule
- [x] Create AuthController
- [x] Create AuthService
- [x] Implement login endpoint (POST /auth/login)
- [x] JWT token generation with userId and role claims
- [x] Validate credentials against static users

### Task 3.2: JWT Infrastructure
- [x] Configure JWT module with secret key
- [x] Set token expiration (e.g., 24 hours)
- [x] Create JWT validation logic (JwtAuthGuard)

### Task 3.3: Guards & Decorators
- [x] Create JwtAuthGuard (verifies JWT token)
- [x] Create RolesGuard (checks user roles)
- [x] Create @Roles() decorator
- [x] Create @CurrentUser() decorator
- [x] Create role-based decorators (@IsCustomer(), @IsSeller(), @IsAdmin())

---

## Phase 4: Users Module

### Task 4.1: Users Module Setup
- [x] Create UsersModule
- [x] Create UsersService
- [x] Create UsersController (if needed)
- [x] Implement getUserById()
- [x] Implement getAllUsers() (admin only)
- [x] Implement validateCredentials()

---

## Phase 5: Products Module

### Task 5.1: Products Module Setup
- [x] Create ProductsModule
- [x] Create ProductsController
- [x] Create ProductsService
- [x] Implement getAllProducts() (customer API)
- [x] Implement getProductById()
- [x] DTOs: CreateProductDto, UpdateProductDto

### Task 5.2: Seller Product Management
- [x] POST /seller/products (create product)
- [x] PUT /seller/products/:id (update product)
- [x] DELETE /seller/products/:id (delete product)
- [x] GET /seller/products (view my products)
- [x] Stock validation logic

---

## Phase 6: Cart Module

### Task 6.1: Cart Module Setup
- [x] Create CartModule
- [x] Create CartController
- [x] Create CartService
- [x] DTOs: AddToCartDto

### Task 6.2: Cart Operations
- [x] POST /cart/add - Add item to cart
- [x] GET /cart - View cart with product details and totals
- [x] DELETE /cart/:productId - Remove item from cart
- [x] Cart validation (stock check)
- [x] Calculate cart totals (subtotal)

---

## Phase 7: Orders Module

### Task 7.1: Orders Module Setup
- [x] Create OrdersModule
- [x] Create OrdersController
- [x] Create OrdersService
- [x] DTOs: CheckoutDto, UpdateOrderStatusDto

### Task 7.2: Customer Order APIs
- [x] POST /orders/checkout - Checkout cart
- [x] GET /orders - View my orders
- [x] Checkout validation (cart not empty, stock available)
- [x] Calculate order totals with discount logic
- [x] Create Order and OrderItems
- [x] Deduct stock from products
- [x] Clear cart after checkout

### Task 7.3: Seller Order APIs
- [x] GET /seller/orders - View orders containing seller's products
- [x] PUT /seller/orders/:id/status - Update order status
- [x] Validate seller owns products in order
- [x] Status transitions validation

### Task 7.4: Admin Order APIs
- [x] GET /admin/orders - List all orders

---

## Phase 8: Discounts Module

### Task 8.1: Discounts Module Setup
- [x] Create DiscountsModule
- [x] Create DiscountsController
- [x] Create DiscountsService
- [x] DTOs: GenerateDiscountDto, ApplyDiscountDto

### Task 8.2: Discount Code Validation
- [x] validateDiscountCode() function
- [x] Check code exists
- [x] Check customer ownership
- [x] Check not expired
- [x] Check not already used
- [x] Calculate discount amount

### Task 8.3: Customer Discount APIs
- [x] GET /discounts - View my available discount codes
- [x] Apply discount at checkout

### Task 8.4: Seller Discount APIs
- [x] POST /seller/discounts/generate - Manual generation
- [x] GET /seller/discounts - View generated codes
- [x] Auto-generate on nth completed order (in OrderService)
- [x] Code generation utility (format: SAVE10-{timestamp})
- [x] Set expiration date

### Task 8.5: Admin Discount APIs
- [x] GET /admin/discounts - List all discount codes

---

## Phase 9: Config Module

### Task 9.1: Config Module Setup
- [x] Create ConfigModule
- [x] Create ConfigController
- [x] Create ConfigService
- [x] StoreConfig entity and operations

### Task 9.2: Admin Configuration APIs
- [x] PUT /admin/config - Update store configuration
- [x] Get/set discountNValue
- [x] Get/set discountPercentage

---

## Phase 10: Analytics Module

### Task 10.1: Analytics Module Setup
- [x] Create AnalyticsModule
- [x] Create AnalyticsController
- [x] Create AnalyticsService

### Task 10.2: Analytics Calculations
- [x] Calculate total revenue
- [x] Calculate items sold
- [x] Calculate order counts
- [x] Calculate discount codes generated
- [x] Calculate total discounts given
- [x] Per-seller breakdowns
- [x] Date range filtering

### Task 10.3: Seller Analytics API
- [x] GET /seller/analytics - View seller metrics

### Task 10.4: Admin Analytics API
- [x] GET /admin/analytics - Store-wide metrics

---

## Phase 11: Business Logic Implementation

### Task 11.1: Checkout Logic
- [x] Validate cart not empty
- [x] Validate stock availability
- [x] Validate discount code (if provided)
- [x] Calculate subtotal
- [x] Calculate discount amount
- [x] Calculate total
- [x] Deduct stock
- [x] Create order and order items
- [x] Mark discount as used
- [x] Clear cart

### Task 11.2: Auto Discount Generation Logic
- [x] Trigger on order status = "completed"
- [x] Count customer's completed orders
- [x] Check if count % n === 0
- [x] Generate discount code
- [x] Set customerId to the qualifying customer
- [x] Set generatedBySellerId to the seller who completed the order
- [x] Set expiration date (30 days default)

### Task 11.3: Order Status Management
- [x] Status transition validation
- [x] Only sellers can update status
- [x] Validation that seller owns products in order

---

## Phase 12: API Documentation (Swagger)

### Task 12.1: Controller Documentation
- [x] Add @ApiTags() to all controllers
- [x] Add @ApiOperation() to all endpoints
- [x] Add @ApiResponse() for success/error cases

### Task 12.2: DTO Documentation
- [x] Add @ApiProperty() to all DTO properties
- [x] Add validation examples
- [x] Add enums documentation

### Task 12.3: Authentication Documentation
- [x] Configure Swagger Bearer auth
- [x] Document JWT header requirement
- [x] Add security decorators to protected routes

---

## Phase 13: Testing & Verification

### Task 13.1: Authentication Testing
- [x] Test login for all 5 users
- [x] Test JWT validation
- [x] Test role-based access control

### Task 13.2: Customer Flow Testing
- [x] Test view products
- [x] Test add to cart
- [x] Test checkout without discount
- [x] Test checkout with valid discount
- [x] Test checkout with invalid discount (expired, used, wrong owner)
- [x] Test view orders
- [x] Test view discount codes

### Task 13.3: Seller Flow Testing
- [x] Test CRUD products
- [x] Test view orders for seller's products
- [x] Test update order status
- [x] Test auto-generate discount on nth order
- [x] Test manual discount generation
- [x] Test seller analytics

### Task 13.4: Admin Flow Testing
- [x] Test configure store settings
- [x] Test view store analytics
- [x] Test view all discount codes
- [x] Test view all orders

### Task 13.5: Edge Cases
- [x] Test insufficient stock
- [x] Test empty cart checkout
- [x] Test expired discount code
- [x] Test already used discount code
- [x] Test unauthorized access (cross-role)

---

## Phase 14: Final Polish

### Task 14.1: Code Quality
- [x] Ensure all endpoints follow REST conventions
- [x] Consistent error handling
- [x] Consistent response format
- [x] Remove console logs
- [x] Add appropriate comments

### Task 14.2: Documentation
- [x] README.md with setup instructions
- [x] API endpoint documentation
- [x] Sample requests/responses
- [x] Static user credentials reference

### Task 14.3: Final Testing
- [x] End-to-end customer flow
- [x] End-to-end seller flow
- [x] End-to-end admin flow
- [x] Verify discount system works correctly

---

## Phase 15: Unit Testing (Jest)

### Task 15.1: Jest Setup
- [x] Verify Jest is installed (included with NestJS)
- [x] Configure Jest for unit tests (exclude e2e)
- [x] Create test utilities and mocks

### Task 15.2: Auth Service Unit Tests
- [x] Test login with valid credentials
- [x] Test login with invalid credentials
- [x] Test JWT token generation

### Task 15.3: Users Service Unit Tests
- [x] Test getUserById (happy path)
- [x] Test validateCredentials (happy path)

### Task 15.4: Products Service Unit Tests
- [x] Test createProduct (happy path)
- [x] Test getAllProducts (happy path)
- [x] Test updateProduct (happy path)

### Task 15.5: Cart Service Unit Tests
- [x] Test addToCart (happy path)
- [x] Test getCart (happy path)
- [x] Test removeFromCart (happy path)

### Task 15.6: Orders Service Unit Tests
- [x] Test checkout without discount (happy path)
- [x] Test checkout with valid discount (happy path)
- [x] Test updateOrderStatus (happy path)

### Task 15.7: Discounts Service Unit Tests
- [x] Test generateDiscountCode (happy path)
- [x] Test validateDiscountCode (happy path)
- [x] Test auto-generate discount on nth order (happy path)

### Task 15.8: Analytics Service Unit Tests
- [x] Test calculateSellerAnalytics (happy path)
- [x] Test calculateStoreAnalytics (happy path)

### Task 15.9: Store Service Unit Tests
- [x] Test in-memory data operations
- [x] Test ID generation

---

## Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1 | 3 tasks | Project Setup & Configuration |
| Phase 2 | 2 tasks | Core Infrastructure |
| Phase 3 | 3 tasks | Authentication & Authorization |
| Phase 4 | 1 task | Users Module |
| Phase 5 | 2 tasks | Products Module |
| Phase 6 | 2 tasks | Cart Module |
| Phase 7 | 4 tasks | Orders Module |
| Phase 8 | 5 tasks | Discounts Module |
| Phase 9 | 2 tasks | Config Module |
| Phase 10 | 4 tasks | Analytics Module |
| Phase 11 | 3 tasks | Business Logic Implementation |
| Phase 12 | 3 tasks | API Documentation (Swagger) |
| Phase 13 | 5 tasks | Testing & Verification |
| Phase 14 | 3 tasks | Final Polish |
| Phase 15 | 9 tasks | Unit Testing (Jest) |
| **Total** | **51 tasks** | |

---

## Priority Order

1. **Phase 1-2**: Setup and infrastructure
2. **Phase 3**: Authentication (required for all other routes)
3. **Phase 4-6**: Core modules (users, products, cart)
4. **Phase 7-8**: Critical features (orders, discounts)
5. **Phase 9-10**: Config and analytics
6. **Phase 11**: Business logic refinement
7. **Phase 12**: Documentation
8. **Phase 13-14**: Testing and polish
