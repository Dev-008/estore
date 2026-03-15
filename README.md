# storeMX

A modern, professional e-commerce platform built with enterprise-grade standards and best practices.

**Version**: 1.0.0  
**Author**: Dev Dharsan

## 🎯 Project Overview

storeMX is a full-stack e-commerce application featuring:
- Strict TypeScript with comprehensive type safety
- Professional error handling and logging
- Input validation and security
- Responsive UI with Tailwind CSS
- State management with React Context
- Full-featured shopping cart and wishlist
- Email integration via SendGrid
- Production-ready architecture

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Documentation](#documentation)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or bun >= 1.0.0

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd zenith-shopper

# Install dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Create environment files
cp .env.example .env
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=storeMX
VITE_APP_VERSION=1.0.0
```

For backend, create `server/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
SENDGRID_API_KEY=your_sendgrid_key_here
```

### Running the Application

**Terminal 1 - Frontend Development Server:**
```bash
npm run dev
```
Runs on `http://localhost:5173`

**Terminal 2 - Backend Server:**
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **State Management**: React Context API
- **Data Fetching**: Axios with custom client
- **Form Validation**: Custom validation library
- **HTTP Client**: Centralized API client with error handling

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Email Service**: SendGrid
- **CORS**: Enabled for frontend communication

### Development
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with enhanced rules
- **Testing**: Vitest

## 📁 Project Structure

```
zenith-shopper/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn-ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── contexts/            # State management
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── pages/               # Page components
│   │   ├── Index.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Orders.tsx
│   │   └── admin/
│   ├── lib/                 # Utility functions
│   │   ├── apiClient.ts     # HTTP client
│   │   ├── errors.ts        # Error types
│   │   ├── logger.ts        # Logging utility
│   │   ├── validation.ts    # Form validation
│   │   ├── env.ts           # Environment config
│   │   └── utils.ts
│   ├── hooks/               # Custom React hooks
│   ├── data/                # Static data
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── server/
│   ├── index.js             # Express server
│   ├── routes/
│   │   └── emailRoutes.js
│   └── package.json
├── public/                  # Static assets
├── .env.example             # Environment template
├── vite.config.ts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts
└── package.json
```

## 📝 Scripts

### Frontend Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Backend Scripts

```bash
cd server

# Development server with auto-restart
npm run dev

# Production server
npm start
```

## ⚙️ Configuration

### TypeScript Configuration

Strict mode is fully enabled for 100% type safety:
- `noImplicitAny`: All types must be explicit
- `noUnusedLocals`: Dead code detection
- `strictNullChecks`: Null/undefined checking
- `strict`: All strict flags enabled

### ESLint Rules

Enhanced ESLint configuration enforces:
- Explicit return types on functions
- No `any` types without justification
- Proper error handling
- Logging instead of console.log

## 📚 Documentation

Comprehensive documentation is available:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture overview
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Backend installation guide
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Development best practices
- **[PROFESSIONAL_SUMMARY.md](PROFESSIONAL_SUMMARY.md)** - Code improvements
- **[SETUP_EMAIL_SERVICE.md](SETUP_EMAIL_SERVICE.md)** - Email configuration
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Feature checklist

## 🔒 Professional Standards

This project follows enterprise-grade practices:

### Error Handling
- Custom error types hierarchy (ValidationError, AuthError, NetworkError)
- Proper error recovery and user feedback
- Centralized error handling in API client

### Logging
- Professional Logger utility instead of console.log
- Development vs production logging
- Timestamp formatting and grouping support

### Validation
- Email, password, phone, ZIP, name validators
- Comprehensive checkout form validation
- Per-field error messages

### Type Safety
- 100% TypeScript coverage
- Strict null checking
- Explicit function return types
- No implicit `any` types

## 🔐 Security Features

- Environment variable validation
- Input sanitization via validation library
- XSS protection via React
- CORS enabled on backend
- Email verification integration

## 📦 Key Libraries

- **react**: UI framework
- **typescript**: Type system
- **vite**: Build tool
- **tailwindcss**: Styling
- **axios**: HTTP client
- **react-router-dom**: Routing
- **@hookform/react**: Form handling
- **zod**: Schema validation

## 🤝 Contributing

When contributing to this project:

1. Follow TypeScript strict mode requirements
2. Add proper error handling
3. Use the Logger utility instead of console.log
4. Ensure all inputs are validated
5. Write descriptive commit messages
6. Test functionality before committing

## 📄 License

This project is private and proprietary.

## 📞 Support

For issues or questions, refer to the documentation files or review the codebase comments.

---

**Last Updated**: 2024  
**Status**: Production Ready ✓

