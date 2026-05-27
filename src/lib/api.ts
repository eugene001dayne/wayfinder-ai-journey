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
  suggested_fix: string;
  pattern_type?: string;
  [key: string]: unknown;
}

export interface Nudge {
  message: string;
  nudge_type: string;
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
  steps?: number;
  tools?: string[];
  query?: string;
  raw_input?: string;
  type?: string;
  has_workflow?: boolean;
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
  fallback?: {
    if_tool_unavailable?: string;
    if_stuck?: string;
    alternative_prompt?: string;
  };
  validation?: {
    checkpoint_question?: string;
    if_yes?: string;
    if_no?: string;
  };
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
  };
  title?: string;
  overview?: string;
  recommended_tools?: WorkflowTool[];
  steps?: WorkflowStep[];
  pro_tips?: string[];
  next_level?: string;
}

export async function getUserByEmail(email: string): Promise<UserProfile> {
  const res = await request<{ user: UserProfile } | UserProfile>(`/users/email/${encodeURIComponent(email)}`);
  if ("user" in res && res.user) return res.user;
  return res as UserProfile;
}

export async function createUser(data: Omit<UserPayload, "email"> & { email?: string }): Promise<UserProfile> {
  const res = await request<{ user: UserProfile } | UserProfile>("/users", { method: "POST", body: JSON.stringify(data) });
  if ("user" in res && res.user) return res.user;
  return res as UserProfile;
}

export async function getUser(id: string): Promise<UserProfile> {
  const res = await request<{ user: UserProfile; patterns?: Pattern[]; nudges?: Nudge[] } | UserProfile>(`/users/${id}`);
  if ("user" in res && res.user) {
    return { ...res.user, patterns: res.patterns || [], nudges: res.nudges || [] };
  }
  return res as UserProfile;
}

export function startSession(data: { user_id: string; raw_input: string }): Promise<Session> {
  return request("/sessions/start", { method: "POST", body: JSON.stringify(data) });
}

export function buildSession(data: { session_id: string; user_id: string; clarifying_answers: Record<string, string> }): Promise<WorkflowResult> {
  return request("/sessions/build", { method: "POST", body: JSON.stringify(data) });
}

export function getUserSessions(userId: string): Promise<Session[]> {
  return request(`/sessions/${userId}`);
}

export function rateSession(data: { session_id: string; outcome_rating: number }): Promise<unknown> {
  return request("/sessions/rate", { method: "POST", body: JSON.stringify(data) });
}

export interface MagicLinkResponse { message: string; is_new_user?: boolean; }
export interface VerifyResponse { user_id: string; is_new_user: boolean; onboarded: boolean; profile?: UserProfile; }

export function sendMagicLink(email: string): Promise<MagicLinkResponse> {
  return request("/auth/magic-link", { method: "POST", body: JSON.stringify({ email }) });
}

export function verifyMagicLink(token: string, email: string): Promise<VerifyResponse> {
  return request("/auth/verify", { method: "POST", body: JSON.stringify({ token, email }) });
}

// ── User ID persistence ──
// Store in BOTH localStorage (survives browser close) and sessionStorage (survives
// clearing recents on Android PWA). Read from either — whichever has it wins.
const USER_ID_KEY = "wayfinder_user_id";

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);
}

export function setUserId(id: string): void {
  localStorage.setItem(USER_ID_KEY, id);
  sessionStorage.setItem(USER_ID_KEY, id);
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}

export function getPendingEmail(): string | null {
  return localStorage.getItem("wayfinder_pending_email");
}

export function setPendingEmail(email: string): void {
  localStorage.setItem("wayfinder_pending_email", email);
}

export function clearPendingEmail(): void {
  localStorage.removeItem("wayfinder_pending_email");
}
