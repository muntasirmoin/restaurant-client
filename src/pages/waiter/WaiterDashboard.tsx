import { Button } from "@/components/ui/button";
import {
  useGetOrdersQuery,
  useMarkServedMutation,
} from "@/redux/features/Order/order.api";
import { OrderCard } from "@/components/OrderCard";
import { NewOrderForm } from "@/components/NewOrderForm";
import type { IOrder } from "@/types";
import { toast } from "sonner";
export default function WaiterDashboard() {
  const { data: ordersRes, refetch } = useGetOrdersQuery(undefined, {
    pollingInterval: 10000,
  });
  const [markServed] = useMarkServedMutation();
  const orders: IOrder[] = (ordersRes?.data ?? []).filter(
    (o: IOrder) => !(["billed", "cancelled"] as string[]).includes(o.status),
  );
  const handleMarkServed = async (orderId: string) => {
    try {
      await markServed(orderId).unwrap();
      toast.success("Marked as served");
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to update order");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {" "}
      <h1 className="text-2xl font-semibold">Waiter</h1>{" "}
      <section className="space-y-4">
        {" "}
        <h2 className="text-lg font-medium">New Order</h2>{" "}
        <NewOrderForm orderType="dine-in" onCreated={refetch} />{" "}
      </section>{" "}
      <section className="space-y-4">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <h2 className="text-lg font-medium">Active Orders</h2>{" "}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {" "}
          {orders.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              actions={
                o.status === "ready" ? (
                  <Button size="sm" onClick={() => handleMarkServed(o._id)}>
                    Mark served
                  </Button>
                ) : undefined
              }
            />
          ))}{" "}
          {orders.length === 0 && (
            <p className="text-muted-foreground">No active orders.</p>
          )}{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}
