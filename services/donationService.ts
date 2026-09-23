import { apiClient } from "@/lib/apiClient";
import { Donation } from "@/types";

export interface DonationInstructions {
  paymentMethod: "bkash";
  accountNumber: string;
  percentage: number;
}

export const donationService = {
  instructions: async (): Promise<DonationInstructions> => {
    const { data } = await apiClient.get("/donations/instructions");
    return data.data;
  },
  mine: async (): Promise<Donation[]> => {
    const { data } = await apiClient.get("/donations/mine");
    return data.data;
  },
  submitPayment: async (id: string, transactionId: string): Promise<Donation> => {
    const { data } = await apiClient.post(`/donations/${id}/payment`, { transactionId });
    return data.data;
  },
};
