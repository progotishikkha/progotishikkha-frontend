import { apiClient } from "@/lib/apiClient";
import { Application, PostApplicant, TuitionPost } from "@/types";

export interface ApplicationInput {
  tuitionPostId: string;
  coverMessage: string;
  expectedSalary: number;
  availability: string;
}

export const applicationService = {
  apply: async (payload: ApplicationInput): Promise<Application> => {
    const { data } = await apiClient.post("/applications", payload);
    return data.data;
  },

  listMine: async (): Promise<Application[]> => {
    const { data } = await apiClient.get("/applications/mine");
    return data.data;
  },

  listForPost: async (tuitionPostId: string): Promise<PostApplicant[]> => {
    const { data } = await apiClient.get(`/applications/post/${tuitionPostId}`);
    return data.data;
  },

  hire: async (applicationId: string): Promise<void> => {
    await apiClient.patch(`/applications/${applicationId}/hire`);
  },

  reject: async (applicationId: string): Promise<void> => {
    await apiClient.patch(`/applications/${applicationId}/reject`);
  },

  saveTuitionPost: async (tuitionPostId: string): Promise<void> => {
    await apiClient.post(`/tuition-posts/${tuitionPostId}/save`);
  },

  unsaveTuitionPost: async (tuitionPostId: string): Promise<void> => {
    await apiClient.delete(`/tuition-posts/${tuitionPostId}/save`);
  },

  listSaved: async (): Promise<TuitionPost[]> => {
    const { data } = await apiClient.get("/tuition-posts/saved");
    return data.data;
  },
};
