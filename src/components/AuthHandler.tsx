import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByEmail, setUserId, getPendingEmail, clearPendingEmail } from "@/lib/api";
import PathLoader from "@/components/PathLoader";

const AuthHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(() => {
    return window.location.hash.includes("access_token");
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const type = params.get("type");

    if (!accessToken) {
      setChecking(false);
      return;
    }

    // Clear hash from URL immediately
    window.history.replaceState(null, "", window.location.pathname);

    const pendingEmail = getPendingEmail();
    if (!pendingEmail) {
      setChecking(false);
      navigate("/");
      return;
    }

    clearPendingEmail();

    // Look up user by email
    getUserByEmail(pendingEmail)
      .then((user) => {
        if (user?.id) {
          setUserId(user.id);

          pendo.identify({
            visitor: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              industry: user.industry,
              tools_they_use: user.tools_they_use,
              goals: user.goals,
              ai_fitness_score: user.ai_fitness_score,
              ai_fitness_level: user.ai_fitness_level,
              ai_fitness_focus: user.ai_fitness_focus,
              onboarded: user.onboarded,
            },
          });

          const isOnboarded = !!(user.full_name && user.role);
          (window as any).pendo?.track("magic_link_authenticated", {
            is_new_user: false,
            is_onboarded: isOnboarded,
            auth_type: type || "magiclink",
          });
          if (isOnboarded) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/onboarding", { state: { email: pendingEmail, userId: user.id }, replace: true });
          }
        } else {
          (window as any).pendo?.track("magic_link_authenticated", {
            is_new_user: true,
            is_onboarded: false,
            auth_type: type || "magiclink",
          });
          // No profile found — new user, go to onboarding
          navigate("/onboarding", { state: { email: pendingEmail }, replace: true });
        }
      })
      .catch(() => {
        // User not found — new user
        navigate("/onboarding", { state: { email: pendingEmail }, replace: true });
      })
      .finally(() => setChecking(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (checking) return <PathLoader />;
  return <>{children}</>;
};

export default AuthHandler;
