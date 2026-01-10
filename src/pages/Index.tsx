import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { CreateMatchModal } from "@/components/CreateMatchModal";
import { LiveMatch } from "@/pages/LiveMatch";
import { Match } from "@/types/match";
import { useAuth } from "@/auth/AuthContext";
import { PageTransition } from "@/components/PageTransition";
import { 
  Play, 
  Zap, 
  BarChart3, 
  Users, 
  Globe,
  Trophy
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  const handleCreateMatch = (match: Match) => {
    setActiveMatch(match);
    setIsModalOpen(false);
  };

  const handleEndMatch = () => {
    setActiveMatch(null);
  };

  // Show live match if active
  if (activeMatch) {
    return <LiveMatch match={activeMatch} onEndMatch={handleEndMatch} />;
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-3">
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
              )}
              <Button variant="hero" onClick={() => setIsModalOpen(true)}>
                <Play className="h-4 w-4 mr-2" />
                Start Match
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Real-time Scoring</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 tracking-tight leading-tight">
            Score Cricket Matches
            <br />
            <span className="text-primary">Like Never Before</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8">
            A premium, real-time cricket scoring application. Track every ball, every run, 
            every wicket with precision and style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="hero" size="lg" onClick={() => setIsModalOpen(true)}>
              <Play className="h-4 w-4 mr-2" />
              Start New Match
            </Button>
            <Button variant="outline" size="lg">
              <Trophy className="h-4 w-4 mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 section-muted border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="score-display text-2xl md:text-3xl font-display font-black text-foreground">1000+</div>
              <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Balls Scored</div>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
              <div className="score-display text-2xl md:text-3xl font-display font-black text-foreground">50+</div>
              <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Matches</div>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
              <div className="score-display text-2xl md:text-3xl font-display font-black text-foreground">100%</div>
              <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
              Everything You Need
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Professional-grade features designed for serious cricket scoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard
              icon={Zap}
              title="Real-time Updates"
              description="Instant ball-by-ball updates with live score calculations."
            />
            <FeatureCard
              icon={BarChart3}
              title="Detailed Statistics"
              description="Comprehensive stats including run rates and partnerships."
            />
            <FeatureCard
              icon={Users}
              title="Multi-player Support"
              description="Track individual player batting and bowling figures."
            />
            <FeatureCard
              icon={Globe}
              title="Any Format"
              description="Support for T20, ODI, Test, and custom formats."
            />
            <FeatureCard
              icon={Trophy}
              title="Match History"
              description="Access past matches and analyze performance trends."
            />
            <FeatureCard
              icon={Play}
              title="Intuitive Controls"
              description="One-tap scoring interface for all ball outcomes."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 section-muted border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
              Ready to Score?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Start scoring your cricket matches with precision. It's free, fast, and beautiful.
            </p>
            <Button variant="hero" size="default" onClick={() => setIsModalOpen(true)}>
              <Play className="h-4 w-4 mr-2" />
              Create Your First Match
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground">
              © 2026 CricMitra. Built with passion for cricket.
            </p>
          </div>
        </div>
      </footer>

      {/* Create Match Modal */}
      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateMatch={handleCreateMatch}
      />
    </div>
    </PageTransition>
  );
};

export default Index;
