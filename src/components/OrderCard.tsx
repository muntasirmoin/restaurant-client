import { Badge } from "@/components/ui/badge";
import type { IOrder } from "@/types";
import type { ReactNode } from "react";
const statusStyles: Record<string, string> = {
  pending: "bg-amber-500 text-white",
  confirmed: "bg-blue-500 text-white",
  preparing: "bg-purple-500 text-white",
  ready: "bg-emerald-500 text-white",
  served: "bg-gray-500 text-white",
  billed: "bg-gray-900 text-white",
  cancelled: "bg-red-500 text-white",
};
const tableLabel = (order: IOrder) => {
  if (order.orderType === "walk-in") return "Walk-in";
  if (order.table && typeof order.table === "object")
    return `Table ${order.table.number}`;
  return "Table";
};
interface Props {
  order: IOrder;
  actions?: ReactNode;
}
export const OrderCard = ({ order, actions }: Props) => {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{tableLabel(order)}</span>
        <Badge className={statusStyles[order.status]}>{order.status}</Badge>
      </div>
      <div className="space-y-1">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-sm text-muted-foreground"
          >
            <span>
              {item.quantity}x {item.name}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="text-right font-semibold">${order.total.toFixed(2)}</div>
      {actions && <div className="flex gap-2 pt-2">{actions}</div>}
    </div>
  );
};
