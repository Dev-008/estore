/**
 * Backend Mail Service - Self-Hosted SMTP
 * Uses your own mail server or local development settings
 * No external APIs required
 */

import nodemailer from 'nodemailer';

// Configure your own SMTP server (self-hosted, dedicated server, or local)
const transporter = nodemailer.createTransport({
  // Option 1: Self-hosted Mail Server
  host: process.env.SMTP_HOST || 'mail.yourdomain.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'noreply@storemx.com',
    pass: process.env.SMTP_PASSWORD || 'your-password'
  },
  
  // Optional: Add these for self-hosted servers
  // rejectUnauthorized: false, // For self-signed certificates
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️ Mail server connection error:', error.message);
  } else {
    console.log('✅ Mail server ready to send emails');
  }
});

export const sendOrderConfirmation = async (
  email,
  trackingId,
  customerName,
  orderDetails
) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@storemx.com',
      to: email,
      subject: `Order Confirmation - StoreMX | Tracking: ${trackingId}`,
      html: generateOrderEmailTemplate(trackingId, customerName, orderDetails),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent via self-hosted server to:', email);
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
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
          <p>Sent via your self-hosted mail server without external APIs.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
