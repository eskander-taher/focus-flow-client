import { api } from "./api";
import { Session } from "../types";

export interface ServerSessionPayload {
  goal: string;
  duration: number;
  result: string;
  startTime: string | Date;
  endTime: string | Date;
  completed: boolean;
}

export async function fetchSessions(): Promise<Session[]> {
  const { data } = await api.get("/api/sessions");
  return (data.sessions || []).map((s: any) => ({
    id: s._id,
    goal: s.goal,
    duration: s.duration,
    result: s.result || "",
    startTime: new Date(s.startTime),
    endTime: new Date(s.endTime),
    completed: Boolean(s.completed),
  }));
}

export async function createSession(session: Session): Promise<Session> {
  const payload: ServerSessionPayload = {
    goal: session.goal,
    duration: session.duration,
    result: session.result,
    startTime: session.startTime,
    endTime: session.endTime,
    completed: session.completed,
  };
  const { data } = await api.post("/api/sessions", payload);
  const s = data.session;
  return {
    id: s._id,
    goal: s.goal,
    duration: s.duration,
    result: s.result || "",
    startTime: new Date(s.startTime),
    endTime: new Date(s.endTime),
    completed: Boolean(s.completed),
  };
}

export async function clearSessions(): Promise<void> {
  await api.delete("/api/sessions");
}


