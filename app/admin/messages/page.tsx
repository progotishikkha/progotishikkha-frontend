"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Eye } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ADMIN_MESSAGES, AdminMessageRow } from "@/data/mock";

export default function ManageMessagesPage() {
  const [rows, setRows] = useState<AdminMessageRow[]>(ADMIN_MESSAGES);
  const [search, setSearch] = useState("");

  const markRead = (id: string) => {
    setRows((prev) => prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)));
  };

  const markResolved = (id: string) => {
    setRows((prev) => prev.map((m) => (m.id === id ? { ...m, status: "resolved" } : m)));
    toast.success("Message marked as resolved");
  };

  const filtered = rows.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AdminMessageRow>[] = [
    { header: "From", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.name}</span> },
    { header: "Email", render: (r) => r.email },
    { header: "Subject", render: (r) => r.subject },
    { header: "Status", render: (r) => <StatusBadge status={r.status === "new" ? "pending" : r.status === "resolved" ? "approved" : "closed"} /> },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-1.5">
          {r.status === "new" && (
            <Button size="sm" variant="ghost" onClick={() => markRead(r.id)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {r.status !== "resolved" && (
            <Button size="sm" variant="outline" onClick={() => markResolved(r.id)}>
              <CheckCircle2 className="h-4 w-4" />
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={filtered}
      getRowId={(r) => r.id}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search messages..."
      emptyMessage="No messages match your search."
    />
  );
}
