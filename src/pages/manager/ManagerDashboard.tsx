import { useState } from "react";
import { useGetOrdersQuery } from "@/redux/features/Order/order.api";
import { useGetBillsQuery } from "@/redux/features/Bill/bill.api";
import { useGetSalesReportQuery } from "@/redux/features/Report/report.api";
import { OrderCard } from "@/components/OrderCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IOrder } from "@/types";
interface IBill {
  _id: string;
  total: number;
  order: { _id: string } | string;
}
export default function ManagerDashboard() {
  const { data: ordersRes } = useGetOrdersQuery(undefined);
  const { data: billsRes } = useGetBillsQuery(undefined);
  const [period, setPeriod] = useState<7 | 30>(7);
  const { data: reportRes, isFetching: reportLoading } =
    useGetSalesReportQuery(period);
  const orders: IOrder[] = ordersRes?.data ?? [];
  const bills: IBill[] = billsRes?.data ?? [];
  const totalRevenue = bills.reduce((sum, b) => sum + b.total, 0);
  const activeCount = orders.filter(
    (o) => !(["billed", "cancelled"] as string[]).includes(o.status),
  ).length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const stats = [
    { label: "Total revenue", value: `$${totalRevenue.toFixed(2)}` },
    { label: "Active orders", value: activeCount },
    { label: "Bills generated", value: bills.length },
    { label: "Cancelled orders", value: cancelledCount },
  ];
  const report = reportRes?.data;
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Manager</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Sales report</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={period === 7 ? "default" : "outline"}
              onClick={() => setPeriod(7)}
            >
              Last 7 days
            </Button>
            <Button
              size="sm"
              variant={period === 30 ? "default" : "outline"}
              onClick={() => setPeriod(30)}
            >
              Last 30 days
            </Button>
          </div>
        </div>
        {report && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-normal text-muted-foreground">
                    Period total sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">
                    ${report.summary.totalSales.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-normal text-muted-foreground">
                    Period orders billed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">
                    {report.summary.totalOrders}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="rounded-lg border divide-y">
              {report.days.length === 0 && (
                <p className="p-4 text-muted-foreground text-sm">
                  No sales in this period yet.
                </p>
              )}
              {report.days.map(
                (day: {
                  _id: string;
                  totalSales: number;
                  orderCount: number;
                }) => (
                  <div
                    key={day._id}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span>{day._id}</span>
                    <span className="text-muted-foreground">
                      {day.orderCount} orders
                    </span>
                    <span className="font-medium">
                      ${day.totalSales.toFixed(2)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </>
        )}
        {reportLoading && (
          <p className="text-muted-foreground text-sm">Loading report...</p>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-medium">All orders (live)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((o) => (
            <OrderCard key={o._id} order={o} />
          ))}
          {orders.length === 0 && (
            <p className="text-muted-foreground">No orders yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
