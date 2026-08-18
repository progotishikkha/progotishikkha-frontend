"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { ADMIN_STUDENTS, AdminStudentRow } from "@/data/mock";

export default function ManageStudentsPage() {
  const [rows, setRows] = useState<AdminStudentRow[]>(ADMIN_STUDENTS);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminStudentRow | null>(null);

  const toggleSuspend = (id: string) => {
    setRows((prev) => prev.map((s) => (s.id === id ? { ...s, isSuspended: !s.isSuspended } : s)));
    toast.success("Student status updated");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast.success("Student account deleted");
    setDeleteTarget(null);
  };

  const filtered = rows.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AdminStudentRow>[] = [
    { header: "Name", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.fullName}</span> },
    { header: "Email", render: (r) => r.email },
    { header: "Phone", render: (r) => r.phone },
    { header: "Posts", render: (r) => r.postsCount },
    { header: "Status", render: (r) => <StatusBadge status={r.isSuspended ? "suspended" : "approved"} /> },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-1.5">
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
        searchPlaceholder="Search students..."
        emptyMessage="No students match your search."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this student account?"
        description={`${deleteTarget?.fullName}'s account and all their tuition posts will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
