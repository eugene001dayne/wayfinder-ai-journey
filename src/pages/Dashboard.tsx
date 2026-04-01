import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Home, Workflow, Brain, Bell, User, Send, Clock, CheckCircle2, Zap, TrendingUp, ArrowRight } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Workflow, label: "My Workflows", path: "/dashboard" },
  { icon: Brain, label: "My Patterns", path: "/dashboard" },
  { icon: Bell, label: "Nudges", path: "/dashboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

const recentSessions = [
  { id: 1, title: "Automate weekly client reports", date: "Mar 28, 2026", status: "Completed" },
  { id: 2, title: "Create social media content calendar", date: "Mar 26, 2026", status: "In Progress" },
  { id: 3, title: "Summarize competitor research", date: "Mar 24, 2026", status: "Completed" },
  { id: 4, title: "Build email outreach sequence", date: "Mar 22, 2026", status: "Draft" },
];

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (query.trim()) navigate("/session");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Wayfinder</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-bold">Wayfinder</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">Beginner</span>
            <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Alex M.</Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Center content */}
          <div className="flex-1 p-6 lg:p-10">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Good morning, Alex</h1>
              <p className="text-muted-foreground mb-10">What do you want to get done today?</p>

              {/* Input area */}
              <div className="relative mb-12">
                <div className="rounded-2xl border border-primary/30 bg-card p-1 animate-pulse-glow">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe what you want to accomplish..."
                    className="w-full bg-transparent rounded-xl p-4 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none min-h-[120px]"
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                  />
                  <div className="flex justify-end p-2">
                    <Button variant="glow" onClick={handleSubmit} disabled={!query.trim()} className="rounded-xl">
                      Map My Path <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recent sessions */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent sessions</h3>
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <Link
                      key={session.id}
                      to="/workflow"
                      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          {session.status === "Completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">{session.title}</p>
                          <p className="text-xs text-muted-foreground">{session.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        session.status === "Completed"
                          ? "bg-primary/10 text-primary"
                          : session.status === "In Progress"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {session.status}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/50 p-6 space-y-6">
            {/* AI Fitness */}
            <div className="rounded-xl bg-card border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">AI Fitness</h3>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold gradient-text">42</span>
                <span className="text-xs text-muted-foreground mb-1">/100</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full mb-3">
                <div className="h-full gradient-bg rounded-full" style={{ width: "42%" }} />
              </div>
              <p className="text-xs text-muted-foreground">Work on: Prompt engineering basics</p>
            </div>

            {/* Latest nudge */}
            <div className="rounded-xl bg-card border border-primary/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Latest Nudge</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Try using Claude to rewrite your last client email — compare the results with your original.
              </p>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                Try it now <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
