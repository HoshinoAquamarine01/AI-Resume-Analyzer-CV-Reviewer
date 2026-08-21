import axiosInstance from './axiosInstance';

export interface CreatePaymentUrlPayload {
  plan: 'pro' | 'premium';
  provider?: 'vnpay' | 'payos' | 'stripe';
  returnUrl?: string;
}

export interface PaymentWebhookPayload {
  orderId: string;
  amount: number | string;
  status: string;
  signature: string;
  provider?: string;
  subscriptionId?: string;
}

export const paymentService = {

  createPaymentUrl: async (payload: CreatePaymentUrlPayload) => {
    const response = await axiosInstance.post('/api/payment/create-url', payload);
    return response.data;
  },

  getSubscriptionStatus: async () => {
    const response = await axiosInstance.get('/api/payment/subscription');
    return response.data;
  },

  
  processWebhook: async (payload: PaymentWebhookPayload) => {
    const response = await axiosInstance.post('/api/payment/webhook', payload);
    return response.data;
  },
};

export default paymentService;
