import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMenuQuery } from "@/redux/features/Menu/menu.api";
import { useGetTablesQuery } from "@/redux/features/Table/table.api";
import { useCreateOrderMutation } from "@/redux/features/Order/order.api";

interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}
interface Props {
  orderType: "dine-in" | "walk-in";
  onCreated: () => void;
}
export const NewOrderForm = ({ orderType, onCreated }: Props) => {
  const { data: menuRes } = useGetMenuQuery(undefined);
  const { data: tablesRes } = useGetTablesQuery(undefined, {
    skip: orderType !== "dine-in",
  });
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const menu = menuRes?.data ?? [];
  const tables = tablesRes?.data ?? [];
  const [tableId, setTableId] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);

  const addItem = (item: { _id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.menuItemId === item._id);
      if (existing) {
        return prev.map((l) =>
          l.menuItemId === item._id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };
  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.menuItemId === id ? { ...l, quantity: l.quantity + delta } : l,
        )
        .filter((l) => l.quantity > 0),
    );
  };
  const total = cart.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const submitOrder = async () => {
    if (orderType === "dine-in" && !tableId)
      return toast.error("Please select a table");
    if (cart.length === 0) return toast.error("Add at least one item");
    try {
      await createOrder({
        orderType,
        table: orderType === "dine-in" ? tableId : undefined,
        items: cart.map((l) => ({
          menuItemId: l.menuItemId,
          quantity: l.quantity,
        })),
      }).unwrap();
      toast.success(
        orderType === "dine-in"
          ? "Order sent to counter"
          : "Walk-in order created",
      );
      setCart([]);
      setTableId("");
      onCreated();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to create order");
    }
  };
  return (
    <div className="space-y-4">
      {" "}
      {orderType === "dine-in" && (
        <Select value={tableId} onValueChange={setTableId}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select a table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((t: { _id: string; number: number }) => (
              <SelectItem key={t._id} value={t._id}>
                {" "}
                Table {t.number}{" "}
              </SelectItem>
            ))}{" "}
          </SelectContent>{" "}
        </Select>
      )}{" "}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {" "}
        {menu.map(
          (item: {
            _id: string;
            name: string;
            price: number;
            available: boolean;
          }) => (
            <button
              key={item._id}
              type="button"
              disabled={!item.available}
              onClick={() => addItem(item)}
              className="rounded-lg border p-3 text-left hover:border-primary disabled:opacity-40"
            >
              {" "}
              <div className="font-medium">{item.name}</div>{" "}
              <div className="text-sm text-muted-foreground">
                ${item.price.toFixed(2)}
              </div>{" "}
            </button>
          ),
        )}{" "}
      </div>{" "}
      {cart.length > 0 && (
        <div className="rounded-lg border p-4 space-y-2 w-full sm:max-w-sm">
          {" "}
          {cart.map((l) => (
            <div
              key={l.menuItemId}
              className="flex items-center justify-between text-sm"
            >
              {" "}
              <span>{l.name}</span>{" "}
              <span className="flex items-center gap-2">
                {" "}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6"
                  onClick={() => changeQty(l.menuItemId, -1)}
                >
                  -
                </Button>{" "}
                {l.quantity}{" "}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6"
                  onClick={() => changeQty(l.menuItemId, 1)}
                >
                  +
                </Button>{" "}
              </span>{" "}
            </div>
          ))}{" "}
          <div className="text-right font-semibold">${total.toFixed(2)}</div>{" "}
          <Button className="w-full" disabled={isLoading} onClick={submitOrder}>
            {" "}
            {isLoading
              ? "Sending..."
              : orderType === "dine-in"
                ? "Send order"
                : "Create order"}{" "}
          </Button>{" "}
        </div>
      )}{" "}
    </div>
  );
};
