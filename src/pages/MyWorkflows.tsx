import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass, Home, Workflow, Brain, Bell, User, CheckCircle2, Clock, ArrowRight, FileX, Bookmark } from "lucide-react";
import { getUserId, getUser, getUserSessions, type UserProfile, type Session } from "@/lib/api";
import { getSavedSessions, type SavedSession } from "@/lib/storage";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Workflow, label: "My Workflows", path: "/workflows" },
  { icon: Brain, label: "My Patterns", path: "/patterns" },
  { icon: Bell, label: "Nudges", path: "/nudges" },
  { icon: User, label: "Profile", path: "/profile" },
];

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [localSessions, setLocalSessions] = useState<SavedSession[]>([]);
  const [apiWorkflows, setApiWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    setLocalSessions(getSavedSessions());
    if (!userId) { navigate("/onboarding"); return; }

    Promise.allSettled([
      getUser(userId),
      getUserSessions(userId),
      // Fetch workflows directly from workflows table
      fetch(`https://wayfinder-backend-au9t.onrender.com/workflows?user_id=${userId}`)
        .then(r => r.ok ? r.json() : { workflows: [] })
        .catch(() => ({ workflows: [] }))
    ]).then(([uRes, sRes, wRes]) => {
      if (uRes.status === "fulfilled") setUser(uRes.value);
      if (sRes.status === "fulfilled") setSessions(Array.isArray(sRes.value) ? sRes.value : []);
      if (wRes.status === "fulfilled") {
        const w = (wRes.value as any);
        setApiWorkflows(Array.isArray(w) ? w : (w.workflows || []));
      }
      setLoading(false);
    });
  }, [userId, navigate]);

  const merged = (() => {
    const localMap = new Map(localSessions.map((s) => [s.sessionId, s]));
    const apiWorkflowMap = new Map(apiWorkflows.map((w) => [w.session_id, w]));

    const apiCards = sessions.map((s) => {
      const id = s.id || s.session_id || "";
      const local = localMap.get(id);
      const apiWorkflow = apiWorkflowMap.get(id);
      return {
        id,
        title: s.title || local?.title || apiWorkflow?.title || null,
        date: s.date || local?.date || "",
        status: s.status || "Completed",
        bookmarked: local?.bookmarked || false,
        hasWorkflow: !!local?.workflow || !!apiWorkflow,
        workflowData: local?.workflow || apiWorkflow?.workflow_data || null,
      };
    });

    const apiIds = new Set(apiCards.map((c) => c.id));
    const localOnly = localSessions
      .filter((s) => !apiIds.has(s.sessionId))
      .map((s) => ({
        id: s.sessionId,
        title: s.title,
        date: s.date,
        status: s.status,
        bookmarked: s.bookmarked || false,
        hasWorkflow: !!s.workflow,
        workflowData: s.workflow || null,
      }));

    const all = [...localOnly, ...apiCards].filter((s) => s.title !== null);
    return all.sort((a, b) => (a.bookmarked === b.bookmarked ? 0 : a.bookmarked ? -1 : 1));
  })();

  const openWorkflow = (id: string, workflowData: any) => {
    if (workflowData) {
      navigate("/workflow", { state: { result: workflowData, sessionId: id } });
    } else {
      // Last resort — navigate and let WorkflowResult fetch it
      navigate("/workflow", { state: { sessionId: id } });
    }
  };

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
                item.path === "/workflows"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
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
            <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">
              {user?.ai_fitness_level || "—"}
            </span>
            <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {user?.full_name || user?.name || "User"}
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">My Workflows</h1>
            <p className="text-muted-foreground mb-8">All your mapped paths in one place.</p>

            {loading && localSessions.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : merged.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileX className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm mb-1">No workflows yet.</p>
                <p className="text-xs">
                  Go to the{" "}
                  <Link to="/dashboard" className="text-primary hover:underline">
                    Dashboard
                  </Link>{" "}
                  and start your first session.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {merged.map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => openWorkflow(wf.id, wf.workflowData)}
                    className="w-full flex items-center justify-between p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {wf.status === "Completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {wf.bookmarked && <Bookmark className="h-3.5 w-3.5 text-primary fill-primary" />}
                          {wf.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{wf.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          wf.status === "Completed"
                            ? "bg-primary/10 text-primary"
                            : wf.status === "In Progress"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {wf.status}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWorkflows;