
import { useCallback } from "react";

const LOG_KEY = "beauty_master_action_log";

export interface BeautyLogEvent {
  session_id: string;
  timestamp: number;
  event: "start" | "answer" | "recommendation" | "reset";
  question_id?: string;
  answer?: string;
  recommendation_id?: string;
}

export function useMestreDaBelezaLogs(session_id: string) {
  const logEvent = useCallback(
    (event: Omit<BeautyLogEvent, "session_id" | "timestamp">) => {
      try {
        const prev = localStorage.getItem(LOG_KEY);
        const logs = prev ? JSON.parse(prev) : [];
        const entry: BeautyLogEvent = { 
          ...event, 
          session_id, 
          timestamp: Date.now() 
        };
        logs.push(entry);
        localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-200)));
      } catch (e) {
        // Silencioso para evitar quebra de fluxo
      }
    },
    [session_id]
  );
  const getLogs = useCallback(() => {
    try {
      const prev = localStorage.getItem(LOG_KEY);
      return prev ? JSON.parse(prev) as BeautyLogEvent[] : [];
    } catch {
      return [];
    }
  }, []);
  const clearLogs = useCallback(() => {
    localStorage.removeItem(LOG_KEY);
  }, []);
  return { logEvent, getLogs, clearLogs };
}
