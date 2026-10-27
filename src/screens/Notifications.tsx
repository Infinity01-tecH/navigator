import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import { ArrowLeft, ArrowUpRight, Bell, Check, X } from 'lucide-react';
import { useApp } from '../lib/context';
import { supabase } from '../lib/supabase';

// Notifications — destination for the bell icon added to Main.tsx's Today
// tab header. New screen, new route (routes.tsx).
//
// Scope call (SESSION_HANDOFF_5.md §10.2 flagged this as genuinely open,
// "needs a direct answer, not an assumption either way"): this feed shows
// BOTH fresh friend requests AND streak-partner tier proposals directed at
// you, in two labeled sections — not just one type. Reasoning: Friends.tsx
// already surfaces both inline today; showing only one here would be
// exactly the "silent gap" that handoff section warned against, not a real
// scope reduction. Both draw from the same `friendships` table (see
// Friends.tsx's loadIncoming/loadFriends) with only a status/
// tier_proposed_by filter difference, so covering both costs little. Say
// the word if you want this narrowed to one type — it's a filter removal,
// not a rewrite.
//
// Two sections instead of one interleaved list because there's no shared
// reliable timestamp to sort by: fresh requests have created_at, but tier
// proposals only carry tier_proposed_by (no tier_proposed_at column exists
// per SESSION_HANDOFF_4.md §0.5's migration). Forcing them into one
// chronological list would mean fabricating an order. Sectioning (same
// pattern Friends.tsx already uses for "Requests" vs "Your friends") avoids
// that without hiding either type.
//
// No pagination — SESSION_HANDOFF_5.md §10.2 already decided plain scroll
// over the Hiring reference's numbered footer; not re-litigated here.
//
// Card layout borrows from the "Hiring" reference screenshot: avatar,
// name, subtitle, top-right circular button, rounded-2xl card shape and
// border. Dropped: the match-rate bar and chat/call icon pair — nothing in
// this data model maps to either. Swapped in: the top-right button now
// opens the requester/partner's profile (a real destination now that
// Profile.tsx is built) instead of an external link, and Accept/Decline
// reuse the exact circular-button visual language Friends.tsx already
// established for its own incoming-request card, not a new pattern.
//
// The reference's "chevron for long details" isn't implemented — nothing
// in the friendships table carries free-text detail to expand. Revisit if
// a future `notifications` table adds one.
//
// Background: a soft top-to-bottom wash using the darkest lime in the
// documented palette (DESIGN-SYSTEM.md §1.2, Lime dark 700 #4e6207) as the
// deepest stop, at low alpha so it reads as a light-mode tint rather than
// a dark panel — same spirit as the reference's own muted gradient without
// breaking the "light mode LOCKED" rule (HANDOFF.md §15).

function goToProfile(navigate: ReturnType<typeof useNavigate>, userId: string) {
  navigate(`/profile/${userId}`);
}

interface ProfileResult {
  id: string;
  username: string;
  display_name: string | null;
}

interface IncomingRequest {
  id: string;
  requester: ProfileResult;
}

interface TierProposal {
  friendshipId: string;
  profile: ProfileResult;
}

type ActionState = 'idle' | 'working' | 'done';

export function Notifications() {
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { user } = useApp();

  const [incoming, setIncoming] = useState<IncomingRequest[]>([]);
  const [proposals, setProposals] = useState<TierProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestState, setRequestState] = useState<Record<string, ActionState>>({});
  const [proposalState, setProposalState] = useState<Record<string, ActionState>>({});

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    // Both queries used to embed `profiles` directly via
    // `profiles!friendships_requester_id_fkey(...)` / `!friendships_addressee_id_fkey`.
    // Confirmed via console that PostgREST 400s on that hint — same root
    // cause as Friends.tsx's loadIncoming/loadFriends (see that file's
    // comment: no actual foreign key from friendships to profiles shows up
    // in Handoff 4 §0.2's own confirmed constraint list). Fetching
    // friendship rows plain and resolving profiles as a separate batched
    // call sidesteps the embed entirely.
    const [incomingRes, tierRes] = await Promise.all([
      // Fresh requests — identical query to Friends.tsx's loadIncoming.
      supabase
        .from('friendships')
        .select('id, requester_id')
        .eq('addressee_id', user.id)
        .eq('status', 'pending'),
      // Tier proposals on already-accepted friendships.
      supabase
        .from('friendships')
        .select('id, requester_id, addressee_id, tier_proposed_by')
        .eq('status', 'accepted')
        .not('tier_proposed_by', 'is', null)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`),
    ]);

    const incomingRows = (!incomingRes.error && incomingRes.data) ? incomingRes.data : [];
    const tierRows = (!tierRes.error && tierRes.data)
      // Only rows proposed by the OTHER party belong here — a row I
      // proposed myself is waiting-state info, already shown inline in
      // Friends.tsx ("Streak-partner request sent · Cancel"), not
      // something for me to act on in a notifications feed.
      ? tierRes.data.filter(row => row.tier_proposed_by && row.tier_proposed_by !== user.id)
      : [];

    // One shared profile fetch for both sections — a proposal and a fresh
    // request could easily point at overlapping people, no reason to ask
    // Supabase for the same profile twice in one load.
    const neededIds = new Set<string>();
    incomingRows.forEach(r => neededIds.add(r.requester_id));
    tierRows.forEach(r => neededIds.add(r.requester_id === user.id ? r.addressee_id : r.requester_id));

    let profileMap = new Map<string, ProfileResult>();
    if (neededIds.size > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', [...neededIds]);
      profileMap = new Map((profs ?? []).map(p => [p.id, p as ProfileResult]));
    }

    setIncoming(
      incomingRows
        .map(r => ({ id: r.id, requester: profileMap.get(r.requester_id) }))
        .filter((r): r is IncomingRequest => !!r.requester)
    );

    setProposals(
      tierRows
        .map(row => {
          const profile = profileMap.get(row.requester_id === user.id ? row.addressee_id : row.requester_id);
          return profile ? { friendshipId: row.id as string, profile } : null;
        })
        .filter((p): p is TierProposal => p !== null)
    );

    setLoading(false);

    // Mark everything just displayed as seen — screen-open-marks-all, not
    // per-card. Fire and forget: this powers the unread badge on
    // Main.tsx's TodayView, but nothing on THIS screen depends on the
    // write completing, so there's no reason to make the user wait on it.
    // Two separate updates because "seen" lives on whichever side of the
    // row belongs to me:
    //   - incoming requests: I'm always the addressee, so addressee_seen_at.
    //   - tier proposals: I could be either side, so split by row.
    const incomingIds = incomingRows.map(r => r.id);
    if (incomingIds.length > 0) {
      supabase
        .from('friendships')
        .update({ addressee_seen_at: new Date().toISOString() })
        .in('id', incomingIds);
    }

    if (tierRows.length > 0) {
      const asAddressee = tierRows.filter(r => r.addressee_id === user.id).map(r => r.id);
      const asRequester = tierRows.filter(r => r.requester_id === user.id).map(r => r.id);
      if (asAddressee.length > 0) {
        supabase
          .from('friendships')
          .update({ addressee_seen_at: new Date().toISOString() })
          .in('id', asAddressee);
      }
      if (asRequester.length > 0) {
        supabase
          .from('friendships')
          .update({ requester_seen_at: new Date().toISOString() })
          .in('id', asRequester);
      }
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function respondToRequest(requestId: string, accept: boolean) {
    setRequestState(s => ({ ...s, [requestId]: 'working' }));
    const { error } = await supabase.rpc('respond_to_friend_request', {
      request_id: requestId,
      accept,
    });
    if (error) { setRequestState(s => ({ ...s, [requestId]: 'idle' })); return; }
    setRequestState(s => ({ ...s, [requestId]: 'done' }));
    setIncoming(list => list.filter(r => r.id !== requestId));
  }

  // Accepting here completes a pairing the other person already proposed —
  // same RPC Friends.tsx calls for its "they proposed, I respond" branch
  // (see that file's proposePartner comment for why one RPC handles both
  // proposing and completing depending on who calls it and what's pending).
  async function acceptProposal(friendshipId: string) {
    setProposalState(s => ({ ...s, [friendshipId]: 'working' }));
    const { error } = await supabase.rpc('propose_streak_partner_tier', {
      p_friendship_id: friendshipId,
    });
    if (error) { setProposalState(s => ({ ...s, [friendshipId]: 'idle' })); return; }
    setProposalState(s => ({ ...s, [friendshipId]: 'done' }));
    setProposals(list => list.filter(p => p.friendshipId !== friendshipId));
  }

  async function declineProposal(friendshipId: string) {
    setProposalState(s => ({ ...s, [friendshipId]: 'working' }));
    const { error } = await supabase.rpc('decline_streak_partner_tier', {
      p_friendship_id: friendshipId,
    });
    if (error) { setProposalState(s => ({ ...s, [friendshipId]: 'idle' })); return; }
    setProposalState(s => ({ ...s, [friendshipId]: 'done' }));
    setProposals(list => list.filter(p => p.friendshipId !== friendshipId));
  }

  const visibleIncoming = incoming.filter(r => (requestState[r.id] ?? 'idle') !== 'done');
  const visibleProposals = proposals.filter(p => (proposalState[p.friendshipId] ?? 'idle') !== 'done');
  const isEmpty = !loading && visibleIncoming.length === 0 && visibleProposals.length === 0;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfff2 45%, #F8FDE7 75%, rgba(78,98,7,0.16) 100%)' }}
    >
      <div className="h-14 shrink-0" />

      <div className="px-5 pb-4 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="-ml-1 p-2 flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft size={24} strokeWidth={2.6} className="text-foreground" />
        </button>
        <h1 className="text-[20px] font-semibold text-foreground mt-3">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Requests and streak-partner proposals.</p>
      </div>

      <div ref={smoothRef} className="flex-1 min-h-0 overflow-y-auto px-5 pb-6 scrollbar-hide">
        {loading && <LoadingState />}

        {!loading && visibleIncoming.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
              New requests
            </p>
            <div className="flex flex-col gap-2.5">
              {visibleIncoming.map(req => (
                <NotificationCard
                  key={req.id}
                  name={req.requester.display_name || req.requester.username}
                  subtitle={`@${req.requester.username} wants to connect`}
                  busy={requestState[req.id] === 'working'}
                  onOpenProfile={() => goToProfile(navigate, req.requester.id)}
                  onAccept={() => respondToRequest(req.id, true)}
                  onDecline={() => respondToRequest(req.id, false)}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && visibleProposals.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
              Streak partner requests
            </p>
            <div className="flex flex-col gap-2.5">
              {visibleProposals.map(p => (
                <NotificationCard
                  key={p.friendshipId}
                  name={p.profile.display_name || p.profile.username}
                  subtitle={`@${p.profile.username} wants to be streak partners`}
                  busy={proposalState[p.friendshipId] === 'working'}
                  onOpenProfile={() => goToProfile(navigate, p.profile.id)}
                  onAccept={() => acceptProposal(p.friendshipId)}
                  onDecline={() => declineProposal(p.friendshipId)}
                />
              ))}
            </div>
          </div>
        )}

        {isEmpty && <EmptyState />}
      </div>
    </div>
  );
}

// ─── Card (Hiring-reference shape, Navigator content) ───────────────────

function NotificationCard({
  name, subtitle, busy, onOpenProfile, onAccept, onDecline,
}: {
  name: string;
  subtitle: string;
  busy: boolean;
  onOpenProfile: () => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="rounded-2xl p-3.5 bg-background border border-border">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground"
            style={{ background: '#c8f135' }}
          >
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{name}</p>
            <p className="text-[11px] text-accent-foreground truncate">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 hover:bg-muted transition-colors"
          aria-label={`View ${name}'s profile`}
        >
          <ArrowUpRight size={14} className="text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center justify-end gap-1.5">
        {busy ? (
          <span className="text-xs text-muted-foreground">…</span>
        ) : (
          <>
            <button
              onClick={onAccept}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-primary transition-colors"
              aria-label="Accept"
            >
              <Check size={14} className="text-foreground" />
            </button>
            <button
              onClick={onDecline}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Decline"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="h-[92px] bg-background/70 border border-border rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-16">
      <div className="w-14 h-14 rounded-[16px] bg-accent flex items-center justify-center mb-4">
        <Bell size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">You're all caught up</p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-[260px]">
        New friend requests and streak-partner proposals will show up here.
      </p>
    </div>
  );
}
