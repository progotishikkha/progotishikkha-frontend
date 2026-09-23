import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/data/mock";

interface Props {
  params: Promise<{ slug: string }>;
}

function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
    },
  };
}

function renderContent(content: string) {
  return content.split("\n\n").map((paragraph, i) => {
    const boldMatch = /^\*\*(.+?)\*\*(.*)$/.exec(paragraph);
    if (boldMatch) {
      return (
        <p key={i} className="mb-4 leading-relaxed">
          <strong className="text-brand-navy dark:text-white">{boldMatch[1]}</strong>
          {boldMatch[2]}
        </p>
      );
    }
    return (
      <p key={i} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    );
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <span className="mt-6 inline-block rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-semibold text-brand-gold">
          {post.category}
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-brand-navy dark:text-white sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-5 text-sm text-slate-400">
          <span>{post.author}</span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readMinutes} min read
          </span>
        </div>

        <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="mt-10 text-base text-slate-600 dark:text-slate-300">
          {renderContent(post.content)}
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="mt-16 max-w-3xl border-t border-slate-200 pt-12 dark:border-slate-800">
          <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">
            Related articles
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
