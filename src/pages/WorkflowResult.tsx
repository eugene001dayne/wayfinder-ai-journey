import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, ArrowLeft, Copy, Check, Star, Share2, Bookmark, BookmarkCheck, Clock, ExternalLink, Zap, Lightbulb, ArrowRight, FileX, Send, Loader2, RefreshCw } from "lucide-react";
import { rateSession, startSession, getUserId, type WorkflowResult as WorkflowResultType } from "@/lib/api";
import { saveSession, toggleBookmark, getSessionBySessionId } from "@/lib/storage";

const ToolCard = ({ tool }: { tool: any }) => {
  const t = tool as { name: string; why: string; url?: string; link?: string; pricing?: string; free_alternative?: string };
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50 flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold">{t.name}</h3>
          {t.pricing && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.pricing}</span>}
        </div>
        <p className="text-xs text-muted-foreground">{t.why}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        {(t.url || t.link) && (
          <a href={t.url || t.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {t.free_alternative && (
          <p className="text-xs text-muted-foreground text-right">Free alt: {t.free_alternative}</p>
        )}
      </div>
    </div>
  );
};

const StepCard = ({ step, idx, copiedIdx, onCopy }: { step: any; idx: number; copiedIdx: number | null; onCopy: (text: string, idx: number) => void }) => (
  <div className="rounded-xl bg-card border border-border/50 p-6">
    <div className="flex items-start gap-4">
      <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
        {step.step_number || step.step || idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold">{step.title || step.what_to_do}</h3>
          {step.time_estimate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" /> {step.time_estimate}
            </div>
          )}
        </div>
        {step.title && step.what_to_do && (
          <p className="text-sm text-foreground/80 mb-2">{step.what_to_do}</p>
        )}
        <p className="text-xs text-primary mb-3">Using {step.tool}</p>
        {step.prompt_to_use && (
          <div className="relative rounded-lg bg-muted/50 border border-border/50 p-4 mb-3">
            <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono">{step.prompt_to_use}</pre>
            <button onClick={() => onCopy(step.prompt_to_use!, idx)} className="absolute top-2 right-2 p-1.5 rounded-md bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground transition-colors">
              {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
        {step.expected_output && (
          <p className="text-xs text-muted-foreground mb-3">
            <span className="text-foreground/70 font-medium">Expected output:</span> {step.expected_output}
          </p>
        )}
        {step.validation && (
          <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-medium text-primary mb-1">✓ Checkpoint</p>
            <p className="text-xs text-foreground/80 mb-1">{step.validation.checkpoint_question}</p>
            <p className="text-xs text-muted-foreground">✅ Yes: {step.validation.if_yes}</p>
            <p className="text-xs text-muted-foreground">❌ No: {step.validation.if_no}</p>
          </div>
        )}
        {step.fallback && (
          <div className="mt-3 rounded-lg bg-muted/30 border border-border/30 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">🔄 If you get stuck</p>
            {step.fallback.if_tool_unavailable && (
              <p className="text-xs text-muted-foreground">No access to tool: {step.fallback.if_tool_unavailable}</p>
            )}
            {step.fallback.if_stuck && (
              <p className="text-xs text-muted-foreground">Simpler option: {step.fallback.if_stuck}</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

const WorkflowResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locState = location.state as { result?: WorkflowResultType; sessionId?: string } | null;

  const [result, setResult] = useState<WorkflowResultType | null>(locState?.result || null);
  const [loadingWorkflow, setLoadingWorkflow] = useState(!locState?.result);
  const sessionId = locState?.sessionId || (locState?.result as any)?.session_id || "";

  // If no result in state — fetch from API (cross-device support)
  useEffect(() => {
    if (result) return;

    // Try localStorage first
    if (sessionId) {
      const saved = getSessionBySessionId(sessionId);
      if (saved?.workflow) {
        setResult(saved.workflow as any);
        setLoadingWorkflow(false);
        return;
      }
    }

    // Try fetching from API by session_id
    if (sessionId) {
      fetch(`https://wayfinder-backend-au9t.onrender.com/workflows?user_id=${getUserId()}`)
        .then(r => r.json())
        .then((workflows: any[]) => {
          const match = workflows.find((w: any) => w.session_id === sessionId);
          if (match?.workflow_data) {
            setResult(match.workflow_data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingWorkflow(false));
    } else {
      setLoadingWorkflow(false);
    }
  }, [sessionId]);

  const wf = (result as any)?.workflow || result;
  const title = wf?.title || "Workflow";
  const overview = wf?.overview || "";
  const tools = wf?.recommended_tools || [];
  const steps = wf?.steps || [];
  const proTips = wf?.pro_tips || [];
  const nextLevel = wf?.next_level || "";

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [tweakInput, setTweakInput] = useState("");
  const [tweakLoading, setTweakLoading] = useState(false);
  const [tweakNotes, setTweakNotes] = useState<string[]>([]);

  useEffect(() => {
    if (result && sessionId) {
      const saved = getSessionBySessionId(sessionId);
      saveSession({
        sessionId,
        title,
        date: new Date().toLocaleDateString(),
        status: "Completed",
        bookmarked: saved?.bookmarked || false,
        workflow: result,
      });
      setBookmarked(saved?.bookmarked || false);
    }
  }, [result, sessionId, title]);

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const submitRating = async (stars: number) => {
    setRating(stars);
    if (sessionId) {
      try { await rateSession({ session_id: sessionId, outcome_rating: stars }); setRatingSubmitted(true); } catch {}
    }
  };

  const handleBookmark = () => {
    if (sessionId) {
      const newState = toggleBookmark(sessionId);
      setBookmarked(newState);
    }
  };

  const handleTweak = async () => {
    if (!tweakInput.trim()) return;
    const userId = getUserId();
    if (!userId) return;
    setTweakLoading(true);
    try {
      const contextMsg = `Follow-up on workflow "${title}": ${tweakInput}`;
      const res = await startSession({ user_id: userId, raw_input: contextMsg });
      const questions = res.clarifying_questions || res.intent?.clarifying_questions || [];
      if (questions.length > 0) {
        navigate("/session", { state: { sessionId: res.session_id || res.id, questions, query: contextMsg } });
      } else {
        setTweakNotes((prev) => [...prev, `Adjustment noted: ${tweakInput}`]);
      }
    } catch {
      setTweakNotes((prev) => [...prev, `Could not process: "${tweakInput}". Try rephrasing.`]);
    } finally {
      setTweakLoading(false);
      setTweakInput("");
    }
  };

  const handleRegenerate = () => {
    const saved = getSessionBySessionId(sessionId);
    const originalQuery = saved?.query || title;
    navigate("/dashboard", { state: { prefillQuery: originalQuery } });
  };

  if (loadingWorkflow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your workflow...</p>
        </div>
      </div>
    );
  }

  if (!result || !wf) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileX className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-2">No workflow data available.</p>
          <Link to="/dashboard" className="text-primary text-sm hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border/50 flex items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 mx-auto">
          <Compass className="h-5 w-5 text-primary" />
          <span className="font-bold">Wayfinder</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleBookmark}>
            {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 lg:p-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs text-primary mb-3">
            <Zap className="h-3 w-3" /> Workflow
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">{title}</h1>
          {overview && <p className="text-muted-foreground">{overview}</p>}
        </div>

        {tools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Recommended Tools</h2>
            <div className="grid gap-3">
              {tools.map((tool: any) => <ToolCard key={tool.name} tool={tool} />)}
            </div>
          </section>
        )}

        {steps.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-6">Step by Step</h2>
            <div className="space-y-6">
              {steps.map((step: any, idx: number) => <StepCard key={idx} step={step} idx={idx} copiedIdx={copiedIdx} onCopy={copyPrompt} />)}
            </div>
          </section>
        )}

        {proTips.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" /> Pro Tips
            </h2>
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-3">
              {proTips.map((tip: string, i: number) => <p key={i} className="text-sm text-foreground/80">• {tip}</p>)}
            </div>
          </section>
        )}

        {nextLevel && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Next Level</h2>
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-sm text-muted-foreground">{nextLevel}</p>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h3 className="text-sm font-medium mb-3">Want to adjust this plan?</h3>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. I don't have Beehiiv, what else can I use?"
              value={tweakInput}
              onChange={(e) => setTweakInput(e.target.value)}
              className="bg-muted/50 border-border/50 flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") handleTweak(); }}
            />
            <Button variant="glow" size="icon" onClick={handleTweak} disabled={tweakLoading || !tweakInput.trim()}>
              {tweakLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          {tweakNotes.length > 0 && (
            <div className="mt-4 space-y-2">
              {tweakNotes.map((note, i) => (
                <div key={i} className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-foreground/80">{note}</div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8 text-center">
          <h3 className="text-sm font-medium mb-3">How useful was this workflow?</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => submitRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1 transition-transform hover:scale-110">
                <Star className={`h-6 w-6 ${star <= (hoverRating || rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              </button>
            ))}
          </div>
          {ratingSubmitted && <p className="text-xs text-muted-foreground">Thanks for your feedback!</p>}
        </section>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="rounded-xl" onClick={handleRegenerate}>
            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
          </Button>
          <Button variant="glow" className="rounded-xl" asChild>
            <Link to="/dashboard">Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowResultPage;