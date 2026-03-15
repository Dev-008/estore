import express from 'express';
//import { sendOrderConfirmation } from '../emailService.js';
import { sendOrderConfirmation } from '../emailService-local.js';

const router = express.Router();

router.post('/send-order-confirmation', async (req, res) => {
  try {
    const { email, trackingId, customerName, orderDetails } = req.body;

    // Validation
    if (!email || !trackingId || !customerName || !orderDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, trackingId, customerName, orderDetails',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Send email
    const result = await sendOrderConfirmation(
      email,
      trackingId,
      customerName,
      orderDetails
    );

    res.json({
      success: true,
      message: 'Confirmation email sent successfully',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Email route error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send confirmation email',
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'Email service is running' });
});

export default router;
