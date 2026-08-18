import { apiClient } from "@/lib/apiClient";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  send: async (payload: ContactPayload) => {
    const { data } = await apiClient.post("/contact", payload);
    return data;
  },
};
