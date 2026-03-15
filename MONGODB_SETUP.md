# MongoDB Setup Guide for StoreMX

Complete guide to set up MongoDB and integrate product storage into your StoreMX backend.

---

## Overview

This guide will help you:
1. Set up MongoDB (locally or cloud)
2. Install backend dependencies
3. Seed the database with initial products
4. Connect the frontend to fetch products from the backend

---

## Option 1: Local MongoDB Setup (Windows)

### Step 1: Install MongoDB Community Edition

1. Download from: https://www.mongodb.com/try/download/community
2. Choose Windows as OS
3. Run the installer and follow the installation wizard
4. MongoDB will be installed at: `C:\Program Files\MongoDB\Server\7.0\`
5. MongoDB automatically runs as a Windows service

### Step 2: Verify MongoDB is Running

Open PowerShell and run:
```bash
mongosh
```

You should see the MongoDB shell prompt. Type `exit` to quit.

### Step 3: MongoDB Connection String

For local development, use:
```
mongodb://localhost:27017/storemx
```

---

## Option 2: MongoDB Atlas (Cloud - Recommended for Production)

### Step 1: Create Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project

### Step 2: Create Database Cluster

1. Click "Create" → Choose a cluster tier (Free tier is great for testing)
2. Select your region (closest to your users)
3. Wait for cluster to be deployed (5-10 minutes)

### Step 3: Connect to Cluster

1. Click "Connect" button
2. Choose "Drivers" → Select Node.js
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `myFirstDatabase` with `storemx`

Example:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/storemx?retryWrites=true&w=majority
```

---

## Backend Setup Steps

### Step 1: Update Environment Variables

Navigate to `server/` directory and create or update `.env`:

```bash
# Backend configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email configuration (keep existing)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@storemx.com

# MongoDB configuration (ADD THIS)
MONGODB_URI=mongodb://localhost:27017/storemx
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/storemx?retryWrites=true&w=majority
```

### Step 2: Install Dependencies

```bash
cd server
npm install
```

This will install:
- `mongoose` - MongoDB ODM (Object Document Mapper)
- All other existing dependencies

### Step 3: Seed Database with Products

```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear any existing products
- Insert sample products from `scripts/seedDb.js`

You should see:
```
✅ MongoDB connected
✅ Products cleared
✅ Successfully inserted X products
✨ Database seeding completed successfully!
```

---

## Start the Backend

### Development Mode (with auto-reload)

```bash
cd server
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║   storeMX Backend Server v1.0        ║
╚═══════════════════════════════════════╝

✅ Server running on http://localhost:5000
📧 Frontend URL: http://localhost:5173
🔧 Environment: development
🔑 SendGrid API Key: ✓ Configured
🗄️  MongoDB: ✓ Connected

📚 Available endpoints:
  GET  /api/products - Get all products
  GET  /api/products/:id - Get single product
  POST /api/products - Create product
  PUT  /api/products/:id - Update product
  DELETE /api/products/:id - Delete product
  GET  /api/products/category/:categoryId - Get products by category
```

---

## Test API Endpoints

### Get All Products

```bash
curl http://localhost:5000/api/products
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Wireless Noise Cancelling Headphones",
      "price": 3999,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

### Get Single Product

```bash
curl http://localhost:5000/api/products/1
```

### Get Products by Category

```bash
curl http://localhost:5000/api/products/category/electronics
```

### With Pagination and Filtering

```bash
curl "http://localhost:5000/api/products?category=electronics&page=1&limit=10&inStock=true"
```

### Search Products

```bash
curl "http://localhost:5000/api/products?search=headphones"
```

---

## Backend File Structure

```
server/
├── index.js                    # Main Express app & MongoDB connection
├── package.json                # Dependencies including Mongoose
├── .env                        # Environment variables (create from .env.example)
├── models/
│   └── productModel.js         # Mongoose Product schema
├── routes/
│   ├── emailRoutes.js          # Email endpoints
│   └── productRoutes.js        # Product CRUD endpoints
└── scripts/
    └── seedDb.js               # Database seeding script
```

---

## Frontend Integration

### Environment Variable

Create or update `src/lib/env.ts`:

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Add to `.env.local`:

```
VITE_API_URL=http://localhost:5000
```

### Use Product Service

In your components:

```typescript
import { productService } from '@/lib/productService';

// Get all products
const products = await productService.getAllProducts();

// Get products with filters
const results = await productService.getAllProducts({
  category: 'electronics',
  inStock: true,
  page: 1,
  limit: 20
});

// Get single product
const product = await productService.getProductById('1');

// Get by category
const categoryProducts = await productService.getProductsByCategory('electronics');
```

---

## Troubleshooting

### MongoDB Connection Error

**Error:** `MONGODB_URI must be defined`

**Solution:**
- Check `.env` file exists in `server/` directory
- Verify `MONGODB_URI` is set correctly
- Test connection string in MongoDB Compass

---

### "connect ECONNREFUSED"

**Error:** Connection refused to MongoDB

**Solutions:**
- **Local MongoDB:** Start MongoDB service
  ```bash
  net start MongoDB
  ```
- **MongoDB Atlas:** Check if connection string is correct (IP whitelist, password, etc.)
- **Firewall:** Allow port 27017 (local) or check network access

---

### "Authentication failed"

**Error:** Invalid credentials for MongoDB Atlas

**Solution:**
- Verify username and password in connection string
- Check MongoDB Atlas cluster settings → Database Access
- Reset password if needed → Click "Edit" on user → "Edit Password"

---

### "getaddrinfo ENOTFOUND cluster0.mongodb.net"

**Error:** DNS resolution failed

**Solutions:**
- Check internet connection
- Verify connection string spelling
- Try adding `?retryWrites=true&w=majority` to the connection string

---

## Useful Commands

```bash
# Start backend
npm start

# Start backend with auto-reload (development)
npm run dev

# Seed database
npm run seed

# Monitor MongoDB (in another terminal)
mongosh
```

---

## Next Steps

1. ✅ Set up MongoDB (local or Atlas)
2. ✅ Configure `.env` file
3. ✅ Run `npm install` in server directory
4. ✅ Run `npm run seed` to populate products
5. ✅ Start backend with `npm run dev`
6. ✅ Start frontend normally
7. ✅ Update frontend components to fetch from backend API

---

## File Locations

- **Backend Config:** `server/.env`
- **Product Model:** `server/models/productModel.js`
- **Product Routes:** `server/routes/productRoutes.js`
- **Seed Script:** `server/scripts/seedDb.js`
- **Frontend Service:** `src/lib/productService.ts`

---

## API Reference

### GET /api/products
Get all products with optional filtering

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Products per page (default: 20)
- `category` (string) - Filter by category
- `inStock` (boolean) - Filter by stock status
- `search` (string) - Search in name and description

**Example:**
```
GET /api/products?category=electronics&inStock=true&page=1&limit=10
```

---

### GET /api/products/:id
Get single product by ID

**Example:**
```
GET /api/products/1
```

---

### GET /api/products/category/:categoryId
Get all products in a category

**Example:**
```
GET /api/products/category/electronics
```

---

### POST /api/products
Create new product (admin only)

**Request Body:**
```json
{
  "id": "new-product-id",
  "name": "Product Name",
  "description": "Description",
  "price": 1999,
  "originalPrice": 2999,
  "category": "electronics",
  "rating": 4.5,
  "reviewCount": 100,
  "image": "https://...",
  "images": ["https://..."],
  "inStock": true,
  "stockCount": 50,
  "brand": "Brand Name",
  "features": ["Feature 1", "Feature 2"]
}
```

---

### PUT /api/products/:id
Update product

**Example:**
```
PUT /api/products/1
```

---

### DELETE /api/products/:id
Delete product

**Example:**
```
DELETE /api/products/1
```

---

Happy coding! 🚀
