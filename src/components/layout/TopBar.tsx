import { Button } from "@/components/ui/button";
import { useMeQuery, useLogoutMutation } from "@/redux/features/Auth/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export const TopBar = () => {
  const { data } = useMeQuery(undefined);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const user = data?.data;
  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Failed to log out");
    }
  };
  return (
    <header className="flex items-center justify-between border-b px-4 sm:px-6 py-3 bg-card">
      <span className="font-semibold">Restaurant OMS</span>
      {user && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground hidden sm:inline">
            {user.name} · {user.role}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={handleLogout}
          >
            {isLoading ? "Logging out..." : "Log out"}
          </Button>
        </div>
      )}
    </header>
  );
};
