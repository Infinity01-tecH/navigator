import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';

// Navigator doesn't use a VITE_SUPABASE_URL env var — per HANDOFF.md, the
// project URL is hardcoded directly in lib/supabase.ts. Hardcoding it here
// too, same pattern, rather than reading a build-time env var that doesn't exist.
const SUPABASE_URL = 'https://ykczxitiyuwbuslmdead.supabase.co';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatThreadSummary {
  id: string;
  title: string;
  roadmap_id: string | null;
  updated_at: string;
  pinned: boolean;
}

function sortThreads(list: ChatThreadSummary[]): ChatThreadSummary[] {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return +new Date(b.updated_at) - +new Date(a.updated_at);
  });
}

// One roadmap can now have many threads (ChatGPT-style new-chat + history),
// not the single thread-per-roadmap of the original design. On mount this
// opens the most recently updated thread for the current roadmap context,
// or creates one if none exist yet — same "lands in a conversation" feel as
// before, just no longer capped at one.
export function useChat(userId: string | null, roadmapId: string | null, systemContext: string) {
  const [threads, setThreads] = useState<ChatThreadSummary[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadMessages = useCallback(async (id: string) => {
    const { data, error: err } = await supabase
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('thread_id', id)
      .order('created_at', { ascending: true });
    if (!err) setMessages((data ?? []) as ChatMessage[]);
    else {
      console.error('failed to load messages:', err);
      setError(`Couldn't load messages for this chat (${err.message}).`);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!userId) { setLoading(false); return; }
    if (userId === 'dev-bypass') { setLoading(false); return; }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: existingThreads, error: fetchErr } = await supabase
          .from('chat_threads')
          .select('id, title, roadmap_id, updated_at, pinned')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
        if (fetchErr) throw fetchErr;
        if (cancelled) return;

        const list = sortThreads((existingThreads ?? []) as ChatThreadSummary[]);
        setThreads(list);

        const forThisRoadmap = list.find(t => t.roadmap_id === roadmapId);
        let id = forThisRoadmap?.id ?? null;

        if (!id) {
          const { data: created, error: insertErr } = await supabase
            .from('chat_threads')
            .insert({ user_id: userId, roadmap_id: roadmapId, title: 'New Chat' })
            .select('id, title, roadmap_id, updated_at, pinned')
            .single();
          if (insertErr) throw insertErr;
          id = created.id;
          if (!cancelled) setThreads(prev => sortThreads([created as ChatThreadSummary, ...prev]));
        }

        if (cancelled) return;
        setThreadId(id);
        await loadMessages(id);
      } catch (e) {
        if (!cancelled) {
          console.error('failed to load chat threads:', e);
          setError(`Couldn't load your chat history (${e instanceof Error ? e.message : String(e)}).`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // roadmapId intentionally re-runs the whole mount flow when the active
    // roadmap changes (switching tabs on a different pinned roadmap).
  }, [userId, roadmapId, loadMessages]);

  const openThread = useCallback(async (id: string) => {
    if (id === threadId) return;
    abortRef.current?.abort();
    setStreaming(false);
    setError(null);
    setLoading(true);
    setThreadId(id);
    await loadMessages(id);
    setLoading(false);
  }, [threadId, loadMessages]);

  const newChat = useCallback(async () => {
    if (!userId) return;
    abortRef.current?.abort();
    setStreaming(false);
    setError(null);
    const { data: created, error: insertErr } = await supabase
      .from('chat_threads')
      .insert({ user_id: userId, roadmap_id: roadmapId, title: 'New Chat' })
      .select('id, title, roadmap_id, updated_at, pinned')
      .single();
    if (insertErr) {
      console.error('failed to create new chat thread:', insertErr);
      setError(`Couldn't start a new chat (${insertErr.message}).`);
      return;
    }
    setThreads(prev => sortThreads([created as ChatThreadSummary, ...prev]));
    setThreadId(created.id);
    setMessages([]);
  }, [userId, roadmapId]);

  const send = useCallback(async (text: string) => {
    if (!threadId || !userId || !text.trim() || streaming) return;
    const isFirstMessage = messages.length === 0;

    const userMsg: ChatMessage = {
      id: `local_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setError(null);

    supabase.from('chat_messages').insert({
      thread_id: threadId, user_id: userId, role: 'user', content: userMsg.content,
    }).then(({ error: insertErr }) => {
      if (insertErr) {
        console.error('failed to persist user message:', insertErr);
        setError(`Your message may not have saved (${insertErr.message}).`);
      }
    });

    // Bump updated_at so history sorts correctly, and auto-title the thread
    // from the first message — same trick as ChatGPT's thread naming.
    const nowIso = new Date().toISOString();
    const autoTitle = isFirstMessage ? userMsg.content.slice(0, 48) : null;
    supabase.from('chat_threads')
      .update({ updated_at: nowIso, ...(autoTitle ? { title: autoTitle } : {}) })
      .eq('id', threadId)
      .then(({ error: updErr }) => {
        if (updErr) { console.error('failed to touch thread:', updErr); return; }
        setThreads(prev => sortThreads(prev
          .map(t => t.id === threadId ? { ...t, updated_at: nowIso, ...(autoTitle ? { title: autoTitle } : {}) } : t)));
      });

    const priorTurns = [...messages, userMsg].slice(-20);
    const apiMessages = [
      { role: 'system', content: systemContext },
      ...priorTurns.map(m => ({ role: m.role, content: m.content })),
    ];

    setStreaming(true);
    const assistantId = `local_${Date.now()}_a`;
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', created_at: new Date().toISOString() }]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let full = '';

    // Shared by both the normal-completion path below and the AbortError
    // branch in the catch block — a stopped stream still has real partial
    // content in `full`, and it deserves the same save (and the same
    // failure visibility) as a completed one.
    async function persistAssistantMessage(content: string, label: string) {
      const { error: insertErr } = await supabase.from('chat_messages').insert({
        thread_id: threadId, user_id: userId, role: 'assistant', content,
      });
      if (insertErr) {
        console.error(`failed to persist ${label.toLowerCase()}:`, insertErr);
        setError(`${label} wasn't saved and may disappear on reload (${insertErr.message}).`);
      }
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/chat-reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ messages: apiMessages }),
          signal: ctrl.signal,
        }
      );

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || `Chat request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              full += delta;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full } : m));
            }
          } catch {
            // Ignore malformed/keep-alive SSE lines rather than aborting the whole stream.
          }
        }
      }

      if (full.trim()) {
        persistAssistantMessage(full, 'This reply');
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        // User hit Stop mid-stream — whatever text already arrived is real
        // content, not a failure. Save it instead of letting it vanish on
        // next reload the same way the original bug did.
        if (full.trim()) {
          persistAssistantMessage(full, 'Partial reply');
        }
      } else {
        console.error('chat send failed:', e);
        setError(`Chat request failed: ${e instanceof Error ? e.message : String(e)}`);
        setMessages(prev => prev.filter(m => m.id !== assistantId || m.content));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [threadId, userId, messages, streaming, systemContext]);

  const togglePin = useCallback(async (id: string, pinned: boolean) => {
    if (!userId) return;
    const prevThreads = threads;
    setThreads(prev => sortThreads(prev.map(t => t.id === id ? { ...t, pinned } : t)));
    const { error: updErr } = await supabase.from('chat_threads').update({ pinned }).eq('id', id);
    if (updErr) {
      console.error('failed to update pin state:', updErr);
      setError(`Couldn't ${pinned ? 'pin' : 'unpin'} this chat (${updErr.message}).`);
      setThreads(prevThreads); // roll back the optimistic update
    }
  }, [userId, threads]);

  const deleteThread = useCallback(async (id: string) => {
    if (!userId) return;
    // Delete messages explicitly rather than assuming an ON DELETE CASCADE
    // exists from chat_messages.thread_id — safe either way: a no-op if the
    // cascade already handled it, the actual cleanup if it doesn't.
    const { error: msgErr } = await supabase.from('chat_messages').delete().eq('thread_id', id);
    if (msgErr) {
      console.error('failed to delete thread messages:', msgErr);
      setError(`Couldn't delete this chat (${msgErr.message}).`);
      return;
    }
    const { error: threadErr } = await supabase.from('chat_threads').delete().eq('id', id);
    if (threadErr) {
      console.error('failed to delete thread:', threadErr);
      setError(`Couldn't delete this chat (${threadErr.message}).`);
      return;
    }

    const remaining = threads.filter(t => t.id !== id);

    if (id === threadId) {
      if (remaining.length > 0) {
        setThreads(remaining);
        setThreadId(remaining[0].id);
        await loadMessages(remaining[0].id);
      } else {
        // Deleted the last thread — same "always land in a conversation"
        // contract as initial mount, so spin up a fresh one.
        setThreads([]);
        await newChat();
      }
    } else {
      setThreads(remaining);
    }
  }, [userId, threadId, threads, loadMessages, newChat]);

  const stop = useCallback(() => { abortRef.current?.abort(); }, []);

  return { threads, threadId, messages, loading, streaming, error, send, stop, newChat, openThread, togglePin, deleteThread };
}
