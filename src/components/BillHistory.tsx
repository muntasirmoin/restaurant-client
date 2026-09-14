import { useState } from "react";
import { useGetBillsQuery } from "@/redux/features/Bill/bill.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import config from "@/config";
interface IBillHistoryItem {
  _id: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  order:
    | {
        _id: string;
        orderType: "dine-in" | "walk-in";
        table?: { number: number };
      }
    | string;
}
export const BillHistory = () => {
  const [date, setDate] = useState("");
  const { data: billsRes, isFetching } = useGetBillsQuery(date || undefined);
  const allBills: IBillHistoryItem[] = billsRes?.data ?? [];
  const bills = date ? allBills : allBills.slice(0, 5);
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-medium">
          {date ? "Bill history" : "Recent bills"}
        </h2>
        {!date && (
          <p className="text-xs text-muted-foreground">
            Showing your 5 most recent bills. Pick a date above to see a full
            day's history.
          </p>
        )}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-auto"
          />
          {date && (
            <Button size="sm" variant="outline" onClick={() => setDate("")}>
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-lg border divide-y">
        {isFetching && (
          <p className="p-4 text-sm text-muted-foreground">Loading...</p>
        )}
        {!isFetching && bills.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            No bills found{date ? " for this date" : ""}.
          </p>
        )}
        {bills.map((bill) => {
          const order = typeof bill.order === "object" ? bill.order : null;
          const label =
            order?.orderType === "walk-in"
              ? "Walk-in"
              : order?.table
                ? `Table ${order.table.number}`
                : "Order";
          return (
            <div
              key={bill._id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-muted-foreground">
                  {new Date(bill.createdAt).toLocaleString()} ·
                  {bill.paymentMethod}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${bill.total.toFixed(2)}</span>
                <Button asChild size="sm" variant="outline">
                  <a
                    href={`${config.baseUrl}/bills/${bill._id}/receipt`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Receipt
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
