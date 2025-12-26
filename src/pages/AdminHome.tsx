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
      <div className="hero-glow" />

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Signed in as {user?.username}</span>
              <Button
                variant="outline"
                size="sm"
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

      <main className="container mx-auto px-4 py-10">
        <Card variant="glow" className="max-w-2xl">
          <h1 className="font-display text-3xl font-black text-foreground">Admin View</h1>
          <p className="mt-2 text-muted-foreground">
            This is the admin area. Put admin-only features here (manage users, matches, settings, etc.).
          </p>
        </Card>
      </main>
    </div>
  );
}
