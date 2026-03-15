# Email Integration - Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ Backend Issues

### Issue: "Cannot find module '@sendgrid/mail'"

**Error Message:**
```
Error: Cannot find module '@sendgrid/mail'
```

**Solutions:**

1. **Install dependencies:**
```bash
cd server
npm install
npm install @sendgrid/mail
```

2. **Verify package.json:**
```bash
cat package.json | grep sendgrid
```

3. **Clear node_modules and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "SENDGRID_API_KEY is undefined"

**Error Message:**
```
Error: Failed to send email: API key is empty
```

**Solutions:**

1. **Check .env file exists:**
```bash
ls -la server/.env
```

2. **Verify content:**
```bash
cat server/.env
```

3. **Create .env if missing:**
```bash
echo "SENDGRID_API_KEY=your_key_here" > server/.env
echo "SENDGRID_FROM_EMAIL=noreply@storemx.com" >> server/.env
```

4. **Restart server:**
```bash
# Stop: Ctrl+C
# Start: npm start
```

❓ **Forgot your API key?** Get it from https://app.sendgrid.com/settings/api_keys

---

### Issue: "Port 5000 already in use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find process using port:**
```bash
lsof -i :5000
# or on Windows:
netstat -ano | findstr :5000
```

2. **Kill the process:**
```bash
# macOS/Linux:
kill -9 <PID>

# Windows PowerShell:
taskkill /PID <PID> /F
```

3. **Or use a different port:**
```bash
PORT=5001 npm start
```

---

### Issue: "TypeError: Cannot read property 'send' of undefined"

**Error Message:**
```
TypeError: Cannot read property 'send' of undefined at emailService
```

**Solutions:**

1. **Check API key again:**
```bash
echo $SENDGRID_API_KEY
# If empty, .env not loaded properly
```

2. **Reinstall SendGrid:**
```bash
npm uninstall @sendgrid/mail
npm install @sendgrid/mail
```

3. **Try alternative approach:**
```javascript
import sgMail from '@sendgrid/mail';
if (!sgMail) console.error('SendGrid not initialized');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

---

## ❌ Frontend Issues

### Issue: "Failed to send confirmation email"

**Error Message:**
```
❌ Failed to send confirmation email
```

**Solutions:**

1. **Check backend is running:**
```bash
curl http://localhost:5000/api/health
```

2. **Verify API URL:**
```
Check .env: REACT_APP_API_URL=http://localhost:5000
```

3. **Check browser console:**
```
F12 → Console → Look for error messages
```

4. **Check CORS error in console:**
```
If CORS error, ensure .env has correct frontend URL
```

---

### Issue: "CORS error - No 'Access-Control-Allow-Origin'"

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/...' 
has been blocked by CORS policy
```

**Solutions:**

1. **Verify CORS middleware in backend:**
```javascript
// server/index.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

2. **Check frontend is running on correct port:**
```bash
npm run dev
# Should show: Local: http://localhost:5173
```

3. **Match CORS origin to frontend URL:**
```javascript
// If frontend on port 3000:
origin: 'http://localhost:3000'
```

---

### Issue: ".env not loaded in frontend"

**Error Message:**
```
REACT_APP_API_URL is undefined
```

**Solutions:**

1. **Create .env in project root:**
```bash
# In main directory (not server directory)
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

2. **Restart dev server:**
```bash
npm run dev
```

3. **Check .env file:**
```bash
cat .env
```

4. **Verify environment variable naming:**
```
Must start with REACT_APP_ for Vite to load it
```

---

## ❌ EmailService Issues

### Issue: "Invalid email address"

**Error Message:**
```
{
  "success": false,
  "message": "Invalid email format"
}
```

**Solutions:**

1. **Check email format:**
- Valid: `user@example.com`
- Invalid: `user@`, `@example.com`, `user example@test.com`

2. **Verify input validation:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test(email));
```

---

### Issue: "Email not sent - Quota exceeded"

**Error Message:**
```
Unable to send email; reason: too many requests
```

**Solutions:**

1. **Check SendGrid quota:**
```
https://app.sendgrid.com/dashboard (Free: 100/day)
```

2. **Upgrade account:**
```
Visit https://sendgrid.com/pricing
```

3. **Wait**: Free tier resets daily

---

### Issue: "Missing required fields"

**Error Message:**
```
{
  "success": false,
  "message": "Missing required fields: email, trackingId, ..."
}
```

**Solutions:**

1. **Check request body:**
```javascript
console.log("Request body:", {
  email,
  trackingId,
  customerName,
  orderDetails
});
```

2. **Verify all fields sent:**
```javascript
if (!email || !trackingId || !customerName) {
  // Add missing field
}
```

---

## ❌ Email Delivery Issues

### Issue: "Email not received in inbox"

**Checklist:**

- ✓ Check spam/junk folder
- ✓ Check garbage/trash
- ✓ Verify email address is correct
- ✓ Wait 5-10 seconds (email is not instant)
- ✓ Check SendGrid dashboard for delivery status

**Non-delivery reasons:**
- Email bounced (invalid address)
- Marked as spam
- Domain not verified in SendGrid
- Send quota exceeded

---

### Issue: "Email marked as spam"

**Solutions:**

1. **Verify sender email:**
```bash
SENDGRID_FROM_EMAIL=noreply@your-domain.com
# Better than: noreply@storemx.com
```

2. **Add SPF/DKIM records:**
```
https://docs.sendgrid.com/for-developers/sending-email/authentication
```

3. **Use verified sender domain:**
```
SendGrid Dashboard → Settings → Sender Authentication
```

---

### Issue: "Email has wrong content/formatting"

**Solutions:**

1. **Check HTML template:**
```javascript
// server/emailService.js
console.log("Email HTML:", html);
```

2. **Test with simple template:**
```javascript
html: `<h1>Hello ${customerName}</h1>`
```

3. **Validate HTML syntax:**
- Missing closing tags
- Unclosed quotes
- Invalid special characters

---

## 🔍 Debugging Steps

### Step 1: Check Backend Connection

```bash
# Terminal
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"StoreMX Backend Server is running",...}
```

### Step 2: Check Browser Network

```
1. Open DevTools (F12)
2. Go to Network tab
3. Place order
4. Look for POST request to /api/email/send-order-confirmation
5. Check Status Code: Should be 200
6. Check Response: Should have {"success": true}
```

### Step 3: Check Backend Logs

```
Look for:
✅ Email sent successfully to: [email]
✓ Or error message explaining the issue
```

### Step 4: Check SendGrid Dashboard

```
1. https://app.sendgrid.com/email_activity
2. Filter by recipient email
3. Check delivery status
4. Click for details
```

---

## 📋 Verification Checklist

Before declaring it working:

```
□ Backend server running: npm start
□ .env file with API key: server/.env
□ Frontend running: npm run dev
□ Health check passes: curl localhost:5000/api/health
□ No CORS errors in console
□ Email received in inbox (within 10 seconds)
□ Tracking ID visible in email
□ Order details correct in email
□ Success page displays in browser
□ SendGrid dashboard shows delivered
```

---

## 🆘 Still Having Issues?

### Quick Fixes (Try These First)

```bash
# 1. Restart both servers
npm start           # Terminal 1 in server/
npm run dev        # Terminal 2 in root

# 2. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Check API key
echo $SENDGRID_API_KEY

# 4. Test backend directly
curl http://localhost:5000/api/health

# 5. Check browser console
F12 → Console → Look for red errors
```

### Get Help

1. **Check SendGrid docs:** https://docs.sendgrid.com
2. **Read setup guide:** `SETUP_EMAIL_SERVICE.md`
3. **Check architecture:** `ARCHITECTURE.md`
4. **Quick start:** `QUICK_START.md`

---

## 📞 Support Resources

| Issue Type | Resource |
|-----------|----------|
| SendGrid API | https://docs.sendgrid.com |
| Express.js | https://expressjs.com |
| Node.js | https://nodejs.org/en/docs |
| CORS | https://enable-cors.org |
| Email Standards | https://www.rfc-editor.org/rfc/rfc5321.html |

---

**Still stuck?** Make sure you've:
1. ✅ Read error message carefully
2. ✅ Checked all .env files
3. ✅ Restarted both servers
4. ✅ Looked at backend console logs
5. ✅ Checked browser DevTools Network tab

Most issues are solved by restarting the server! 🚀
