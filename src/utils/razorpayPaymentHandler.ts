import { toast } from "../hooks/use-toast";
import { createOrder, verifyPayment } from "../services/operations/PaymentAPI";

interface User {
  username: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const razorpayPaymentHandler = async (user: User) => {
  try {
    const date = new Date();
    const orderData = {
      amount: 1000, // Consider making this dynamic
      currency: "INR",
      receipt: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
    };

    const response = await createOrder(orderData);
    const order = response.data;

    if (response.success) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is set correctly
        amount: order.amount,
        currency: order.currency,
        name: "ChatNow",
        description: "Payment for getting verified",
        image:
          "https://res.cloudinary.com/dwivoxxaz/image/upload/v1728220262/ChatNow/User%20Icons/Anime-Char10_prbkoa.jpg",
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          const data = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const result = await verifyPayment(data);

          if (result.success) {
            toast({
              title: "Payment done successfully",
              duration: 3000,
            });

            window.location.reload();
          } else {
            toast({
              variant: "destructive",
              title: "Something went wrong",
              duration: 3000,
            });
          }
        },
        prefill: {
          name: user.username,
        },
        notes: {
          address: "ChatNow",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } else {
      toast({
        variant: "destructive",
        title: order.message,
        duration: 3000,
      });
    }
  } catch (e) {
    console.error("Payment processing error:", e);
    toast({
      variant: "destructive",
      title: "Something went wrong",
      duration: 3000,
    });
  }
};

export default razorpayPaymentHandler;
