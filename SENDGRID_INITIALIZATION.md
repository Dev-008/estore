# SendGrid Initialization Guide

Complete step-by-step guide to initialize SendGrid for StoreMX email confirmation system.

---

## Part 1: Create SendGrid Account

### Step 1: Sign Up for SendGrid

1. **Visit SendGrid**
   ```
   https://signup.sendgrid.com/
   ```

2. **Fill signup form:**
   - Email: Your business email
   - Password: Strong password (save it!)
   - First Name: Your name
   - Last Name: Your surname
   - Company: StoreMX (or your company)
   - Use case: Select "Other" or "Email API"

3. **Accept Terms**
   - [ ] I agree to SendGrid's Terms of Service
   - [ ] Click "Create Account"

4. **Verify email**
   - Check your email inbox
   - Click verification link
   - Account activated ✓

### Step 2: Complete Account Setup

1. **Login to SendGrid**
   ```
   https://app.sendgrid.com/
   ```

2. **Authentication Setup (Optional but Recommended)**
   - Go to: Settings → Authentication
   - Add SPF/DKIM records (for custom domain)
   - For now, you can skip this

3. **Verify Sender Email**
   - Settings → Sender Authentication → Single Sender
   - Click "Create New Sender"
   - Fill details:
     ```
     From Email: noreply@storemx.com (or your email)
     From Name: StoreMX
     Reply To: support@storemx.com (or your email)
     Address: 123 Business St
     City: Mumbai
     Country: India
     Postal Code: 400001
     ```
   - Verify the email
   - Check inbox for verification link

---

## Part 2: Generate API Key

### Step 1: Access API Key Settings

1. **Click your profile (top right)**
   - Select "Settings"
   - Or go directly: https://app.sendgrid.com/settings/api_keys

2. **Select "API Keys"** from left menu

### Step 2: Create New API Key

1. **Click "Create API Key"** button

2. **Configure API Key:**
   - API Key Name: `StoreMX-Production` (or `StoreMX-Dev`)
   - Permissions: Choose one:
     - **Full Access** (if testing)
     - **Restricted Access** → Select:
       - [ ] Mail Send
       - [ ] Templates Read
       - [ ] Statistics Read

3. **Click "Create & Copy"**

4. **Important: COPY and SAVE the key immediately**
   ```
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - ⚠️ This key is only shown ONCE
   - If you lose it, you must create a new one

---

## Part 3: Setup Backend Environment

### Step 1: Create .env File

In `server/` directory:

```bash
# server/.env

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_copied_key_here
SENDGRID_FROM_EMAIL=noreply@storemx.com

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `SG.your_copied_key_here` → Paste your actual API key
- `noreply@storemx.com` → Use the email you verified in SendGrid
- `http://localhost:5173` → Your frontend URL (for localhost development)

### Step 2: Protect .env File

Make sure `.gitignore` includes:

```bash
# server/.gitignore

# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

---

## Part 4: Backend Code Initialization

### Step 1: Install Dependencies

```bash
cd server
npm install
npm install @sendgrid/mail dotenv express cors
```

### Step 2: Initialize in Code

Your `server/index.js`:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Import email routes
import emailRoutes from './routes/emailRoutes.js';
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'StoreMX Backend Server is running',
    sendgridStatus: process.env.SENDGRID_API_KEY ? '✅ Loaded' : '❌ Missing',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ SendGrid API Key: ${process.env.SENDGRID_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log(`✅ SendGrid From Email: ${process.env.SENDGRID_FROM_EMAIL}`);
});
```

### Step 3: Email Service Initialization

Your `server/emailService.js`:

```javascript
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY is not set in .env file');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

console.log('✅ SendGrid initialized successfully');

// Export send function
export const sendOrderConfirmation = async (email, trackingId, customerName, orderDetails) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Order Confirmation - Tracking ID: ${trackingId}`,
      html: generateOrderEmailTemplate(trackingId, customerName, orderDetails),
    };

    const result = await sgMail.send(msg);
    console.log(`✅ Email sent successfully to: ${email}`);
    return result;
  } catch (error) {
    console.error(`❌ Error sending email:`, error.message);
    throw error;
  }
};

function generateOrderEmailTemplate(trackingId, customerName, orderDetails) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .tracking-id { background: #f0f0f0; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .tracking-id .label { font-size: 12px; color: #666; }
          .tracking-id .value { font-size: 24px; font-weight: bold; color: #667eea; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>StoreMX</h1>
            <p>Order Confirmation</p>
          </div>
          
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for your order! Here are your order details:</p>
            
            <div class="tracking-id">
              <div class="label">Your Tracking ID</div>
              <div class="value">${trackingId}</div>
            </div>
            
            <h3>Order Summary:</h3>
            <ul>
              ${orderDetails.items ? orderDetails.items.map(item => `<li>${item}</li>`).join('') : ''}
            </ul>
            
            <p><strong>Total Amount:</strong> ${orderDetails.total}</p>
            <p><strong>Order Date:</strong> ${orderDetails.date}</p>
            
            <p>You can track your order using the Tracking ID above.</p>
            <p>We'll notify you when your order ships!</p>
            
            <p>Best regards,<br>StoreMX Team</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

---

## Part 5: Test SendGrid Initialization

### Test 1: Check Environment Variables

```bash
# In server directory
node -e "console.log(process.env.SENDGRID_API_KEY)"
# Should print: SG.xxxxx... (not empty)
```

### Test 2: Start Backend and Check Logs

```bash
cd server
npm start
```

**Expected output:**
```
✅ SendGrid initialized successfully
✅ Server running on port 5000
✅ SendGrid API Key: ✅ Loaded
✅ SendGrid From Email: noreply@storemx.com
```

### Test 3: Health Check Endpoint

```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "StoreMX Backend Server is running",
  "sendgridStatus": "✅ Loaded",
  "timestamp": "2026-02-23T10:30:00.000Z"
}
```

If you see `sendgridStatus: "❌ Missing"`, it means:
- .env file not created
- SENDGRID_API_KEY not set
- API key value is empty

### Test 4: Send Test Email

```bash
curl -X POST http://localhost:5000/api/email/send-order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "trackingId": "STM12345ABC",
    "customerName": "Test User",
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
  "message": "Email sent successfully to: your-email@gmail.com",
  "trackingId": "STM12345ABC"
}
```

**Check your email:** You should receive the email within 10 seconds.

---

## Part 6: Verify in SendGrid Dashboard

### Check Email Status

1. **Login to SendGrid**
   ```
   https://app.sendgrid.com/
   ```

2. **Go to Email Activity**
   ```
   Mail Send → Email Activity
   ```

3. **Search for your email**
   - Look for recipient email address
   - Status should show: `Delivered` ✅
   - Click for detailed logs

### Monitor API Usage

1. **Dashboard → Overview**
   - Check "Requests" count (each email = 1 request)
   - Check "Bounces" (should be 0)
   - Check "Drops" (should be 0)

2. **API Statistics**
   - Settings → API Statistics
   - View requests over time

---

## Part 7: Troubleshooting Initialization

### Issue: "SENDGRID_API_KEY is not defined"

```bash
# Check .env file exists
ls -la server/.env

# Check content
cat server/.env

# Verify API key is not empty
grep SENDGRID_API_KEY server/.env
```

**Solution:**
```bash
# Create/recreate .env
echo "SENDGRID_API_KEY=SG.your_key_here" > server/.env
echo "SENDGRID_FROM_EMAIL=noreply@storemx.com" >> server/.env
echo "PORT=5000" >> server/.env
echo "FRONTEND_URL=http://localhost:5173" >> server/.env
```

### Issue: "Cannot find module '@sendgrid/mail'"

```bash
# Install SendGrid package
cd server
npm install @sendgrid/mail
```

### Issue: "Invalid API key"

```bash
# Check API key format
# Must start with: SG.
# Should be ~86 characters

# If still invalid:
# 1. Go to https://app.sendgrid.com/settings/api_keys
# 2. Delete the old key
# 3. Create new key
# 4. Copy and paste to .env (no spaces!)
```

### Issue: "Email not sending - 401 Unauthorized"

```
API key is missing or incorrect

Solution:
1. Verify .env file has SENDGRID_API_KEY
2. Check API key starts with "SG."
3. Make sure no spaces or typos
4. Restart server: npm start
```

### Issue: "Email not sending - 403 Forbidden"

```
API key doesn't have permission to send email

Solution:
1. Delete old API key
2. Create new key with "Full Access" or "Mail Send" permission
3. Update server/.env
4. Restart server
```

---

## Part 8: Production Initialization

### For Deployment (Railway, Heroku, Vercel)

Instead of .env file, use platform's environment variables:

**Railway:**
```bash
# In Railway dashboard:
Variables → Add Variable
Name: SENDGRID_API_KEY
Value: SG.xxxxx...

Name: SENDGRID_FROM_EMAIL
Value: noreply@storemx.com

Name: FRONTEND_URL
Value: https://your-domain.com
```

**Heroku:**
```bash
heroku config:set SENDGRID_API_KEY=SG.xxxxx...
heroku config:set SENDGRID_FROM_EMAIL=noreply@storemx.com
heroku config:set FRONTEND_URL=https://your-domain.com
```

**Vercel (if backend on Vercel):**
```bash
# In .env.local (local testing)
SENDGRID_API_KEY=SG.xxxxx...

# In Vercel dashboard:
Settings → Environment Variables
Add variables with same names
```

---

## Part 9: Security Best Practices

### ✅ DO:

- ✅ Keep API key in .env (not in code)
- ✅ Add .env to .gitignore
- ✅ Use restricted API key if possible (Mail Send only)
- ✅ Regularly rotate API keys
- ✅ Monitor SendGrid dashboard for suspicious activity
- ✅ Use verified sender domain for production

### ❌ DON'T:

- ❌ Commit .env to Git
- ❌ Share API key in emails/Slack
- ❌ Use same key across environments (dev, staging, prod)
- ❌ Paste API key in code comments
- ❌ Leave API key visible in browser console
- ❌ Use full access API key unless necessary

---

## Complete Initialization Checklist

- [ ] SendGrid account created
- [ ] Sender email verified in SendGrid
- [ ] API key generated
- [ ] API key copied to clipboard
- [ ] .env file created in server/
- [ ] SENDGRID_API_KEY pasted in .env
- [ ] SENDGRID_FROM_EMAIL set in .env
- [ ] Dependencies installed: `npm install`
- [ ] emailService.js initializes sgMail.setApiKey()
- [ ] Server starts successfully
- [ ] `npm start` shows "✅ SendGrid initialized"
- [ ] Health check endpoint works
- [ ] Test email sends successfully
- [ ] Email received in inbox
- [ ] Email appears in SendGrid dashboard
- [ ] .env added to .gitignore
- [ ] No console errors

---

## Next Steps

1. **Frontend Integration**
   - Update Checkout.tsx to call backend API
   - Reference: `CHECKOUT_EXAMPLE.tsx`

2. **Customize Email**
   - Edit `server/emailService.js`
   - Change colors, logos, content

3. **Add More Email Types**
   - Order shipped
   - Order delivered
   - Account confirmation

4. **Monitor & Scale**
   - Check SendGrid dashboard daily
   - Upgrade plan if needed
   - Set up alerts

---

## Support Resources

| Resource | Link |
|----------|------|
| SendGrid Docs | https://docs.sendgrid.com |
| API Reference | https://docs.sendgrid.com/api-reference |
| Troubleshooting | https://docs.sendgrid.com/for-developers/sending-email/troubleshooting |
| Dashboard | https://app.sendgrid.com |
| Community | https://support.sendgrid.com |

---

**Ready to initialize?** Follow the steps above and you'll have SendGrid ready in 10 minutes! 🚀
