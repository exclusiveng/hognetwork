import axios from 'axios';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_BASE_URL = 'https://api.flutterwave.com/v3';

export interface FlwInitializeResponse {
    status: string;
    message: string;
    data: {
        link: string; // Flutterwave hosted payment link
    };
    // tx_ref we pass in and get back on redirect
    tx_ref?: string;
}

export interface FlwVerifyResponse {
    status: string;
    message: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        device_fingerprint: string;
        amount: number;
        currency: string;
        charged_amount: number;
        app_fee: number;
        merchant_fee: number;
        processor_response: string;
        auth_model: string;
        ip: string;
        narration: string;
        status: string; // 'successful' | 'failed' | 'pending'
        payment_type: string;
        created_at: string;
        account_id: number;
        customer: {
            id: number;
            name: string;
            phone_number: string;
            email: string;
            created_at: string;
        };
        meta: any;
    };
}

export interface FlwPaymentPlanResponse {
    status: string;
    message: string;
    data: {
        id: number;
        name: string;
        amount: number;
        interval: string;
        duration: number;
        status: string;
        currency: string;
        plan_token: string;
        created_at: string;
    };
}

export class FlutterwaveService {
    private get headers() {
        return {
            Authorization: `Bearer ${FLW_SECRET_KEY}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Initialize a standard (one-time) payment transaction.
     * Returns a hosted payment link the user is redirected to.
     */
    async initializeTransaction(
        email: string,
        amount: number,
        metadata: any,
        txRef?: string,
        currency: string = 'NGN'
    ): Promise<FlwInitializeResponse> {
        const reference = txRef || `kedgr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        try {
            const response = await axios.post(
                `${FLW_BASE_URL}/payments`,
                {
                    tx_ref: reference,
                    amount,               // Flutterwave uses the actual amount (not kobo/cents)
                    currency,             // Dynamically passed: 'NGN', 'USD', etc.
                    redirect_url: process.env.FLW_CALLBACK_URL,
                    customer: {
                        email,
                        name: metadata?.name || email,
                    },
                    meta: metadata,
                    customizations: {
                        title: 'Kedgr Subscription',
                        description: `Payment for ${metadata?.planTier || 'plan'} subscription`,
                        logo: process.env.FLW_LOGO_URL || '',
                    },
                },
                { headers: this.headers }
            );

            // Attach the tx_ref so callers can store/track it
            return { ...response.data, tx_ref: reference };
        } catch (error: any) {
            console.error('Flutterwave initialization error:', error.response?.data || error.message);
            throw new Error('Failed to initialize Flutterwave transaction');
        }
    }

    /**
     * Verify a payment using the Flutterwave transaction ID returned on redirect.
     * The redirect URL receives ?transaction_id=<id>&tx_ref=<ref>&status=<status>
     */
    async verifyTransaction(transactionId: string | number): Promise<FlwVerifyResponse> {
        try {
            const response = await axios.get(
                `${FLW_BASE_URL}/transactions/${transactionId}/verify`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error: any) {
            console.error('Flutterwave verification error:', error.response?.data || error.message);
            throw new Error('Failed to verify Flutterwave transaction');
        }
    }

    /**
     * Create a recurring payment plan for subscriptions.
     */
    async createPaymentPlan(
        planName: string,
        amount: number,
        interval: 'monthly' | 'yearly'
    ): Promise<FlwPaymentPlanResponse> {
        try {
            const response = await axios.post(
                `${FLW_BASE_URL}/payment-plans`,
                {
                    amount,
                    name: planName,
                    interval: interval === 'yearly' ? 'yearly' : 'monthly',
                    duration: 0, // 0 = until cancelled
                    currency: 'NGN',
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error: any) {
            console.error('Flutterwave plan creation error:', error.response?.data || error.message);
            throw new Error('Failed to create Flutterwave payment plan');
        }
    }

    /**
     * Cancel / deactivate a recurring payment plan subscription.
     * In Flutterwave you cancel a subscription via the subscription endpoint.
     */
    async cancelSubscription(subscriptionId: string | number): Promise<any> {
        try {
            const response = await axios.put(
                `${FLW_BASE_URL}/subscriptions/${subscriptionId}/cancel`,
                {},
                { headers: this.headers }
            );
            return response.data;
        } catch (error: any) {
            console.error('Flutterwave subscription cancel error:', error.response?.data || error.message);
            throw new Error('Failed to cancel Flutterwave subscription');
        }
    }

    /**
     * Verify the webhook signature from Flutterwave.
     * Flutterwave sends the secret hash in the "verif-hash" header.
     */
    verifyWebhookSignature(hash: string): boolean {
        const FLW_WEBHOOK_SECRET = process.env.FLW_WEBHOOK_SECRET_HASH;
        if (!FLW_WEBHOOK_SECRET) return false;
        return hash === FLW_WEBHOOK_SECRET;
    }

    /**
     * Check if a verified transaction was actually successful.
     */
    isTransactionSuccessful(verifyResponse: FlwVerifyResponse): boolean {
        return (
            verifyResponse.status === 'success' &&
            verifyResponse.data?.status === 'successful'
        );
    }
}

export const flutterwaveService = new FlutterwaveService();
