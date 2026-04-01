import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, Copy, Check, Star, Share2, Bookmark, Clock, ExternalLink, Zap, Lightbulb, ArrowRight } from "lucide-react";

const tools = [
  { name: "ChatGPT (GPT-4)", why: "Best for generating narrative summaries and insights from raw data", link: "#", pricing: "Plus $20/mo" },
  { name: "Google Sheets + AppScript", why: "Automate data collection and formatting before AI processing", link: "#", pricing: "Free" },
  { name: "Zapier", why: "Connect your data sources to ChatGPT automatically each week", link: "#", pricing: "Free tier available" },
];

const steps = [
  {
    title: "Set up your data pipeline",
    tool: "Google Sheets",
    prompt: "Create a Google Sheet that pulls data from your analytics sources using ImportData or API connections.",
    output: "A single spreadsheet with all your weekly metrics in one place",
    time: "30 min (one-time setup)",
  },
  {
    title: "Create your report template prompt",
    tool: "ChatGPT",
    prompt: `You are a data analyst. I'm going to give you this week's performance metrics. Please create a professional client report that includes:\n\n1. Executive Summary (3 sentences)\n2. Key Metrics Table\n3. Week-over-week trends\n4. Top 3 insights\n5. Recommended actions\n\nHere is the data:\n[PASTE YOUR WEEKLY DATA HERE]`,
    output: "A polished, ready-to-send client report",
    time: "5 min per report",
  },
  {
    title: "Automate the weekly trigger",
    tool: "Zapier",
    prompt: "Set up a Zap: Every Monday at 9am → Pull data from Google Sheets → Send to ChatGPT API → Email the result to you for review.",
    output: "A fully automated weekly report delivered to your inbox",
    time: "20 min (one-time setup)",
  },
];

const WorkflowResult = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

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
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">Automate Weekly Client Reports with AI</h1>
          <p className="text-muted-foreground">
            This workflow combines Google Sheets for data collection, ChatGPT for report generation, and Zapier for automation — turning a 3-hour weekly task into a 5-minute review.
          </p>
        </div>

        {/* Tools */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Recommended Tools</h2>
          <div className="grid gap-3">
            {tools.map((tool) => (
              <div key={tool.name} className="p-4 rounded-xl bg-card border border-border/50 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold">{tool.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tool.pricing}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.why}</p>
                </div>
                <a href={tool.link} className="text-primary hover:text-primary/80 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-6">Step by Step</h2>
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="rounded-xl bg-card border border-border/50 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" /> {step.time}
                      </div>
                    </div>
                    <p className="text-xs text-primary mb-3">Using {step.tool}</p>

                    {/* Prompt */}
                    <div className="relative rounded-lg bg-muted/50 border border-border/50 p-4 mb-3">
                      <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono">{step.prompt}</pre>
                      <button
                        onClick={() => copyPrompt(step.prompt, idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground/70 font-medium">Expected output:</span> {step.output}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pro tips */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" /> Pro Tips
          </h2>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-3">
            <p className="text-sm text-foreground/80">• Always review AI-generated reports before sending — check numbers against your source data.</p>
            <p className="text-sm text-foreground/80">• Add a "tone of voice" instruction to your prompt to match your brand's communication style.</p>
            <p className="text-sm text-foreground/80">• Save your best prompts as templates in a doc for quick reuse.</p>
          </div>
        </section>

        {/* What's next */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">What's next?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <h3 className="text-sm font-medium mb-1">Automate client invoicing</h3>
              <p className="text-xs text-muted-foreground">Build on this workflow to generate invoices too</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <h3 className="text-sm font-medium mb-1">Create data visualizations</h3>
              <p className="text-xs text-muted-foreground">Add charts to your reports with AI</p>
            </div>
          </div>
        </section>

        {/* Rating */}
        <section className="mb-12 text-center">
          <h3 className="text-sm font-medium mb-3">How useful was this workflow?</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
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
          {rating > 0 && <p className="text-xs text-muted-foreground">Thanks for your feedback!</p>}
        </section>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button variant="glow" className="rounded-xl" asChild>
            <Link to="/dashboard">Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowResult;
