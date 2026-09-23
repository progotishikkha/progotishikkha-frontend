import { apiClient } from "@/lib/apiClient";
import { NotificationItem } from "@/types";

export const notificationService = {
  list: async (): Promise<NotificationItem[]> => {
    const { data } = await apiClient.get("/notifications");
    return data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};
