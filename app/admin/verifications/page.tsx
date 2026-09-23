"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Phone, MessageCircle } from "lucide-react";
import { adminService } from "@/services/adminService";
import { AdminStudentRow, AdminTutorRow } from "@/types";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/errorMessage";
import { whatsappHrefFor } from "@/lib/contactLinks";

const waHref = (n?: string) => whatsappHrefFor(n);

export default function AdminVerificationsPage() {
  const [students, setStudents] = useState<AdminStudentRow[]>([]);
  const [tutors, setTutors] = useState<AdminTutorRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, t] = await Promise.all([adminService.listStudents(), adminService.listTutors()]);
      setStudents(s); setTutors(t);
    } catch (err) { toast.error(getErrorMessage(err, "Couldn't load verification queue.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const verifyStudent = async (id: string, status: "verified" | "rejected") => {
    try {
      await adminService.verifyStudent(id, status);
      setStudents((prev) => prev.map((x) => x.id === id ? { ...x, verificationStatus: status } : x));
      toast.success(`Student ${status}`);
    } catch (err) { toast.error(getErrorMessage(err, "Couldn't update verification.")); }
  };

  const verifyTutor = async (id: string, status: "verified" | "rejected") => {
    try {
      await adminService.verifyTutor(id, status);
      setTutors((prev) => prev.map((x) => x.id === id ? { ...x, verificationStatus: status, isApproved: status === "verified" } : x));
      toast.success(`Tutor ${status}`);
    } catch (err) { toast.error(getErrorMessage(err, "Couldn't update verification.")); }
  };

  if (loading) return <div>Loading verification queue...</div>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">Student verification</h2>
        <div className="mt-4 space-y-3">
          {students.filter((x) => x.verificationStatus !== "verified").map((student) => {
            const contact = waHref(student.whatsappNumber || student.user.phone);
            return <div key={student.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="font-semibold text-brand-navy dark:text-white">{student.user.fullName}</p><p className="text-sm text-slate-500">{student.user.email}</p><p className="mt-1 text-xs text-slate-500">Status: {student.verificationStatus ?? "pending"}</p></div>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${student.user.phone}`}><Button size="sm" variant="outline"><Phone className="h-4 w-4" />Call</Button></a>
                  {contact && <a href={contact} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><MessageCircle className="h-4 w-4" />WhatsApp</Button></a>}
                  <Button size="sm" onClick={() => verifyStudent(student.id, "verified")}><CheckCircle2 className="h-4 w-4" />Verify</Button>
                  <Button size="sm" variant="ghost" onClick={() => verifyStudent(student.id, "rejected")}><XCircle className="h-4 w-4" />Reject</Button>
                </div>
              </div>
            </div>;
          })}
          {students.filter((x) => x.verificationStatus !== "verified").length === 0 && <p className="text-sm text-slate-500">No pending student verification.</p>}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">Tutor verification</h2>
        <div className="mt-4 space-y-3">
          {tutors.filter((x) => x.verificationStatus !== "verified").map((tutor) => {
            const contact = waHref(tutor.whatsappNumber || tutor.user.phone);
            return <div key={tutor.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="font-semibold text-brand-navy dark:text-white">{tutor.user.fullName}</p><p className="text-sm text-slate-500">{tutor.user.email}</p><p className="text-sm text-slate-500">{tutor.qualification ?? "—"} • {tutor.university ?? "—"}</p><p className="mt-1 text-xs text-slate-500">Status: {tutor.verificationStatus ?? "pending"}</p></div>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${tutor.user.phone}`}><Button size="sm" variant="outline"><Phone className="h-4 w-4" />Call</Button></a>
                  {contact && <a href={contact} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><MessageCircle className="h-4 w-4" />WhatsApp</Button></a>}
                  <Button size="sm" onClick={() => verifyTutor(tutor.id, "verified")}><CheckCircle2 className="h-4 w-4" />Verify</Button>
                  <Button size="sm" variant="ghost" onClick={() => verifyTutor(tutor.id, "rejected")}><XCircle className="h-4 w-4" />Reject</Button>
                </div>
              </div>
            </div>;
          })}
          {tutors.filter((x) => x.verificationStatus !== "verified").length === 0 && <p className="text-sm text-slate-500">No pending tutor verification.</p>}
        </div>
      </section>
    </div>
  );
}
