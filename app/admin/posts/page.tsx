"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { LIVE_TUITION_POSTS } from "@/data/mock";
import { TuitionPost } from "@/types";

export default function ManagePostsPage() {
  const [rows, setRows] = useState<TuitionPost[]>(LIVE_TUITION_POSTS);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TuitionPost | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success("Tuition post deleted");
    setDeleteTarget(null);
  };

  const filtered = rows.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<TuitionPost>[] = [
    { header: "Title", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.title}</span> },
    { header: "Subject", render: (r) => r.subject },
    { header: "Location", render: (r) => r.location },
    { header: "Salary", render: (r) => `৳${r.salary.toLocaleString()}` },
    { header: "Applicants", render: (r) => r.applicantCount },
    { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      render: (r) => (
        <Button
          size="sm"
          variant="ghost"
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          onClick={() => setDeleteTarget(r)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(r) => r.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tuition posts..."
        emptyMessage="No tuition posts match your search."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this tuition post?"
        description={`"${deleteTarget?.title}" and all its applications will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
