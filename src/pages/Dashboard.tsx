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
    const hash = window.location.hash;

    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const email = localStorage.getItem('pending_email');

      if (accessToken && email) {
        window.history.replaceState(null, '', window.location.pathname);
        fetch(`https://wayfinder-backend-au9t.onrender.com/users/email/${encodeURIComponent(email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              const previousUserId = localStorage.getItem('wayfinder_user_id');
              if (previousUserId && previousUserId !== data.user.id) {
                // Different user logging in — clear old user's cached sessions
                localStorage.removeItem(`wayfinder_sessions_${previousUserId}`);
              }
              localStorage.setItem('wayfinder_user_id', data.user.id);
              localStorage.removeItem('pending_email');
              if (data.user.onboarded) {
                loadDashboard(data.user.id);
              } else {
                navigate('/onboarding');
              }
            } else {
              localStorage.removeItem('pending_email');
              navigate('/onboarding');
            }
          })
          .catch(() => navigate('/'));
        return;
      }
    }

    const userId = getUserId();
    if (!userId) { navigate("/"); return; }
    setLocalSessions(getSavedSessions());
    loadDashboard(userId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      .filter((s) => s.title && s.title !== "Untitled" && s.status === "completed")
      .map((s) => ({
        id: s.id || s.session_id || "",
        title: s.title!,
        date: s.date || "",
        status: s.status || "completed",
        hasLocal: localMap.has(s.id || s.session_id || ""),
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
        hasLocal: true,
        bookmarked: s.bookmarked || false,
      }));
    return [...localOnly, ...apiCards];
  })();

  const displayName = (user?.full_name || user?.name || "").split(" ")[0] || "there";
  const fitnessScore = user?.ai_fitness_score ?? 0;
  const fitnessLevel = user?.ai_fitness_level ?? "Beginner";
  const latestNudge = user?.nudges?.[0] as { message?: string; text?: string; nudge_type?: string } | undefined;

  const openWorkflow = (id: string) => {
    const local = localSessions.find((s) => s.sessionId === id);
    if (local?.workflow) {
      navigate("/workflow", { state: { result: local.workflow, sessionId: id } });
    } else {
      navigate("/workflow", { state: { sessionId: id } });
    }
  };

  if (submitting) return <PathLoader />;

  return (
    <div className="min-h-screen bg-background flex">
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

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6">
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

        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="flex-1 p-6 lg:p-10">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {loading ? <Skeleton className="h-8 w-64" /> : `Good morning, ${displayName}`}
              </h1>
              <p className="text-muted-foreground mb-10">What do you want to get done today?</p>

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
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sessions yet. Start by describing what you want to accomplish!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mergedSessions.map((session) => (
                      <button key={session.id} onClick={() => openWorkflow(session.id)} className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group text-left">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            {session.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {session.bookmarked && <Bookmark className="h-3 w-3 text-primary fill-primary" />}
                              {session.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{session.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          session.status === "completed" ? "bg-primary/10 text-primary"
                          : session.status === "In Progress" ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                        }`}>{session.status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/50 p-6 space-y-6">
            {loading ? (
              <>
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </>
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
                    <div className="h-full gradient-bg rounded-full" style={{ width: `${fitnessScore}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">Work on: {user?.ai_fitness_focus || "Getting started"}</p>
                </div>

                <div className="rounded-xl bg-card border border-primary/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Latest Nudge</h3>
                  </div>
                  {latestNudge ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-3">{latestNudge.message || (latestNudge as any).text}</p>
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        Try it now <ArrowRight className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No nudges yet. Complete a session to get personalized tips!</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;