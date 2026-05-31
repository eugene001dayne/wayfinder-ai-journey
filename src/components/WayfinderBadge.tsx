/**
 * WayfinderBadge
 *
 * Sits at the bottom of every authenticated page.
 * Shows branding + feedback email link.
 * Not floating — part of the page flow.
 *
 * Usage: import and place at the bottom of each page's main content div.
 */

interface WayfinderBadgeProps {
  showFeedback?: boolean;
}

const WayfinderBadge = ({ showFeedback = true }: WayfinderBadgeProps) => {
  return (
    <div className="w-full border-t border-border mt-12 pt-6 pb-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Left — branding */}
        <div className="flex items-center gap-2">
          <img
            src="/icon-192.png"
            alt="Wayfinder"
            width={20}
            height={20}
            className="rounded-md opacity-80"
          />
          <span className="text-xs text-muted-foreground font-medium">
            Wayfinder — Your Personal AI Navigator
          </span>
        </div>

        {/* Right — feedback + support */}
        {showFeedback && (
          <div className="flex items-center gap-4">
            <a
              href="mailto:www.bitelance.team@gmail.com?subject=Wayfinder Feedback"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Share feedback
            </a>
            <span className="text-border">·</span>
            <a
              href="mailto:www.bitelance.team@gmail.com?subject=Question about Wayfinder"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Get help
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default WayfinderBadge;
