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
  [key: string]: unknown;
}

export interface Nudge {
  message: string;
  nudge_type: string;
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
  intent?: { clarifying_questions?: string[] };
  clarifying_questions?: string[] | ClarifyingQuestion[];
}

export interface WorkflowTool {
  name: string;
  why: string;
  link?: string;
  pricing?: string;
}

export interface WorkflowStep {
  step: number;
  tool: string;
  what_to_do: string;
  prompt_to_use?: string;
  expected_output?: string;
  time_estimate?: string;
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
  // Also support flat structure
  title?: string;
  overview?: string;
  recommended_tools?: WorkflowTool[];
  steps?: WorkflowStep[];
  pro_tips?: string[];
  next_level?: string;
}

// GET /users/email/:email
export async function getUserByEmail(email: string): Promise<UserProfile> {
  const res = await request<{ user: UserProfile } | UserProfile>(`/users/email/${encodeURIComponent(email)}`);
  if ("user" in res && res.user) return res.user;
  return res as UserProfile;
}

// POST /users
export async function createUser(data: UserPayload): Promise<UserProfile> {
  const res = await request<{ user: UserProfile } | UserProfile>("/users", { method: "POST", body: JSON.stringify(data) });
  if ("user" in res && res.user) return res.user;
  return res as UserProfile;
}

// GET /users/:id — response is { user: {...}, patterns: [], nudges: [] }
export async function getUser(id: string): Promise<UserProfile> {
  const res = await request<{ user: UserProfile; patterns?: Pattern[]; nudges?: Nudge[] } | UserProfile>(`/users/${id}`);
  if ("user" in res && res.user) {
    return { ...res.user, patterns: res.patterns || [], nudges: res.nudges || [] };
  }
  return res as UserProfile;
}

// POST /sessions/start
export function startSession(data: { user_id: string; raw_input: string }): Promise<Session> {
  return request("/sessions/start", { method: "POST", body: JSON.stringify(data) });
}

// POST /sessions/build
export function buildSession(data: { session_id: string; user_id: string; clarifying_answers: Record<string, string> }): Promise<WorkflowResult> {
  return request("/sessions/build", { method: "POST", body: JSON.stringify(data) });
}

// GET /sessions/:user_id
export function getUserSessions(userId: string): Promise<Session[]> {
  return request(`/sessions/${userId}`);
}

// POST rating
export function rateSession(data: { session_id: string; outcome_rating: number }): Promise<unknown> {
  return request("/sessions/rate", { method: "POST", body: JSON.stringify(data) });
}

// Magic link auth
export interface MagicLinkResponse {
  message: string;
  is_new_user?: boolean;
}

export interface VerifyResponse {
  user_id: string;
  is_new_user: boolean;
  onboarded: boolean;
  profile?: UserProfile;
}

export function sendMagicLink(email: string): Promise<MagicLinkResponse> {
  return request("/auth/magic-link", { method: "POST", body: JSON.stringify({ email }) });
}

export function verifyMagicLink(token: string, email: string): Promise<VerifyResponse> {
  return request("/auth/verify", { method: "POST", body: JSON.stringify({ token, email }) });
}

// Helper to get/set user id
export function getUserId(): string | null {
  return localStorage.getItem("wayfinder_user_id");
}

export function setUserId(id: string): void {
  localStorage.setItem("wayfinder_user_id", id);
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
