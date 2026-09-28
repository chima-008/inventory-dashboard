# Inventory Management Dashboard — Frontend

A modern inventory management dashboard built with **Next.js, TypeScript, React, and Tailwind CSS**.

The application provides the frontend interface for a Laravel-based inventory management API and allows authenticated users to manage products, categories, stock movements, users, and inventory information through a responsive business dashboard.

## Live Application

**Production Frontend:** inventory-dashboard-sand-alpha.vercel.app

**Production API:** inventory-api-utcf.onrender.com

**Frontend Repository:** chima-008/inventory-dashboard

**Backend Repository:** chima-008/inventory-project

---

## Overview

The Inventory Management Dashboard is the frontend application of a full-stack inventory management system.

The application communicates with a separate Laravel REST API rather than connecting directly to the database.

The system provides:

* Dashboard overview
* Product management
* Category management
* Stock movement management
* Inventory statistics
* Low-stock monitoring
* Out-of-stock monitoring
* Inventory valuation
* User management
* Role management
* Authentication
* Business/profile management
* Responsive dashboard interface

---

## Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Next.js App Router

### Backend

* Laravel 12
* PHP 8.2+
* Laravel Sanctum
* PostgreSQL

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL on Render
* Source control: GitHub

---

## Application Architecture

```text
┌───────────────────────────────────┐
│          Next.js Frontend         │
│                                   │
│  Dashboard                        │
│  Products                         │
│  Categories                       │
│  Stock                            │
│  Users                            │
│  Authentication                   │
└─────────────────┬─────────────────┘
                  │
                  │ HTTPS / REST API
                  ▼
┌───────────────────────────────────┐
│           Laravel API             │
│                                   │
│  Authentication                   │
│  Products                         │
│  Categories                       │
│  Stock Movements                  │
│  Users / Roles                    │
│  Invitations                      │
│  Dashboard Summary                │
│  Business / Profile               │
└─────────────────┬─────────────────┘
                  │
                  │ Eloquent
                  ▼
┌───────────────────────────────────┐
│       PostgreSQL Database         │
│                                   │
│  Users                            │
│  Products                         │
│  Categories                       │
│  Stock Movements                  │
│  Sessions / Application Data      │
└───────────────────────────────────┘
```

---

# Features

## Dashboard

The dashboard provides a centralized overview of inventory activity.

It displays:

* Total products
* Total categories
* Total stock units
* Low-stock products
* Out-of-stock products
* Inventory value
* Stock health

The dashboard retrieves its data from the Laravel API.

---

## Product Management

Users can manage inventory products through the dashboard.

Supported functionality includes:

* View products
* Create products
* View product details
* Update products
* Delete products
* Assign categories
* Set product prices
* Set stock quantities
* Set low-stock thresholds
* Activate or deactivate products

---

## Category Management

The dashboard supports:

* Viewing categories
* Creating categories
* Viewing category information
* Updating categories
* Deleting categories
* Associating products with categories

---

## Stock Management

The stock section provides a way to record inventory changes.

Users can:

* View stock movements
* Select products
* Record stock changes
* Specify quantities
* Track stock movement history

Stock persistence and business rules are handled by the Laravel backend.

---

## User Management

Authorized users can:

* View users
* View assigned roles
* Update user roles

Role enforcement is performed by the backend.

---

## Authentication

The application integrates with the Laravel authentication API.

Authentication functionality includes:

* Registration
* Login
* Authenticated dashboard access
* Current-user retrieval
* Email verification
* Password recovery
* Google authentication
* Logout/session handling

---

# Environment Configuration

The frontend requires an API URL pointing to the Laravel backend.

### Local Development

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Production

The deployed frontend uses the production Laravel API:

```env
NEXT_PUBLIC_API_URL=https://inventory-api-utcf.onrender.com/api
```

The production value should be configured through the Vercel project's environment-variable settings rather than hard-coded into source code.

---

# Local Development

## Prerequisites

Install:

* Node.js
* npm
* Git
* A running Laravel API

Verify Node.js:

```bash
node -v
```

Verify npm:

```bash
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/chima-008/inventory-dashboard.git
```

Move into the project:

```bash
cd inventory-dashboard
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# Production Deployment

The frontend is deployed through Vercel.

Production architecture:

```text
Vercel
  │
  │ HTTPS
  ▼
Laravel API on Render
  │
  ▼
PostgreSQL on Render
```

The production API URL is configured through the frontend environment variables.

Production frontend:

```text
https://inventory-dashboard-sand-alpha.vercel.app
```

Production API:

```text
https://inventory-api-utcf.onrender.com/api
```

---

# API Integration

The frontend communicates with the Laravel backend through REST endpoints.

Major API resources include:

```text
Authentication
Products
Categories
Stock Movements
Users
Invitations
Dashboard Summary
Business Profile
User Profile
```

Example API operations include:

```text
GET    /api/products
POST   /api/products
PUT    /api/products/{product}
DELETE /api/products/{product}

GET    /api/categories
POST   /api/categories
PUT    /api/categories/{category}
DELETE /api/categories/{category}

GET    /api/products/{product}/stock-movements
POST   /api/products/{product}/stock-movements

GET    /api/dashboard/summary
GET    /api/users
PATCH  /api/users/{user}/role
```

The backend remains responsible for validation, persistence, and authorization.

---

# Authentication Flow

```text
User
 │
 ▼
Next.js Login
 │
 ▼
Laravel Authentication API
 │
 ├── Authentication successful
 │
 ▼
Authenticated Dashboard
 │
 ├── Products
 ├── Categories
 ├── Stock
 └── Users
```

Authentication failures are handled by the frontend and may redirect the user to the login page.

---

# Dashboard Data

The dashboard consumes summary data from:

```text
GET /api/dashboard/summary
```

The API provides values including:

```text
total_products
total_categories
total_stock_units
low_stock_count
out_of_stock_count
inventory_value
```

The frontend transforms these values into dashboard cards and stock-health information.

---

# Inventory Value

The backend calculates inventory value from product stock and price.

Conceptually:

```text
Inventory Value =
Σ (Stock Quantity × Product Price)
```

The frontend displays the value returned by the API rather than calculating the database value independently.

---

# Project Structure

```text
inventory-dashboard/
│
├── app/
│   ├── dashboard/
│   │   ├── categories/
│   │   ├── products/
│   │   ├── stock/
│   │   ├── users/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   └── ...
│
├── components/
│
├── lib/
│   ├── auth.ts
│   └── ...
│
├── public/
│
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# Code Quality

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production build locally:

```bash
npm start
```

Before deployment, both linting and production build checks should pass.

---

# Testing Checklist

## Authentication

* [ ] Registration works
* [ ] Login works
* [ ] Invalid credentials are rejected
* [ ] Protected routes require authentication
* [ ] Logout works
* [ ] Email verification flow works
* [ ] Password recovery flow works
* [ ] Google authentication works

## Dashboard

* [ ] Dashboard loads
* [ ] Product count is correct
* [ ] Category count is correct
* [ ] Stock quantity is correct
* [ ] Low-stock count is correct
* [ ] Out-of-stock count is correct
* [ ] Inventory value is correct
* [ ] Stock health displays correctly

## Products

* [ ] Products load
* [ ] Products can be created
* [ ] Products can be updated
* [ ] Products can be deleted
* [ ] Categories display correctly
* [ ] Product prices display correctly
* [ ] Stock quantities display correctly

## Categories

* [ ] Categories load
* [ ] Categories can be created
* [ ] Categories can be updated
* [ ] Categories can be deleted

## Stock

* [ ] Stock movements load
* [ ] Stock movements can be created
* [ ] Product selection works
* [ ] Quantities are validated
* [ ] Inventory changes are reflected correctly

## Users

* [ ] Users load
* [ ] Roles display correctly
* [ ] Authorized role changes work

## UI

* [ ] Navigation works
* [ ] Forms work
* [ ] Buttons work
* [ ] Loading states work
* [ ] Error states work
* [ ] Responsive layouts work
* [ ] No major browser console errors exist

---

# Security

The frontend does not connect directly to PostgreSQL.

Database access is handled exclusively by the Laravel backend.

Important principles:

* Never commit `.env.local`
* Never expose database credentials
* Never expose Google OAuth secrets
* Never expose mail credentials
* Do not rely on frontend authorization alone
* Backend authorization must enforce permissions
* Production communication should use HTTPS

---

# Backend Repository

The corresponding Laravel API is maintained separately.

Repository:

```text
https://github.com/chima-008/inventory-project
```

Production API:

```text
https://inventory-api-utcf.onrender.com
```

---

# Known Limitations

The frontend depends on the Laravel API for:

* Persistent data
* Authentication
* Authorization
* Database operations
* Inventory calculations
* Email functionality
* User management

The frontend cannot function as a complete standalone inventory system without the backend API.

---

# Future Improvements

Potential future improvements include:

* Advanced search
* Product filtering
* Pagination
* Bulk product operations
* CSV import/export
* Barcode scanning
* Supplier management
* Purchase orders
* Sales orders
* Inventory reports
* Audit logs
* Notifications
* Automated low-stock alerts
* Advanced analytics
* Mobile-specific improvements

---

# Project Purpose

This project demonstrates practical frontend development for a real business application.

It demonstrates experience with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* REST API integration
* Authentication
* CRUD interfaces
* Protected application routes
* Role-based workflows
* Responsive UI development
* Business dashboard design
* Full-stack architecture

---

# Author

**Ojeh Chimamanda**

Full-stack developer focused on building practical business applications, dashboards, APIs, and modern web systems.

GitHub: **chima-008**

---

# License

This project is intended for portfolio, demonstration, and commercial development purposes.

If distributed as a reusable template or commercial product, provide the applicable license and usage terms.
