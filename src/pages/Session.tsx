import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, ArrowLeft, Send, Loader2 } from "lucide-react";

const clarifyingQuestions = [
  { id: 1, question: "How often do you currently create these reports?", placeholder: "e.g., Weekly, every Monday" },
  { id: 2, question: "What data sources do you pull from?", placeholder: "e.g., Google Analytics, CRM, spreadsheets" },
  { id: 3, question: "What format should the final report be in?", placeholder: "e.g., PDF, Google Slides, email summary" },
  { id: 4, question: "How long does it take you currently?", placeholder: "e.g., About 3 hours each week" },
];

const Session = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => navigate("/workflow"), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32" viewBox="0 0 120 120">
              <path
                d="M20 100 Q40 60 60 70 Q80 80 100 20"
                fill="none"
                stroke="hsl(217 91% 60%)"
                strokeWidth="3"
                strokeDasharray="1000"
                className="animate-[path-draw_2s_ease-in-out_infinite]"
                style={{ strokeDashoffset: 0 }}
              />
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        {/* Original input */}
        <div className="rounded-xl bg-card border border-border/50 p-5 mb-8">
          <p className="text-xs text-muted-foreground mb-2">Your goal</p>
          <p className="text-foreground font-medium">Automate weekly client reports with AI</p>
        </div>

        {/* Clarifying questions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-1">Let's refine your path</h2>
          <p className="text-sm text-muted-foreground mb-6">Answer a few questions so we can map the perfect workflow.</p>
          <div className="space-y-4">
            {clarifyingQuestions.map((q) => (
              <div key={q.id} className="rounded-xl bg-card border border-border/50 p-5 animate-fade-up" style={{ animationDelay: `${q.id * 0.1}s` }}>
                <label className="text-sm font-medium mb-2 block">{q.question}</label>
                <Input
                  placeholder={q.placeholder}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
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
