import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: any[];
};

const SESSION_KEY = "copilot_session_id";

function extractCourseId(pathname: string): string | null {
  const match = pathname.match(/\/academia\/curso\/([^\/]+)/);
  return match ? match[1] : null;
}

export function useCopilotChat() {
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const courseId = useMemo(() => extractCourseId(location.pathname), [location.pathname]);

  useEffect(() => {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) {
      setSessionId(existing);
      return;
    }
    const id = uuidv4();
    localStorage.setItem(SESSION_KEY, id);
    setSessionId(id);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("copilot-query", {
        body: {
          query: text,
          top_k: 6,
          session_id: sessionId,
          course_id: courseId ?? null,
        },
      });
      if (error) throw error;
      const answer = (data as any)?.answer || "";
      const citations = (data as any)?.citations || [];
      setMessages((prev) => [...prev, { role: "assistant", content: answer, citations }]);
    } catch (err: any) {
      console.error("Copilot chat error:", err);
      toast.error(err?.message || "Falha ao consultar o Copilot");
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, courseId };
}

export default useCopilotChat;
