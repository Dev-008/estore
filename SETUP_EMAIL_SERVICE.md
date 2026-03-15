# Email Service Integration Guide

## Step 1: Choose Your Email Service

### Option A: SendGrid (Recommended for beginners)
- Free tier: 100 emails/day
- Website: https://sendgrid.com
- Easy setup, good documentation

### Option B: Mailgun
- Free tier: 5,000 emails/month
- Website: https://www.mailgun.com
- More advanced features

### Option C: Resend (Email for developers)
- Website: https://resend.com
- Great for developers, modern API

---

## Step 2: Backend Setup (Node.js/Express)

### Install Dependencies

```bash
npm install express nodemailer dotenv cors
# OR for SendGrid:
npm install @sendgrid/mail dotenv
```

### Create `.env` file in project root

```env
# SendGrid Setup
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@storemx.com

# Or Mailgun Setup
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=mg.yourdomain.com

# Server
PORT=5000
```

---

## Step 3: Create Backend Email Service

### Create file: `server/emailService.js`

```javascript
// For SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderConfirmation = async (email, trackingId, customerName, orderDetails) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Order Confirmation - StoreMX | Tracking: ${trackingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Placed Successfully! 🎉</h2>
          <p>Hi <strong>${customerName}</strong>,</p>
          
          <p>Your order has been confirmed and is being processed.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Tracking Information</h3>
            <p style="font-size: 18px; font-weight: bold; color: #007bff;">
              Tracking ID: ${trackingId}
            </p>
            <p style="color: #666; font-size: 14px;">
              Save this ID to track your order status
            </p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Amount:</strong> ₹${orderDetails.totalAmount}</p>
            <p><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
            <p><strong>Status:</strong> <span style="color: #ff9800;">Processing</span></p>
            <p><strong>Items:</strong> ${orderDetails.itemCount}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <h3>Next Steps</h3>
            <ol>
              <li>Your order is being prepared</li>
              <li>You'll receive a shipping notification when dispatched</li>
              <li>Track your order using your Tracking ID</li>
            </ol>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              Have questions? Reply to this email or visit StoreMX customer support
            </p>
          </div>
          
          <footer style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 StoreMX. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log('✅ Email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

module.exports = { sendOrderConfirmation };
```

### Create file: `server/routes/sendEmail.js`

```javascript
const express = require('express');
const { sendOrderConfirmation } = require('../emailService');

const router = express.Router();

router.post('/send-order-confirmation', async (req, res) => {
  try {
    const { email, trackingId, customerName, orderDetails } = req.body;

    // Validation
    if (!email || !trackingId || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Send email
    await sendOrderConfirmation(email, trackingId, customerName, orderDetails);

    res.json({
      success: true,
      message: 'Confirmation email sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
```

### Create file: `server/index.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/sendEmail');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/email', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## Step 4: Update Frontend to Call Backend

Replace the email sending logic in `src/pages/Checkout.tsx`:

### Original Code (Simulated)
```javascript
const sendEmailConfirmation = (email: string, trackingId: string) => {
  console.log("📧 Email Sent:", orderDetails);
  toast.success(`Confirmation email sent to ${email}`);
};
```

### Updated Code (Real Email)
```javascript
const sendEmailConfirmation = async (
  email: string,
  trackingId: string,
  customerName: string,
  orderDetails: object
) => {
  try {
    const response = await fetch('http://localhost:5000/api/email/send-order-confirmation', {
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
    });

    const data = await response.json();

    if (data.success) {
      toast.success(`Confirmation email sent to ${email}`);
    } else {
      toast.error('Failed to send confirmation email');
    }
  } catch (error) {
    console.error('Email error:', error);
    toast.error('Failed to send confirmation email');
  }
};
```

---

## Step 5: Get API Keys

### For SendGrid:
1. Visit https://sendgrid.com
2. Sign up (free account)
3. Go to Settings → API Keys
4. Create new API Key (Full Access)
5. Copy and paste into `.env` file

### For Mailgun:
1. Visit https://www.mailgun.com
2. Sign up (free account)
3. Go to API Security
4. Copy API Key
5. Copy Domain from dashboard

---

## Step 6: Run the Server

```bash
# In project root, create server folder
mkdir server

# Navigate to server
cd server

# Install dependencies
npm init -y
npm install express nodemailer dotenv cors @sendgrid/mail

# Create .env file with your API key
echo "SENDGRID_API_KEY=your_key_here" > .env

# Start server
node index.js
```

---

## Step 7: Run Both Frontend and Backend

### Terminal 1 - Frontend
```bash
npm run dev
```

### Terminal 2 - Backend
```bash
cd server && node index.js
```

---

## Testing the Email

1. Go to checkout
2. Fill in form with real email
3. Place order
4. Check your email inbox (and spam folder)
5. You should receive confirmation with tracking ID

---

## Email Template Customization

Modify the HTML in `server/emailService.js` to add:
- Your logo
- Company branding colors
- Social media links
- Custom message
- Product images

---

## Production Deployment

### For Vercel/Netlify (Frontend)
- No changes needed for email (backend handles it)
- Update API URL from `localhost:5000` to production URL

### For Backend Hosting
- **Option 1: Heroku** (Free tier available)
- **Option 2: Railway** (New, recommended)
- **Option 3: Render**
- **Option 4: AWS Lambda**

### Update Frontend API URL for Production
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const response = await fetch(`${API_URL}/api/email/send-order-confirmation`, {
  // ...
});
```

Add to `.env`:
```
REACT_APP_API_URL=https://your-backend.com
```

---

## Common Issues & Solutions

### "API key not found"
- Check `.env` file exists
- Restart server after adding .env
- Run `npm install dotenv`

### "CORS error"
- Add `cors()` middleware in Express
- Update CORS origin for production

### "Email not sent"
- Check email validity
- Check API key is correct
- Check SendGrid/Mailgun quota
- Check spam folder

---

## Next Steps

1. ✅ Set up email service account (SendGrid/Mailgun)
2. ✅ Create backend server
3. ✅ Add email routes
4. ✅ Update frontend to call backend
5. ✅ Test with real email
6. ✅ Deploy to production
7. ✅ Monitor email delivery rates
