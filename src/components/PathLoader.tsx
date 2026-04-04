import { useState, useEffect } from "react";

const messages = [
  "Reading your goal...",
  "Checking the best tools for you...",
  "Finding what real people have done...",
  "Mapping your exact steps...",
  "Almost there — building your path...",
];

const PathLoader = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-32 h-32" viewBox="0 0 120 120">
            <path
              d="M20 100 Q40 60 60 70 Q80 80 100 20"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="200"
              className="animate-[path-draw_2s_ease-in-out_infinite]"
            />
            <circle r="4" fill="hsl(var(--accent))">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M20 100 Q40 60 60 70 Q80 80 100 20"
              />
            </circle>
          </svg>
        </div>
        <p
          className={`text-lg font-semibold text-foreground transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
        >
          {messages[index]}
        </p>
      </div>
    </div>
  );
};

export default PathLoader;
