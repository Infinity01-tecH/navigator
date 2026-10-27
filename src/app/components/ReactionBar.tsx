import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../lib/context';
import { supabase } from '../../lib/supabase';

const QUICK_REACTIONS = ['🔥', '👏', '💪', '🎉', '❤️', '😮'];

interface ReactionRow {
  from_user: string;
  reaction_type: string;
}

interface ReactionBarProps {
  /** Profile id of the person being reacted to. */
  toUserId: string;
  /** Defaults to 'profile' — see reactions_migration.sql for why other
   * target types aren't wired up yet. */
  targetType?: string;
  /** Defaults to toUserId — pass a distinct id once a real target type
   * (achievement, streak, etc.) is added. */
  targetId?: string;
}

export function ReactionBar({ toUserId, targetType = 'profile', targetId }: ReactionBarProps) {
  const { user } = useApp();
  const resolvedTarget = targetId ?? toUserId;

  const [rows, setRows] = useState<ReactionRow[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('reactions')
      .select('from_user, reaction_type')
      .eq('to_user', toUserId)
      .eq('target_type', targetType)
      .eq('target_id', resolvedTarget);
    setRows(data ?? []);
  }, [toUserId, targetType, resolvedTarget]);

  useEffect(() => {
    load();
  }, [load]);

  const myReaction = rows.find(r => r.from_user === user?.id)?.reaction_type ?? null;

  const counts: Record<string, number> = {};
  rows.forEach(r => {
    counts[r.reaction_type] = (counts[r.reaction_type] ?? 0) + 1;
  });
  const summary = Object.entries(counts);

  async function react(emoji: string) {
    if (!user || sending) return;
    setSending(true);
    setPickerOpen(false);

    // Optimistic update — revert on failure rather than waiting on the
    // round trip, since this is meant to feel instant like WhatsApp.
    const prevRows = rows;
    let nextRows: ReactionRow[];
    if (myReaction === emoji) {
      nextRows = rows.filter(r => r.from_user !== user.id);
    } else if (myReaction) {
      nextRows = rows.map(r => (r.from_user === user.id ? { ...r, reaction_type: emoji } : r));
    } else {
      nextRows = [...rows, { from_user: user.id, reaction_type: emoji }];
    }
    setRows(nextRows);

    const { error } = await supabase.rpc('toggle_reaction', {
      p_to_user: toUserId,
      p_reaction_type: emoji,
      p_target_type: targetType,
      p_target_id: resolvedTarget,
    });

    if (error) setRows(prevRows);
    setSending(false);
  }

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {summary.map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => react(emoji)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
            myReaction === emoji
              ? 'bg-accent border-primary text-accent-foreground'
              : 'bg-muted border-border text-muted-foreground'
          }`}
        >
          <span>{emoji}</span>
          <span className="font-semibold">{count}</span>
        </button>
      ))}

      <button
        onClick={() => setPickerOpen(o => !o)}
        aria-label="React"
        className="w-7 h-7 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors text-sm"
      >
        {myReaction ?? '+'}
      </button>

      {pickerOpen && (
        <>
          {/* Click-outside catcher */}
          <button
            className="fixed inset-0 z-0 cursor-default"
            aria-label="Close reaction picker"
            onClick={() => setPickerOpen(false)}
          />
          <div
            className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-background border border-border rounded-full px-2 py-1.5 shadow-[0_8px_20px_rgba(19,25,39,0.12)] z-10"
            style={{ animation: 'reaction-bar-pop 0.18s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            {QUICK_REACTIONS.map((emoji, i) => (
              <button
                key={emoji}
                onClick={() => react(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:scale-125 hover:bg-accent transition-transform"
                style={{
                  animation: 'reaction-emoji-pop 0.22s cubic-bezier(0.34,1.56,0.64,1) both',
                  animationDelay: `${i * 25}ms`,
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes reaction-bar-pop {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes reaction-emoji-pop {
          from { opacity: 0; transform: scale(0.4) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
