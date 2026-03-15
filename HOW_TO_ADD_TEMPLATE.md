# 📧 How to Add Template to EmailJS Dashboard

## Step-by-Step Guide

### Step 1: Open EmailJS Dashboard
1. Go to: https://dashboard.emailjs.com/
2. Login with your account
3. Click **"Email Templates"** in the left sidebar

### Step 2: Create New Template
1. Click **"Create New Template"** button
2. Enter Template Name: **order_confirmation**
3. Click **"Create"**

### Step 3: Configure Template Content

#### Subject Line:
```
Order Confirmation - StoreMX | Tracking: {{tracking_id}}
```

#### Email Body:
1. Look for the HTML/Content area
2. Copy the entire HTML from `EMAILJS_TEMPLATE.html` in this project
3. Paste it into the Email Body field
4. The template variables are already included:
   - `{{customer_name}}`
   - `{{tracking_id}}`
   - `{{order_date}}`
   - `{{total_amount}}`
   - `{{item_count}}`
   - `{{estimated_delivery}}`
   - `{{order_items}}`

### Step 4: Save Template
1. Click **"Save"** button (top right)
2. Copy your **Template ID** (shown in the dashboard, format: `template_xxxxxxx`)
3. Save it safely

### Step 5: Add to .env.local
```env
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
```

> Replace `template_xxxxxxx` with your actual Template ID

---

## 📋 Template Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{{customer_name}}` | Customer's full name | Dev Dharsan |
| `{{tracking_id}}` | Order tracking ID | STM6659090C007 |
| `{{order_date}}` | Date order was placed | 24 February 2026 |
| `{{total_amount}}` | Total order value | 4,999 |
| `{{item_count}}` | Number of items | 3 |
| `{{estimated_delivery}}` | Estimated delivery date | 1 March 2026 |
| `{{order_items}}` | List of ordered items | Laptop x1, Mouse x2 |

---

## ✅ What's Included in Template

✅ Professional StoreMX branding  
✅ Order status with processing badge  
✅ Prominent tracking ID display  
✅ Complete order summary table  
✅ Item list section  
✅ Estimated delivery info  
✅ Next steps guidance  
✅ Mobile-responsive design  
✅ Professional styling with gradients  
✅ Contact information  

---

## 🎨 Template Features

- **Beautiful Header** with StoreMX branding
- **Order Status Section** showing when order was placed
- **Tracking ID Highlight** with visual emphasis
- **Order Summary Table** with all details
- **Items Section** listing what was ordered
- **Delivery Information** with next steps
- **Professional Footer** with support links
- **Mobile Optimized** - looks great on all devices
- **Dark/Light Mode Support** - adapts to email client

---

## 🧪 Test Your Template

### After Adding to EmailJS:

1. Go to **Dashboard** → **Email Templates**
2. Click your **order_confirmation** template
3. Scroll down and click **"Test it"** button
4. Fill in test data:
   - Customer Name: Dev Dharsan
   - Tracking ID: STM6659090C007
   - Order Date: 24 February 2026
   - Total Amount: 4,999
   - Item Count: 3
   - Estimated Delivery: 1 March 2026
   - Order Items: Laptop x1, Mouse x2

5. Click **"Send Test Email"**
6. Check your inbox

---

## ✨ Email Content Structure

```
┌─────────────────────────────────────┐
│  📦 StoreMX                         │
│  Order Confirmed!                   │
│  Thank you for your purchase        │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ Hello [customer_name],              │
│ We're thrilled to confirm...        │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ 📊 ORDER STATUS                     │
│ Order placed on [order_date]        │
│ ⚙️ Processing                       │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ 📍 YOUR TRACKING ID                 │
│ [tracking_id]                       │
│ Keep this ID handy...               │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ 📋 ORDER SUMMARY                    │
│ Subtotal: ₹[total_amount]           │
│ Items: [item_count] items           │
│ Delivery: [estimated_delivery]      │
│ Total: ₹[total_amount]              │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ 📦 ITEMS ORDERED                    │
│ [order_items]                       │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ ✅ NEXT STEPS & FOOTER              │
│ Support & Links                     │
└─────────────────────────────────────┘
```

---

## 🔗 Links

- **EmailJS Dashboard:** https://dashboard.emailjs.com/
- **Your Project Template File:** `EMAILJS_TEMPLATE.html`
- **Integration Setup:** `EMAILJS_SETUP.md`

---

**Template is ready to use!** 🚀
