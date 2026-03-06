export interface PaymentGatewayResult {
  success: boolean;
  transactionId: string;
}

const delay = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const processPayment = async (amount: number, method: string): Promise<PaymentGatewayResult> => {
  await delay(1000);

  return {
    success: amount > 0 && Boolean(method),
    transactionId: `PAY-${Date.now()}`
  };
};
