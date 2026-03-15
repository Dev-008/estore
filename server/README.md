# StoreMX Backend - Email Service

Backend server for StoreMX email confirmations and order notifications.

## Features

✅ Order confirmation emails  
✅ Professional HTML templates  
✅ Tracking ID generation  
✅ SendGrid integration  
✅ CORS enabled for frontend  
✅ Error handling & validation  

## Prerequisites

- Node.js v14+
- SendGrid account (free at https://sendgrid.com)
- SendGrid API Key

## Installation

1. **Clone/Setup**
```bash
cd server
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add your SendGrid API key
```

3. **Start Server**
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Server will start on `http://localhost:5000`

## Environment Variables

```env
SENDGRID_API_KEY=your_sendgrid_api_key       # Required
SENDGRID_FROM_EMAIL=noreply@storemx.com      # Required
PORT=5000                                     # Optional
FRONTEND_URL=http://localhost:5173           # For CORS
NODE_ENV=development                         # development|production
```

## API Endpoints

### Health Check
```
GET /api/health
```
Response: `{ status: "OK", ... }`

### Send Order Confirmation
```
POST /api/email/send-order-confirmation
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "trackingId": "STM123456ABC",
  "customerName": "John Doe",
  "orderDetails": {
    "totalAmount": "₹5,000",
    "itemCount": 3,
    "orderDate": "2026-02-23"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully",
  "messageId": "sendgrid_message_id"
}
```

## Folder Structure

```
server/
├── index.js                    # Main server file
├── emailService.js             # Email sending logic
├── package.json
├── .env.example
└── routes/
    └── emailRoutes.js          # Email endpoints
```

## Email Template

The email includes:
- Professional branding (purple gradient header)
- Tracking ID prominently displayed
- Order details and amounts
- Next steps timeline
- Support contact information
- Responsive design for mobile/desktop

## Testing

### Local Test
```bash
curl -X POST http://localhost:5000/api/email/send-order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "trackingId": "STM123456ABC",
    "customerName": "Test User",
    "orderDetails": {
      "totalAmount": "₹5,000",
      "itemCount": 1,
      "orderDate": "2026-02-23"
    }
  }'
```

### Via Frontend
1. Start frontend: `npm run dev`
2. Add items to cart
3. Proceed to checkout
4. Enter your email
5. Place order
6. Check email (including spam folder)

## Deployment

### Railway
```bash
# Push to GitHub
git push

# Railway auto-deploys from GitHub
# Set environment variable in Railway dashboard
```

### Heroku
```bash
heroku create storemx-backend
heroku config:set SENDGRID_API_KEY=your_key
git push heroku main
```

### Render
1. Connect repository
2. Create Web Service
3. Add environment variables
4. Deploy

## Monitoring

Check email delivery:
1. https://app.sendgrid.com/email_activity
2. Filter by recipient email
3. View delivery status and details

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key invalid" | Check SENDGRID_API_KEY in .env |
| "Port already in use" | Change PORT in .env or kill process on 5000 |
| "CORS error" | Check FRONTEND_URL matches your frontend |
| "Email not received" | Check SendGrid limits, verify email address |
| "Module not found" | Run `npm install` |

## Performance

- **Email sending**: ~200-500ms
- **Validation**: ~10ms
- **Daily limit** (free): 100 emails/day on SendGrid

## Security

✅ Email validation  
✅ CORS restricted to frontend  
✅ Environment variables for secrets  
✅ Error handling without exposing details  

## Support

- SendGrid Documentation: https://docs.sendgrid.com
- This Project: Check SETUP_EMAIL_SERVICE.md

---

Made with ❤️ for StoreMX
