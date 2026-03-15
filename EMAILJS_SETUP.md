# EmailJS Integration Guide

EmailJS is a service that allows you to send emails directly from the frontend (or backend) without managing a backend email server. It's secure, easy to use, and free for up to 200 emails/month.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up** and create a free account
3. Verify your email

## Step 2: Add Email Service

### Option A: Gmail (Recommended)
1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Name it `Gmail` or any name you prefer
5. Log in with your Gmail account
6. EmailJS will ask for permission - click **Allow**
7. Copy your **Service ID** (e.g., `service_xxxxxxx`)

### Option B: SendGrid
1. Go to **Email Services** → **Add New Service**
2. Select **SendGrid**
3. Enter your SendGrid API Key
4. Copy your **Service ID**

### Option C: Custom SMTP
1. Go to **Email Services** → **Add New Service**
2. Select **SMTP** and enter your email server details

## Step 3: Create Email Template

1. In the EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Name it `order_confirmation` or similar
4. Copy the **Template ID** (e.g., `template_xxxxxxx`)

### Example Template Content:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; }
        .details { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation 🎉</h1>
        </div>
        
        <p>Hi {{customer_name}},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        
        <div class="details">
            <h3>Order Details</h3>
            <p><strong>Tracking ID:</strong> {{tracking_id}}</p>
            <p><strong>Order Date:</strong> {{order_date}}</p>
            <p><strong>Total Amount:</strong> ₹{{total_amount}}</p>
            <p><strong>Items:</strong> {{item_count}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>
        </div>
        
        <p>Items: {{order_items}}</p>
        
        <p>You can track your order using your Tracking ID.</p>
        <p>Thank you for shopping with us!</p>
    </div>
</body>
</html>
```

**Important Template Variables:**
- `{{to_email}}` - Recipient email
- `{{customer_name}}` - Customer name
- `{{tracking_id}}` - Order tracking ID
- `{{order_date}}` - Order date
- `{{total_amount}}` - Total amount
- `{{item_count}}` - Number of items
- `{{estimated_delivery}}` - Estimated delivery date
- `{{order_items}}` - List of items

## Step 4: Get Your Credentials

1. Go to **Account** → **API**
2. Copy your **Public Key** (NOT the Private Key)
3. You now have:
   - Service ID
   - Template ID
   - Public Key

## Step 5: Configure Your Application

1. Create a `.env.local` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

2. Or update `.env` if you already have it

## Step 6: Use in Your Component

### Example in Checkout.tsx:

```typescript
import { useEmailJS } from '@/hooks/useEmailJS';

export default function Checkout() {
  const { sendOrderEmail, isLoading } = useEmailJS();

  const handleCheckout = async () => {
    // ... your checkout logic
    
    const result = await sendOrderEmail({
      to_email: userEmail,
      customer_name: customerName,
      tracking_id: trackingId,
      order_date: new Date().toLocaleDateString(),
      total_amount: totalPrice.toString(),
      item_count: cartItems.length,
      estimated_delivery: getEstimatedDeliveryDate(),
      order_items: cartItems.map(item => `${item.name} x${item.quantity}`).join(', ')
    });

    if (result.success) {
      console.log('✅ Confirmation email sent!');
    }
  };

  return (
    <button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Sending email...' : 'Complete Order'}
    </button>
  );
}
```

## Step 7: Test Your Setup

1. Start your development server: `npm run dev`
2. Fill out the checkout form with a test email
3. Complete the order
4. Check your inbox for the confirmation email
5. Check the EmailJS dashboard **Activity Log** to see email status

## Troubleshooting

### Email not sending?
- ✅ Verify Service ID is correct and enabled
- ✅ Check Template ID matches in EmailJS dashboard
- ✅ Make sure Public Key is copied (not Private Key)
- ✅ Check browser console for error messages
- ✅ Go to EmailJS Activity Log to see failed emails

### "Configuration missing" error?
- ✅ Your environment variables in `.env.local` couldn't be loaded
- ✅ Make sure you restart `npm run dev` after updating .env.local
- ✅ Check that variable names match exactly: `VITE_` prefix required

### Rate limiting issues?
- EmailJS free tier: 200 emails/month
- Pro tier: Unlimited emails
- Upgrade at: https://www.emailjs.com/pricing

## Useful Links

- 📚 [EmailJS Documentation](https://www.emailjs.com/docs/)
- 🔗 [EmailJS Dashboard](https://dashboard.emailjs.com/)
- 📧 [Email Template Guide](https://www.emailjs.com/docs/user-guide/email-templates/)
- 🐛 [Troubleshooting Guide](https://www.emailjs.com/docs/introduction/troubleshooting/)

## Security Notes

- ⚠️ Never commit `.env.local` to git (already in .gitignore)
- ✅ Public Key is safe to use in frontend code
- ✅ EmailJS handles all CORS issues automatically
- ✅ Your email server credentials are stored securely on EmailJS servers

Done! Your EmailJS integration is complete. 🚀
