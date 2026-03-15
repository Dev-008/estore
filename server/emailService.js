import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderConfirmation = async (
  email,
  trackingId,
  customerName,
  orderDetails
) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Order Confirmation - StoreMX | Tracking: ${trackingId}`,
      html: generateOrderEmailTemplate(trackingId, customerName, orderDetails),
    };

    const response = await sgMail.send(msg);
    console.log('✅ Email sent successfully to:', email);
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
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
        
        /* Header */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 15px;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 10px 0;
          letter-spacing: -0.5px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.95;
          margin: 5px 0 0 0;
        }
        
        /* Content */
        .content {
          padding: 40px 30px;
        }
        .greeting {
          margin-bottom: 30px;
        }
        .greeting h2 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        .greeting p {
          color: #666;
          font-size: 14px;
          margin: 8px 0;
        }
        
        /* Status Badge */
        .status-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-left: 4px solid #667eea;
          border-radius: 6px;
          padding: 25px;
          margin: 25px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-left h3 {
          font-size: 16px;
          color: #2c3e50;
          margin-bottom: 8px;
        }
        .status-left p {
          color: #666;
          font-size: 13px;
          margin: 0;
        }
        .status-badge {
          background-color: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Tracking Box */
        .tracking-box {
          background-color: #f0f4ff;
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          margin: 25px 0;
        }
        .tracking-box h3 {
          color: #667eea;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .tracking-id {
          font-size: 28px;
          font-weight: 700;
          color: #667eea;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          margin: 15px 0;
          background: white;
          padding: 15px;
          border-radius: 6px;
        }
        .tracking-help {
          font-size: 12px;
          color: #666;
          margin-top: 12px;
        }
        
        /* Order Summary */
        .order-summary {
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f4ff 100%);
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 28px;
          margin: 25px 0;
        }
        .order-summary h3 {
          font-size: 18px;
          color: #2c3e50;
          margin-bottom: 24px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 14px;
          font-weight: 700;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .summary-item {
          background: white;
          padding: 16px;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }
        .summary-item-label {
          color: #666;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }
        .summary-item-value {
          font-weight: 700;
          color: #2c3e50;
          font-size: 15px;
          display: block;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-label {
          color: #666;
          font-weight: 500;
        }
        .summary-value {
          font-weight: 600;
          color: #2c3e50;
        }
        .summary-total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          padding: 16px;
          margin: 20px 0 0 0;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 700;
        }
        
        /* Status Timeline */
        .status-timeline {
          background: white;
          border-radius: 8px;
          padding: 28px;
          margin: 25px 0;
          border: 2px solid #e5e7eb;
        }
        .status-timeline {
          margin: 0;
        }
        .status-track {
          position: absolute;
          top: 20px;
          left: 60px;
          right: 60px;
          height: 2px;
          background: #e5e7eb;
          z-index: 0;
        }
        .status-step {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          position: relative;
        }
        .status-step.active {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }
        .status-step.completed {
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        }
        .current-status {
          background: #e8f4f8;
          border-left: 4px solid #0066cc;
          padding: 14px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .current-status strong {
          color: #2c3e50;
          display: block;
          margin-bottom: 4px;
        }
        .current-status p {
          color: #666;
          font-size: 13px;
          margin: 0;
        }
        
        /* Timeline/Steps - What Happens Next */
        .timeline {
          margin: 30px 0;
        }
        .timeline h3 {
          font-size: 18px;
          color: #2c3e50;
          margin-bottom: 24px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 14px;
          font-weight: 700;
        }
        .timeline-item {
          display: flex;
          margin-bottom: 24px;
          position: relative;
          padding-bottom: 4px;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 19px;
          top: 48px;
          width: 2px;
          height: 56px;
          background: linear-gradient(180deg, #667eea 0%, transparent 100%);
        }
        .timeline-number {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 18px;
          font-size: 16px;
          position: relative;
          z-index: 1;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.25);
        }
        .timeline-content {
          padding-top: 2px;
          flex: 1;
        }
        .timeline-content h4 {
          font-size: 15px;
          color: #2c3e50;
          margin: 0 0 6px 0;
          font-weight: 700;
        }
        .timeline-content p {
          font-size: 13px;
          color: #666;
          margin: 0 0 8px 0;
        }
        .timeline-duration {
          display: inline-block;
          background: #f0f4ff;
          color: #667eea;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          margin-top: 0;
        }
        
        /* Benefits */
        .benefits {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 25px 0;
        }
        .benefit-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }
        .benefit-item strong {
          display: block;
          color: #2c3e50;
          font-size: 13px;
          margin-bottom: 3px;
        }
        .benefit-item small {
          color: #666;
          font-size: 12px;
        }
        
        /* CTA Button */
        .cta-section {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .button:hover {
          opacity: 0.9;
        }
        
        /* Support Section */
        .support-box {
          background: #e8f4f8;
          border-left: 4px solid #0066cc;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
        }
        .support-box strong {
          display: block;
          color: #2c3e50;
          margin-bottom: 8px;
        }
        .support-box p {
          font-size: 13px;
          color: #666;
          margin: 0;
        }
        .support-box a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }
        
        /* Footer */
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 40px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer-logo {
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .footer-links {
          margin: 15px 0;
          font-size: 12px;
        }
        .footer-links a {
          color: #667eea;
          text-decoration: none;
          margin: 0 10px;
        }
        .footer-text {
          font-size: 11px;
          color: #999;
          margin-top: 20px;
          line-height: 1.6;
        }
        .footer-badge {
          display: inline-block;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          margin-top: 15px;
          border: 1px solid #667eea;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo">📦 StoreMX</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase</p>
          </div>

          <!-- Main Content -->
          <div class="content">
            <!-- Greeting -->
            <div class="greeting">
              <h2>Hello ${customerName},</h2>
              <p>We're thrilled to confirm that your order has been successfully placed and is now being prepared for shipment.</p>
              <p>We'll keep you updated every step of the way with tracking notifications.</p>
            </div>

            <!-- Status Section -->
            <div class="status-section">
              <div class="status-left">
                <h3>Order Status</h3>
                <p>Order placed on ${formattedDate}</p>
              </div>
              <div class="status-badge">Processing</div>
            </div>

            <!-- Tracking Box -->
            <div class="tracking-box">
              <h3>📍 Your Tracking ID</h3>
              <div class="tracking-id">${trackingId}</div>
              <p class="tracking-help">
                Keep this ID handy to track your shipment status. You'll receive shipping updates via email.
              </p>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
              <h3>📦 Order Summary</h3>
              
              <!-- Order Items -->
              <div style="margin-bottom: 20px;">
                <h4 style="font-size: 14px; font-weight: 600; color: #2c3e50; margin-bottom: 12px;">Items Ordered:</h4>
                ${Array.isArray(orderDetails.items) 
                  ? orderDetails.items.map((item, index) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
                      <span style="color: #2c3e50; font-weight: 500;">${index + 1}. ${item}</span>
                    </div>
                  `).join('')
                  : '<p style="color: #999;">No items information available</p>'
                }
              </div>

              <!-- Price Breakdown -->
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-item-label">Item Count</div>
                  <div class="summary-item-value">${Array.isArray(orderDetails.items) ? orderDetails.items.length : 'N/A'} items</div>
                </div>
                <div class="summary-item">
                  <div class="summary-item-label">Order Date</div>
                  <div class="summary-item-value">${orderDetails.date || formattedDate}</div>
                </div>
              </div>

              <!-- Delivery Address -->
              ${orderDetails.address ? `
                <div style="background: #f0f4ff; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 13px;">
                  <h4 style="font-weight: 600; color: #2c3e50; margin-bottom: 8px;">📍 Delivery Address:</h4>
                  <p style="margin: 5px 0; color: #2c3e50;">${orderDetails.address}</p>
                  <p style="margin: 5px 0; color: #2c3e50;">${orderDetails.city}${orderDetails.zip ? ', ' + orderDetails.zip : ''}</p>
                </div>
              ` : ''}

              <!-- Price Summary -->
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ccc; font-size: 13px;">
                  <span style="color: #666;">Subtotal</span>
                  <span style="color: #2c3e50; font-weight: 600;">₹${orderDetails.subtotal || orderDetails.total?.replace('₹', '') || 'N/A'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ccc; font-size: 13px;">
                  <span style="color: #666;">Estimated Delivery</span>
                  <span style="color: #2c3e50; font-weight: 600;">${deliveryDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px;">
                  <span style="color: #666;">Delivery Type</span>
                  <span style="color: #2c3e50; font-weight: 600;">Standard Shipping</span>
                </div>
              </div>

              <!-- Total -->
              <div class="summary-total">
                <span style="font-size: 15px;">Total Order Value</span>
                <span style="font-size: 18px;">${orderDetails.total || 'N/A'}</span>
              </div>
            </div>

            <!-- What Happens Next -->
            <div class="timeline">
              <h3>📋 What Happens Next?</h3>
              <div class="timeline-item">
                <div class="timeline-number">1</div>
                <div class="timeline-content">
                  <h4>Order Processing</h4>
                  <p>We're carefully picking and packing your items (24-48 hours)</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">2</div>
                <div class="timeline-content">
                  <h4>In Transit</h4>
                  <p>Your package is on its way to you (3-5 business days)</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">3</div>
                <div class="timeline-content">
                  <h4>Out for Delivery</h4>
                  <p>Your order is being delivered to your address</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">4</div>
                <div class="timeline-content">
                  <h4>Delivered</h4>
                  <p>Enjoy your new products! We'd love your feedback</p>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div class="benefits">
              <div class="benefit-item">
                <strong>✓ Free Returns</strong>
                <small>30-day return policy</small>
              </div>
              <div class="benefit-item">
                <strong>✓ Secure Payment</strong>
                <small>100% encrypted transactions</small>
              </div>
              <div class="benefit-item">
                <strong>✓ Live Tracking</strong>
                <small>Real-time shipment updates</small>
              </div>
              <div class="benefit-item">
                <strong>✓ Customer Support</strong>
                <small>24/7 assistance available</small>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
              <a href="http://localhost:8080/orders" class="button">Track Your Order</a>
            </div>

            <!-- Support -->
            <div class="support-box">
              <strong>📞 Need Help?</strong>
              <p>
                If you have any questions about your order or need assistance, 
                <a href="mailto:support@storemx.com">contact our support team</a> 
                or visit <a href="http://localhost:8080">storemx.com</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-logo">StoreMX</div>
            <p style="margin: 10px 0; color: #999; font-size: 12px;">Your trusted online shopping destination</p>
            <div class="footer-links">
              <a href="http://localhost:8080">Website</a> |
              <a href="http://localhost:8080">Orders</a> |
              <a href="http://localhost:8080">Support</a>
            </div>
            <div class="footer-text">
              <p>© 2026 StoreMX. All rights reserved.</p>
              <p>
                This is an automated transaction email. Please do not reply to this email.<br>
                If you did not place this order, please <a href="mailto:support@storemx.com" style="color: #667eea;">contact us immediately</a>.
              </p>
            </div>
            <div class="footer-badge">✓ Secure & Verified</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
