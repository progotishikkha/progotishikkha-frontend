import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical advice for students, parents, and tutors — study tips, tutor selection guidance, and online learning best practices.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
