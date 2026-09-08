import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/features/User/user.api";
import {
  useGetMenuQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
} from "@/redux/features/Menu/menu.api";
import type { TRole } from "@/types";
const ROLES: TRole[] = [
  "administrator",
  "manager",
  "counter",
  "waiter",
  "kitchen",
];
export default function AdminDashboard() {
  const { data: usersRes, refetch: refetchUsers } = useGetUsersQuery(undefined);
  const { data: menuRes, refetch: refetchMenu } = useGetMenuQuery(undefined);
  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createMenuItem, { isLoading: creatingItem }] =
    useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const users = usersRes?.data ?? [];
  const menu = menuRes?.data ?? [];
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "waiter" as TRole,
  });
  const [newItem, setNewItem] = useState({ name: "", category: "", price: "" });
  const submitUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser).unwrap();
      toast.success("User created");
      setNewUser({ name: "", username: "", password: "", role: "waiter" });
      refetchUsers();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to create user");
    }
  };
  const toggleActive = async (id: string, active: boolean) => {
    try {
      await updateUser({ id, active: !active }).unwrap();
      toast.success("User updated");
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to update user");
    }
  };
  const submitMenuItem = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createMenuItem({
        ...newItem,
        price: parseFloat(newItem.price),
      }).unwrap();
      toast.success("Menu item created");
      setNewItem({ name: "", category: "", price: "" });
      refetchMenu();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to create menu item");
    }
  };
  const toggleAvailable = async (id: string, available: boolean) => {
    try {
      await updateMenuItem({ id, available: !available }).unwrap();
      toast.success("Menu item updated");
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || "Failed to update menu item");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
       
      <h1 className="text-2xl font-semibold">Administrator</h1> 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
        <Card>
           
          <CardHeader>
            <CardTitle>Staff users</CardTitle>
          </CardHeader> 
          <CardContent className="space-y-4">
             
            <form onSubmit={submitUser} className="space-y-3">
               
              <div className="space-y-2">
                 
                <Label htmlFor="u-name">Name</Label> 
                <Input
                  id="u-name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                /> 
              </div> 
              <div className="space-y-2">
                 
                <Label htmlFor="u-username">Username</Label> 
                <Input
                  id="u-username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                /> 
              </div> 
              <div className="space-y-2">
                 
                <Label htmlFor="u-password">Password</Label> 
                <Input
                  id="u-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                /> 
              </div> 
              <div className="space-y-2">
                 
                <Label>Role</Label> 
                <Select
                  value={newUser.role}
                  onValueChange={(v) =>
                    setNewUser({ ...newUser, role: v as TRole })
                  }
                >
                   
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger> 
                  <SelectContent>
                     
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))} 
                  </SelectContent> 
                </Select> 
              </div> 
              <Button type="submit" className="w-full" disabled={creatingUser}>
                 
                {creatingUser ? "Adding..." : "Add user"} 
              </Button> 
            </form> 
            <div className="space-y-2 pt-2">
               
              {users.map(
                (u: {
                  _id: string;
                  name: string;
                  username: string;
                  role: string;
                  active: boolean;
                }) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between text-sm border-t pt-2"
                  >
                     
                    <span>
                      {u.name} · {u.username} · {u.role}
                    </span> 
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(u._id, u.active)}
                    >
                       
                      {u.active ? "Deactivate" : "Activate"} 
                    </Button> 
                  </div>
                ),
              )} 
            </div> 
          </CardContent> 
        </Card> 
        <Card>
           
          <CardHeader>
            <CardTitle>Menu items</CardTitle>
          </CardHeader> 
          <CardContent className="space-y-4">
             
            <form onSubmit={submitMenuItem} className="space-y-3">
               
              <div className="space-y-2">
                 
                <Label htmlFor="m-name">Name</Label> 
                <Input
                  id="m-name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                /> 
              </div> 
              <div className="space-y-2">
                 
                <Label htmlFor="m-category">Category</Label> 
                <Input
                  id="m-category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  required
                /> 
              </div> 
              <div className="space-y-2">
                 
                <Label htmlFor="m-price">Price</Label> 
                <Input
                  id="m-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  required
                /> 
              </div> 
              <Button type="submit" className="w-full" disabled={creatingItem}>
                 
                {creatingItem ? "Adding..." : "Add item"} 
              </Button> 
            </form> 
            <div className="space-y-2 pt-2">
               
              {menu.map(
                (item: {
                  _id: string;
                  name: string;
                  category: string;
                  price: number;
                  available: boolean;
                }) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-sm border-t pt-2"
                  >
                     
                    <span>
                      {item.name} · {item.category} · ${item.price.toFixed(2)}
                    </span> 
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAvailable(item._id, item.available)}
                    >
                       
                      {item.available
                        ? "Mark unavailable"
                        : "Mark available"} 
                    </Button> 
                  </div>
                ),
              )} 
            </div> 
          </CardContent> 
        </Card> 
      </div> 
    </div>
  );
}
