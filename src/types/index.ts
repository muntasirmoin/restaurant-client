import type { ComponentType } from "react";
export type TRole =
  | "administrator"
  | "manager"
  | "counter"
  | "waiter"
  | "kitchen";
export interface ISidebarItem {
  title: string;
  items: { title: string; url: string; component: ComponentType }[];
}
export interface IUser {
  userId: string;
  username: string;
  name: string;
  role: TRole;
}

export interface IMenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}
export interface ITable {
  _id: string;
  number: number;
  status: "free" | "occupied";
}
export type TOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "served"
  | "billed"
  | "cancelled";
export interface IOrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}
export interface IOrder {
  _id: string;
  orderType: "dine-in" | "walk-in";
  table?: { _id: string; number: number } | string;
  items: IOrderItem[];
  status: TOrderStatus;
  createdBy: { _id: string; name: string } | string;
  confirmedBy?: { _id: string; name: string } | string;
  total: number;
  createdAt: string;
}
