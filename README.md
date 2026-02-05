# E-Commerce Backend API

A comprehensive NestJS-based e-commerce backend API with cart, checkout, discount system, and role-based access control.

## Features

- **Authentication**: JWT-based authentication with 5 pre-configured static users
- **Role-Based Access Control**: Customer, Seller, and Admin roles
- **Product Management**: Sellers can create, update, and delete products
- **Shopping Cart**: Customers can add/remove items from cart
- **Checkout System**: Complete order creation with discount code support
- **Discount System**: Auto-generated discount codes on nth order completion
- **Order Management**: Sellers can update order status
- **Analytics**: Store-wide and seller-specific analytics
- **Configuration**: Configurable discount settings

## Tech Stack

- **Framework**: NestJS v10+
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Storage**: In-memory data store (no database required)

## Quick Start

### Installation

```bash
$ npm install
```

### Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod

# Build
$ npm run build
```

The API will be available at `http://localhost:3000`

### API Documentation

Once the server is running, access Swagger UI at:

```
http://localhost:3000/docs
```

## Static User Credentials

The system comes with 5 pre-configured users for testing:

| User ID   | Password     | Role     | Description          |
|-----------|--------------|----------|----------------------|
| customer1 | password123  | customer | Regular customer     |
| customer2 | password123  | customer | Regular customer     |
| seller1   | password123  | seller   | Product seller       |
| seller2   | password123  | seller   | Product seller       |
| admin1    | password123  | admin    | System administrator |

## API Endpoints

### Authentication
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/auth/login` | POST | Public | Login with credentials |

### Products
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/products` | GET | Public | List all products |
| `/products/:id` | GET | Public | Get product by ID |
| `/products/seller/products` | POST | Seller | Create product |
| `/products/seller/products/:id` | PUT | Seller | Update product |
| `/products/seller/products/:id` | DELETE | Seller | Delete product |
| `/products/seller/my-products` | GET | Seller | List seller's products |

### Cart
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/cart` | GET | Customer | View cart |
| `/cart/add` | POST | Customer | Add item to cart |
| `/cart/:productId` | DELETE | Customer | Remove item from cart |

### Orders
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/orders` | GET | Customer | View my orders |
| `/orders/checkout` | POST | Customer | Checkout cart |
| `/orders/seller/orders` | GET | Seller | View seller's orders |
| `/orders/seller/orders/:id/status` | PUT | Seller | Update order status |
| `/orders/admin/orders` | GET | Admin | View all orders |

### Discounts
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/discounts` | GET | Customer | View my discount codes |
| `/discounts/seller/discounts` | GET | Seller | View generated codes |
| `/discounts/seller/discounts/generate` | POST | Seller | Generate discount code |
| `/discounts/admin/discounts` | GET | Admin | View all discount codes |

### Analytics
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/analytics/seller/analytics` | GET | Seller | Seller analytics |
| `/analytics/admin/analytics` | GET | Admin | Store-wide analytics |

### Configuration
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/config` | GET | Public | Get store config |
| `/config/admin/config` | PUT | Admin | Update store config |

### Users
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/users` | GET | Admin | List all users |
| `/users/:id` | GET | Any (own) | Get user by ID |

## Sample Requests

### 1. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"customer1","password":"password123"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "customer1",
    "name": "Customer One",
    "email": "customer1@store.com",
    "role": "customer"
  }
}
```

### 2. Create Product (Seller)

```bash
curl -X POST http://localhost:3000/products/seller/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SELLER_TOKEN>" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 999.99,
    "stockQuantity": 10
  }'
```

### 3. Add to Cart (Customer)

```bash
curl -X POST http://localhost:3000/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "productId": "prod-xxx",
    "quantity": 2
  }'
```

### 4. Checkout (Customer)

```bash
curl -X POST http://localhost:3000/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "discountCode": "SAVE10-xxx"
  }'
```

### 5. Update Order Status (Seller)

```bash
curl -X PUT http://localhost:3000/orders/seller/orders/order-xxx/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SELLER_TOKEN>" \
  -d '{
    "status": "completed"
  }'
```

### 6. View Store Analytics (Admin)

```bash
curl http://localhost:3000/analytics/admin/analytics \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## Discount System

The discount system automatically generates discount codes when:

1. An order status is updated to "completed"
2. The customer has completed exactly n orders (default: every 3rd order)
3. A discount code is generated with format: `SAVE{percentage}-{timestamp}`

Default configuration:
- Discount N Value: 3 (every 3rd order gets a discount)
- Discount Percentage: 10%

These can be configured by admin via the config API.

## Order Status Flow

```
pending → confirmed → shipped → delivered → completed
   ↓          ↓          ↓
cancelled  cancelled  cancelled
```

Only sellers can update order status, and only for orders containing their products.

## Project Structure

```
ecommerce-backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # Users module
│   ├── products/       # Products module
│   ├── cart/           # Shopping cart module
│   ├── orders/         # Orders module
│   ├── discounts/      # Discount codes module
│   ├── config/         # Store configuration module
│   ├── analytics/      # Analytics module
│   ├── store/          # In-memory data store
│   └── common/         # Shared decorators and guards
├── test/               # Test files
└── docs/               # Documentation
```

## Testing

```bash
# Run unit tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Run test coverage
$ npm run test:cov
```

## Build

```bash
# Build the project
$ npm run build

# Start production server
$ npm run start:prod
```

## License

This project is [MIT licensed](LICENSE).
