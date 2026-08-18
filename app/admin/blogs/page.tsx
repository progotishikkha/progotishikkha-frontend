"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, Plus } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { BLOG_POSTS } from "@/data/mock";
import { BlogPost } from "@/types";

export default function ManageBlogsPage() {
  const [rows, setRows] = useState<BlogPost[]>(BLOG_POSTS);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success("Blog post deleted");
    setDeleteTarget(null);
  };

  const filtered = rows.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<BlogPost>[] = [
    { header: "Title", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.title}</span> },
    { header: "Category", render: (r) => r.category },
    { header: "Author", render: (r) => r.author },
    {
      header: "Published",
      render: (r) => new Date(r.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            onClick={() => setDeleteTarget(r)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New blog post
        </Button>
      </div>
      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(r) => r.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search blog posts..."
        emptyMessage="No blog posts match your search."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this blog post?"
        description={`"${deleteTarget?.title}" will be permanently removed from the site.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
