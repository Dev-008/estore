/**
 * Local Email Service - No External APIs
 * Stores emails in memory/database without sending via external services
 * Perfect for development and testing
 */

import fs from 'fs';
import path from 'path';

// Store emails locally in a JSON file
const emailStoragePath = path.join(process.cwd(), 'emails.json');

// Initialize emails file if it doesn't exist
const initEmailStorage = () => {
  if (!fs.existsSync(emailStoragePath)) {
    fs.writeFileSync(emailStoragePath, JSON.stringify([], null, 2));
  }
};

// Read all stored emails
const getStoredEmails = () => {
  try {
    const data = fs.readFileSync(emailStoragePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save email to file
const saveEmailToFile = (emailData) => {
  try {
    const emails = getStoredEmails();
    emails.push({
      ...emailData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    fs.writeFileSync(emailStoragePath, JSON.stringify(emails, null, 2));
  } catch (error) {
    console.error('❌ Failed to save email:', error.message);
  }
};

// Send email (stores locally without external API)
export const sendOrderConfirmation = async (
  email,
  trackingId,
  customerName,
  orderDetails
) => {
  try {
    initEmailStorage();

    const emailData = {
      to: email,
      subject: `Order Confirmation - StoreMX | Tracking: ${trackingId}`,
      html: generateOrderEmailTemplate(trackingId, customerName, orderDetails),
      orderDetails: {
        trackingId,
        customerName,
        email,
        amount: orderDetails.total,
        date: new Date().toISOString(),
        items: orderDetails.items
      }
    };

    // Save to local file
    saveEmailToFile(emailData);

    // Log to console for development
    console.log('✅ Email saved locally (no API used)');
    console.log(`   To: ${email}`);
    console.log(`   Tracking ID: ${trackingId}`);
    console.log(`   Amount: ₹${orderDetails.total?.toLocaleString('en-IN') || '0'}`);
    console.log(`   📁 All emails stored in: emails.json`);

    return {
      success: true,
      messageId: Date.now().toString(),
      message: 'Email stored locally',
      emailPath: emailStoragePath
    };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error(`Failed to store email: ${error.message}`);
  }
};

// Get all stored emails (for admin dashboard)
export const getAllStoredEmails = () => {
  initEmailStorage();
  return getStoredEmails();
};

// Delete stored email
export const deleteStoredEmail = (emailId) => {
  try {
    const emails = getStoredEmails();
    const filtered = emails.filter(e => e.id !== emailId);
    fs.writeFileSync(emailStoragePath, JSON.stringify(filtered, null, 2));
    return { success: true, message: 'Email deleted' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Email template
const generateOrderEmailTemplate = (trackingId, customerName, orderDetails) => {
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryDate = estimatedDelivery.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 650px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .logo { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
        .header h1 { font-size: 32px; font-weight: 700; margin: 10px 0; }
        .header p { font-size: 14px; opacity: 0.95; margin: 5px 0 0 0; }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 30px; }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .info-label { font-weight: 600; color: #555; }
        .info-value { color: #2c3e50; font-weight: 500; }
        .footer {
          background-color: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📦 StoreMX</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <p>Hello <strong>${customerName}</strong>,</p>
          <p style="margin: 15px 0; color: #666;">Your order has been placed successfully. We're preparing it for shipment!</p>
          
          <div class="section">
            <div class="section-title">Order Details</div>
            <div class="info-row">
              <span class="info-label">Tracking ID:</span>
              <span class="info-value"><strong>${trackingId}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estimated Delivery:</span>
              <span class="info-value">${deliveryDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Amount:</span>
              <span class="info-value"><strong>₹${orderDetails.total?.toLocaleString('en-IN') || '0'}</strong></span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2026 StoreMX. All rights reserved.</p>
          <p>This email was stored locally without using any external email APIs.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
