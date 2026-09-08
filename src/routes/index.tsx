import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/Login";

import WaiterDashboard from "@/pages/waiter/WaiterDashboard";
import { withAuth } from "@/utils/withAuth";
import CounterDashboard from "@/pages/counter/CounterDashboard";
import KitchenDashboard from "@/pages/kitchen/KitchenDashboard";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const AdminDashboardRoute = withAuth(AdminDashboard, ["administrator"]);

const ManagerDashboardRoute = withAuth(ManagerDashboard, [
  "manager",
  "administrator",
]);
const CounterDashboardRoute = withAuth(CounterDashboard, [
  "counter",
  "manager",
]);
const WaiterDashboardRoute = withAuth(WaiterDashboard, ["waiter"]);

const KitchenDashboardRoute = withAuth(KitchenDashboard, ["kitchen"]);
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, element: <div>Dashboard placeholder</div> },
      { path: "administrator", Component: AdminDashboardRoute },
      { path: "manager", Component: ManagerDashboardRoute },
      { path: "counter", Component: CounterDashboardRoute },
      { path: "waiter", Component: WaiterDashboardRoute },
      { path: "kitchen", Component: KitchenDashboardRoute },
    ],
  },
  { path: "/login", Component: Login },
]);
