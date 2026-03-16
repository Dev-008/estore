import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import emailRoutes from './routes/emailRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Environment validation
const validateEnvironment = () => {
  const errors = [];
  
  if (!process.env.PORT && !process.env.PORT === '0') {
    errors.push('PORT must be defined');
  }
  
  if (!process.env.FRONTEND_URL) {
    errors.push('FRONTEND_URL must be defined');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.SENDGRID_API_KEY) {
    errors.push('SENDGRID_API_KEY must be defined in production');
  }

  if (!process.env.MONGODB_URI) {
    errors.push('MONGODB_URI must be defined');
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
};

validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://estore-puce.vercel.app",
  "https://estore-git-main-dev-008s-projects.vercel.app",
  "https://estore-khaki.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB before starting server
await connectToMongoDB();

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'storeMX Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      serverName: 'storeMX Backend',
      version: '1.0.0',
      environment: NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Test email endpoint (for testing before implementing in checkout)
app.post('/api/test-email', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Email is required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid email format',
      });
    }

    res.json({
      success: true,
      message: `Test email would be sent to: ${email}`,
      info: 'This is a test endpoint. Use /api/email/send-order-confirmation for real orders',
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  
  res.status(statusCode).json({
    success: false,
    error: errorCode,
    message: err.message || 'Internal server error',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   storeMX Backend Server v1.0        ║');
  console.log('╚═══════════════════════════════════════╝\n');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🔧 Environment: ${NODE_ENV}`);
  console.log(`🔑 SendGrid API Key: ${process.env.SENDGRID_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`🗄️  MongoDB: ✓ Connected`);
  console.log('\n📚 Available endpoints:');
  console.log('  GET  /api/health - Server health check');
  console.log('  GET  /api/status - Server status');
  console.log('  POST /api/test-email - Test email endpoint');
  console.log('  GET  /api/products - Get all products');
  console.log('  GET  /api/products/:id - Get single product');
  console.log('  POST /api/products - Create product');
  console.log('  PUT  /api/products/:id - Update product');
  console.log('  DELETE /api/products/:id - Delete product');
  console.log('  GET  /api/products/category/:categoryId - Get products by category');
  console.log('  POST /api/email/send-order-confirmation - Send order confirmation\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
