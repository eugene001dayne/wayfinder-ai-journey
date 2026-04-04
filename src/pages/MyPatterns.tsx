import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass, Home, Workflow, Brain, Bell, User, Lightbulb } from "lucide-react";
import { getUserId, getUser, type UserProfile } from "@/lib/api";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Workflow, label: "My Workflows", path: "/workflows" },
  { icon: Brain, label: "My Patterns", path: "/patterns" },
  { icon: Bell, label: "Nudges", path: "/nudges" },
  { icon: User, label: "Profile", path: "/profile" },
];

const MyPatterns = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    if (!userId) { navigate("/onboarding"); return; }
    getUser(userId).then(setUser).catch(() => {}).finally(() => setLoading(false));
  }, [userId, navigate]);

  const patterns = user?.patterns || [];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Wayfinder</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${item.path === "/patterns" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-bold">Wayfinder</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">{user?.ai_fitness_level || "—"}</span>
            <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{user?.name || "User"}</Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">My Patterns</h1>
            <p className="text-muted-foreground mb-8">AI-detected habits and behaviors from your sessions.</p>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}</div>
            ) : patterns.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Brain className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm mb-1">No patterns detected yet.</p>
                <p className="text-xs">Complete more sessions to unlock AI-detected behavior insights.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {patterns.map((pattern, i) => (
                  <div key={i} className="rounded-xl bg-card border border-border/50 p-5 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                     <h3 className="text-sm font-semibold">{pattern.description}</h3>
                    </div>
                    {pattern.suggested_fix && (
                      <p className="text-xs text-muted-foreground mb-2"><span className="text-foreground/70 font-medium">Suggestion:</span> {pattern.suggested_fix}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPatterns;
