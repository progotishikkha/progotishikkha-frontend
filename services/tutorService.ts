import { apiClient } from "@/lib/apiClient";
import {
  PublicTutorProfile,
  TutorListResult,
  TutorFilters,
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

};
