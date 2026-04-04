import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Compass, Briefcase, Users, Store, GraduationCap, Sparkles, ArrowRight, Check, Loader2 } from "lucide-react";
import { createUser, setUserId, getUserId } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const roles = [
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "freelancer", label: "Freelancer", icon: Users },
  { id: "smb", label: "SMB Owner", icon: Store },
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "other", label: "Other", icon: Sparkles },
];

const industries = [
  "Technology", "Marketing & Advertising", "Finance", "Healthcare",
  "Education", "E-commerce", "Creative & Design", "Consulting",
  "Real Estate", "Legal", "Media & Entertainment", "Other",
];

const aiTools = ["ChatGPT", "Claude", "Gemini", "Notion AI", "Midjourney", "None yet", "Others"];

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get email and userId from magic link verification
  const locationState = location.state as { email?: string; userId?: string } | null;
  const authEmail = locationState?.email || "";
  const authUserId = locationState?.userId || getUserId() || "";

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 3;
  const progress = step <= totalSteps ? (step / (totalSteps + 1)) * 100 : 100;

  const toggleTool = (tool: string) => {
    setTools((prev) => prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]);
  };

  const canNext = () => {
    if (step === 1) return name.trim() && role;
    if (step === 2) return industry;
    if (step === 3) return tools.length > 0;
    return true;
  };

  const next = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else if (step === totalSteps) {
      setSubmitting(true);
      try {
        const user = await createUser({ full_name: name, email: authEmail, role, industry, tools_they_use: tools, goals: goal });
        setUserId(user.id);
        setStep(4);
      } catch {
        toast({ title: "Error", description: "Could not complete onboarding. Please try again.", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full h-1 bg-muted">
        <div className="h-full gradient-bg transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-2 justify-center mb-12">
            <Compass className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Wayfinder</span>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Let's set up your profile</h2>
                <p className="text-muted-foreground text-sm">What's your name and what do you do?</p>
              </div>
              <Input placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="bg-card border-border/50 h-12" />
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === r.id
                        ? "border-primary bg-primary/10 glow-border"
                        : "border-border/50 bg-card hover:border-primary/30"
                    }`}
                  >
                    <r.icon className={`h-6 w-6 mb-2 ${role === r.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">What industry are you in?</h2>
                <p className="text-muted-foreground text-sm">We'll customize recommendations for your field.</p>
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-12 rounded-xl bg-card border border-border/50 px-4 text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select your industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">What industry are you in?</h2>
                <p className="text-muted-foreground text-sm">We'll customize recommendations for your field.</p>
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-12 rounded-xl bg-card border border-border/50 px-4 text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select your industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Your AI experience</h2>
                <p className="text-muted-foreground text-sm">Which AI tools have you used before?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiTools.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      tools.includes(tool)
                        ? "gradient-bg text-primary-foreground"
                        : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {tools.includes(tool) && <Check className="h-3 w-3 inline mr-1" />}
                    {tool}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">What's your main goal with AI?</label>
                <Textarea
                  placeholder="e.g., Automate my weekly reporting..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="bg-card border-border/50 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center animate-fade-up">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                <Compass className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Your path is ready.</h2>
              <p className="text-muted-foreground mb-8">Let's go.</p>
            </div>
          )}

          <div className="mt-10 flex justify-between items-center">
            {step > 1 && step <= totalSteps && (
              <button onClick={() => setStep(step - 1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back
              </button>
            )}
            <div className="ml-auto">
              <Button
                variant="glow"
                size="lg"
                onClick={next}
                disabled={(step <= totalSteps && !canNext()) || submitting}
                className="rounded-xl"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                ) : (
                  <>{step === 4 ? "Go to Dashboard" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>

          {step <= totalSteps && (
            <div className="flex justify-center gap-2 mt-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? "w-8 gradient-bg" : s < step ? "w-4 bg-primary/40" : "w-4 bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
