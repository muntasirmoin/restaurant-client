import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useGetOrdersQuery,
  useConfirmOrderMutation,
  useMarkServedMutation,
  useCancelOrderMutation,
} from "@/redux/features/Order/order.api";
import { OrderCard } from "@/components/OrderCard";
import { NewOrderForm } from "@/components/NewOrderForm";
import { GenerateBillDialog } from "@/components/GenerateBillDialog";
import type { IOrder } from "@/types";
export default function CounterDashboard() {
  const { data: ordersRes, refetch } = useGetOrdersQuery(undefined, {
    pollingInterval: 10000,
  });
  const [confirmOrder] = useConfirmOrderMutation();
  const [markServed] = useMarkServedMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [showNewOrder, setShowNewOrder] = useState(false);
  const orders: IOrder[] = ordersRes?.data ?? [];
  const pending = orders.filter((o) => o.status === "pending");
  const inProgress = orders.filter((o) =>
    ["confirmed", "preparing", "ready"].includes(o.status),
  );
  const readyToBill = orders.filter((o) => o.status === "served");
  const handle = async (fn: () => Promise<unknown>, successMsg: string) => {
    try {
      await fn();
      toast.success(successMsg);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {" "}
      <h1 className="text-2xl font-semibold">Counter</h1>{" "}
      <section className="space-y-4">
        {" "}
        <Button variant="outline" onClick={() => setShowNewOrder((s) => !s)}>
          {" "}
          {showNewOrder
            ? "Hide walk-in order form"
            : "+ New walk-in order"}{" "}
        </Button>{" "}
        {showNewOrder && (
          <NewOrderForm
            orderType="walk-in"
            onCreated={() => {
              refetch();
              setShowNewOrder(false);
            }}
          />
        )}{" "}
      </section>{" "}
      {pending.length > 0 && (
        <section className="space-y-4">
          {" "}
          <h2 className="text-lg font-medium">Waiting for confirmation</h2>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {" "}
            {pending.map((o) => (
              <OrderCard
                key={o._id}
                order={o}
                actions={
                  <>
                    {" "}
                    <Button
                      size="sm"
                      onClick={() =>
                        handle(
                          () => confirmOrder(o._id).unwrap(),
                          "Order confirmed",
                        )
                      }
                    >
                      {" "}
                      Confirm{" "}
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handle(
                          () => cancelOrder(o._id).unwrap(),
                          "Order cancelled",
                        )
                      }
                    >
                      {" "}
                      Cancel{" "}
                    </Button>{" "}
                  </>
                }
              />
            ))}{" "}
          </div>{" "}
        </section>
      )}{" "}
      <section className="space-y-4">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <h2 className="text-lg font-medium">In progress</h2>{" "}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {" "}
          {inProgress.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              actions={
                o.status === "ready" ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      handle(() => markServed(o._id).unwrap(), "Marked served")
                    }
                  >
                    {" "}
                    Mark served{" "}
                  </Button>
                ) : undefined
              }
            />
          ))}{" "}
          {inProgress.length === 0 && (
            <p className="text-muted-foreground">Nothing in progress.</p>
          )}{" "}
        </div>{" "}
      </section>{" "}
      {readyToBill.length > 0 && (
        <section className="space-y-4">
          {" "}
          <h2 className="text-lg font-medium">Ready to bill</h2>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {" "}
            {readyToBill.map((o) => (
              <OrderCard
                key={o._id}
                order={o}
                actions={
                  <GenerateBillDialog orderId={o._id} onGenerated={refetch} />
                }
              />
            ))}{" "}
          </div>{" "}
        </section>
      )}{" "}
    </div>
  );
}
