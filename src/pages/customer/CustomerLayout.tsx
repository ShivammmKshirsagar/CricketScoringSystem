import { Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/auth/AuthContext";
import { Shield } from "lucide-react";

export default function CustomerLayout() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Logo size="sm" />
              <nav className="hidden md:flex items-center gap-2">
                <NavLink
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm text-muted-foreground"
                  activeClassName="bg-secondary text-foreground"
                >
                  Matches
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Show admin info if logged in as admin */}
              {isAuthenticated && user?.role === "admin" ? (
                <>
                  <span className="hidden sm:inline text-sm text-muted-foreground">
                    Admin: {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      navigate("/", { replace: true });
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                /* Show Admin Login button for public users */
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              )}
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