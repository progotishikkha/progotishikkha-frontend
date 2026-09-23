"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, Trash2, Phone, MessageCircle, ShieldCheck, UserCircle2 } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { adminService } from "@/services/adminService";
import { AdminStudentRow } from "@/types";
import { getErrorMessage } from "@/lib/errorMessage";
import { whatsappHrefFor } from "@/lib/contactLinks";

const waHref = (n?: string) => whatsappHrefFor(n);

export default function ManageStudentsPage() {
  const [rows, setRows] = useState<AdminStudentRow[]>([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminStudentRow | null>(null);
  useEffect(() => { adminService.listStudents().then(setRows).catch((e) => toast.error(getErrorMessage(e, "Couldn't load students."))); }, []);

  const toggleSuspend = async (row: AdminStudentRow) => {
    try { await adminService.toggleSuspend(row.user.id); setRows((prev) => prev.map((s) => s.id === row.id ? { ...s, user: { ...s.user, isSuspended: !s.user.isSuspended } } : s)); toast.success("Student status updated"); }
    catch (e) { toast.error(getErrorMessage(e, "Couldn't update status.")); }
  };
  const confirmDelete = async () => { if (!deleteTarget) return; try { await adminService.deleteUser(deleteTarget.user.id); setRows((prev) => prev.filter((s) => s.id !== deleteTarget.id)); toast.success("Student account deleted"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't delete student.")); } finally { setDeleteTarget(null); } };
  const filtered = useMemo(() => rows.filter((s) => `${s.user.fullName} ${s.user.email}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const columns: Column<AdminStudentRow>[] = [
    { header: "Profile", render: (r) => <div className="flex items-center gap-2">{r.profilePhoto?.url ? <img src={r.profilePhoto.url} alt={r.user.fullName} className="h-9 w-9 rounded-full object-cover" /> : <UserCircle2 className="h-9 w-9 text-slate-400" />}<span className="font-medium text-brand-navy dark:text-white">{r.user.fullName}</span></div> },
    { header: "Email", render: (r) => r.user.email },
    { header: "Phone", render: (r) => r.user.phone },
    { header: "Verification", render: (r) => <StatusBadge status={r.verificationStatus === "verified" ? "approved" : r.verificationStatus === "rejected" ? "rejected" : "pending"} /> },
    { header: "Posts", render: (r) => r.postsCount },
    { header: "Contact", render: (r) => <div className="flex gap-1.5"><a href={`tel:${r.user.phone}`}><Button size="sm" variant="ghost"><Phone className="h-4 w-4" /></Button></a>{waHref(r.whatsappNumber || r.user.phone) && <a href={waHref(r.whatsappNumber || r.user.phone) ?? "#"} target="_blank" rel="noreferrer"><Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4" /></Button></a>}</div> },
    { header: "Actions", render: (r) => <div className="flex gap-1.5">{r.verificationStatus !== "verified" && <Button size="sm" variant="outline" onClick={async () => { await adminService.verifyStudent(r.id, "verified"); setRows((p) => p.map((x) => x.id === r.id ? { ...x, verificationStatus: "verified" } : x)); toast.success("Student verified"); }}><ShieldCheck className="h-4 w-4" /></Button>}<Button size="sm" variant="ghost" onClick={() => toggleSuspend(r)}>{r.user.isSuspended ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}</Button><Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteTarget(r)}><Trash2 className="h-4 w-4" /></Button></div> },
  ];

  return <div><DataTable columns={columns} rows={filtered} getRowId={(r) => r.id} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search students..." emptyMessage="No students match your search." /><ConfirmDialog open={!!deleteTarget} title="Delete this student account?" description={`${deleteTarget?.user.fullName}'s account and all their tuition posts will be permanently deleted.`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} /></div>;
}
