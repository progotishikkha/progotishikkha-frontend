import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Search,
  Bookmark,
  ClipboardList,
  Bell,
  User,
  Settings,
  Users,
  GraduationCap,
  Newspaper,
  Star,
  Mail,
  BarChart3,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  student: [
    { href: "/student", label: "Overview", icon: LayoutDashboard },
    { href: "/student/posts", label: "My Tuition Posts", icon: FileText },
    { href: "/student/posts/create", label: "Create Post", icon: PlusCircle },
    { href: "/student/notifications", label: "Notifications", icon: Bell },
    { href: "/student/profile", label: "Profile", icon: User },
    { href: "/student/settings", label: "Settings", icon: Settings },
  ],
  tutor: [
    { href: "/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/tutor/browse", label: "Browse Tuitions", icon: Search },
    { href: "/tutor/saved", label: "Saved Tuitions", icon: Bookmark },
    { href: "/tutor/applications", label: "My Applications", icon: ClipboardList },
    { href: "/tutor/notifications", label: "Notifications", icon: Bell },
    { href: "/tutor/profile", label: "Profile", icon: User },
    { href: "/tutor/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/admin", label: "Analytics", icon: BarChart3 },
    { href: "/admin/students", label: "Students", icon: GraduationCap },
    { href: "/admin/tutors", label: "Tutors", icon: ShieldCheck },
    { href: "/admin/posts", label: "Tuition Posts", icon: FileText },
    { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/messages", label: "Contact Messages", icon: Mail },
    { href: "/admin/categories", label: "Categories", icon: FolderKanban },
    { href: "/admin/notifications", label: "Notification Management", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};
