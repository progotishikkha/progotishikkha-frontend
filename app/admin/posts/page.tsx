"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Phone, MessageCircle, Link2, Unlink2, Trash2, UserCircle2, UserRound, X, CheckCircle2, Clock3 } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { adminService, AdminPostDetail, AdminPostListItem } from "@/services/adminService";
import { getErrorMessage } from "@/lib/errorMessage";
import { whatsappHrefFor } from "@/lib/contactLinks";

const waHref = (n?: string) => whatsappHrefFor(n);

function Avatar({ name, url }: { name: string; url?: string }) {
  return url
    ? <img src={url} alt={name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900" />
    : <UserCircle2 className="h-10 w-10 text-slate-400" aria-hidden="true" />;
}


function ProfileDialog({
  profile,
  role,
  onClose,
}: {
  profile: any;
  role: "student" | "tutor";
  onClose: () => void;
}) {
  if (!profile) return null;
  const photo = profile.profilePhoto?.url;
  const name = profile.fullName ?? (role === "student" ? "Student" : "Tutor");
  const fields =
    role === "student"
      ? [
          ["Location", profile.location],
          ["Email", profile.email],
          ["Phone", profile.phone],
          ["WhatsApp", profile.whatsappNumber],
          ["Verification", profile.verificationStatus],
        ]
      : [
          ["Qualification", profile.qualification],
          ["University", profile.university],
          ["Department", profile.department],
          ["Experience", profile.experienceYears != null ? `${profile.experienceYears} years` : undefined],
          ["Subjects", profile.subjects?.length ? profile.subjects.join(", ") : undefined],
          ["Skills", profile.skills?.length ? profile.skills.join(", ") : undefined],
          ["Location", profile.location],
          ["Availability", profile.availability],
          ["Email", profile.email],
          ["Phone", profile.phone],
          ["WhatsApp", profile.whatsappNumber],
          ["Verification", profile.verificationStatus],
          ["Rating", profile.rating != null ? `${Number(profile.rating).toFixed(1)} (${profile.reviewCount ?? 0} reviews)` : undefined],
          ["Completed Tuitions", profile.completedTuitionCount],
        ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            {photo ? (
              <img src={photo} alt={name} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <UserCircle2 className="h-14 w-14 text-slate-400" />
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-blue">{role} profile</p>
              <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">{name}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close profile" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map(([label, value]) => value ? (
              <div key={label} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">{String(value)}</p>
              </div>
            ) : null)}
          </div>
          {role === "tutor" && profile.about && (
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs text-slate-400">About</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{profile.about}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const connectionLabel: Record<string, string> = {
  not_connected: "Not connected",
  pending_admin: "Waiting for admin",
  contacting: "Admin contacting both",
  connected: "Connected",
  failed: "Contact failed",
  cancelled: "Cancelled",
};

export default function ManagePostsPage() {
  const [rows, setRows] = useState<AdminPostListItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminPostDetail | null>(null);
  const [profileView, setProfileView] = useState<{ profile: any; role: "student" | "tutor" } | null>(null);

  const loadPosts = () =>
    adminService.listTuitionPosts()
      .then(setRows)
      .catch((e) => toast.error(getErrorMessage(e, "Couldn't load tuition posts.")));

  useEffect(() => { loadPosts(); }, []);

  const filtered = useMemo(
    () => rows.filter((x) => `${x.post.title} ${x.post.subject} ${x.student?.fullName ?? ""} ${x.hiredTutor?.fullName ?? ""}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const columns: Column<AdminPostListItem>[] = [
    {
      header: "Post / Student",
      render: (r) => <div className="flex min-w-[250px] items-center gap-3">
        <Avatar name={r.student?.fullName ?? "Student"} url={r.student?.profilePhoto?.url} />
        <div className="min-w-0">
          <p className="font-medium text-brand-navy dark:text-white">{r.post.title}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <button
              type="button"
              title="View student full profile"
              aria-label={`View ${r.student?.fullName ?? "student"} profile`}
              className="rounded-full p-0.5 text-brand-blue hover:bg-brand-blue/10"
              onClick={async () => {
                try {
                  const detail = await adminService.getTuitionPostDetail(r.post.id);
                  setProfileView({ profile: detail.student, role: "student" });
                } catch (e) {
                  toast.error(getErrorMessage(e, "Couldn't load student profile."));
                }
              }}
            >
              <UserRound className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="truncate text-left text-xs text-slate-500 hover:text-brand-blue hover:underline"
              onClick={async () => {
                try {
                  const detail = await adminService.getTuitionPostDetail(r.post.id);
                  setProfileView({ profile: detail.student, role: "student" });
                } catch (e) {
                  toast.error(getErrorMessage(e, "Couldn't load student profile."));
                }
              }}
            >
              {r.student?.fullName ?? "Student unavailable"}
            </button>
          </div>
        </div>
      </div>
    },
    { header: "Subject", render: (r) => r.post.subject },
    { header: "Location", render: (r) => r.post.location },
    { header: "Salary", render: (r) => `৳${r.post.salary.toLocaleString()}` },
    { header: "Applicants", render: (r) => <span>{r.applicantCount} <span className="text-xs text-slate-400">({r.hiredCount} hired)</span></span> },
    { header: "Connection", render: (r) => r.connectedCount > 0 ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4" />Connected</span> : <span className="inline-flex items-center gap-1 text-amber-600"><Clock3 className="h-4 w-4" />Needs admin</span> },
    { header: "Status", render: (r) => <StatusBadge status={r.post.status} /> },
    { header: "Actions", render: (r) => <div className="flex gap-1.5">
      <Button size="sm" variant="outline" onClick={async () => { try { setSelected(await adminService.getTuitionPostDetail(r.post.id)); } catch (e) { toast.error(getErrorMessage(e, "Couldn't load post details.")); } }}>Manage</Button>
      <Button size="sm" variant="ghost" className="text-red-500" onClick={async () => { if (!window.confirm("Delete this tuition post?")) return; try { await adminService.deleteTuitionPost(r.post.id); setRows((prev) => prev.filter((x) => x.post.id !== r.post.id)); toast.success("Tuition post deleted"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't delete post.")); } }}><Trash2 className="h-4 w-4" /></Button>
    </div> },
  ];

  if (selected) {
    const student = selected.student;
    const connected = selected.applications.filter((a) => a.status === "hired" && a.connectionStatus === "connected").length;
    return <>
      <div className="space-y-6">
      <Button size="sm" variant="ghost" onClick={() => setSelected(null)}><ArrowLeft className="h-4 w-4" />Back to tuition posts</Button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={student?.fullName ?? "Student"} url={student?.profilePhoto?.url} />
            <div>
              <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{selected.post.title}</h2>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <span>Posted by:</span>
                <button
                  type="button"
                  title="View student full profile"
                  className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
                  onClick={() => setProfileView({ profile: student, role: "student" })}
                >
                  <UserRound className="h-4 w-4" />
                  {student?.fullName ?? "Unknown student"}
                </button>
              </div>
            </div>
          </div>
          <div className="text-right text-sm"><p className="text-slate-400">Connection</p><p className="font-semibold">{connected} connected</p></div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div><p className="text-xs text-slate-400">Student</p><p className="font-medium">{student?.fullName ?? "—"}</p><p className="text-sm text-slate-500">{student?.email ?? "—"}</p></div>
          <div><p className="text-xs text-slate-400">Tuition</p><p className="font-medium">{selected.post.subject} • {selected.post.class}</p><p className="text-sm text-slate-500">৳{selected.post.salary.toLocaleString()} • {selected.post.location}</p></div>
          <div><p className="text-xs text-slate-400">Admin contact</p><div className="mt-1 flex gap-2">{student?.phone && <a href={`tel:${student.phone}`}><Button size="sm" variant="outline"><Phone className="h-4 w-4" />Call</Button></a>}{waHref(student?.whatsappNumber || student?.phone) && <a href={waHref(student?.whatsappNumber || student?.phone) ?? "#"} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><MessageCircle className="h-4 w-4" />WhatsApp</Button></a>}</div></div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
        <h3 className="font-display font-semibold text-brand-navy dark:text-white">Admin connection workflow</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Only the admin connects the student and tutor. Start contact, communicate with both sides, then mark the hired tutor as connected. This status is stored on the application, so you can always see who is connected.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-display font-semibold text-brand-navy dark:text-white">Applicants ({selected.applications.length})</h3><span className="text-sm text-slate-500">{connected} connected</span></div>
        {selected.applications.length === 0 && <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">No tutor has applied yet.</div>}
        {selected.applications.map((application) => {
          const tutor = application.tutor;
          const fullName = tutor?.user?.fullName ?? "Tutor";
          const phone = tutor?.user?.phone;
          const wa = waHref(application.whatsappNumber || phone);
          const hired = application.status === "hired";
          const state = application.connectionStatus ?? "not_connected";
          return <div key={application.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={fullName} url={tutor?.profilePhoto?.url} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="View tutor full profile"
                      aria-label={`View ${fullName} profile`}
                      className="rounded-full p-0.5 text-brand-blue hover:bg-brand-blue/10"
                      onClick={() => setProfileView({ profile: { ...tutor, fullName, email: tutor?.user?.email, phone: tutor?.user?.phone }, role: "tutor" })}
                    >
                      <UserRound className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="font-semibold text-brand-navy hover:text-brand-blue hover:underline dark:text-white"
                      onClick={() => setProfileView({ profile: { ...tutor, fullName, email: tutor?.user?.email, phone: tutor?.user?.phone }, role: "tutor" })}
                    >
                      {fullName}
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">{tutor?.qualification ?? "—"} • {tutor?.university ?? "—"}</p>
                  <p className="text-xs text-slate-500">{application.coverMessage}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${state === "connected" ? "bg-emerald-100 text-emerald-700" : state === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{connectionLabel[state] ?? state}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">Application: <strong>{application.status}</strong></span>
              {phone && <a href={`tel:${phone}`}><Button size="sm" variant="outline"><Phone className="h-4 w-4" />Call tutor</Button></a>}
              {wa && <a href={wa} target="_blank" rel="noreferrer"><Button size="sm" variant="outline"><MessageCircle className="h-4 w-4" />WhatsApp tutor</Button></a>}
              {hired && (state === "pending_admin" || state === "failed" || state === "not_connected") && <Button size="sm" variant="outline" onClick={async () => { try { await adminService.startContact(application.id); setSelected((prev) => prev ? { ...prev, applications: prev.applications.map((a) => a.id === application.id ? { ...a, connectionStatus: "contacting" } : a) } : prev); toast.success("Admin contact started"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't start contact.")); } }}><Link2 className="h-4 w-4" />Start contact</Button>}
              {hired && (state === "pending_admin" || state === "contacting") && <Button size="sm" onClick={async () => { try { await adminService.markConnected(application.id); setSelected((prev) => prev ? { ...prev, applications: prev.applications.map((a) => a.id === application.id ? { ...a, connectionStatus: "connected" } : a) } : prev); toast.success("Student + tutor connected"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't mark connection.")); } }}><CheckCircle2 className="h-4 w-4" />Mark connected</Button>}
              {hired && (state === "pending_admin" || state === "contacting") && <Button size="sm" variant="ghost" onClick={async () => { const reason = window.prompt("Why did the connection fail?"); if (reason === null) return; try { await adminService.markConnectionFailed(application.id, reason); setSelected((prev) => prev ? { ...prev, applications: prev.applications.map((a) => a.id === application.id ? { ...a, connectionStatus: "failed" } : a) } : prev); toast.success("Connection marked failed"); } catch (e) { toast.error(getErrorMessage(e, "Couldn't update connection.")); } }}><Unlink2 className="h-4 w-4" />Failed</Button>}
            </div>
          </div>;
        })}
      </div>

      {selected.hiredTutor && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30"><div className="flex items-center gap-3"><Avatar name={selected.hiredTutor.fullName} url={selected.hiredTutor.profilePhoto?.url} /><div><p className="font-semibold">Hired tutor: {selected.hiredTutor.fullName}</p><p className="text-sm text-slate-600 dark:text-slate-300">{selected.hiredTutor.phone}</p></div></div></div>}
      </div>
      {profileView && <ProfileDialog profile={profileView.profile} role={profileView.role} onClose={() => setProfileView(null)} />}
    </>;
  }

  return <>
    <div><DataTable columns={columns} rows={filtered} getRowId={(r) => r.post.id} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search post, student, subject..." emptyMessage="No tuition posts match your search." /></div>
    {profileView && <ProfileDialog profile={profileView.profile} role={profileView.role} onClose={() => setProfileView(null)} />}
  </>;
}
