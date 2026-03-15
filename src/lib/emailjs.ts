import emailjs from '@emailjs/browser';

// Initialize EmailJS (get these from emailjs.com dashboard)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

export interface OrderEmailParams {
  to_email: string;
  customer_name: string;
  tracking_id: string;
  order_date: string;
  total_amount: string;
  item_count: number;
  estimated_delivery: string;
  order_items?: string;
}

export const sendOrderConfirmationEmail = async (
  params: OrderEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      throw new Error('EmailJS configuration missing. Please check your environment variables.');
    }

    const templateParams = {
      ...params,
      to_email: params.to_email,
      customer_name: params.customer_name,
      tracking_id: params.tracking_id,
      order_date: params.order_date,
      total_amount: params.total_amount,
      item_count: params.item_count,
      estimated_delivery: params.estimated_delivery,
      order_items: params.order_items || 'See order details',
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

    console.log('✅ Email sent successfully:', response.status);
    return {
      success: true,
      messageId: response.status.toString(),
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
};

export const sendContactEmail = async (
  to_email: string,
  name: string,
  message: string,
  subject: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      throw new Error('EmailJS configuration missing');
    }

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email,
      customer_name: name,
      message,
      subject,
    });

    console.log('✅ Contact email sent:', response.status);
    return {
      success: true,
      messageId: response.status.toString(),
    };
  } catch (error) {
    console.error('❌ Contact email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send contact email',
    };
  }
};

export default emailjs;
