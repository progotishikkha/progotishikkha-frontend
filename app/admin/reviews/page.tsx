"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Star } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { ADMIN_REVIEWS, AdminReviewRow } from "@/data/mock";

export default function ManageReviewsPage() {
  const [rows, setRows] = useState<AdminReviewRow[]>(ADMIN_REVIEWS);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewRow | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast.success("Review deleted");
    setDeleteTarget(null);
  };

  const filtered = rows.filter(
    (r) =>
      r.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AdminReviewRow>[] = [
    { header: "Tutor", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.tutorName}</span> },
    { header: "Student", render: (r) => r.studentName },
    {
      header: "Rating",
      render: (r) => (
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
          {r.rating}
        </span>
      ),
    },
    { header: "Comment", render: (r) => <span className="line-clamp-1 max-w-xs">{r.comment}</span> },
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
        searchPlaceholder="Search reviews..."
        emptyMessage="No reviews match your search."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this review?"
        description="This review will be permanently removed and the tutor's rating will be recalculated."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
