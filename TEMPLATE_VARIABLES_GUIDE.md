# 📧 EmailJS Template Variables - Complete Guide

## All Template Variables Used

### 1. **{{customer_name}}**
- **What it is:** Customer's full name
- **Where it appears:** Greeting line "Hello {{customer_name}},"
- **Example value:** Dev Dharsan
- **From your code:** `customer_name` parameter

### 2. **{{tracking_id}}**
- **What it is:** Unique order tracking ID
- **Where it appears:** Large prominent display in tracking section
- **Example value:** STM6659090C007
- **From your code:** `tracking_id` parameter
- **Format:** Usually "ZS" + timestamp + random string

### 3. **{{order_date}}**
- **What it is:** Date when order was placed
- **Where it appears:** Status section "Order placed on {{order_date}}"
- **Example value:** 24 February 2026
- **From your code:** `order_date` parameter (formatted)
- **Format:** Localized date string (en-IN format)

### 4. **{{total_amount}}**
- **What it is:** Total order value
- **Where it appears:** Multiple places:
  - Order Summary table (Subtotal and Total)
  - Summary section
- **Example value:** 4,999
- **From your code:** `total_amount` parameter
- **Format:** Localized currency string (₹)

### 5. **{{item_count}}**
- **What it is:** Number of items ordered
- **Where it appears:** Order summary "{{item_count}} items"
- **Example value:** 3
- **From your code:** `item_count` parameter
- **Format:** Integer value

### 6. **{{estimated_delivery}}**
- **What it is:** Estimated delivery date
- **Where it appears:** Multiple places:
  - Order summary section
  - Next steps section at bottom
- **Example value:** 1 March 2026
- **From your code:** `estimated_delivery` parameter
- **Format:** Localized date string (en-IN format)

### 7. **{{order_items}}**
- **What it is:** List of items ordered
- **Where it appears:** Items Ordered section
- **Example value:** Laptop x1, Mouse x2
- **From your code:** `order_items` parameter
- **Format:** Comma-separated list with quantities

---

## 📊 How Data Flows

```
Frontend (Checkout.tsx)
    ↓
sendOrderConfirmationEmail() in emailjs.ts
    ↓
Creates object with all template variables:
{
  to_email: "customer@example.com",
  customer_name: "Dev Dharsan",
  tracking_id: "ZS123456ABC",
  order_date: "24 February 2026",
  total_amount: "4,999",
  item_count: 3,
  estimated_delivery: "1 March 2026",
  order_items: "Laptop x1, Mouse x2"
}
    ↓
Sends to EmailJS API
    ↓
EmailJS replaces {{variable}} with actual values
    ↓
Email delivered to customer inbox
```

---

## 🔄 Current Implementation in Checkout.tsx

```typescript
await sendOrderConfirmationEmail({
  to_email: email,                                    // Customer email
  customer_name: customerName,                        // From form
  tracking_id: trackingId,                            // Generated ID
  order_date: new Date().toLocaleDateString("en-IN"), // Today's date
  total_amount: Math.round(total).toLocaleString("en-IN"), // Total price
  item_count: items.length,                           // Number of items
  estimated_delivery: estimatedDelivery.toLocaleDateString("en-IN"), // +5 days
  order_items: items
    .map((item) => `${item.product.name} x${item.quantity}`)
    .join(", "),                                      // Item list
});
```

---

## ✅ Test Data Examples

### Scenario 1: Simple Order
```
customer_name: Dev Dharsan
tracking_id: ZS042024ABC
order_date: 10 March 2026
total_amount: 2,499
item_count: 1
estimated_delivery: 15 March 2026
order_items: Wireless Mouse x1
```

### Scenario 2: Multiple Items
```
customer_name: Priya Sharma
tracking_id: STM6659090C007
order_date: 24 February 2026
total_amount: 12,999
item_count: 3
estimated_delivery: 1 March 2026
order_items: Laptop x1, USB Cable x2, Mouse Pad x1
```

### Scenario 3: Large Order
```
customer_name: Rajesh Kumar
tracking_id: ZS031026XYZ
order_date: 08 March 2026
total_amount: 45,999
item_count: 5
estimated_delivery: 13 March 2026
order_items: Gaming Keyboard x1, Monitor 27" x2, HDMI Cable x1, USB Hub x1
```

---

## 📝 Variable Formatting Rules

| Variable | Type | Format | Max Length |
|----------|------|--------|-----------|
| customer_name | String | Text | No limit |
| tracking_id | String | Alphanumeric | 15-20 chars |
| order_date | String | Localized Date | e.g., "24 February 2026" |
| total_amount | String | Formatted Currency | e.g., "₹4,999" |
| item_count | Number | Integer | 1-999 |
| estimated_delivery | String | Localized Date | e.g., "1 March 2026" |
| order_items | String | Comma-separated | No limit |

---

## 🧪 How to Test Template Variables

### In EmailJS Dashboard:
1. Go to your template
2. Click **"Test it"** button
3. Fill in all fields with test data (use examples above)
4. Click **"Send Test Email"**
5. Verify email arrives with correct data

### In Your App:
1. Fill out Checkout form
2. Add items to cart
3. Complete order
4. Check inbox for email
5. Verify all variables are populated correctly

---

## ⚠️ Common Issues

### Issue: Variable shows {{variable_name}} in email
**Cause:** Template ID doesn't match  
**Fix:** Verify VITE_EMAILJS_TEMPLATE_ID in .env.local

### Issue: Variable shows "undefined"
**Cause:** Variable not passed from Checkout.tsx  
**Fix:** Check sendOrderConfirmationEmail() call includes the variable

### Issue: Date format looks wrong
**Cause:** Locale settings differ  
**Fix:** Template uses "en-IN" locale (Indian format). Adjust as needed

### Issue: Currency shows ₹ but no amount
**Cause:** Currency formatting issue  
**Fix:** Ensure total_amount is formatted as string with commas

---

## 🔗 Reference Files

- **Template HTML:** `EMAILJS_TEMPLATE.html`
- **Template Setup:** `HOW_TO_ADD_TEMPLATE.md`
- **Integration Code:** `src/lib/emailjs.ts`
- **Usage in Component:** `src/pages/Checkout.tsx`

---

**All variables are properly configured and ready to send!** ✅
