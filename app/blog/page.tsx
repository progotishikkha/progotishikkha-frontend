"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/data/mock";

const CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Guidance for students, parents & tutors"
          description="Practical, no-fluff advice on studying, tutoring, and making the most of every session."
        />

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "bg-brand-blue text-white"
                    : "bg-brand-50 text-brand-navy hover:bg-brand-100 dark:bg-white/5 dark:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-slate-400">
            No articles match your search. Try a different keyword or category.
          </p>
        )}
      </Container>
    </div>
  );
}
