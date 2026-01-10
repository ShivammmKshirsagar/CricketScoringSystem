import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/AuthContext";
import { PageTransition } from "@/components/PageTransition";

type LocationState = {
  from?: { pathname?: string };
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  const state = (location.state ?? {}) as LocationState;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated as admin, redirect to admin panel
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authenticated = login({ username, password });
      
      // Only admins should use this login page
      if (authenticated.role !== "admin") {
        toast.error("This login is for administrators only");
        setIsSubmitting(false);
        return;
      }

      const next = state.from?.pathname;
      if (next && next !== "/login") {
        navigate(next, { replace: true });
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <Card variant="flat" className="animate-slide-up">
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Sign In</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Administrator access only.
              <br />
              Demo credentials: <strong>admin / admin123</strong>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Matches
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}