"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ADMIN_CATEGORIES, AdminCategoryRow } from "@/data/mock";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ManageCategoriesPage() {
  const [rows, setRows] = useState<AdminCategoryRow[]>(ADMIN_CATEGORIES);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminCategoryRow | null>(null);

  const addCategory = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setRows((prev) => [
      ...prev,
      { id: `c${Date.now()}`, name: trimmed, slug: slugify(trimmed), postCount: 0 },
    ]);
    setNewName("");
    toast.success("Category added");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success("Category deleted");
    setDeleteTarget(null);
  };

  const columns: Column<AdminCategoryRow>[] = [
    { header: "Name", render: (r) => <span className="font-medium text-brand-navy dark:text-white">{r.name}</span> },
    { header: "Slug", render: (r) => <code className="text-xs text-slate-400">{r.slug}</code> },
    { header: "Posts", render: (r) => r.postCount },
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="max-w-xs flex-1">
          <Input
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
          />
        </div>
        <Button onClick={addCategory}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} emptyMessage="No categories yet." />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        description={`Posts under "${deleteTarget?.name}" will need to be reassigned to another category.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
