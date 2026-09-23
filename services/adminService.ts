import { apiClient } from "@/lib/apiClient";
import { AdminAnalytics, AdminStudentRow, AdminTutorRow, Donation, TuitionPost } from "@/types";

export interface BroadcastNotificationInput {
  audience: "all" | "students" | "tutors";
  message: string;
}

export interface AdminContact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  profilePhoto?: { url: string; publicId: string };
  role: "student" | "tutor" | "admin";
  isSuspended: boolean;
  // Role-specific profile fields returned by the admin tuition-post detail API.
  location?: string;
  qualification?: string;
  university?: string;
  department?: string;
  experienceYears?: number;
  skills?: string[];
  subjects?: string[];
  availability?: string;
  about?: string;
  rating?: number;
  reviewCount?: number;
  completedTuitionCount?: number;
  verificationStatus?: string;
  isApproved?: boolean;
}

export interface AdminPostListItem {
  post: TuitionPost & { student?: unknown; hiredTutor?: unknown };
  student: AdminContact | null;
  hiredTutor: AdminContact | null;
  applicantCount: number;
  hiredCount: number;
  connectedCount: number;
}

export interface AdminPostDetail {
  post: TuitionPost & { student?: unknown; hiredTutor?: unknown };
  student: AdminContact | null;
  hiredTutor: AdminContact | null;
  applications: Array<{
    id: string;
    tutor: any;
    whatsappNumber?: string;
    coverMessage: string;
    expectedSalary: number;
    availability: string;
    status: "pending" | "hired" | "rejected";
    connectionStatus?: "not_connected" | "pending_admin" | "contacting" | "connected" | "failed" | "cancelled";
    createdAt: string;
  }>;
}

export const adminService = {
  analytics: async (): Promise<AdminAnalytics> => {
    const { data } = await apiClient.get("/admin/analytics");
    return data.data;
  },
  listStudents: async (): Promise<AdminStudentRow[]> => {
    const { data } = await apiClient.get("/admin/students");
    return data.data;
  },
  listTutors: async (): Promise<AdminTutorRow[]> => {
    const { data } = await apiClient.get("/admin/tutors");
    return data.data;
  },
  verifyStudent: async (id: string, status: "verified" | "rejected", note?: string) => {
    const { data } = await apiClient.patch(`/admin/students/${id}/verification`, { status, note });
    return data.data;
  },
  verifyTutor: async (id: string, status: "verified" | "rejected", note?: string) => {
    const { data } = await apiClient.patch(`/admin/tutors/${id}/verification`, { status, note });
    return data.data;
  },
  toggleSuspend: async (userId: string) => {
    const { data } = await apiClient.patch(`/admin/users/${userId}/suspend`);
    return data.data;
  },
  deleteUser: async (userId: string) => {
    await apiClient.delete(`/admin/users/${userId}`);
  },
  getUserContact: async (userId: string): Promise<AdminContact> => {
    const { data } = await apiClient.get(`/admin/users/${userId}/contact`);
    return data.data;
  },
  listTuitionPosts: async (): Promise<AdminPostListItem[]> => {
    const { data } = await apiClient.get("/admin/tuition-posts");
    return data.data;
  },
  deleteTuitionPost: async (id: string) => {
    await apiClient.delete(`/admin/tuition-posts/${id}`);
  },
  getTuitionPostDetail: async (id: string): Promise<AdminPostDetail> => {
    const { data } = await apiClient.get(`/admin/tuition-posts/${id}`);
    return data.data;
  },
  markConnected: async (applicationId: string) => {
    const { data } = await apiClient.patch(`/admin/applications/${applicationId}/connect`);
    return data.data;
  },
  startContact: async (applicationId: string, notes?: string) => {
    const { data } = await apiClient.patch(`/admin/applications/${applicationId}/contact-start`, notes ? { notes } : {});
    return data.data;
  },
  markConnectionFailed: async (applicationId: string, failureReason?: string) => {
    const { data } = await apiClient.patch(`/admin/applications/${applicationId}/connection-failed`, failureReason ? { failureReason } : {});
    return data.data;
  },
  cancelConnection: async (applicationId: string, reason?: string) => {
    const { data } = await apiClient.patch(`/admin/applications/${applicationId}/cancel`, reason ? { reason } : {});
    return data.data;
  },
  listDonations: async (status?: string): Promise<Donation[]> => {
    const { data } = await apiClient.get("/admin/donations", { params: status && status !== "all" ? { status } : undefined });
    return data.data;
  },
  markSalaryReceived: async (id: string, dueDate?: string) => {
    const { data } = await apiClient.patch(`/admin/donations/${id}/salary-received`, dueDate ? { dueDate } : {});
    return data.data;
  },
  verifyDonation: async (id: string, approved: boolean, note?: string) => {
    const { data } = await apiClient.patch(`/admin/donations/${id}/verify`, { approved, note });
    return data.data;
  },
  markDonationOverdue: async (id: string) => {
    const { data } = await apiClient.patch(`/admin/donations/${id}/overdue`);
    return data.data;
  },
  remindDonation: async (id: string) => {
    const { data } = await apiClient.patch(`/admin/donations/${id}/remind`);
    return data.data;
  },
  suspendDonationTutor: async (id: string) => {
    const { data } = await apiClient.patch(`/admin/donations/${id}/suspend`);
    return data.data;
  },
  reinstateTutor: async (id: string) => {
    const { data } = await apiClient.patch(`/admin/donations/${id}/reinstate`);
    return data.data;
  },
  broadcastNotification: async (payload: BroadcastNotificationInput): Promise<{ recipientCount: number }> => {
    const { data } = await apiClient.post("/admin/notifications/broadcast", payload);
    return data.data;
  },
};
