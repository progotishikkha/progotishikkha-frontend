"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, CircleCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { donationService, DonationInstructions } from "@/services/donationService";
import { Donation } from "@/types";
import { getErrorMessage } from "@/lib/errorMessage";

export default function TutorDonationsPage() {
  const [rows, setRows] = useState<Donation[]>([]);
  const [instructions, setInstructions] = useState<DonationInstructions | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactionIds, setTransactionIds] = useState<Record<string, string>>({});

  const load = async () => {
    try {
      const [donations, paymentInstructions] = await Promise.all([donationService.mine(), donationService.instructions()]);
      setRows(donations);
      setInstructions(paymentInstructions);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load donations."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const submit = async (id: string) => {
    const transactionId = transactionIds[id]?.trim();
    if (!transactionId) return toast.error("Enter the bKash transaction ID.");
    try {
      const updated = await donationService.submitPayment(id, transactionId);
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
      toast.success("Payment submitted for admin verification.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't submit payment."));
    }
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-brand-navy dark:text-white">Donation</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your first-month donation helps Progoti Shikkha continue its free tuition support.</p>
      </div>

      {instructions && (
        <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-5 dark:border-brand-blue/30">
          <p className="text-sm font-semibold text-brand-navy dark:text-white">bKash payment instructions</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Send the exact donation amount to:</p>
          <p className="mt-1 text-xl font-bold text-brand-navy dark:text-white">{instructions.accountNumber}</p>
          <p className="mt-1 text-xs text-slate-500">Donation rate: {instructions.percentage}% of the first-month salary.</p>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">No donation records yet.</div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const post = typeof row.tuitionPost === "object" ? row.tuitionPost : null;
            const payable = ["due", "overdue", "rejected"].includes(row.status);
            return (
              <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display font-semibold text-brand-navy dark:text-white">{post?.title ?? "Tuition"}</p>
                    <p className="mt-1 text-sm text-slate-500">First-month salary: ৳{row.firstMonthSalary.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Donation: ৳{row.donationAmount.toLocaleString()} ({row.percentage}%)</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800">
                    {row.status === "completed" ? <CircleCheck className="h-4 w-4 text-emerald-500" /> : <Clock3 className="h-4 w-4 text-amber-500" />}
                    {row.status.replaceAll("_", " ")}
                  </div>
                </div>

                {payable && (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="w-full sm:max-w-sm">
                      <Input
                        label="bKash transaction ID"
                        value={transactionIds[row.id] ?? row.transactionId ?? ""}
                        onChange={(e) => setTransactionIds((prev) => ({ ...prev, [row.id]: e.target.value }))}
                        placeholder="e.g. 8A1B2C3D"
                      />
                    </div>
                    <Button onClick={() => submit(row.id)}><CreditCard className="h-4 w-4" />Submit Payment</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
