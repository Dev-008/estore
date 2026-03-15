import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/productModel.js';

const router = express.Router();

// Admin credentials (in production, use hashed passwords and database)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { username, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
});

// Get all products (Admin view with edit/delete buttons)
router.get('/products', verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
      // Search by name, brand, category, and id with case-insensitive regex
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { id: searchRegex },
        { description: searchRegex },
      ];
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
});

// Get single product for editing
router.get('/products/:id', verifyAdminToken, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
});

// Create new product
router.post('/products', verifyAdminToken, async (req, res) => {
  try {
    const { id, name, description, price, originalPrice, category, rating, reviewCount, image, images, inStock, stockCount, brand, features } = req.body;

    // Validate required fields
    if (!id || !name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id, name, price, category',
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this ID already exists',
      });
    }

    const product = new Product({
      id,
      name,
      description: description || '',
      price,
      originalPrice: originalPrice || price,
      category,
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      image: image || 'https://via.placeholder.com/400',
      images: images || [image || 'https://via.placeholder.com/400'],
      inStock: inStock !== undefined ? inStock : true,
      stockCount: stockCount || 0,
      brand: brand || '',
      features: features || [],
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
});

// Update product
router.put('/products/:id', verifyAdminToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
});

// Delete product
router.delete('/products/:id', verifyAdminToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
});

// Verify token (check if admin is still logged in)
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

export default router;
