export type PaymentMethodType = 'cod' | 'vnpay' | 'momo' | 'stripe';

export type PaymentStatusType = 'pending' | 'paid' | 'failed' | 'refunded';

export const PAYMENT_METHODS = [
    {
        code: 'cod' as PaymentMethodType,
        nameKey: 'CHECKOUT.PAYMENT.COD_NAME',
        descKey: 'CHECKOUT.PAYMENT.COD_DESC',
        icon: 'assets/icons/payment/cod.svg',
        disabled: false,
    },
    {
        code: 'vnpay' as PaymentMethodType,
        nameKey: 'CHECKOUT.PAYMENT.VNPAY_NAME',
        descKey: 'CHECKOUT.PAYMENT.VNPAY_DESC',
        icon: 'assets/icons/payment/vnpay.svg',
        disabled: false,
    },
    {
        code: 'momo' as PaymentMethodType,
        nameKey: 'CHECKOUT.PAYMENT.MOMO_NAME',
        descKey: 'CHECKOUT.PAYMENT.MOMO_DESC',
        icon: 'assets/icons/payment/momo.svg',
        disabled: false,
    },
    {
        code: 'stripe' as PaymentMethodType,
        nameKey: 'CHECKOUT.PAYMENT.STRIPE_NAME',
        descKey: 'CHECKOUT.PAYMENT.STRIPE_DESC',
        icon: 'assets/icons/payment/stripe.svg',
        disabled: true,
    },
] as const;
