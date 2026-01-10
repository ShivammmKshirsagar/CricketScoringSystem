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
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Logo size="sm" />
              <div className="h-5 w-px bg-border hidden md:block"></div>
              <nav className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/admin/matches"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="bg-secondary text-foreground"
                >
                  Matches
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-muted-foreground">{user?.username}</span>
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
        <Outlet />
      </main>
    </div>
  );
}
