import { Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/auth/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="hero-glow" />

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Logo size="sm" />
              <nav className="hidden md:flex items-center gap-2">
                <NavLink
                  to="/admin/matches"
                  className="px-3 py-2 rounded-lg text-sm text-muted-foreground"
                  activeClassName="bg-secondary text-foreground"
                >
                  Matches
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-muted-foreground">Signed in as {user?.username}</span>
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

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
