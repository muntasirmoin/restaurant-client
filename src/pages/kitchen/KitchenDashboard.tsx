import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useGetOrdersQuery,
  useUpdateKitchenStatusMutation,
} from "@/redux/features/Order/order.api";
import { OrderCard } from "@/components/OrderCard";
import type { IOrder } from "@/types";
export default function KitchenDashboard() {
  const { data: ordersRes, refetch } = useGetOrdersQuery(undefined, {
    pollingInterval: 8000,
  });
  const [updateKitchenStatus] = useUpdateKitchenStatusMutation();
  const orders: IOrder[] = (ordersRes?.data ?? []).filter((o: IOrder) =>
    ["confirmed", "preparing"].includes(o.status),
  );
  const setStatus = async (orderId: string, status: "preparing" | "ready") => {
    try {
      await updateKitchenStatus({ orderId, status }).unwrap();
      toast.success(
        status === "preparing" ? "Started preparing" : "Marked ready",
      );
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to update order");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kitchen</h1>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o) => (
          <OrderCard
            key={o._id}
            order={o}
            actions={
              o.status === "confirmed" ? (
                <Button size="sm" onClick={() => setStatus(o._id, "preparing")}>
                  Start preparing
                </Button>
              ) : (
                <Button size="sm" onClick={() => setStatus(o._id, "ready")}>
                  Mark ready
                </Button>
              )
            }
          />
        ))}
        {orders.length === 0 && (
          <p className="text-muted-foreground">
            No orders in the kitchen queue.
          </p>
        )}
      </div>
    </div>
  );
}
