import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, ArrowLeft, Send, Loader2 } from "lucide-react";
import { buildSession, getUserId } from "@/lib/api";
import { saveSession } from "@/lib/storage";

const Session = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    sessionId?: string;
    questions?: string[];
    query?: string;
  } | null;

  const sessionId = state?.sessionId || "";
  const query = state?.query || "Describe your goal";
  const questions: string[] = state?.questions || [];

  // Each question gets its own independent answer tracked by index
  const [answers, setAnswers] = useState<string[]>(() => new Array(questions.length).fill(""));
  const [loading, setLoading] = useState(false);

  const handleAnswer = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    const userId = getUserId();
    if (!userId) return;
    setLoading(true);
    try {
      // Build { "question text": "answer text" } object
      const clarifying_answers: Record<string, string> = {};
      questions.forEach((q, i) => {
        clarifying_answers[q] = answers[i] || "";
      });
      const result = await buildSession({ session_id: sessionId, user_id: userId, clarifying_answers });
      // Save to localStorage with query for regeneration
      const wfTitle = result?.workflow?.title || result?.title || query;
      saveSession({ sessionId, title: wfTitle, date: new Date().toLocaleDateString(), status: "Completed", query, workflow: result });
      navigate("/workflow", { state: { result, sessionId } });
    } catch {
      navigate("/workflow", { state: { sessionId } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32" viewBox="0 0 120 120">
              <path d="M20 100 Q40 60 60 70 Q80 80 100 20" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="3" strokeDasharray="1000" className="animate-[path-draw_2s_ease-in-out_infinite]" style={{ strokeDashoffset: 0 }} />
              <circle r="4" fill="hsl(263 70% 52%)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M20 100 Q40 60 60 70 Q80 80 100 20" />
              </circle>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 glow-text">Mapping your path...</h2>
          <p className="text-muted-foreground text-sm">Analyzing your goals and finding the best tools</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            No clarifying questions received.{" "}
            <Link to="/dashboard" className="text-primary hover:underline">Go back</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border/50 flex items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 mx-auto">
          <Compass className="h-5 w-5 text-primary" />
          <span className="font-bold">Wayfinder</span>
        </div>
        <div className="w-24" />
      </header>

      <div className="max-w-2xl mx-auto p-6 lg:p-10">
        <div className="rounded-xl bg-card border border-border/50 p-5 mb-8">
          <p className="text-xs text-muted-foreground mb-2">Your goal</p>
          <p className="text-foreground font-medium">{query}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-1">Let's refine your path</h2>
          <p className="text-sm text-muted-foreground mb-6">Answer a few questions so we can map the perfect workflow.</p>
          <div className="space-y-4">
            {questions.map((question, idx) => (
              <div key={idx} className="rounded-xl bg-card border border-border/50 p-5 animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <label className="text-sm font-medium mb-2 block">{question}</label>
                <Input
                  placeholder="Type your answer..."
                  value={answers[idx]}
                  onChange={(e) => handleAnswer(idx, e.target.value)}
                  className="bg-muted/50 border-border/50"
                />
              </div>
            ))}
          </div>
        </div>

        <Button variant="glow" size="lg" className="w-full rounded-xl" onClick={handleSubmit}>
          Build My Path <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Session;
