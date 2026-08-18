"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, Trash2, ShieldCheck } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { ADMIN_TUTORS, AdminTutorRow } from "@/data/mock";

export default function ManageTutorsPage() {
  const [rows, setRows] = useState<AdminTutorRow[]>(ADMIN_TUTORS);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminTutorRow | null>(null);

  const approve = (id: string) => {
    setRows((prev) => prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t)));
    toast.success("Tutor approved — they can now apply to tuition posts");
  };

  const toggleSuspend = (id: string) => {
    setRows((prev) => prev.map((t) => (t.id === id ? { ...t, isSuspended: !t.isSuspended } : t)));
    toast.success("Tutor status updated");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    toast.success("Tutor account deleted");
    setDeleteTarget(null);
  };

  const filtered = rows.filter(
    (t) =>
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AdminTutorRow>[] = [
    { header: "Name", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.fullName}</span> },
    { header: "Email", render: (r) => r.email },
    { header: "Subjects", render: (r) => r.subjects.join(", ") },
    { header: "Rating", render: (r) => (r.rating > 0 ? r.rating.toFixed(1) : "—") },
    {
      header: "Status",
      render: (r) => (
        <div className="flex gap-1.5">
          <StatusBadge status={r.isSuspended ? "suspended" : r.isApproved ? "approved" : "pending"} />
        </div>
      ),
    },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-1.5">
          {!r.isApproved && (
            <Button size="sm" variant="outline" onClick={() => approve(r.id)}>
              <ShieldCheck className="h-4 w-4" />
              Approve
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => toggleSuspend(r.id)}>
            {r.isSuspended ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
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
      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(r) => r.id}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tutors..."
        emptyMessage="No tutors match your search."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this tutor account?"
        description={`${deleteTarget?.fullName}'s account, applications, and reviews will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
