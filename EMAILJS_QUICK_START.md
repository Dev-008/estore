# EmailJS Quick Start (5 Minutes)

## Why EmailJS?
✅ Send emails directly from frontend  
✅ No backend email server needed  
✅ 200 emails/month free  
✅ Already integrated in your code!

---

## 🚀 Quick Setup

### 1. Sign Up (1 minute)
```
Go to: https://www.emailjs.com/
Click: Sign Up → Create Account
Check your email → Verify account
```

### 2. Add Gmail (1 minute)
```
In EmailJS Dashboard:
1. Click "Email Services" (left sidebar)
2. Click "Add New Service"
3. Choose "Gmail"
4. Click "Connect with Google"
5. Allow EmailJS to send emails via Gmail
6. Note your Service ID (copy it)
```

### 3. Create Template (1 minute)
```
In EmailJS Dashboard:
1. Click "Email Templates" (left sidebar)
2. Click "Create New Template"
3. Name: order_confirmation
4. Subject: Order Confirmation - {{tracking_id}}
5. Body: Use the template below
6. Note your Template ID (copy it)
```

### Template Code (Copy & Paste):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial; line-height: 1.6; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; }
        .details { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto;">
        <div class="header">
            <h1>Order Confirmation 🎉</h1>
        </div>
        
        <p>Hi {{customer_name}},</p>
        <p>Thank you for your order!</p>
        
        <div class="details">
            <h3>Order Details</h3>
            <p><strong>Tracking ID:</strong> {{tracking_id}}</p>
            <p><strong>Order Date:</strong> {{order_date}}</p>
            <p><strong>Total Amount:</strong> ₹{{total_amount}}</p>
            <p><strong>Items:</strong> {{item_count}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>
        </div>
        
        <p>Items: {{order_items}}</p>
        <p>Thank you for shopping with us!</p>
    </div>
</body>
</html>
```

### 4. Get Public Key (1 minute)
```
In EmailJS Dashboard:
1. Click "Account" (top right)
2. Click "API"
3. Copy "Public Key" (NOT Private Key)
```

### 5. Add to .env.local (1 minute)
```
Create file: .env.local

VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Get these values from:**
- Service ID: Email Services page
- Template ID: Email Templates page (right side)
- Public Key: Account → API


### 6. Test It! (1 minute)
```bash
# Restart dev server
npm run dev

# Go to Checkout page
# Add items to cart
# Complete order with a test email
# Check your inbox!
```

---

## ✅ Success Indicators

✅ See "Confirmation email sent" toast message  
✅ Email arrives in your inbox (within 1 minute)  
✅ No errors in browser console  

---

## 🐛 If It Doesn't Work

### Issue: "Configuration missing" error
**Fix:** 
- Make sure .env.local file exists in project root
- Restart `npm run dev` after creating .env.local
- Check exact variable names: `VITE_` prefix required

### Issue: Email not arriving
**Fix:**
- Check spam folder
- Verify template ID is correct
- Go to EmailJS dashboard → Activity Log to see status
- Check if service is "Active" (Email Services page)

### Issue: Wrong sender email
**Fix:**
- EmailJS will send FROM the Gmail you verified
- Not from the provided email in form
- This is normal and correct

---

## 📚 Full Documentation

For detailed help, see: `EMAILJS_SETUP.md` in project root

---

**Your EmailJS integration is ready!** 🎉

The Checkout page is already updated to use EmailJS.
