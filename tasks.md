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
- [ ] Create ConfigModule
- [ ] Create ConfigController
- [ ] Create ConfigService
- [ ] StoreConfig entity and operations

### Task 9.2: Admin Configuration APIs
- [ ] PUT /admin/config - Update store configuration
- [ ] Get/set discountNValue
- [ ] Get/set discountPercentage

---

## Phase 10: Analytics Module

### Task 10.1: Analytics Module Setup
- [ ] Create AnalyticsModule
- [ ] Create AnalyticsController
- [ ] Create AnalyticsService

### Task 10.2: Analytics Calculations
- [ ] Calculate total revenue
- [ ] Calculate items sold
- [ ] Calculate order counts
- [ ] Calculate discount codes generated
- [ ] Calculate total discounts given
- [ ] Per-seller breakdowns
- [ ] Date range filtering

### Task 10.3: Seller Analytics API
- [ ] GET /seller/analytics - View seller metrics

### Task 10.4: Admin Analytics API
- [ ] GET /admin/analytics - Store-wide metrics

---

## Phase 11: Business Logic Implementation

### Task 11.1: Checkout Logic
- [ ] Validate cart not empty
- [ ] Validate stock availability
- [ ] Validate discount code (if provided)
- [ ] Calculate subtotal
- [ ] Calculate discount amount
- [ ] Calculate total
- [ ] Deduct stock
- [ ] Create order and order items
- [ ] Mark discount as used
- [ ] Clear cart

### Task 11.2: Auto Discount Generation Logic
- [ ] Trigger on order status = "completed"
- [ ] Count customer's completed orders
- [ ] Check if count % n === 0
- [ ] Generate discount code
- [ ] Set customerId to the qualifying customer
- [ ] Set generatedBySellerId to the seller who completed the order
- [ ] Set expiration date (provided by seller)

### Task 11.3: Order Status Management
- [ ] Status transition validation
- [ ] Only sellers can update status
- [ ] Validation that seller owns products in order

---

## Phase 12: API Documentation (Swagger)

### Task 12.1: Controller Documentation
- [ ] Add @ApiTags() to all controllers
- [ ] Add @ApiOperation() to all endpoints
- [ ] Add @ApiResponse() for success/error cases

### Task 12.2: DTO Documentation
- [ ] Add @ApiProperty() to all DTO properties
- [ ] Add validation examples
- [ ] Add enums documentation

### Task 12.3: Authentication Documentation
- [ ] Configure Swagger Bearer auth
- [ ] Document JWT header requirement
- [ ] Add security decorators to protected routes

---

## Phase 13: Testing & Verification

### Task 13.1: Authentication Testing
- [ ] Test login for all 5 users
- [ ] Test JWT validation
- [ ] Test role-based access control

### Task 13.2: Customer Flow Testing
- [ ] Test view products
- [ ] Test add to cart
- [ ] Test checkout without discount
- [ ] Test checkout with valid discount
- [ ] Test checkout with invalid discount (expired, used, wrong owner)
- [ ] Test view orders
- [ ] Test view discount codes

### Task 13.3: Seller Flow Testing
- [ ] Test CRUD products
- [ ] Test view orders for seller's products
- [ ] Test update order status
- [ ] Test auto-generate discount on nth order
- [ ] Test manual discount generation
- [ ] Test seller analytics

### Task 13.4: Admin Flow Testing
- [ ] Test configure store settings
- [ ] Test view store analytics
- [ ] Test view all discount codes
- [ ] Test view all orders

### Task 13.5: Edge Cases
- [ ] Test insufficient stock
- [ ] Test empty cart checkout
- [ ] Test expired discount code
- [ ] Test already used discount code
- [ ] Test unauthorized access (cross-role)

---

## Phase 14: Final Polish

### Task 14.1: Code Quality
- [ ] Ensure all endpoints follow REST conventions
- [ ] Consistent error handling
- [ ] Consistent response format
- [ ] Remove console logs
- [ ] Add appropriate comments

### Task 14.2: Documentation
- [ ] README.md with setup instructions
- [ ] API endpoint documentation
- [ ] Sample requests/responses
- [ ] Static user credentials reference

### Task 14.3: Final Testing
- [ ] End-to-end customer flow
- [ ] End-to-end seller flow
- [ ] End-to-end admin flow
- [ ] Verify discount system works correctly

---

## Phase 15: Unit Testing (Jest)

### Task 15.1: Jest Setup
- [ ] Verify Jest is installed (included with NestJS)
- [ ] Configure Jest for unit tests (exclude e2e)
- [ ] Create test utilities and mocks

### Task 15.2: Auth Service Unit Tests
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test JWT token generation

### Task 15.3: Users Service Unit Tests
- [ ] Test getUserById (happy path)
- [ ] Test validateCredentials (happy path)

### Task 15.4: Products Service Unit Tests
- [ ] Test createProduct (happy path)
- [ ] Test getAllProducts (happy path)
- [ ] Test updateProduct (happy path)

### Task 15.5: Cart Service Unit Tests
- [ ] Test addToCart (happy path)
- [ ] Test getCart (happy path)
- [ ] Test removeFromCart (happy path)

### Task 15.6: Orders Service Unit Tests
- [ ] Test checkout without discount (happy path)
- [ ] Test checkout with valid discount (happy path)
- [ ] Test updateOrderStatus (happy path)

### Task 15.7: Discounts Service Unit Tests
- [ ] Test generateDiscountCode (happy path)
- [ ] Test validateDiscountCode (happy path)
- [ ] Test auto-generate discount on nth order (happy path)

### Task 15.8: Analytics Service Unit Tests
- [ ] Test calculateSellerAnalytics (happy path)
- [ ] Test calculateStoreAnalytics (happy path)

### Task 15.9: Store Service Unit Tests
- [ ] Test in-memory data operations
- [ ] Test ID generation

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
