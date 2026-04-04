import type { WorkflowResult } from "./api";

export interface SavedSession {
  sessionId: string;
  title: string;
  date: string;
  status: string;
  query?: string;
  bookmarked?: boolean;
  workflow?: WorkflowResult;
}

const STORAGE_KEY = "wayfinder_sessions";

export function getSavedSessions(): SavedSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSession(session: SavedSession): void {
  const existing = getSavedSessions();
  const idx = existing.findIndex((s) => s.sessionId === session.sessionId);
  if (idx >= 0) {
    existing[idx] = { ...existing[idx], ...session };
  } else {
    existing.unshift(session);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function toggleBookmark(sessionId: string): boolean {
  const sessions = getSavedSessions();
  const s = sessions.find((s) => s.sessionId === sessionId);
  if (s) {
    s.bookmarked = !s.bookmarked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return s.bookmarked;
  }
  return false;
}

export function getSessionBySessionId(sessionId: string): SavedSession | undefined {
  return getSavedSessions().find((s) => s.sessionId === sessionId);
}
