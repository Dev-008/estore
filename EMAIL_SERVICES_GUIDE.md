# 📧 Email Service Setup Guide

## Current Implementation
Your project currently uses **EmailJS** on the frontend and can also use **SendGrid** on the backend. Here are all the alternatives:

---

## 🎯 BACKEND ONLY - NO EXTERNAL APIs

### 🟢 Option 1: **Store Emails Locally (File-Based)**

**Best for:** Development, testing, small projects without actual email sending

#### Features:
- ✅ **No API keys needed**
- ✅ **No external services**
- ✅ **No cost**
- ✅ **Store emails locally in JSON file**
- ✅ **See all emails in `emails.json`**

#### Setup:

1. Use the provided `emailService-local.js`:
```javascript
// In server/emailRoutes.js, change:
import { sendOrderConfirmation } from '../emailService-local.js';
```

2. Add to `.env` (optional):
```env
STORAGE_PATH=./emails.json
```

3. Restart server - emails will be stored in `emails.json`

#### What happens:
- When customer places order → email data saved to `emails.json`
- You can view all customer emails and order details locally
- No actual sending occurs
- Perfect for testing before switching to real email service

#### Example output in `emails.json`:
```json
[
  {
    "id": "1234567890",
    "to": "customer@example.com",
    "subject": "Order Confirmation - StoreMX | Tracking: xyz123",
    "html": "...",
    "orderDetails": {
      "trackingId": "xyz123",
      "customerName": "John Doe",
      "amount": 4999,
      "date": "2026-03-13T10:30:00Z"
    },
    "timestamp": "2026-03-13T10:30:00Z",
    "status": "sent"
  }
]
```

---

### 🟢 Option 2: **Self-Hosted Mail Server (Your Own Server)**

**Best for:** Full control, privacy, enterprise, no external dependencies

#### Features:
- ✅ **No external APIs**
- ✅ **Complete control**
- ✅ **Send real emails from your own server**
- ✅ **Privacy focused**
- ❌ **Requires mail server setup**
- ❌ **More technical setup**

#### Setup:

1. Install Nodemailer on backend:
```bash
cd server
npm install nodemailer
```

2. Use provided `emailService-selfhosted.js`:
```javascript
// In server/emailRoutes.js, change:
import { sendOrderConfirmation } from '../emailService-selfhosted.js';
```

3. Configure your mail server in `.env`:
```env
# Option A: Your own mail server
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-mail-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false

# Option B: With self-signed certificate
SMTP_REJECT_UNAUTHORIZED=false
```

4. Start server - emails send via your mail server

#### Popular self-hosted solutions:
- **Postfix** - Open source, widely used
- **Sendmail** - Traditional Unix mail server
- **Zimbra** - Complete mail solution
- **Mail-in-a-Box** - Easy setup on Ubuntu
- **iRedMail** - Full-featured mail platform

#### Cost: **FREE** (only server hosting costs)

---

## 🥇 Option 3: **Backend API + Nodemailer (FREE)**

### Why Choose This?
- ✅ **Free** (no monthly fees)
- ✅ **Works with any SMTP provider** (Gmail, Outlook, custom server)
- ✅ **Secure** (no API keys exposed on frontend)
- ✅ **Already have backend server** (you already built it!)
- ✅ **Better control** over email delivery

### Setup with Gmail:

#### Step 1: Enable Gmail App Password

1. Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication** (if not already enabled)
3. Go to **App passwords** section
4. Select **Mail** and **Windows Computer**
5. Copy the generated **16-character password**

#### Step 2: Install Nodemailer

```bash
cd server
npm install nodemailer
```

#### Step 3: Update .env file

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
# OR for custom SMTP:
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
```

#### Step 4: Use emailService-nodemailer.js

Replace the import in `emailRoutes.js`:
```javascript
import { sendOrderConfirmation } from '../emailService-nodemailer.js';
```

---

## 🥈 Option 2: **Keep SendGrid (Current Backend Setup)**

### Why Choose This?
- ✅ **Professional & Reliable**
- ✅ **Better analytics** (open rates, click rates)
- ✅ **Higher deliverability**
- ✅ **Scalable** (millions of emails)
- ❌ **Paid** ($19.95/month for Pro)
- ✅ **Free tier**: 100 emails/day

### Current Status
Your backend is already configured for SendGrid!

### Verify Setup:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@storemx.com
```

**No changes needed** - your current emailService.js already uses SendGrid!

---

## 🥉 Option 3: **Mailgun (Great Balance)**

### Why Choose This?
- ✅ **Free**: 1,250 emails/month
- ✅ **Excellent** analytics
- ✅ **WebHook support** (bounce notifications)
- ❌ **Requires credit card** (though free tier available)

### Setup:

1. Sign up at [https://www.mailgun.com](https://www.mailgun.com)
2. Install SDK:

```bash
npm install mailgun.js
```

3. Create `emailService-mailgun.js`:

```javascript
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
const messagesClient = client.messages;

const mailgunDomain = process.env.MAILGUN_DOMAIN;

export const sendOrderConfirmation = async (
  email,
  trackingId,
  customerName,
  orderDetails
) => {
  try {
    const response = await messagesClient.create(mailgunDomain, {
      from: `StoreMX <noreply@${mailgunDomain}>`,
      to: [email],
      subject: `Order Confirmation - StoreMX | Tracking: ${trackingId}`,
      html: generateOrderEmailTemplate(trackingId, customerName, orderDetails),
    });

    console.log('✅ Email sent successfully to:', email);
    return {
      success: true,
      messageId: response.id,
    };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Same template function as others...
const generateOrderEmailTemplate = (trackingId, customerName, orderDetails) => {
  // ... email template HTML
};
```

### .env:
```env
MAILGUN_API_KEY=key-xxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
```

---

## ⚡ Option 4: **AWS SES (Cloud-Native)**

### Why Choose This?
- ✅ **Very cheap** ($0.10 per 1000 emails)
- ✅ **Scalable** (millions of emails)
- ✅ **Integrated** with AWS ecosystem
- ❌ **Complex setup**
- ❌ **Requires AWS account**

### Quick Setup:

1. Create AWS Account and go to SES service
2. Install AWS SDK:

```bash
npm install @aws-sdk/client-ses
```

3. Create `emailService-aws.js`:

```javascript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION });

export const sendOrderConfirmation = async (
  email,
  trackingId,
  customerName,
  orderDetails
) => {
  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: `Order Confirmation - StoreMX | Tracking: ${trackingId}` },
      Body: { Html: { Data: generateOrderEmailTemplate(trackingId, customerName, orderDetails) } },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log('✅ Email sent successfully to:', email);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
```

---

## ⚡ Option 5: **Resend (Modern Email API)**

### Why Choose This?
- ✅ **Modern & Simple** (built for developers)
- ✅ **Generous Free Tier** (100 emails/day)
- ✅ **Beautiful templates** out of the box
- ✅ **Built-in React support** for email templates
- ✅ **Great docs & support**
- ✅ **Cheap Pro Plan** ($20/mo for unlimited)
- ❌ **Newer service** (less established than SendGrid)
- ❌ **Requires sending from their domain initially**

### Quick Setup:

1. Sign up at [https://resend.com](https://resend.com)
2. Get API key from dashboard
3. Install Resend:

```bash
npm install resend
```

4. Add to `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

5. Use provided `emailService-resend.js`:

```javascript
// In server/emailRoutes.js, change:
import { sendOrderConfirmation } from '../emailService-resend.js';
```

### Email Template Support:

Resend also supports React components for emails:

```bash
npm install @react-email/components
```

Then create email templates using React:

```javascript
import { Body, Container, Head, Hr, Html, Text } from "@react-email/components";

export const OrderConfirmationEmail = ({ trackingId, customerName }) => (
  <Html>
    <Head />
    <Body>
      <Container>
        <Text>Order Confirmed for {customerName}!</Text>
        <Text>Tracking ID: {trackingId}</Text>
      </Container>
    </Body>
  </Html>
);
```

### Custom Domain (Production):

After initial setup, verify your own domain:
1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., noreply@storemx.com)
3. Follow DNS verification steps
4. Update `from:` field in emailService-resend.js

---

## 📊 **Comparison Table**

| Feature | Local File | Self-Hosted | Nodemailer | SendGrid | Mailgun | Resend |
|---------|-----------|-----------|-----------|----------|---------|-----------|
| **External API** | ❌ No | ❌ No | ✅ Need SMTP | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cost** | **Free** | **Free** | Free | $19.95/mo | Free (1250/mo) | Free (100/day) |
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Real Email Send** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Analytics** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Setup Time** | 2 min | 15 min | 5 min | 10 min | 10 min | 5 min |
| **Best For** | Dev/Test | Full Control | Simple | Pro | Balanced | Modern |
| **Recommended** | ✅ START | ✅ CONTROL | ✅ SIMPLE | ✅ PRO | ✅ GOOD | ✅ BEST |

---

## 🚀 **How to Switch**

### To Switch Backend Email Service:

1. **For Local File Storage (No API)**:
   ```javascript
   // In server/emailRoutes.js, change:
   import { sendOrderConfirmation } from '../emailService-local.js';
   ```

2. **For Self-Hosted Server (No API)**:
   ```javascript
   // In server/emailRoutes.js, change:
   import { sendOrderConfirmation } from '../emailService-selfhosted.js';
   ```

3. **For Nodemailer + Gmail**:
   ```javascript
   // In server/emailRoutes.js, change:
   import { sendOrderConfirmation } from '../emailService-nodemailer.js';
   ```

4. **For Mailgun**:
   ```javascript
   // In server/emailRoutes.js, change:
   import { sendOrderConfirmation } from '../emailService-mailgun.js';
   ```

5. **For AWS SES**:
   ```javascript
   // In server/emailRoutes.js, change:
   import { sendOrderConfirmation } from '../emailService-aws.js';
   ```

6. **For Resend**:
   ```javascript
   // In server/emailRoutes.js, change:
   import { sendOrderConfirmation } from '../emailService-resend.js';
   ```

### Remove EmailJS (Frontend):

If you switch to backend-only:
```bash
npm uninstall @emailjs/browser
```

Then remove from Checkout.tsx:
- Remove `import { sendOrderConfirmationEmail } from "@/lib/emailjs";`
- Remove the email sending call

---

## ✅ **My Recommendation**

For your project, I recommend:

1. **[BEST - NO API] Use Local File Storage** (emailService-local.js) - Development & testing
2. **[BEST - NO API] Use Self-Hosted Server** (emailService-selfhosted.js) - Full control, privacy
3. **[FREE] Use Resend** (Modern, easiest setup, free tier 100/day)
4. **[FREE] Use Nodemailer + Gmail** (Simple, works right now)
5. **[PRODUCTION] Keep SendGrid** if you want professional analytics
6. **[SCALABLE] Use Mailgun** for free tier with analytics

---

## 🔧 **Implementation Steps**

### To Use Backend Email Instead of EmailJS:

1. Install Nodemailer:
   ```bash
   cd server && npm install nodemailer
   ```

2. Use the provided `emailService-nodemailer.js`

3. Add Gmail credentials to `.env`

4. Update frontend to call backend API:
   ```typescript
   // In Checkout.tsx, replace EmailJS call with:
   const sendOrderConfirmationByBackend = async (email, name, trackingId) => {
     try {
       const response = await fetch('http://localhost:5000/api/email/send-order-confirmation', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           email,
           trackingId,
           customerName: name,
           orderDetails: { /* order details */ }
         })
       });
       return response.json();
     } catch (error) {
       console.error('Failed to send email:', error);
     }
   };
   ```

---

## 📞 **Need Help?**

- **Resend Docs**: https://resend.com/docs
- **Nodemailer Docs**: https://nodemailer.com
- **SendGrid Docs**: https://docs.sendgrid.com
- **Mailgun Docs**: https://documentation.mailgun.com
- **AWS SES Docs**: https://docs.aws.amazon.com/ses

