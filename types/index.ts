export type UserRole = "student" | "tutor" | "admin";

export interface ProfilePhoto {
  url: string;
  publicId: string;
}

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface StudentProfileData {
  id: string;
  user: string;
  location?: string;
  whatsappNumber?: string;
  profilePhoto?: ProfilePhoto;
  verificationStatus?: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfileData {
  id: string;
  user: string;
  isApproved: boolean;
  verificationStatus?: VerificationStatus;
  profilePhoto?: ProfilePhoto;
  qualification?: string;
  university?: string;
  department?: string;
  experienceYears?: number;
  skills: string[];
  subjects: string[];
  location?: string;
  whatsappNumber?: string;
  availability?: "weekdays" | "weekends" | "evenings" | "flexible";
  about?: string;
  rating: number;
  reviewCount: number;
  completedTuitionCount: number;
  createdAt: string;
  updatedAt: string;
}

// Full public tutor profile — GET /tutors/:id and GET /tutors (marketplace).
export interface PublicTutorProfile {
  id: string;
  user: { id: string; fullName: string };
  isApproved: boolean;
  profilePhoto?: ProfilePhoto;
  qualification?: string;
  university?: string;
  department?: string;
  experienceYears?: number;
  skills: string[];
  subjects: string[];
  location?: string;
  availability?: "weekdays" | "weekends" | "evenings" | "flexible";
  about?: string;
  rating: number;
  reviewCount: number;
  completedTuitionCount: number;
  createdAt: string;
}

export interface TutorListResult {
  tutors: PublicTutorProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface TutorFilters {
  q?: string;
  subject?: string;
  location?: string;
  availability?: string;
  page?: number;
  limit?: number;
}

export interface Tutor {
  id: string;
  fullName: string;
  photoUrl: string;
  qualification: string;
  university: string;
  subjects: string[];
  location: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  availability: string;
}

export type TeachingMode = "online" | "offline" | "both";
export type TuitionStatus = "open" | "closed" | "filled";

export interface TuitionPost {
  id: string;
  title: string;
  class: string;
  medium: string;
  subject: string;
  daysPerWeek: number;
  salary: number;
  location: string;
  teachingMode: TeachingMode;
  genderPreference: "male" | "female" | "any";
  description: string;
  status: TuitionStatus;
  deadline: string;
  applicantCount: number;
  createdAt: string;
}

export type ApplicationStatus = "pending" | "hired" | "rejected";
export type ConnectionStatus = "not_connected" | "pending_admin" | "contacting" | "connected" | "failed" | "cancelled";

// Matches GET /applications/mine — tuitionPost is populated with a small
// projection (title/salary/location/status), not flattened server-side.
export interface Application {
  id: string;
  tuitionPost: {
    id: string;
    title: string;
    salary: number;
    location: string;
    status: string;
  } | null;
  coverMessage: string;
  expectedSalary: number;
  availability: string;
  status: ApplicationStatus;
  connectionStatus?: ConnectionStatus;
  createdAt: string;
}

// Shape of an application as returned by GET /applications/post/:postId,
// where `tutor` is the populated TutorProfile (itself populating its user).
export interface PostApplicant {
  id: string;
  tutor: Omit<TutorProfileData, "user"> & { user: { id: string; fullName: string } };
  coverMessage: string;
  expectedSalary: number;
  availability: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface AdminStudentRow {
  id: string;
  user: { id: string; fullName: string; email: string; phone: string; isSuspended: boolean; createdAt: string };
  whatsappNumber?: string;
  profilePhoto?: ProfilePhoto;
  verificationStatus?: VerificationStatus;
  postsCount: number;
}

export interface AdminTutorRow {
  id: string;
  user: { id: string; fullName: string; email: string; phone: string; isSuspended: boolean; createdAt: string };
  whatsappNumber?: string;
  profilePhoto?: ProfilePhoto;
  verificationStatus?: VerificationStatus;
  isApproved: boolean;
  qualification?: string;
  university?: string;
  subjects: string[];
  location?: string;
  rating: number;
}

export type DonationStatus = "not_due" | "due" | "payment_submitted" | "completed" | "rejected" | "overdue" | "suspended";

export interface Donation {
  id: string;
  tutor: string | Record<string, unknown>;
  tuitionPost: { id: string; title: string; salary: number; location: string; status: string } | string;
  application: string | Record<string, unknown>;
  firstMonthSalary: number;
  percentage: number;
  donationAmount: number;
  salaryReceivedAt?: string;
  dueDate?: string;
  status: DonationStatus;
  paymentMethod?: "bkash";
  transactionId?: string;
  paymentSubmittedAt?: string;
  paidAt?: string;
  verifiedAt?: string;
  reminderCount: number;
  lastReminderAt?: string;
  suspendedAt?: string;
  adminNote?: string;
  createdAt: string;
}

export interface AdminAnalytics {
  studentCount: number;
  tutorCount: number;
  openPostsCount: number;
  filledPostsCount: number;
  pendingApprovals: number;
  pendingStudentVerifications: number;
  pendingTutorVerifications: number;
  donationDue: number;
  donationPaymentSubmitted: number;
  donationCompleted: number;
  donationOverdue: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
}

export interface NotificationItem {
  id: string;
  type: "new_application" | "tutor_hired" | "tutor_rejected" | "new_review" | "new_match" | "system";
  message: string;
  isRead: boolean;
  createdAt: string;
}
