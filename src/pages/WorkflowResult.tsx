import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, Copy, Check, Star, Share2, Bookmark, Clock, ExternalLink, Zap, Lightbulb, ArrowRight, FileX } from "lucide-react";
import { rateSession, type WorkflowResult as WorkflowResultType } from "@/lib/api";

const WorkflowResultPage = () => {
  const location = useLocation();
  const state = location.state as { result?: WorkflowResultType; sessionId?: string } | null;

  const result = state?.result;
  const wf = result?.workflow || result;
  const sessionId = state?.sessionId || result?.session_id;

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

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const submitRating = async (stars: number) => {
    setRating(stars);
    if (sessionId) {
      try {
        await rateSession({ session_id: sessionId, outcome_rating: stars });
        setRatingSubmitted(true);
      } catch {}
    }
  };

  if (!result) {
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
          <Button variant="ghost" size="icon"><Bookmark className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 lg:p-10">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs text-primary mb-3">
            <Zap className="h-3 w-3" /> Workflow
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">{title}</h1>
          {overview && <p className="text-muted-foreground">{overview}</p>}
        </div>

        {/* Recommended Tools */}
        {tools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Recommended Tools</h2>
            <div className="grid gap-3">
              {tools.map((tool) => (
                <div key={tool.name} className="p-4 rounded-xl bg-card border border-border/50 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold">{tool.name}</h3>
                      {tool.pricing && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tool.pricing}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.why}</p>
                  </div>
                  {tool.link && (
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-6">Step by Step</h2>
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="rounded-xl bg-card border border-border/50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                      {step.step || idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{step.what_to_do}</h3>
                        {step.time_estimate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <Clock className="h-3 w-3" /> {step.time_estimate}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-primary mb-3">Using {step.tool}</p>

                      {step.prompt_to_use && (
                        <div className="relative rounded-lg bg-muted/50 border border-border/50 p-4 mb-3">
                          <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono">{step.prompt_to_use}</pre>
                          <button
                            onClick={() => copyPrompt(step.prompt_to_use!, idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-md bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      )}

                      {step.expected_output && (
                        <p className="text-xs text-muted-foreground">
                          <span className="text-foreground/70 font-medium">Expected output:</span> {step.expected_output}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pro tips */}
        {proTips.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" /> Pro Tips
            </h2>
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-3">
              {proTips.map((tip, i) => (
                <p key={i} className="text-sm text-foreground/80">• {tip}</p>
              ))}
            </div>
          </section>
        )}

        {/* Next Level */}
        {nextLevel && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Next Level</h2>
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-sm text-muted-foreground">{nextLevel}</p>
            </div>
          </section>
        )}

        {/* Rating */}
        <section className="mb-12 text-center">
          <h3 className="text-sm font-medium mb-3">How useful was this workflow?</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => submitRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          {ratingSubmitted && <p className="text-xs text-muted-foreground">Thanks for your feedback!</p>}
        </section>

        <div className="flex gap-3 justify-center">
          <Button variant="glow" className="rounded-xl" asChild>
            <Link to="/dashboard">Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowResultPage;
