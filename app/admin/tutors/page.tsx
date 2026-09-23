"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, Trash2, ShieldCheck, Phone, MessageCircle, UserCircle2 } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { adminService } from "@/services/adminService";
import { AdminTutorRow } from "@/types";
import { getErrorMessage } from "@/lib/errorMessage";
import { whatsappHrefFor } from "@/lib/contactLinks";

const waHref = (n?: string) => whatsappHrefFor(n);

export default function ManageTutorsPage() {
  const [rows, setRows] = useState<AdminTutorRow[]>([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminTutorRow | null>(null);
  useEffect(() => { adminService.listTutors().then(setRows).catch((e) => toast.error(getErrorMessage(e, "Couldn't load tutors."))); }, []);

  const approve = async (id: string) => { try { await adminService.verifyTutor(id, "verified"); setRows((p) => p.map((t) => t.id === id ? { ...t, verificationStatus: "verified", isApproved: true } : t)); toast.success("Tutor verified successfully"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't verify tutor.")); } };
  const toggleSuspend = async (row: AdminTutorRow) => { try { await adminService.toggleSuspend(row.user.id); setRows((p) => p.map((t) => t.id === row.id ? { ...t, user: { ...t.user, isSuspended: !t.user.isSuspended } } : t)); toast.success("Tutor status updated"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't update status.")); } };
  const confirmDelete = async () => { if (!deleteTarget) return; try { await adminService.deleteUser(deleteTarget.user.id); setRows((p) => p.filter((t) => t.id !== deleteTarget.id)); toast.success("Tutor account deleted"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't delete tutor.")); } finally { setDeleteTarget(null); } };
  const filtered = useMemo(() => rows.filter((t) => `${t.user.fullName} ${t.user.email}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const columns: Column<AdminTutorRow>[] = [
    { header: "Profile", render: (r) => <div className="flex items-center gap-2">{r.profilePhoto?.url ? <img src={r.profilePhoto.url} alt={r.user.fullName} className="h-9 w-9 rounded-full object-cover" /> : <UserCircle2 className="h-9 w-9 text-slate-400" />}<span className="font-medium text-brand-navy dark:text-white">{r.user.fullName}</span></div> },
    { header: "Email", render: (r) => r.user.email },
    { header: "Subjects", render: (r) => r.subjects.join(", ") },
    { header: "Verification", render: (r) => <StatusBadge status={(r.verificationStatus === "verified" || (r.verificationStatus == null && r.isApproved)) ? "approved" : r.verificationStatus === "rejected" ? "rejected" : "pending"} /> },
    { header: "Rating", render: (r) => (r.rating > 0 ? r.rating.toFixed(1) : "—") },
    { header: "Contact", render: (r) => <div className="flex gap-1.5"><a href={`tel:${r.user.phone}`}><Button size="sm" variant="ghost"><Phone className="h-4 w-4" /></Button></a>{waHref(r.whatsappNumber || r.user.phone) && <a href={waHref(r.whatsappNumber || r.user.phone) ?? "#"} target="_blank" rel="noreferrer"><Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4" /></Button></a>}</div> },
    { header: "Actions", render: (r) => <div className="flex gap-1.5">{!r.isApproved && <Button size="sm" variant="outline" onClick={() => approve(r.id)}><ShieldCheck className="h-4 w-4" />Verify</Button>}<Button size="sm" variant="ghost" onClick={() => toggleSuspend(r)}>{r.user.isSuspended ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}</Button><Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteTarget(r)}><Trash2 className="h-4 w-4" /></Button></div> },
  ];

  return <div><DataTable columns={columns} rows={filtered} getRowId={(r) => r.id} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search tutors..." emptyMessage="No tutors match your search." /><ConfirmDialog open={!!deleteTarget} title="Delete this tutor account?" description={`${deleteTarget?.user.fullName}'s account, applications, and donation history will be permanently deleted.`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} /></div>;
}
