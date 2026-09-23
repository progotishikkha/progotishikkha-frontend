import { apiClient } from "@/lib/apiClient";
import { AuthUser } from "@/services/authService";
import { Tutor } from "@/types";

// fullName/phone are account-level fields (they live on User, not on the
// profile document) but the backend now accepts them on these same "update
// my profile" endpoints and applies them to the right place.
export interface TutorProfileInput {
  fullName?: string;
  phone?: string;
  qualification?: string;
  university?: string;
  department?: string;
  experienceYears?: number;
  skills?: string[];
  subjects?: string[];
  location?: string;
  availability?: "weekdays" | "weekends" | "evenings" | "flexible";
  whatsappNumber?: string;
  about?: string;
}

export interface StudentProfileInput {
  fullName?: string;
  phone?: string;
  location?: string;
  whatsappNumber?: string;
}

export const profileService = {
  getTutor: async (id: string): Promise<Tutor> => {
    const { data } = await apiClient.get(`/tutors/${id}`);
    return data.data;
  },

  // Both update endpoints now return the full merged user+profile object
  // (same shape as GET /auth/me) so the caller can drop it straight into
  // AuthContext without a second round trip.
  updateTutorProfile: async (payload: TutorProfileInput): Promise<AuthUser> => {
    const { data } = await apiClient.patch("/tutors/me", payload);
    return data.data;
  },

  uploadTutorPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    const { data } = await apiClient.post("/tutors/me/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  updateStudentProfile: async (payload: StudentProfileInput): Promise<AuthUser> => {
    const { data } = await apiClient.patch("/students/me", payload);
    return data.data;
  },

  // Was missing entirely — there was no student photo endpoint on either
  // side before this fix (see students.routes.ts / profile.controller.ts).
  uploadStudentPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    const { data } = await apiClient.post("/students/me/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },
};
