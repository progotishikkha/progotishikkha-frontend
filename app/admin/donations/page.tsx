"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock3, Phone, MessageCircle, AlertTriangle, ShieldBan, RotateCcw } from "lucide-react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { adminService } from "@/services/adminService";
import { Donation } from "@/types";
import { getErrorMessage } from "@/lib/errorMessage";
import { whatsappHrefFor } from "@/lib/contactLinks";

const waHref = (n?: string) => whatsappHrefFor(n);

// Spec section 16: admin donation dashboard must support filtering by
// All / Paid / Unpaid / Overdue / Payment Submitted / Rejected / Suspended.
// "Paid" maps to the model's "completed" status; "Unpaid" is a backend-side
// alias for due+overdue (see admin.service.listDonations).
const FILTERS: Array<{ label: string; value: string }> = [
  { label: "All", value: "all" },
  { label: "Paid", value: "completed" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Due", value: "due" },
  { label: "Overdue", value: "overdue" },
  { label: "Payment Submitted", value: "payment_submitted" },
  { label: "Rejected", value: "rejected" },
  { label: "Suspended", value: "suspended" },
];

export default function AdminDonationsPage() {
  const [rows, setRows] = useState<Donation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async (status: string) => {
    setLoading(true);
    try {
      setRows(await adminService.listDonations(status));
    } catch (e) {
      toast.error(getErrorMessage(e, "Couldn't load donations."));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const actions = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      toast.success(msg);
      await load(statusFilter);
    } catch (e) {
      toast.error(getErrorMessage(e, "Action failed."));
    }
  };

  const filtered = useMemo(
    () =>
      rows.filter((r: any) => {
        const tutor = typeof r.tutor === "object" ? r.tutor : null;
        const name = tutor?.user?.fullName ?? "";
        return name.toLowerCase().includes(search.toLowerCase());
      }),
    [rows, search]
  );

  const columns: Column<Donation>[] = [
    { header: "Tutor", render: (r: any) => r.tutor?.user?.fullName ?? "—" },
    { header: "Tuition", render: (r: any) => r.tuitionPost?.title ?? "—" },
    { header: "Salary", render: (r) => `৳${r.firstMonthSalary.toLocaleString()}` },
    { header: "Donation", render: (r) => `৳${r.donationAmount.toLocaleString()}` },
    { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { header: "Transaction", render: (r) => r.transactionId ?? "—" },
    {
      header: "Actions",
      render: (r: any) => {
        const phone = r.tutor?.user?.phone;
        const wa = waHref(r.tutor?.whatsappNumber || phone);
        return (
          <div className="flex flex-wrap gap-1.5">
            {r.status === "not_due" && (
              <Button size="sm" variant="outline" onClick={() => actions(() => adminService.markSalaryReceived(r.id), "Donation is now due")}>
                <Clock3 className="h-4 w-4" />
                Salary received
              </Button>
            )}
            {(r.status === "due" || r.status === "overdue") && (
              <Button size="sm" variant="outline" onClick={() => actions(() => adminService.remindDonation(r.id), "Reminder sent")}>
                <MessageCircle className="h-4 w-4" />
                Remind
              </Button>
            )}
            {r.status === "payment_submitted" && (
              <Button size="sm" onClick={() => actions(() => adminService.verifyDonation(r.id, true), "Payment verified")}>
                <CheckCircle2 className="h-4 w-4" />
                Verify
              </Button>
            )}
            {r.status === "payment_submitted" && (
              <Button size="sm" variant="ghost" onClick={() => actions(() => adminService.verifyDonation(r.id, false), "Payment rejected")}>
                <AlertTriangle className="h-4 w-4" />
                Reject
              </Button>
            )}
            {r.status === "due" && (
              <Button size="sm" variant="ghost" onClick={() => actions(() => adminService.markDonationOverdue(r.id), "Marked overdue")}>
                <AlertTriangle className="h-4 w-4" />
              </Button>
            )}
            {(r.status === "overdue" || r.status === "due") && (
              <Button size="sm" variant="ghost" onClick={() => actions(() => adminService.suspendDonationTutor(r.id), "Tutor suspended")}>
                <ShieldBan className="h-4 w-4" />
              </Button>
            )}
            {r.status === "suspended" && (
              <Button size="sm" variant="outline" onClick={() => actions(() => adminService.reinstateTutor(r.id), "Tutor reinstated")}>
                <RotateCcw className="h-4 w-4" />
                Reinstate
              </Button>
            )}
            {phone && (
              <a href={`tel:${phone}`}>
                <Button size="sm" variant="ghost">
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer">
                <Button size="sm" variant="ghost">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              statusFilter === f.value
                ? "bg-brand-navy text-white dark:bg-white dark:text-brand-navy"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div>Loading donations...</div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(r) => r.id}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search tutor..."
          emptyMessage="No donation records found."
        />
      )}
    </div>
  );
}
