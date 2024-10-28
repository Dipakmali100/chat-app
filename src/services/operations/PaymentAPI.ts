import axios from "axios";
import { PaymentApi } from "../apis";
import { toast } from "../../hooks/use-toast";

const { CREATE_ORDER, VERIFY_PAYMENT } = PaymentApi;

interface Order {
  amount: number;
  currency: string;
  receipt: string;
}
export const createOrder = async (order: Order) => {
  try {
    const response = await axios.post(CREATE_ORDER, order, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    toast({ title: "Something went wrong", duration: 2000 });
    return { success: false, message: "Something went wrong" };
  }
};

interface VerifyPayment {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const verifyPayment = async (data: VerifyPayment) => {
  try {
    const response = await axios.post(VERIFY_PAYMENT, data, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    toast({ title: "Something went wrong", duration: 2000 });
    return { success: false, message: "Something went wrong" };
  }
};
