import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { CreateMatchModal } from "@/components/CreateMatchModal";
import { LiveMatch } from "@/pages/LiveMatch";
import { Match } from "@/types/match";
import { useAuth } from "@/auth/AuthContext";
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero glow effect */}
      <div className="hero-glow" />
      
      {/* Navigation */}
      <header className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-lg">
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
      <section className="relative z-10 py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real-time Cricket Scoring</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 tracking-tight animate-slide-up">
            Score Cricket Matches
            <br />
            <span className="text-gradient">Like Never Before</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A premium, real-time cricket scoring application. Track every ball, every run, 
            every wicket with precision and style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" onClick={() => setIsModalOpen(true)}>
              <Play className="h-5 w-5 mr-2" />
              Start New Match
            </Button>
            <Button variant="glass" size="xl">
              <Trophy className="h-5 w-5 mr-2" />
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="score-display text-4xl md:text-5xl font-display font-black text-foreground">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">Balls Scored</div>
            </div>
            <div className="h-12 w-px bg-border/50"></div>
            <div className="text-center">
              <div className="score-display text-4xl md:text-5xl font-display font-black text-foreground">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Matches</div>
            </div>
            <div className="h-12 w-px bg-border/50"></div>
            <div className="text-center">
              <div className="score-display text-4xl md:text-5xl font-display font-black text-foreground">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional-grade features designed for serious cricket scoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Real-time Updates"
              description="Instant ball-by-ball updates with live score calculations and run rate tracking."
            />
            <FeatureCard
              icon={BarChart3}
              title="Detailed Statistics"
              description="Comprehensive stats including run rates, partnerships, and over-by-over breakdowns."
            />
            <FeatureCard
              icon={Users}
              title="Multi-player Support"
              description="Track individual player performances, batting and bowling figures."
            />
            <FeatureCard
              icon={Globe}
              title="Any Format"
              description="Support for T20, ODI, Test matches, and custom overs formats."
            />
            <FeatureCard
              icon={Trophy}
              title="Match History"
              description="Access past matches, review scorecards, and analyze performance trends."
            />
            <FeatureCard
              icon={Play}
              title="Intuitive Controls"
              description="Easy-to-use scoring interface with one-tap recording for all ball outcomes."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="glass-card glow-effect max-w-4xl mx-auto p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Score?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start scoring your cricket matches with precision. It's free, fast, and beautiful.
            </p>
            <Button variant="hero" size="xl" onClick={() => setIsModalOpen(true)}>
              <Play className="h-5 w-5 mr-2" />
              Create Your First Match
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2026 CricMitra. Built with passion for cricket and technology.
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
  );
};

export default Index;
