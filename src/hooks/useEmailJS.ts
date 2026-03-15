import { useState } from 'react';
import { sendOrderConfirmationEmail, OrderEmailParams } from '@/lib/emailjs';
import { useToast } from '@/hooks/use-toast';

export const useEmailJS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendOrderEmail = async (params: OrderEmailParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendOrderConfirmationEmail(params);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Order confirmation email sent successfully!',
        });
        return result;
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOrderEmail, isLoading, error };
};
