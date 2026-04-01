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
  name: string;
  email: string;
  role: string;
  industry: string;
  tools: string[];
  goal: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  industry: string;
  tools: string[];
  goal: string;
  ai_fitness_score?: number;
  ai_fitness_level?: string;
  ai_fitness_focus?: string;
  patterns?: { title: string; desc: string; strength?: number }[];
  nudges?: { text: string; urgent?: boolean; category?: string; date?: string }[];
  sessions?: { title: string; date: string; status?: string; rating?: number; steps?: number; tools?: string[] }[];
}

export interface Session {
  id: string;
  title: string;
  date: string;
  status: string;
  rating?: number;
  steps?: number;
  tools?: string[];
  query?: string;
  clarifying_questions?: { id: number; question: string; placeholder?: string }[];
}

export interface WorkflowResult {
  id: string;
  title: string;
  overview?: string;
  tools?: { name: string; why: string; link?: string; pricing?: string }[];
  steps?: { step: number; action: string; tool: string; prompt?: string; output?: string; time?: string }[];
  pro_tips?: string[];
  whats_next?: string[];
}

// POST /users — create user on onboarding completion
export function createUser(data: UserPayload): Promise<UserProfile> {
  return request("/users", { method: "POST", body: JSON.stringify(data) });
}

// GET /users/:id — fetch user profile, patterns, nudges
export function getUser(id: string): Promise<UserProfile> {
  return request(`/users/${id}`);
}

// POST /sessions/start — when user submits "Map My Path"
export function startSession(data: { user_id: string; query: string }): Promise<Session> {
  return request("/sessions/start", { method: "POST", body: JSON.stringify(data) });
}

// POST /sessions/build — when user submits clarifying answers
export function buildSession(data: { session_id: string; answers: Record<string, string> }): Promise<WorkflowResult> {
  return request("/sessions/build", { method: "POST", body: JSON.stringify(data) });
}

// GET /sessions/:user_id — fetch user's past sessions
export function getUserSessions(userId: string): Promise<Session[]> {
  return request(`/sessions/${userId}`);
}

// Helper to get/set user id
export function getUserId(): string | null {
  return localStorage.getItem("wayfinder_user_id");
}

export function setUserId(id: string): void {
  localStorage.setItem("wayfinder_user_id", id);
}
