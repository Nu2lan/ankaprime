# ANKAPRIME — Luxury Furniture E-commerce

A full-stack luxury furniture e-commerce application with a **black & gold** premium theme, featuring a **customer-facing store**, **admin panel**, and **Node.js API**.

## Tech Stack

| Layer     | Technology                                                              |
|-----------|-------------------------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Redux Toolkit, React Hook Form, Zod       |
| Admin     | React 18, Vite, Tailwind CSS                                            |
| Backend   | Node.js, Express, Mongoose, JWT (access + refresh)                      |
| Database  | MongoDB Atlas                                                           |

## Project Structure

```
furniture/
├── backend/         # Express API server
│   ├── config/      # Database connection
│   ├── middleware/   # Auth, validation, rate limiting, error handler
│   ├── models/      # Mongoose schemas (User, Product, Category, Cart, Order, Coupon)
│   ├── routes/      # Public + admin API routes
│   ├── seed.js      # Database seeder
│   └── server.js    # Entry point
├── frontend/        # Customer-facing store (port 5173)
│   └── src/
│       ├── api/         # Axios instance with token refresh
│       ├── components/  # Navbar, Footer, ProductCard
│       ├── features/    # Redux slices (auth, cart, products)
│       ├── pages/       # All store pages
│       └── routes/      # Route guards
├── admin/           # Admin panel (port 5174)
│   └── src/
│       ├── pages/   # Dashboard, Products, Categories, Orders, Users, Coupons
│       └── api.js   # Admin API client
└── README.md
```

## Setup

### 1. Environment Variables

Copy the example env file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Required variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/luxe-furniture
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 2. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend Store
cd frontend && npm install

# Admin Panel
cd admin && npm install
```

### 3. Seed the Database

```bash
cd backend && npm run seed
```

This creates:
- **Admin:** `admin@ankaprime.az` / `Admin123!`
- 6 categories and 12 demo products

### 4. Run the App

Open three terminals:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend Store
cd frontend && npm run dev

# Terminal 3 — Admin Panel
cd admin && npm run dev
```

| Service  | URL                         |
|----------|-----------------------------|
| API      | http://localhost:5000       |
| Store    | http://localhost:5173       |
| Admin    | http://localhost:5174       |

## API Endpoints

### Auth
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| POST   | `/api/auth/register`   | Register new user     |
| POST   | `/api/auth/login`      | Login                 |
| POST   | `/api/auth/refresh`    | Refresh access token  |
| POST   | `/api/auth/logout`     | Logout                |
| GET    | `/api/auth/me`         | Get current user      |

### Products & Categories (Public)
| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/api/products`         | List products (filter/sort/search) |
| GET    | `/api/products/:slug`   | Product details                    |
| GET    | `/api/categories`       | List categories                    |

### Cart (Protected)
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | `/api/cart`                   | Get cart             |
| POST   | `/api/cart/items`             | Add item             |
| PATCH  | `/api/cart/items/:productId`  | Update quantity      |
| DELETE | `/api/cart/items/:productId`  | Remove item          |
| DELETE | `/api/cart`                   | Clear cart           |

### Orders (Protected)
| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| POST   | `/api/orders`     | Create order         |
| GET    | `/api/orders/my`  | My orders            |
| GET    | `/api/orders/:id` | Order details        |

### Admin (Admin Only)
| Method | Endpoint                          | Description             |
|--------|-----------------------------------|-------------------------|
| GET    | `/api/admin/dashboard`            | Dashboard KPIs          |
| CRUD   | `/api/admin/products`             | Manage products         |
| CRUD   | `/api/admin/categories`           | Manage categories       |
| GET    | `/api/admin/orders`               | List orders             |
| PATCH  | `/api/admin/orders/:id/status`    | Update order status     |
| GET    | `/api/admin/users`                | List users              |
| PATCH  | `/api/admin/users/:id/role`       | Change user role        |
| CRUD   | `/api/admin/coupons`              | Manage coupons          |

## Features

- 🔐 JWT auth with HttpOnly refresh token cookies
- 🛡️ Role-based route protection (user/admin)
- 🛒 Cart with price snapshots
- 📦 Order creation from cart with status tracking
- 💳 Simulated payment flow
- 📊 Admin dashboard with KPI cards and sales chart
- 🎨 Premium black & gold UI theme
- 📱 Fully responsive design
