import { apiClient } from "@/lib/apiClient";
import {
  PublicTutorProfile,
  TutorListResult,
  TutorFilters,
  ContactAnalyticsSummary,
} from "@/types";

export const tutorService = {
  list: async (filters: TutorFilters = {}): Promise<TutorListResult> => {
    const { data } = await apiClient.get("/tutors", { params: filters });
    return data.data;
  },

  getById: async (id: string): Promise<PublicTutorProfile> => {
    const { data } = await apiClient.get(`/tutors/${id}`);
    return data.data;
  },

  // Fire-and-forget analytics ping — never blocks or breaks the UI it's
  // called from if it fails (network hiccup, ad-blocker, etc).
  trackEvent: (id: string, type: "profile_view" | "call_click" | "whatsapp_click"): void => {
    apiClient.post(`/tutors/${id}/contact-events`, { type }).catch(() => undefined);
  },

  getMyAnalytics: async (): Promise<ContactAnalyticsSummary> => {
    const { data } = await apiClient.get("/tutors/me/analytics");
    return data.data;
  },
};
