import nodemailer from 'nodemailer';

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your-email@gmail.com
    pass: process.env.GMAIL_PASSWORD, // App password (not regular password!)
  },
});

// Alternative: Use any SMTP server
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

export const sendOrderConfirmation = async (
  email,
  trackingId,
  customerName,
  orderDetails
) => {
  try {
    const msg = {
      from: process.env.GMAIL_USER || 'noreply@storemx.com',
      to: email,
      subject: `Order Confirmation - StoreMX | Tracking: ${trackingId}`,
      html: generateOrderEmailTemplate(trackingId, customerName, orderDetails),
    };

    const response = await transporter.sendMail(msg);
    console.log('✅ Email sent successfully to:', email);
    return {
      success: true,
      messageId: response.messageId,
    };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          background-color: #f8f9fa;
        }
        .wrapper {
          background-color: #f8f9fa;
          padding: 20px 0;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
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
        .logo {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .content {
          padding: 40px 30px;
        }
        .section {
          margin-bottom: 30px;
        }
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
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .info-label {
          font-weight: 600;
          color: #555;
        }
        .info-value {
          color: #2c3e50;
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin-top: 20px;
        }
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
      <div class="wrapper">
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
            
            <a href="https://storemx.com/orders" class="btn">Track Your Order</a>
          </div>
          
          <div class="footer">
            <p>© 2024 StoreMX. All rights reserved.</p>
            <p>Need help? Contact us at support@storemx.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
