import { apiClient } from "@/lib/apiClient";

export interface BroadcastNotificationInput {
  audience: "all" | "students" | "tutors";
  message: string;
}

export const adminService = {
  broadcastNotification: async (payload: BroadcastNotificationInput): Promise<{ recipientCount: number }> => {
    const { data } = await apiClient.post("/admin/notifications/broadcast", payload);
    return data.data;
  },
};
