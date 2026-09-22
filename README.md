# Inventory Management Dashboard

A production-ready inventory management dashboard built with Next.js and TypeScript.

The application provides the frontend interface for a Laravel-based inventory management API, allowing businesses to manage products, categories, stock movements, users, and inventory analytics from a centralized dashboard.

> **Commercial project:** This repository is primarily intended to demonstrate the engineering work and capabilities of the application. Commercial deployment, customization, licensing, and redistribution are separate from this public project documentation.

---

## Overview

The Inventory Management Dashboard is the frontend application for a full-stack inventory management platform.

It connects to a Laravel REST API and provides authenticated users with a centralized workspace for managing business inventory.

The dashboard is designed around:

* Business inventory management
* Secure authentication
* Role-based access
* Product management
* Category management
* Stock management
* Inventory analytics
* Multi-business data isolation

---

# Features

## Authentication

The application supports:

* Email/password login
* Account registration
* Email verification
* Verification email resend
* Password recovery
* Password reset
* Google sign in
* Logout
* Protected dashboard routes
* Authenticated API requests

Authentication state is maintained through a secure HTTP-only authentication cookie.

---

## Dashboard

The dashboard provides an overview of the business inventory.

Current metrics include:

* Total products
* Total categories
* Total stock units
* Low-stock items
* Out-of-stock items
* Inventory value
* Stock health

The dashboard retrieves live data from the Laravel API rather than relying on hard-coded values.

---

## Product Management

Authenticated users can manage products through the dashboard.

Product functionality includes:

* Product listing
* Product creation
* Product details
* Product updates
* Product deletion
* Category assignment
* SKU
* Pricing
* Stock quantity
* Low-stock threshold
* Active/inactive status
* Low-stock monitoring

---

## Category Management

Users can manage inventory categories from the dashboard.

Supported operations include:

* Create category
* View categories
* Update category
* Delete category

Administrative operations are protected according to the user's role.

---

## Stock Management

The dashboard provides a dedicated stock management area.

Users can:

* View stock information
* Record stock movements
* Increase stock
* Decrease stock
* Review stock movement history
* Monitor low-stock products

Stock changes are persisted through the Laravel API.

---

## User Management

Administrative users can manage users within their business.

The dashboard supports:

* Viewing users
* Viewing user roles
* Updating user roles

Role management is protected by the backend authorization layer.

---

# User Experience

The interface follows a modern SaaS dashboard design approach.

The design system uses:

* Slate-based neutral surfaces
* Blue primary actions
* Responsive layouts
* Consistent form controls
* Dashboard cards
* Clear navigation
* Responsive mobile layouts
* Accessible focus states
* Error and success feedback

The authentication screens use the same visual language as the dashboard to provide a consistent product experience.

---

# Technology Stack

## Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Next.js App Router

## Backend

The frontend communicates with a separate:

* Laravel 12 API
* PostgreSQL database
* Laravel Sanctum authentication

## Authentication Services

* Google OAuth
* Brevo transactional email

## Deployment

* Vercel
* GitHub

---

# Architecture

The application separates the frontend interface from the backend API.

```text id="9c3v1z"
                 ┌───────────────────────────┐
                 │      Next.js Frontend     │
                 │                           │
                 │ Authentication            │
                 │ Dashboard                 │
                 │ Products                  │
                 │ Categories                │
                 │ Stock                     │
                 │ Users                     │
                 └─────────────┬─────────────┘
                               │
                               │ HTTPS / JSON
                               ▼
                 ┌───────────────────────────┐
                 │       Laravel API         │
                 │                           │
                 │ Authentication            │
                 │ Authorization             │
                 │ Business Logic            │
                 │ Inventory Data            │
                 └─────────────┬─────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │ PostgreSQL  │
                        └─────────────┘
```

---

# Authentication Architecture

The frontend does not receive a long-lived authentication token directly through a Google redirect URL.

Instead, Google authentication uses a short-lived OAuth handoff code.

```text id="m9z1r4"
User
 │
 ▼
Next.js Login
 │
 ▼
Laravel Google OAuth
 │
 ▼
Google
 │
 ▼
Laravel Callback
 │
 ▼
Short-lived OAuth Code
 │
 ▼
Next.js Callback Page
 │
 ▼
Code Exchange
 │
 ▼
HTTP-only inventory_token Cookie
 │
 ▼
Dashboard
```

This keeps the final authentication token out of the browser URL.

---

# Route Protection

Authenticated dashboard pages use server-side authentication checks.

The application retrieves the current authenticated user from the Laravel API before rendering protected dashboard content.

If authentication is missing or invalid, the user is redirected to the login page.

This allows the dashboard to protect application routes without relying solely on client-side checks.

---

# API Communication

The frontend communicates with the Laravel API using HTTP requests.

The API base URL is configured through:

```env id="g4wz3p"
NEXT_PUBLIC_API_URL=
```

Local development can use:

```env id="z4q5w8"
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Production uses the deployed Laravel API.

The production API is:

```text
https://inventory-api-utcf.onrender.com/api
```

The production frontend is deployed separately through Vercel.

---

# API Proxy Routes

Some authentication operations are handled through Next.js API routes.

These include flows such as:

* Registration
* Email verification notification
* Password reset
* Google authentication code exchange

The proxy layer allows the frontend to communicate with the backend while keeping the authentication cookie under the frontend application's domain.

---

# Dashboard Structure

The main application areas are organized around the dashboard.

```text id="z7g9qp"
Dashboard
│
├── Overview
│
├── Products
│   └── Create Product
│
├── Categories
│   └── Create Category
│
├── Stock
│   └── Stock Movements
│
└── Users
    └── Role Management
```

---

# Responsive Design

The dashboard is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Navigation and dashboard content adapt to smaller screen sizes while preserving the core inventory workflows.

---

# Error Handling

The frontend provides user-facing handling for common API failures including:

* Invalid credentials
* Unverified accounts
* Expired verification flows
* Invalid password reset tokens
* Failed Google authentication
* Unauthorized requests
* API connectivity failures
* Validation errors

Errors are presented through the application's UI rather than exposing raw backend exceptions to users.

---

# Production Deployment

The frontend is deployed through Vercel.

Architecture:

```text id="9n7n4c"
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js Inventory Dashboard
   │
   │ HTTPS
   ▼
Render
   │
   ▼
Laravel Inventory API
   │
   ▼
PostgreSQL
```

The production frontend and backend are deployed independently.

This allows the API and frontend to be scaled, maintained, and deployed separately.

---

# Development

Install dependencies:

```bash id="d8e1m2"
npm install
```

Create the local environment file:

```text id="f0h4wl"
.env.local
```

Configure:

```env id="c7v9b1"
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash id="n6z4p1"
npm run dev
```

The application will normally be available at:

```text id="1m6q3s"
http://localhost:3000
```

---

# Production Build

Create a production build with:

```bash id="r2n8v6"
npm run build
```

Start the production application with:

```bash id="w5k3j9"
npm run start
```

---

# Engineering Highlights

This project demonstrates practical experience with:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Server-side authentication
* HTTP-only cookies
* REST API integration
* Authentication proxy routes
* OAuth integration
* Protected routes
* Responsive dashboard design
* API error handling
* Production deployment
* Frontend/backend separation

---

# Production Application

Frontend:

```text
https://inventory-dashboard-sand-alpha.vercel.app/
```

Backend API:

```text
https://inventory-api-utcf.onrender.com/api
```

Health check:

```text
https://inventory-api-utcf.onrender.com/api/health
```

---

# Project Status

The application is deployed and the core inventory workflows are implemented.

### Completed

* Authentication UI
* Registration
* Email verification
* Password reset
* Google authentication
* Login/logout
* Protected dashboard
* Inventory overview
* Product management
* Category management
* Stock management
* Stock movements
* User management
* Role management
* Laravel API integration
* Production deployment

Backend automated test status:

**84/84 tests passing.**

---

# Commercial Use

This project is part of a professional development and portfolio project.

The repository documentation demonstrates the application's architecture and engineering capabilities.

Commercial versions may include:

* Private deployment
* Business-specific branding
* Custom workflows
* Additional features
* Third-party integrations
* Data migration
* Hosting configuration
* Maintenance
* Support

Commercial licensing and usage rights should be agreed upon separately with the developer.

---

# License

No open-source license is granted by this repository unless a separate license file explicitly states otherwise.

All rights not expressly granted are reserved by the project owner.
