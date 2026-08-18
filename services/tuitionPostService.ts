import { apiClient } from "@/lib/apiClient";
import { TuitionPost } from "@/types";

export interface TuitionPostInput {
  title: string;
  class: string;
  medium: string;
  subject: string;
  daysPerWeek: number;
  salary: number;
  location: string;
  teachingMode: "online" | "offline" | "both";
  genderPreference: "male" | "female" | "any";
  description: string;
  preferredTutor?: string;
  deadline: string;
}

export interface TuitionFilters {
  subject?: string;
  location?: string;
  medium?: string;
  class?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
}

export const tuitionPostService = {
  listMine: async (): Promise<TuitionPost[]> => {
    const { data } = await apiClient.get("/tuition-posts/mine");
    return data.data;
  },

  listLive: async (filters: TuitionFilters = {}): Promise<TuitionPost[]> => {
    const { data } = await apiClient.get("/tuition-posts", { params: filters });
    return data.data;
  },

  getById: async (id: string): Promise<TuitionPost> => {
    const { data } = await apiClient.get(`/tuition-posts/${id}`);
    return data.data;
  },

  create: async (payload: TuitionPostInput): Promise<TuitionPost> => {
    const { data } = await apiClient.post("/tuition-posts", payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<TuitionPostInput>): Promise<TuitionPost> => {
    const { data } = await apiClient.patch(`/tuition-posts/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/tuition-posts/${id}`);
  },
};
