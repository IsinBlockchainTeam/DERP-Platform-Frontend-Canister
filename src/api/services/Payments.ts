import { t } from "i18next";
import { PaymentDto } from "../../dto/OrderPaymentDto";
import api from "../api"
import { auth } from "../auth";
import { PaymentMethodDto } from "../../dto/PaymentMethod";

export const paymentsService = {
    async getOrderPayments(orderId: number): Promise<PaymentDto[]> {
        const res = await api.get<PaymentDto[]>('/payments/orders/' + orderId, {
            headers: await auth.authenticatedHeaders()
        });

        return res.data;
    },
    
    async getTransactionPayment(transactionId: string): Promise<PaymentDto> {
        const res = await api.get<PaymentDto[]>('/payments',{
            headers: await auth.authenticatedHeaders(),
            params: {
                transactionId
            }
        });
        
        if (res.data.length !== 1) {
            throw new Error('Invalid transaction! should have exactly one payment but got ' + res.data.length);
        }
            
        return res.data[0]
    },
    
    async getPaymentMethods(storeId: number): Promise<PaymentMethodDto[]> {
        const res = await api.get<PaymentMethodDto[]>('/payment-methods', {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        return res.data;
    }
}