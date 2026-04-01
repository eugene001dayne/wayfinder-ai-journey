import { Link } from "react-router-dom";
import { Compass, Home, Workflow, Brain, Bell, User, Lightbulb, TrendingUp, Repeat, Target } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Workflow, label: "My Workflows", path: "/workflows" },
  { icon: Brain, label: "My Patterns", path: "/patterns" },
  { icon: Bell, label: "Nudges", path: "/nudges" },
  { icon: User, label: "Profile", path: "/profile" },
];

const patterns = [
  { id: 1, title: "Content Creation Loop", description: "You frequently use AI for drafting and editing written content. Consider building reusable prompt templates.", icon: Repeat, strength: 85 },
  { id: 2, title: "Research-First Approach", description: "You tend to start workflows with research gathering before taking action. This is a strong analytical habit.", icon: Lightbulb, strength: 72 },
  { id: 3, title: "Tool Hopping", description: "You switch between multiple AI tools for similar tasks. Specializing in one could boost your efficiency.", icon: Target, strength: 58 },
  { id: 4, title: "Prompt Iteration", description: "You often refine prompts 3-4 times before getting desired results. Learning prompt engineering could save time.", icon: TrendingUp, strength: 45 },
];

const MyPatterns = () => {
  return (
    <div className="min-h-screen bg-background flex">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.path === "/patterns"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
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
            <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">Beginner</span>
            <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Alex M.</Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">My Patterns</h1>
            <p className="text-muted-foreground mb-8">AI-detected habits and behaviors from your sessions.</p>

            <div className="grid gap-4 md:grid-cols-2">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="rounded-xl bg-card border border-border/50 p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <pattern.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold">{pattern.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{pattern.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full">
                      <div className="h-full gradient-bg rounded-full" style={{ width: `${pattern.strength}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{pattern.strength}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPatterns;
