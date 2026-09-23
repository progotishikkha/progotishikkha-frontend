import { Tutor, TuitionPost, BlogPost, Application, NotificationItem } from "@/types";

export const FEATURED_TUTORS: Tutor[] = [
  {
    id: "t1",
    fullName: "Farhana Akter",
    photoUrl: "https://i.pravatar.cc/150?img=47",
    qualification: "BSc in Mathematics, DU",
    university: "University of Dhaka",
    subjects: ["Mathematics", "Physics"],
    location: "Dhanmondi, Dhaka",
    experienceYears: 5,
    rating: 4.9,
    reviewCount: 62,
    availability: "Evenings",
  },
  {
    id: "t2",
    fullName: "Rezaul Karim",
    photoUrl: "https://i.pravatar.cc/150?img=12",
    qualification: "BSc in CSE, BUET",
    university: "BUET",
    subjects: ["ICT", "Higher Math"],
    location: "Mirpur, Dhaka",
    experienceYears: 3,
    rating: 4.7,
    reviewCount: 34,
    availability: "Weekends",
  },
  {
    id: "t3",
    fullName: "Nusrat Jahan",
    photoUrl: "https://i.pravatar.cc/150?img=32",
    qualification: "MA in English, JU",
    university: "Jahangirnagar University",
    subjects: ["English", "General Knowledge"],
    location: "Uttara, Dhaka",
    experienceYears: 7,
    rating: 5.0,
    reviewCount: 91,
    availability: "Flexible",
  },
  {
    id: "t4",
    fullName: "Tanvir Ahmed",
    photoUrl: "https://i.pravatar.cc/150?img=59",
    qualification: "BBA, IBA-DU",
    university: "IBA, University of Dhaka",
    subjects: ["Accounting", "Business Studies"],
    location: "Bashundhara, Dhaka",
    experienceYears: 4,
    rating: 4.8,
    reviewCount: 28,
    availability: "Weekdays",
  },
];

export const LIVE_TUITION_POSTS: TuitionPost[] = [
  {
    id: "p1",
    title: "Need Math & Physics tutor for Class 9 (English Medium)",
    class: "Class 9",
    medium: "English Medium",
    subject: "Mathematics, Physics",
    daysPerWeek: 4,
    salary: 8000,
    location: "Gulshan, Dhaka",
    teachingMode: "offline",
    genderPreference: "any",
    description:
      "Looking for an experienced tutor to help with O-Level Math and Physics fundamentals ahead of exams.",
    status: "open",
    deadline: "2026-08-20",
    applicantCount: 6,
    createdAt: "2026-07-28",
  },
  {
    id: "p2",
    title: "Spoken English for adult beginner",
    class: "Adult Learner",
    medium: "General",
    subject: "Spoken English",
    daysPerWeek: 3,
    salary: 6000,
    location: "Online",
    teachingMode: "online",
    genderPreference: "female",
    description: "Need a patient tutor to help build conversational confidence in English.",
    status: "open",
    deadline: "2026-08-15",
    applicantCount: 11,
    createdAt: "2026-07-30",
  },
  {
    id: "p3",
    title: "HSC Chemistry & Biology, Bangla Medium",
    class: "HSC (Class 12)",
    medium: "Bangla Medium",
    subject: "Chemistry, Biology",
    daysPerWeek: 5,
    salary: 12000,
    location: "Chattogram",
    teachingMode: "offline",
    genderPreference: "any",
    description: "Preparing for medical admission — need a rigorous, exam-focused tutor.",
    status: "open",
    deadline: "2026-08-25",
    applicantCount: 3,
    createdAt: "2026-08-01",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "5 Habits of Highly Effective Students",
    slug: "5-habits-of-highly-effective-students",
    excerpt:
      "Small, consistent habits separate students who thrive from those who struggle. Here's what actually works.",
    content: `Effective studying isn't about long hours — it's about consistent, deliberate habits.

**1. Study in short, focused sessions.** 25–40 minutes of deep focus beats three unfocused hours. Take a real break between sessions.

**2. Teach it back.** If you can explain a topic simply to someone else, you actually understand it. If you can't, you've found your gap.

**3. Review before you forget, not after.** Revisit new material within 24 hours, then again a few days later. This single habit does more for retention than almost anything else.

**4. Sleep is part of studying.** Memory consolidation happens during sleep. Cramming through the night trades short-term cramming for long-term forgetting.

**5. Ask for help early.** A good tutor can save you weeks of confusion on a topic that would otherwise compound. Don't wait until you're behind.`,
    category: "Study Tips",
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    author: "Progoti Shikkha Team",
    publishedAt: "2026-07-15",
    readMinutes: 4,
  },
  {
    id: "b2",
    title: "How to Choose the Right Tutor for Your Child",
    slug: "how-to-choose-the-right-tutor",
    excerpt:
      "Qualifications matter, but they're not the whole story. Here's a practical checklist for parents.",
    content: `Choosing a tutor is a relationship decision, not just a credentials check.

**Look beyond the CV.** A strong academic background matters, but so does the tutor's ability to explain things patiently and adapt to your child's pace.

**Ask about their teaching approach.** Do they focus on rote memorization, or on building real understanding? Ask for a short trial session before committing.

**Check communication style.** Does the tutor give you regular updates on progress? Are they responsive when you have questions?

**Trust your child's feedback.** After the first couple of sessions, ask your child how it felt — engaged, bored, confused, motivated? Their answer tells you more than any resume.`,
    category: "Parenting",
    coverImage:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
    author: "Progoti Shikkha Team",
    publishedAt: "2026-07-22",
    readMinutes: 5,
  },
  {
    id: "b3",
    title: "Making the Most of Online Tuition",
    slug: "making-the-most-of-online-tuition",
    excerpt:
      "Online learning works — if it's set up right. Practical tips for students and tutors alike.",
    content: `Online tuition can be just as effective as in-person — with the right setup.

**Treat it like a real class.** Sit at a desk, not in bed. Have your books, notebook, and pen ready before the session starts.

**Use a second screen or split view.** Being able to see the tutor and your notes/slides at the same time keeps you engaged instead of switching tabs.

**Speak up when confused.** It's easier to zone out on a video call. Make a habit of pausing the tutor and asking questions in the moment.

**Keep sessions consistent.** The same time, same days each week builds a routine that makes online learning stick.`,
    category: "Online Learning",
    coverImage:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&q=80",
    author: "Progoti Shikkha Team",
    publishedAt: "2026-08-01",
    readMinutes: 3,
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "new_application",
    message: "Rezaul Karim applied to your post: Need Math & Physics tutor for Class 9",
    isRead: false,
    createdAt: "2026-08-02T10:15:00Z",
  },
  {
    id: "n2",
    type: "tutor_hired",
    message: "You were hired for: HSC Chemistry & Biology, Bangla Medium",
    isRead: false,
    createdAt: "2026-08-02T08:40:00Z",
  },
  {
    id: "n3",
    type: "new_review",
    message: "You received a new 5-star review from a student.",
    isRead: true,
    createdAt: "2026-07-30T14:20:00Z",
  },
];

// --- Admin-facing datasets ---

export interface AdminStudentRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  postsCount: number;
  isSuspended: boolean;
  joinedAt: string;
}

export const ADMIN_STUDENTS: AdminStudentRow[] = [
  { id: "s1", fullName: "Rafi Ahmed", email: "rafi@example.com", phone: "+8801711111111", postsCount: 3, isSuspended: false, joinedAt: "2026-06-12" },
  { id: "s2", fullName: "Shirin Akhtar", email: "shirin@example.com", phone: "+8801722222222", postsCount: 1, isSuspended: false, joinedAt: "2026-06-20" },
  { id: "s3", fullName: "Kamrul Islam", email: "kamrul@example.com", phone: "+8801733333333", postsCount: 5, isSuspended: true, joinedAt: "2026-05-30" },
];

export interface AdminTutorRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: string[];
  rating: number;
  isApproved: boolean;
  isSuspended: boolean;
  joinedAt: string;
}

export const ADMIN_TUTORS: AdminTutorRow[] = [
  { id: "t1", fullName: "Farhana Akter", email: "farhana@example.com", phone: "+8801744444444", subjects: ["Math", "Physics"], rating: 4.9, isApproved: true, isSuspended: false, joinedAt: "2026-04-02" },
  { id: "t2", fullName: "Rezaul Karim", email: "rezaul@example.com", phone: "+8801755555555", subjects: ["ICT"], rating: 4.7, isApproved: true, isSuspended: false, joinedAt: "2026-05-14" },
  { id: "t3", fullName: "Imran Hossain", email: "imran@example.com", phone: "+8801766666666", subjects: ["English"], rating: 0, isApproved: false, isSuspended: false, joinedAt: "2026-08-01" },
];

export interface AdminReviewRow {
  id: string;
  tutorName: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const ADMIN_REVIEWS: AdminReviewRow[] = [
  { id: "r1", tutorName: "Farhana Akter", studentName: "Rafi Ahmed", rating: 5, comment: "Excellent tutor, very patient.", createdAt: "2026-07-28" },
  { id: "r2", tutorName: "Rezaul Karim", studentName: "Shirin Akhtar", rating: 4, comment: "Good, but sometimes late.", createdAt: "2026-07-25" },
];

export interface AdminMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
}

export const ADMIN_MESSAGES: AdminMessageRow[] = [
  { id: "m1", name: "Nusrat Jahan", email: "nusrat@example.com", subject: "Question about tutor verification", message: "How long does tutor approval usually take?", status: "new", createdAt: "2026-08-02" },
  { id: "m2", name: "Tanvir Ahmed", email: "tanvir@example.com", subject: "Partnership inquiry", message: "We'd like to discuss a coaching center partnership.", status: "read", createdAt: "2026-07-30" },
];

export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export const ADMIN_CATEGORIES: AdminCategoryRow[] = [
  { id: "c1", name: "Study Tips", slug: "study-tips", postCount: 4 },
  { id: "c2", name: "Parenting", slug: "parenting", postCount: 2 },
  { id: "c3", name: "Online Learning", slug: "online-learning", postCount: 3 },
];

export const REVENUE_BY_MONTH = [
  { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 55000 },
  { month: "May", revenue: 61000 },
  { month: "Jun", revenue: 78000 },
  { month: "Jul", revenue: 94000 },
  { month: "Aug", revenue: 68000 },
];

export const SIGNUPS_BY_MONTH = [
  { month: "Mar", students: 120, tutors: 45 },
  { month: "Apr", students: 145, tutors: 58 },
  { month: "May", students: 168, tutors: 62 },
  { month: "Jun", students: 210, tutors: 80 },
  { month: "Jul", students: 260, tutors: 95 },
  { month: "Aug", students: 190, tutors: 70 },
];
