# 🎯 Backend-Only Email Setup (NO APIs)

## Quick Start: Choose Your Option

### Option 1: Local File Storage (Simplest)
If you want to **store emails locally** without sending:

```bash
# 1. No installation needed - the file `emailService-local.js` is already ready
# 2. Update your emailRoutes.js:
import { sendOrderConfirmation } from '../emailService-local.js';

# 3. Restart server - done!
```

**What happens:**
- Emails are saved to `emails.json` in your project root
- You can view all customer orders and emails
- No external services needed
- No API keys required

**View stored emails:**
```bash
# Just open the emails.json file in your editor
# You'll see all customer emails with order details
```

---

### Option 2: Self-Hosted Mail Server (Full Control)
If you want to **send real emails from your own server**:

#### Step 1: Install Nodemailer
```bash
cd server
npm install nodemailer
```

#### Step 2: Update emailRoutes.js
```javascript
import { sendOrderConfirmation } from '../emailService-selfhosted.js';
```

#### Step 3: Configure Your Mail Server in `.env`

**If you have a mail server already:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-mail-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

**If you need to set one up (easy options):**

1. **Mail-in-a-Box** (Highly Recommended)
   - Go to https://mailinabox.email/
   - Install on Ubuntu VPS (~$5/mo)
   - Built-in management panel
   - Takes 30 minutes total

2. **Postfix** (Linux)
   ```bash
   sudo apt install postfix
   # Follow the setup wizard
   ```

3. **Windows Mail Server**
   - iRedMail for Windows
   - hMailServer (open-source)

4. **Docker Container**
   ```bash
   docker run -d mailserver/docker-mailserver:latest
   ```

#### Step 4: Restart Server
```bash
npm start
```

Emails will now send from your own mail server! 🎉

---

## How It Works

### Local Storage Flow (Option 1)
```
Customer places order 
  ↓
Order goes to backend
  ↓
emailService-local.js stores email in emails.json
  ↓
You see all emails/orders in emails.json file
```

### Self-Hosted Flow (Option 2)
```
Customer places order
  ↓
Order goes to backend
  ↓
emailService-selfhosted.js connects to your SMTP server
  ↓
Your mail server sends email to customer
  ↓
Email arrives in customer's inbox
```

---

## Important: Email Sending vs. Email Storage

| | LOCAL STORAGE | SELF-HOSTED |
|---|---|---|
| **Send Real Emails** | ❌ No, just saves | ✅ Yes |
| **API Required** | ❌ No APIs | ❌ No APIs |
| **Setup Time** | 2 minutes | 20 minutes |
| **Best Use** | Testing/Development | Production |
| **Inbox Delivery** | ❌ Can't see in Gmail | ✅ Works like regular email |

---

## What You Get Immediately

### Using `emailService-local.js`:
- No setup required
- Instant email storage
- See all customer orders locally
- Perfect for development/testing
- Switch to real email sending later

### Using `emailService-selfhosted.js`:
- Complete control over email sending
- No subscription fees
- Own your data entirely
- Real emails to customers
- Works forever (no vendor lock-in)

---

## Next Steps

1. **Start with Local Storage** (2 min setup)
   ```javascript
   import { sendOrderConfirmation } from '../emailService-local.js';
   ```

2. **Test it works** by placing an order and checking `emails.json`

3. **When ready, switch to Self-Hosted** (20 min setup)
   - Set up mail server on your VPS
   - Update `.env` with SMTP credentials
   - Change import to `emailService-selfhosted.js`

---

## Common Questions

**Q: Will emails be sent to customers?**
- Local Storage: No, only saved locally
- Self-Hosted: Yes, real emails to customer inboxes

**Q: Do I need to pay for anything?**
- Local Storage: No
- Self-Hosted: Only VPS hosting (~$5-10/mo), no email service fees

**Q: Can I switch between options?**
- Yes! Just change the import in `emailRoutes.js` and restart

**Q: Where are emails stored in Local Storage?**
- File: `emails.json` in your project root

**Q: What if I want to send via Gmail later?**
- Use `emailService-nodemailer.js` (free Google SMTP setup in 5 minutes)

---

## File References

- **Local Storage**: `/server/emailService-local.js` ✅ Ready to use
- **Self-Hosted**: `/server/emailService-selfhosted.js` ✅ Ready to use
- **Current Setup**: Check `/server/emailRoutes.js` to see current implementation
