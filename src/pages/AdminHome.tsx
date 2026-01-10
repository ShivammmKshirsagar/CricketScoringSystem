import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/Card";
import { useAuth } from "@/auth/AuthContext";

export default function AdminHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo size="sm" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{user?.username}</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card variant="flat" className="max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage users, matches, and application settings.
          </p>
        </Card>
      </main>
    </div>
  );
}
