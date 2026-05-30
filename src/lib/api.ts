const BASE_URL = "https://wayfinder-backend-au9t.onrender.com";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export interface UserPayload {
  email: string;
  full_name: string;
  role: string;
  industry: string;
  tools_they_use: string[];
  goals: string;
}

export interface Pattern {
  description: string;
  suggested_fix?: string;
  pattern_type?: string;
  [key: string]: unknown;
}

export interface Nudge {
  id?: string;
  message: string;
  nudge_type?: string;
  action_prompt?: string;
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  role?: string;
  industry?: string;
  tools_they_use?: string[];
  goals?: string;
  ai_fitness_score?: number;
  ai_fitness_level?: string;
  ai_fitness_focus?: string;
  patterns?: Pattern[];
  nudges?: Nudge[];
  onboarded?: boolean;
}

export interface ClarifyingQuestion {
  id: number | string;
  question: string;
  placeholder?: string;
}

export interface Session {
  id: string;
  session_id?: string;
  title?: string;
  date?: string;
  status?: string;
  rating?: number;
  has_workflow?: boolean;
  workflow_id?: string;
  raw_input?: string;
  type?: string;
  intent?: { clarifying_questions?: string[] };
  clarifying_questions?: string[] | ClarifyingQuestion[];
}

export interface WorkflowTool {
  name: string;
  why?: string;
  url?: string;
  link?: string;
  pricing?: string;
  free_alternative?: string;
}

export interface WorkflowStep {
  step?: number;
  step_number?: number;
  title?: string;
  tool?: string;
  what_to_do?: string;
  prompt_to_use?: string;
  expected_output?: string;
  time_estimate?: string;
  fallback?: { if_tool_unavailable?: string; if_stuck?: string; };
  validation?: { checkpoint_question?: string; if_yes?: string; if_no?: string; };
}

export interface WorkflowResult {
  id?: string;
  session_id?: string;
  workflow?: {
    title?: string;
    overview?: string;
    recommended_tools?: WorkflowTool[];
    steps?: WorkflowStep[];
    pro_tips?: string[];
    next_level?: string;
    prompts_generated?: Record<string, unknown>;
  };
  title?: string;
  overview?: string;
  recommended_tools?: WorkflowTool[];
  steps?: WorkflowStep[];
  pro_tips?: string[];
  next_level?: string;
}

// ── User API ──
export async function getUserByEmail(email: string): Promise<UserProfile> {
  const res = await request<{ user: UserProfile } | UserProfile>(`/users/email/${encodeURIComponent(email)}`);
  if (res && "user" in res && (res as any).user) return (res as any).user;
  return res as UserProfile;
}

export async function createUser(data: Partial<UserPayload> & { email?: string }): Promise<UserProfile> {
  const res = await request<{ user: UserProfile } | UserProfile>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res && "user" in res && (res as any).user) return (res as any).user;
  return res as UserProfile;
}

export async function getUser(id: string): Promise<UserProfile> {
  const res = await request<{ user: UserProfile; patterns?: Pattern[]; nudges?: Nudge[] } | UserProfile>(`/users/${id}`);
  if (res && "user" in res && (res as any).user) {
    return { ...(res as any).user, patterns: (res as any).patterns || [], nudges: (res as any).nudges || [] };
  }
  return res as UserProfile;
}

// ── Session API ──
export function startSession(data: { user_id: string; raw_input: string }): Promise<Session> {
  return request("/sessions/start", { method: "POST", body: JSON.stringify(data) });
}

export function buildSession(data: {
  session_id: string;
  user_id: string;
  clarifying_answers: Record<string, string>;
}): Promise<WorkflowResult> {
  return request("/sessions/build", { method: "POST", body: JSON.stringify(data) });
}

export function getUserSessions(userId: string): Promise<Session[]> {
  return request(`/sessions/${userId}`);
}

export function rateSession(data: { session_id: string; outcome_rating: number }): Promise<unknown> {
  return request("/sessions/rate", { method: "POST", body: JSON.stringify(data) });
}

// ── Auth API ──
export interface MagicLinkResponse { message: string; is_new_user?: boolean; }

export function sendMagicLink(email: string): Promise<MagicLinkResponse> {
  return request("/auth/magic-link", { method: "POST", body: JSON.stringify({ email }) });
}

// ── Storage helpers ──
// Dual storage: localStorage survives browser close, sessionStorage survives
// clearing recent apps on Android. Reading either one keeps users logged in.
const USER_ID_KEY = "wayfinder_user_id";

export function getUserId(): string | null {
  try {
    return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);
  } catch {
    return null;
  }
}

export function setUserId(id: string): void {
  try {
    localStorage.setItem(USER_ID_KEY, id);
    sessionStorage.setItem(USER_ID_KEY, id);
  } catch {
    // storage blocked (private browsing) — fall back to memory
  }
}

export function clearUserId(): void {
  try {
    localStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
  } catch { /* ignore */ }
}

export function getPendingEmail(): string | null {
  try { return localStorage.getItem("wayfinder_pending_email"); } catch { return null; }
}

export function setPendingEmail(email: string): void {
  try { localStorage.setItem("wayfinder_pending_email", email); } catch { /* ignore */ }
}

export function clearPendingEmail(): void {
  try { localStorage.removeItem("wayfinder_pending_email"); } catch { /* ignore */ }
}
