# Backend Email Setup - Node.js & npm

Complete guide to set up and run the email backend service using Node.js and npm.

---

## ✅ Backend Already Created

The backend infrastructure is already set up in the `server/` directory:

```
server/
├── index.js                 ✅ Main Express server
├── emailService.js          ✅ SendGrid integration
├── routes/
│   └── emailRoutes.js       ✅ Email endpoints
├── package.json             ✅ Dependencies defined
├── .env.example             ✅ Configuration template
├── .gitignore               ✅ Protect .env
└── README.md                ✅ Backend documentation
```

All files are ready! Now let's set it up.

---

## Step 1: Install Dependencies

```bash
# Navigate to server directory
cd server

# Install npm packages
npm install
```

**Expected output:**
```
added 64 packages, and audited 65 packages in 5s
```

**What gets installed:**
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `@sendgrid/mail` - SendGrid email API client

---

## Step 2: Create Environment File

```bash
# In the server directory, copy .env.example to .env
cp .env.example .env

# On Windows:
# copy .env.example .env
```

**Or manually:**
```bash
# Create blank .env file
echo. > .env
```

Then edit `server/.env` and add:

```dotenv
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@storemx.com
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important:**
- Replace `SG.your_api_key_here` with your actual SendGrid API key
- Don't commit .env to Git (it's in .gitignore)

---

## Step 3: Get SendGrid API Key

If you don't have an API key yet:

### Quick Setup (5 mins):

1. **Visit SendGrid signup**
   ```
   https://signup.sendgrid.com/
   ```

2. **Create account** with your email and password

3. **Verify email** - Check inbox for verification link

4. **Get API Key:**
   - Login: https://app.sendgrid.com
   - Go to: Settings → API Keys
   - Click: "Create API Key"
   - Select: Full Access (for testing)
   - Click: "Create & Copy"

5. **Copy the key** (it's shown only once!)
   ```
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

6. **Paste in server/.env:**
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

👉 **Full guide:** See `SENDGRID_INITIALIZATION.md`

---

## Step 4: Start the Backend Server

```bash
# Make sure you're in the server directory
cd server

# Start the server
npm start
```

**Expected output:**

```
╔═══════════════════════════════════════╗
║   StoreMX Email Service Backend      ║
╚═══════════════════════════════════════╝
✅ Server running on http://localhost:5000
📧 Frontend URL: http://localhost:5173
🔑 API Key configured: Yes

Available endpoints:
  GET  /api/health - Server health check
  POST /api/test-email - Test email endpoint
  POST /api/email/send-order-confirmation - Send order confirmation
```

**✅ If you see "Server running" → Backend is working!**

---

## Step 5: Test the Backend

### Test 1: Health Check

```bash
# In a new terminal
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "StoreMX Backend Server is running",
  "timestamp": "2026-02-23T10:30:00.000Z"
}
```

### Test 2: Send Test Email

```bash
curl -X POST http://localhost:5000/api/email/send-order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "trackingId": "STM12345ABC",
    "customerName": "John Doe",
    "orderDetails": {
      "items": ["Test Product"],
      "total": "₹1,199",
      "date": "2026-02-23"
    }
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully",
  "messageId": "..."
}
```

**Check your email inbox** - You should receive the email within 10 seconds!

---

## Step 6: Connect Frontend to Backend

### Update Frontend .env

In the **root directory** (not server), create/update `.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

### Update Checkout.tsx

In `src/pages/Checkout.tsx`, find the sendEmailConfirmation function and update it:

```typescript
const sendEmailConfirmation = async (
  email: string,
  trackingId: string,
  customerName: string,
  orderDetails: any
) => {
  try {
    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/email/send-order-confirmation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          trackingId,
          customerName,
          orderDetails,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send confirmation email');
    }

    // Success - email sent!
    console.log('✅ Confirmation email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  } finally {
    setLoading(false);
  }
};
```

---

## Complete Setup Script

One command to set everything up:

```bash
# Run from project root directory

# 1. Navigate to server
cd server

# 2. Install dependencies
npm install

# 3. Copy .env.example to .env
cp .env.example .env

# 4. Edit .env with your SENDGRID_API_KEY
# (Use your text editor to add the API key)

# 5. Start the server
npm start
```

---

## Troubleshooting Setup

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
# You might be in wrong directory, or npm install didn't work
cd server
npm install
```

### Issue: "SENDGRID_API_KEY is undefined"

**Solution:**
```bash
# Check .env exists
cat .env

# Verify SENDGRID_API_KEY is set
# If not, edit .env manually with your API key
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Use a different port
PORT=5001 npm start
```

### Issue: "npm: command not found"

**Solution:**
Install Node.js from https://nodejs.org/

Then check:
```bash
node --version
npm --version
```

---

## Running Frontend & Backend Together

### Terminal 1: Start Backend

```bash
cd server
npm start
```

Wait for: `✅ Server running on http://localhost:5000`

### Terminal 2: Start Frontend

```bash
# From root directory (not server/)
npm run dev
```

Wait for: `Local: http://localhost:5173`

### Now:
1. Open http://localhost:5173
2. Add product to cart
3. Go to checkout
4. Enter your email
5. Click "Place Order"
6. Check your email! 📧

---

## Development Mode (Optional)

### With Auto-Reload

If you want the server to restart when you make changes:

```bash
# Edit package.json in server/
# Change this:
"start": "node index.js"
# To this:
"start": "node --watch index.js"

# Then:
npm start
```

---

## Backend File Structure

```
server/
├── index.js
│   └── Express app setup
│       - CORS configuration
│       - Health check endpoint
│       - Email routes
│       - Error handlers
│
├── emailService.js
│   └── SendGrid integration
│       - sgMail.setApiKey()
│       - sendOrderConfirmation()
│       - Email template generation
│       - HTML email formatting
│
├── routes/emailRoutes.js
│   └── API endpoints
│       - POST /send-order-confirmation
│       - GET /health
│       - Input validation
│       - Error handling
│
├── package.json
│   └── Dependency definitions
│       - express 4.18.2
│       - cors 2.8.5
│       - dotenv 16.3.1
│       - @sendgrid/mail 7.7.0
│
└── .env.example
    └── Configuration template
```

---

## API Endpoints Available

### Health Check

```
GET http://localhost:5000/api/health

Response:
{
  "status": "OK",
  "message": "StoreMX Backend Server is running",
  "timestamp": "2026-02-23T..."
}
```

### Send Order Confirmation Email

```
POST http://localhost:5000/api/email/send-order-confirmation

Request Body:
{
  "email": "customer@gmail.com",
  "trackingId": "STM12345ABC",
  "customerName": "John Doe",
  "orderDetails": {
    "items": ["Product 1", "Product 2"],
    "total": "₹2,499",
    "date": "2026-02-23"
  }
}

Response (Success):
{
  "success": true,
  "message": "Confirmation email sent successfully",
  "messageId": "..."
}

Response (Error):
{
  "success": false,
  "message": "Invalid email format"
}
```

---

## Security Checklist

- ✅ .env file created (not committed)
- ✅ SENDGRID_API_KEY in .env (not in code)
- ✅ .env added to .gitignore
- ✅ CORS configured to frontend URL only
- ✅ Email validation implemented
- ✅ Error handling present
- ✅ No console logs in production

---

## Next Steps

1. ✅ npm install (dependencies)
2. ✅ Create .env file
3. ✅ Add SendGrid API key
4. ✅ npm start (start server)
5. ✅ Test endpoints
6. ✅ Connect frontend
7. 📍 Place test order
8. 📧 Verify email received
9. 🚀 Ready for production

---

## Need Help?

- 📖 Full guide: `SENDGRID_INITIALIZATION.md`
- 🐛 Troubleshooting: `TROUBLESHOOTING.md`
- ✅ Checklist: `IMPLEMENTATION_CHECKLIST.md`
- 🏗️ Architecture: `ARCHITECTURE.md`

---

**Ready?** Start with:
```bash
cd server && npm install && npm start
```

Then check your email! 🚀
