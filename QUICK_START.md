# Quick Start Guide: Email Service Integration

## 🚀 Quick Setup (5 minutes)

### Step 1: Get SendGrid API Key

1. Visit https://sendgrid.com and sign up (FREE)
2. Go to **Settings → API Keys → Create API Key**
3. Copy the key

### Step 2: Set Up Backend

```bash
# Navigate to server folder
cd server

# Create .env file
echo SENDGRID_API_KEY=your_api_key_here > .env
echo SENDGRID_FROM_EMAIL=noreply@storemx.com >> .env
echo PORT=5000 >> .env

# Install dependencies
npm install

# Start server
npm start
```

You should see:
```
✅ Server running on http://localhost:5000
🔑 API Key configured: Yes
```

### Step 3: Update Frontend Environment

Create/update `.env` in your main project:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 4: Run Frontend

In a new terminal:

```bash
npm run dev
```

### Step 5: Test It!

1. Go to http://localhost:5173
2. Add products to cart
3. Go to checkout
4. Fill in form with **your real email**
5. Click "Place Order"
6. Check your email inbox (and spam folder)

---

## 📧 What You'll See

### In Browser:
- ✅ Success screen with tracking ID
- ✅ Confirmation message
- ✅ Order details

### In Email:
- ✅ Professional email template
- ✅ Tracking ID clearly displayed
- ✅ Order details
- ✅ Company branding

---

## 🔧 API Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Send Order Confirmation
```bash
curl -X POST http://localhost:5000/api/email/send-order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "trackingId": "STM123456ABC",
    "customerName": "John Doe",
    "orderDetails": {
      "totalAmount": "₹5,000",
      "itemCount": 3,
      "orderDate": "2026-02-23"
    }
  }'
```

---

## ✅ Troubleshooting

### "API key not found"
```bash
# Check .env file exists
ls -la server/.env

# Restart server after creating .env
npm start
```

### "CORS error"
- Make sure backend is running on http://localhost:5000
- Check REACT_APP_API_URL in .env

### "Email not received"
- Check spam/junk folder
- Verify email address is correct
- Check SendGrid dashboard for delivery status

### "Connection refused"
- Backend not running → run `npm start` in server folder
- Check port 5000 is not blocked

---

## 📝 File Structure

```
zenith-shopper-main/
├── server/
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   ├── emailService.js
│   └── routes/
│       └── emailRoutes.js
├── src/
│   ├── pages/
│   │   └── Checkout.tsx
│   └── ...
└── .env (frontend)
```

---

## 🚢 Deployment

### Deploy Backend (Choose One)

#### Option 1: Railway (Recommended)
1. Push code to GitHub
2. Visit https://railway.app
3. Connect GitHub repo
4. Add environment variables (SENDGRID_API_KEY)
5. Deploy! ✅

#### Option 2: Heroku
```bash
npm install -g heroku
heroku login
heroku create
git push heroku main
heroku config:set SENDGRID_API_KEY=your_key
```

#### Option 3: Render
1. Visit https://render.com
2. Connect GitHub repository
3. Create Web Service
4. Add environment variables
5. Deploy!

### Deploy Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

When prompted, set `REACT_APP_API_URL` to your deployed backend URL

---

## 📊 Monitoring

Check email sends in SendGrid dashboard:
- https://app.sendgrid.com/email_activity

---

## 🎓 Next Steps

1. ✅ Test locally
2. ✅ Customize email template
3. ✅ Deploy backend
4. ✅ Update frontend API URL
5. ✅ Test in production
6. ✅ Monitor email delivery

---

## 💡 Tips

- **Test with yourself first**: Use your own email
- **Check spam folder**: Some clients filter automated emails
- **Save tracking ID**: Customers need it to track orders
- **Monitor costs**: SendGrid free tier = 100/day, paid plans available

---

**Questions?** Check the full setup guide: `SETUP_EMAIL_SERVICE.md`
