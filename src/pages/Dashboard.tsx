import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass, Home, Workflow, Brain, Bell, User, Send, Clock, CheckCircle2, Zap, TrendingUp, ArrowRight, Bookmark } from "lucide-react";
import { getUserId, getUser, getUserSessions, startSession, type UserProfile, type Session } from "@/lib/api";
import { getSavedSessions, type SavedSession } from "@/lib/storage";
import PathLoader from "@/components/PathLoader";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Workflow, label: "My Workflows", path: "/workflows" },
  { icon: Brain, label: "My Patterns", path: "/patterns" },
  { icon: Bell, label: "Nudges", path: "/nudges" },
  { icon: User, label: "Profile", path: "/profile" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as { prefillQuery?: string } | null)?.prefillQuery || "";

  const [query, setQuery] = useState(prefill);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [localSessions, setLocalSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // AuthHandler in App.tsx handles the magic link token — do NOT duplicate here.
    // Dashboard just loads data for whoever is already logged in.
    const userId = getUserId();
    if (!userId) { navigate("/"); return; }
    setLocalSessions(getSavedSessions());
    loadDashboard(userId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (prefill) setQuery(prefill);
  }, [prefill]);

  const loadDashboard = (uid: string) => {
    setLocalSessions(getSavedSessions());
    Promise.allSettled([getUser(uid), getUserSessions(uid)]).then(([uRes, sRes]) => {
      if (uRes.status === "fulfilled") setUser(uRes.value);
      if (sRes.status === "fulfilled") setSessions(Array.isArray(sRes.value) ? sRes.value : []);
      setLoading(false);
    });
  };

  const userId = getUserId();

  const handleSubmit = async () => {
    if (!query.trim() || !userId) return;
    setSubmitting(true);
    try {
      const res = await startSession({ user_id: userId, raw_input: query });
      const sessionId = res.session_id || res.id;
      const questions = res.clarifying_questions || res.intent?.clarifying_questions || [];
      (window as any).pendo?.track("session_started", {
        query_length: query.trim().length,
        session_id: sessionId,
        clarifying_questions_count: questions.length,
        was_prefilled: !!prefill,
      });
      navigate("/session", { state: { sessionId, questions, query } });
    } catch {
      navigate("/session", { state: { query } });
    } finally {
      setSubmitting(false);
    }
  };

  const mergedSessions = (() => {
    const localMap = new Map(localSessions.map((s) => [s.sessionId, s]));
    const apiCards = sessions
      .filter((s) => s.title && s.title !== "Untitled")
      .map((s) => ({
        id: s.id || s.session_id || "",
        title: s.title!,
        date: s.date || "",
        status: s.status || "completed",
        bookmarked: localMap.get(s.id || s.session_id || "")?.bookmarked || false,
      }));
    const apiIds = new Set(apiCards.map((c) => c.id));
    const localOnly = localSessions
      .filter((s) => !apiIds.has(s.sessionId) && s.title && s.title !== "Untitled")
      .map((s) => ({
        id: s.sessionId,
        title: s.title,
        date: s.date,
        status: s.status,
        bookmarked: s.bookmarked || false,
      }));
    return [...apiCards, ...localOnly];
  })();

  const displayName = (user?.full_name || user?.name || "").split(" ")[0] || "there";
  const fitnessScore = user?.ai_fitness_score ?? 0;
  const fitnessLevel = user?.ai_fitness_level ?? "Beginner";
  const latestNudge = user?.nudges?.[0] as { id?: string; message?: string; action_prompt?: string } | undefined;

  const openWorkflow = (id: string) => {
    const local = localSessions.find((s) => s.sessionId === id);
    if (local?.workflow) {
      navigate("/workflow", { state: { result: local.workflow, sessionId: id } });
    } else {
      navigate("/workflow", { state: { sessionId: id } });
    }
  };

  const handleTryIt = (nudge: typeof latestNudge) => {
    if (!nudge) return;
    const action = nudge.action_prompt || nudge.message || "";
    navigate("/dashboard", { state: { prefillQuery: action } });
  };

  if (submitting) return <PathLoader />;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Wayfinder</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-bold">Wayfinder</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {loading ? <Skeleton className="h-6 w-20 rounded-full" /> : (
              <>
                <span className="text-xs px-3 py-1 rounded-full gradient-bg text-primary-foreground font-medium">{fitnessLevel}</span>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{user?.full_name || user?.name || "User"}</Link>
              </>
            )}
          </div>
        </header>

        {/* pb-20 adds space above mobile bottom nav */}
        <div className="flex-1 flex flex-col lg:flex-row pb-20 lg:pb-0">
          <div className="flex-1 p-6 lg:p-10">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {loading ? <Skeleton className="h-8 w-64" /> : `Good morning, ${displayName}`}
              </h1>
              <p className="text-muted-foreground mb-8">What do you want to get done today?</p>

              <div className="relative mb-10">
                <div className="rounded-2xl border border-primary/30 bg-card p-1 animate-pulse-glow">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe what you want to accomplish..."
                    className="w-full bg-transparent rounded-xl p-4 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none min-h-[100px]"
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                  />
                  <div className="flex justify-end p-2">
                    <Button variant="glow" onClick={handleSubmit} disabled={!query.trim() || submitting} className="rounded-xl">
                      {submitting ? "Starting..." : "Map My Path"} <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent sessions</h3>
                {loading ? (
                  <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
                ) : mergedSessions.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sessions yet. Start by describing what you want to accomplish!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mergedSessions.map((session) => (
                      <button key={session.id} onClick={() => openWorkflow(session.id)} className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group text-left">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                              {session.bookmarked && <Bookmark className="h-3 w-3 text-primary fill-primary shrink-0" />}
                              {session.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{session.date}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0 ml-2">done</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar panel — desktop only */}
          <div className="hidden lg:block w-80 border-l border-border/50 p-6 space-y-6">
            {loading ? (
              <><Skeleton className="h-40 w-full rounded-xl" /><Skeleton className="h-32 w-full rounded-xl" /></>
            ) : (
              <>
                <div className="rounded-xl bg-card border border-border/50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">AI Fitness</h3>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-bold gradient-text">{fitnessScore}</span>
                    <span className="text-xs text-muted-foreground mb-1">/100</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mb-3">
                    <div className="h-full gradient-bg rounded-full transition-all" style={{ width: `${fitnessScore}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{user?.ai_fitness_focus || "Getting started"}</p>
                </div>

                <div className="rounded-xl bg-card border border-primary/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Latest Nudge</h3>
                  </div>
                  {latestNudge ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-3">{latestNudge.message}</p>
                      <button onClick={() => handleTryIt(latestNudge)} className="text-xs text-primary hover:underline flex items-center gap-1">
                        Try it now <ArrowRight className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Complete sessions to get personalized tips!</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile fitness + nudge strip — shows above bottom nav on mobile */}
        {!loading && (
          <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 border-t border-border/30 bg-background/95 backdrop-blur-xl px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="w-20 h-1.5 bg-muted rounded-full">
                <div className="h-full gradient-bg rounded-full" style={{ width: `${fitnessScore}%` }} />
              </div>
              <span className="text-xs text-primary font-medium">{fitnessScore}</span>
              <span className="text-xs text-muted-foreground">{fitnessLevel}</span>
            </div>
            {latestNudge && (
              <button onClick={() => handleTryIt(latestNudge)} className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
                <Zap className="h-3 w-3" /> Nudge <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
