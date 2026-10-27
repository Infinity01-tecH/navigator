import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import { Search, UserPlus, Check, Clock, X, Flame } from 'lucide-react';
import { useApp } from '../lib/context';
import { supabase } from '../lib/supabase';
import { ReactionBar } from '../app/components/ReactionBar';
import svgPaths from '../imports/SettingsScreenChatScreen2DarkMode4/svg-i8mhn8rzzt';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';

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

interface FriendEntry {
  friendshipId: string;
  profile: ProfileResult;
  tier: 'friend' | 'streak_partner';
  tierProposedBy: string | null;
}

type FriendStatus =
  | 'none'
  | 'pending_outgoing'
  | 'pending_incoming'
  | 'accepted'
  | 'declined'
  | 'blocked';

interface StatusEntry {
  status: FriendStatus;
  friendshipId: string;
}

type RequestState = 'idle' | 'sending' | 'sent' | 'error';
type RespondState = 'idle' | 'responding' | 'done';

// ── Illustration components (structure from Figma import) ──────────────────────

function IllustrationGroup() {
  return (
    <div className="absolute flex items-center justify-center" style={{ inset: '2.77% 54.19% 48.39% -3.34%', containerType: 'size' }}>
      <div className="flex-none rotate-[12.85deg]" style={{ width: 'hypot(81.5807cqw, 18.7213cqh)', height: 'hypot(-18.4193cqw, 81.2787cqh)' }}>
        <div className="relative size-full">
          <svg className="absolute block inset-0 size-full" fill="none" height="146.983" preserveAspectRatio="none" viewBox="0 0 148.459 146.983" width="148.459">
            <g>
              <path d={svgPaths.pbfd0180} fill="black" fillOpacity="0.1" />
              <path d={svgPaths.p3e841b00} fill="#F7D67C" />
              <path d={svgPaths.pbd6d00} fill="black" />
              <path d={svgPaths.p28d5a080} fill="black" />
              <path d={svgPaths.p3e325880} fill="white" />
              <path d={svgPaths.pcd34880} fill="black" />
              <path d={svgPaths.pddf1100} fill="black" />
              <path d={svgPaths.p15768840} fill="black" />
              <path d={svgPaths.p195f9f00} fill="black" />
              <path d={svgPaths.p3c8f1300} fill="black" />
              <path d={svgPaths.p3a1d8480} fill="black" />
              <path d={svgPaths.p9788ff0} fill="black" />
              <path d={svgPaths.p1b574c00} fill="white" />
              <path d={svgPaths.pad9bb80} fill="black" />
              <path d={svgPaths.p2f5cadc0} fill="white" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function IllustrationGroup1() {
  return (
    <div className="absolute flex items-center justify-center" style={{ inset: '43.21% 2.4% 12.68% 52.88%', containerType: 'size' }}>
      <div className="flex-none rotate-[14.86deg]" style={{ width: 'hypot(79.4148cqw, 21.3622cqh)', height: 'hypot(-20.5852cqw, 78.6378cqh)' }}>
        <div className="relative size-full">
          <svg className="absolute block inset-0 size-full" fill="none" height="129.553" preserveAspectRatio="none" viewBox="0 0 132.626 129.553" width="132.626">
            <g>
              <path d={svgPaths.p176ac9c0} fill="black" fillOpacity="0.1" />
              <path d={svgPaths.p2e8652b0} fill="#CFE58C" />
              <path d={svgPaths.p3d01fb6c} fill="black" />
              <path clipRule="evenodd" d={svgPaths.p38ba6300} fill="#763900" fillRule="evenodd" />
              <path d={svgPaths.p2607ed00} fill="black" />
              <path d={svgPaths.p17c49500} fill="white" />
              <path d={svgPaths.p17ef500} fill="black" />
              <path d={svgPaths.p3b7bbe00} fill="white" />
              <path d={svgPaths.p2a395680} fill="black" />
              <path d={svgPaths.p1fc8bb00} fill="black" />
              <path d={svgPaths.p2caa6a00} fill="black" />
              <path d={svgPaths.p2c0e2a80} fill="white" />
              <path d={svgPaths.p33919600} fill="black" />
              <path d={svgPaths.p2192a080} fill="black" />
              <path d={svgPaths.p3d19c126} fill="#796A45" />
              <path d={svgPaths.p11301b00} fill="#796A45" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function IllustrationFlag2() {
  return (
    <div className="absolute" style={{ inset: '3.65% 10.31% 82.76% 76.48%' }}>
      <svg className="absolute block inset-0 size-full" fill="none" height="49.0659" preserveAspectRatio="none" viewBox="0 0 47.6668 49.0659" width="47.6668">
        <path d={svgPaths.p7150ec0} fill="#131313" />
        <path d={svgPaths.p6e96180} fill="white" />
        <path d={svgPaths.p3d018b00} fill="#0ACF83" />
        <path d={svgPaths.pb390a00} fill="#A259FF" />
        <path d={svgPaths.p22f6340} fill="#F24E1E" />
        <path d={svgPaths.p1637b80} fill="#FF7262" />
        <path d={svgPaths.p39b7b80} fill="#1ABCFE" />
      </svg>
    </div>
  );
}

function IllustrationGroup2() {
  return (
    <div className="absolute" style={{ inset: '72.02% 88.04% 21.53% 5.54%' }}>
      <svg className="absolute block inset-0 size-full" fill="none" height="23.2764" preserveAspectRatio="none" viewBox="0 0 23.1641 23.2764" width="23.1641">
        <path d={svgPaths.pb131400} fill="#FF7043" />
        <path d={svgPaths.p1acad500} fill="#FF7043" />
        <path d={svgPaths.p371c3f80} fill="#FF7043" />
        <path d={svgPaths.p4ad2280} fill="#FF7043" />
        <path d={svgPaths.p3da1b800} fill="#FF7043" />
        <path d={svgPaths.p24b93980} fill="#FF7043" />
        <path d={svgPaths.p64fbac0} fill="#FF7043" />
        <path d={svgPaths.p501d4f2} fill="#FF7043" />
        <path d={svgPaths.p19198600} fill="#FF7043" />
        <path d={svgPaths.pa709580} fill="#FF7043" />
        <path d={svgPaths.p28754780} fill="#FF7043" />
        <path d={svgPaths.p27a656f2} fill="#FF7043" />
      </svg>
    </div>
  );
}

function IllustrationFlag() {
  return (
    <div className="absolute" style={{ inset: '91.21% 29.06% 0.63% 63.02%' }}>
      <svg className="absolute block inset-0 size-full" fill="none" height="29.4795" preserveAspectRatio="none" viewBox="0 0 28.5834 29.4795" width="28.5834">
        <path d={svgPaths.p38efd0c0} fill="#131313" />
        <path d={svgPaths.p109ba400} fill="#F9FFE6" />
        <path d={svgPaths.p3cd48880} fill="black" />
      </svg>
    </div>
  );
}

function FindFriendsIllustration() {
  return (
    <div className="relative w-full aspect-square shrink-0">
      {/* blob background */}
      <div className="absolute" style={{ inset: '0.05% -1.65%' }}>
        <svg className="absolute block inset-0 size-full" fill="none" height="360.628" preserveAspectRatio="none" viewBox="0 0 372.924 360.628" width="372.924">
          <path d={svgPaths.p23144f80} fill="#F9FFE6" />
        </svg>
      </div>
      {/* dashed green line */}
      <div className="absolute" style={{ inset: '5.87% 2.35% -4.96% -10.03%' }}>
        <svg className="absolute block inset-0 size-full" fill="none" height="357.719" preserveAspectRatio="none" viewBox="0 0 388.753 357.719" width="388.753">
          <path clipRule="evenodd" d={svgPaths.p2270a000} fill="#8CB200" fillRule="evenodd" />
        </svg>
      </div>
      <IllustrationGroup />
      <IllustrationGroup1 />
      <IllustrationFlag2 />
      {/* phone icon vector */}
      <div className="absolute" style={{ inset: '69.48% 84.64% 19.35% 4.17%' }}>
        <svg className="absolute block inset-0 size-full" fill="none" height="40.3222" preserveAspectRatio="none" viewBox="0 0 40.3732 40.3222" width="40.3732">
          <path d={svgPaths.p1c5a940} fill="#131313" />
        </svg>
      </div>
      <div className="absolute" style={{ inset: '69.76% 85.54% 19.1% 3.3%' }}>
        <svg className="absolute block inset-0 size-full" fill="none" height="40.2092" preserveAspectRatio="none" viewBox="0 0 40.2777 40.2092" width="40.2777">
          <path d={svgPaths.p77faef0} fill="#F9FFE6" />
        </svg>
      </div>
      <IllustrationGroup2 />
      <IllustrationFlag />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Friends() {
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { user } = useApp();

  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, StatusEntry>>({});
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [requestState, setRequestState] = useState<Record<string, RequestState>>({});
  const [cancelConfirm, setCancelConfirm] = useState<Record<string, boolean>>({});
  const cancelTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [incoming, setIncoming] = useState<IncomingRequest[]>([]);
  const [incomingLoading, setIncomingLoading] = useState(true);
  const [respondState, setRespondState] = useState<Record<string, RespondState>>({});

  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [tierActionState, setTierActionState] = useState<Record<string, 'idle' | 'working'>>({});
  const [demoteConfirm, setDemoteConfirm] = useState<Record<string, boolean>>({});
  const demoteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [unfriendConfirm, setUnfriendConfirm] = useState<Record<string, boolean>>({});
  const unfriendTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus search input when search mode activates
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // ---------------- Accepted friends ----------------
  const loadFriends = useCallback(async () => {
    if (!user) return;
    setFriendsLoading(true);

    const { data: rows, error } = await supabase
      .from('friendships')
      .select('id, requester_id, addressee_id, tier, tier_proposed_by')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!error && rows) {
      if (rows.length === 0) {
        setFriends([]);
      } else {
        const otherIds = [...new Set(
          rows.map(r => (r.requester_id === user.id ? r.addressee_id : r.requester_id))
        )];
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, username, display_name')
          .in('id', otherIds);
        const profileMap = new Map((profs ?? []).map(p => [p.id, p as ProfileResult]));
        const list = rows
          .map(row => ({
            friendshipId: row.id,
            profile: profileMap.get(row.requester_id === user.id ? row.addressee_id : row.requester_id),
            tier: (row.tier ?? 'friend') as FriendEntry['tier'],
            tierProposedBy: row.tier_proposed_by ?? null,
          }))
          .filter((f): f is FriendEntry => !!f.profile);
        setFriends(list);
      }
    }
    setFriendsLoading(false);
  }, [user]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  // ---------------- Incoming requests ----------------
  const loadIncoming = useCallback(async () => {
    if (!user) return;
    setIncomingLoading(true);

    const { data: rows, error } = await supabase
      .from('friendships')
      .select('id, requester_id')
      .eq('addressee_id', user.id)
      .eq('status', 'pending');

    if (!error && rows) {
      if (rows.length === 0) {
        setIncoming([]);
      } else {
        const requesterIds = [...new Set(rows.map(r => r.requester_id))];
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, username, display_name')
          .in('id', requesterIds);
        const profileMap = new Map((profs ?? []).map(p => [p.id, p as ProfileResult]));
        setIncoming(
          rows
            .map(r => ({ id: r.id, requester: profileMap.get(r.requester_id) }))
            .filter((r): r is IncomingRequest => !!r.requester)
        );
      }
    }
    setIncomingLoading(false);
  }, [user]);

  useEffect(() => {
    loadIncoming();
  }, [loadIncoming]);

  async function respond(requestId: string, accept: boolean) {
    setRespondState(s => ({ ...s, [requestId]: 'responding' }));
    const { error } = await supabase.rpc('respond_to_friend_request', {
      request_id: requestId,
      accept,
    });
    if (error) {
      setRespondState(s => ({ ...s, [requestId]: 'idle' }));
      return;
    }
    setRespondState(s => ({ ...s, [requestId]: 'done' }));
    setIncoming(list => list.filter(r => r.id !== requestId));
    if (accept) loadFriends();
  }

  // ---------------- Search ----------------
  const runSearch = useCallback(
    async (q: string) => {
      if (!user) return;
      const trimmed = q.trim();
      if (trimmed.length < 3) {
        setResults([]);
        setStatusMap({});
        setSearchError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setSearchError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .ilike('username', `${trimmed}%`)
        .neq('id', user.id)
        .limit(20);

      if (error) {
        setSearchError('Search failed. Try again.');
        setResults([]);
        setLoading(false);
        return;
      }

      const found = data ?? [];
      setResults(found);

      if (found.length === 0) {
        setStatusMap({});
        setLoading(false);
        return;
      }

      const ids = found.map(r => r.id);
      const { data: existing } = await supabase
        .from('friendships')
        .select('id, requester_id, addressee_id, status')
        .or(
          `and(requester_id.eq.${user.id},addressee_id.in.(${ids.join(',')})),` +
            `and(addressee_id.eq.${user.id},requester_id.in.(${ids.join(',')}))`
        );

      const map: Record<string, StatusEntry> = {};
      (existing ?? []).forEach((row: any) => {
        const otherId = row.requester_id === user.id ? row.addressee_id : row.requester_id;
        let status: FriendStatus;
        if (row.status === 'accepted') status = 'accepted';
        else if (row.status === 'blocked') status = 'blocked';
        else if (row.status === 'pending') {
          status = row.requester_id === user.id ? 'pending_outgoing' : 'pending_incoming';
        } else {
          status = 'declined';
        }
        map[otherId] = { status, friendshipId: row.id };
      });
      setStatusMap(map);
      setLoading(false);
    },
    [user]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  async function sendRequest(target: ProfileResult) {
    if (!user) return;
    setRequestState(s => ({ ...s, [target.id]: 'sending' }));

    const { data, error } = await supabase.rpc('send_friend_request_by_id', {
      target_id: target.id,
    });

    if (error) {
      setRequestState(s => ({ ...s, [target.id]: 'error' }));
      return;
    }
    setRequestState(s => ({ ...s, [target.id]: 'sent' }));
    setStatusMap(m => ({
      ...m,
      [target.id]: { status: 'pending_outgoing', friendshipId: data as string },
    }));
  }

  function handleCancelTap(targetId: string, friendshipId: string) {
    if (cancelConfirm[targetId]) {
      cancelRequest(targetId, friendshipId);
      return;
    }
    setCancelConfirm(c => ({ ...c, [targetId]: true }));
    if (cancelTimers.current[targetId]) clearTimeout(cancelTimers.current[targetId]);
    cancelTimers.current[targetId] = setTimeout(() => {
      setCancelConfirm(c => ({ ...c, [targetId]: false }));
    }, 3000);
  }

  async function cancelRequest(targetId: string, friendshipId: string) {
    setCancelConfirm(c => ({ ...c, [targetId]: false }));
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
    if (!error) {
      setStatusMap(m => {
        const next = { ...m };
        delete next[targetId];
        return next;
      });
      setRequestState(s => {
        const next = { ...s };
        delete next[targetId];
        return next;
      });
    }
  }

  function applyTierRow(friendshipId: string, row: any) {
    setFriends(list =>
      list.map(f =>
        f.friendshipId === friendshipId
          ? { ...f, tier: row.tier as FriendEntry['tier'], tierProposedBy: row.tier_proposed_by ?? null }
          : f
      )
    );
  }

  async function proposePartner(friendshipId: string) {
    setTierActionState(s => ({ ...s, [friendshipId]: 'working' }));
    const { data, error } = await supabase.rpc('propose_streak_partner_tier', {
      p_friendship_id: friendshipId,
    });
    setTierActionState(s => ({ ...s, [friendshipId]: 'idle' }));
    if (error) return;
    const row = Array.isArray(data) ? data[0] : data;
    if (row) applyTierRow(friendshipId, row);
  }

  async function declineProposal(friendshipId: string) {
    setTierActionState(s => ({ ...s, [friendshipId]: 'working' }));
    const { data, error } = await supabase.rpc('decline_streak_partner_tier', {
      p_friendship_id: friendshipId,
    });
    setTierActionState(s => ({ ...s, [friendshipId]: 'idle' }));
    if (error) return;
    const row = Array.isArray(data) ? data[0] : data;
    if (row) applyTierRow(friendshipId, row);
  }

  function handleDemoteTap(friendshipId: string) {
    if (demoteConfirm[friendshipId]) {
      demote(friendshipId);
      return;
    }
    setDemoteConfirm(c => ({ ...c, [friendshipId]: true }));
    if (demoteTimers.current[friendshipId]) clearTimeout(demoteTimers.current[friendshipId]);
    demoteTimers.current[friendshipId] = setTimeout(() => {
      setDemoteConfirm(c => ({ ...c, [friendshipId]: false }));
    }, 3000);
  }

  async function demote(friendshipId: string) {
    setDemoteConfirm(c => ({ ...c, [friendshipId]: false }));
    const { data, error } = await supabase.rpc('demote_streak_partner', {
      p_friendship_id: friendshipId,
    });
    if (error) return;
    const row = Array.isArray(data) ? data[0] : data;
    if (row) applyTierRow(friendshipId, row);
  }

  function handleUnfriendTap(friendshipId: string) {
    if (unfriendConfirm[friendshipId]) {
      unfriend(friendshipId);
      return;
    }
    setUnfriendConfirm(c => ({ ...c, [friendshipId]: true }));
    if (unfriendTimers.current[friendshipId]) clearTimeout(unfriendTimers.current[friendshipId]);
    unfriendTimers.current[friendshipId] = setTimeout(() => {
      setUnfriendConfirm(c => ({ ...c, [friendshipId]: false }));
    }, 3000);
  }

  async function unfriend(friendshipId: string) {
    setUnfriendConfirm(c => ({ ...c, [friendshipId]: false }));
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
    if (!error) {
      setFriends(list => list.filter(f => f.friendshipId !== friendshipId));
    }
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const isLoaded = !friendsLoading && !incomingLoading;
  const isEmpty = isLoaded && friends.length === 0 && incoming.length === 0;
  const showEmptyState = isEmpty && !showSearch && query === '';

  function handleSearchToggle() {
    if (showSearch && query === '') {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  }

  function handleFindFriends() {
    setShowSearch(true);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="h-14 shrink-0" />

      {/* Back & theme row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 flex items-center justify-center"
          aria-label="Back"
        >
          <div className="relative size-[24px] flex items-center justify-center" style={{ containerType: 'size' }}>
            <div className="flex-none rotate-90" style={{ width: 'hypot(100cqw, 0cqh)', height: 'hypot(0cqw, 100cqh)' }}>
              <svg fill="none" height="17" viewBox="0 0 14.049 17" width="14.049">
                <path d="M7.0246 16V1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d={backSvg.pcca5f60} stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </button>
        <button
          className="bg-card rounded-[12px] p-2 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          <svg fill="none" height="24" viewBox="0 0 19.3542 19.3542" width="24">
            <path clipRule="evenodd" d={backSvg.p1b5c2d80} fill="#131313" fillRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Header — "Friends" + search icon */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <p className="text-[20px] font-semibold leading-6 tracking-[-0.06px] text-foreground">
          Friends
        </p>
        <button
          onClick={handleSearchToggle}
          className="bg-card rounded-[12px] p-2 flex items-center justify-center transition-colors hover:bg-[#efefef]"
          aria-label={showSearch ? 'Close search' : 'Search users'}
        >
          {showSearch && query === '' ? (
            <X size={20} className="text-foreground" />
          ) : (
            <Search size={20} className="text-foreground" />
          )}
        </button>
      </div>

      {showEmptyState ? (
        /* ── Empty state ── */
        <div
          ref={smoothRef}
          className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center px-4 pb-8"
        >
          <div className="flex flex-col items-center gap-[50px] w-full max-w-[361px] pt-2">
            <FindFriendsIllustration />

            <div className="flex flex-col gap-2 text-center w-full">
              <p className="text-[20px] font-semibold leading-6 tracking-[-0.06px] text-foreground">
                Makes friends with people like you, intentional for growth
              </p>
              <p className="text-[16px] font-normal leading-5 tracking-[-0.048px] text-foreground">
                {"It's kind of quiet here... Add friends! You can check each other's streak and achievements."}
              </p>
            </div>

            <button
              onClick={handleFindFriends}
              className="w-full bg-primary rounded-[12px] py-3 px-5 text-white text-[20px] font-semibold leading-6 tracking-[-0.408px] text-center transition-colors hover:bg-[#7ea300] active:bg-[#6f9000]"
            >
              Find friends
            </button>

            <button className="text-primary text-base font-medium">
              Invite friends
            </button>
          </div>
        </div>
      ) : (
        /* ── List + search view ── */
        <div ref={smoothRef} className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 scrollbar-hide">

          {/* Search bar */}
          {(showSearch || query.length > 0) && (
            <div className="relative mb-5">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                ref={searchInputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search username…"
                className="w-full h-12 pl-10 pr-4 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          {query.trim().length > 0 && query.trim().length < 3 && (
            <p className="text-xs text-muted-foreground text-center mt-6">Keep typing… (3+ characters)</p>
          )}
          {loading && <p className="text-xs text-muted-foreground text-center mt-6">Searching…</p>}
          {searchError && <p className="text-xs text-[#e0533d] text-center mt-6">{searchError}</p>}
          {!loading && !searchError && query.trim().length >= 3 && results.length === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-6">No users found.</p>
          )}

          {/* Search results */}
          {results.length > 0 && (
            <div className="flex flex-col gap-2.5 mb-6">
              {results.map(r => {
                const entry = statusMap[r.id];
                const status = entry?.status ?? 'none';
                const st = requestState[r.id] ?? 'idle';
                const confirming = cancelConfirm[r.id];

                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-border"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground"
                      style={{ background: '#c8f135' }}
                    >
                      {r.username.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {r.display_name || r.username}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">@{r.username}</p>
                    </div>

                    {status === 'accepted' ? (
                      <span className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-primary bg-accent border border-primary shrink-0">
                        <Check size={12} /> Friends
                      </span>
                    ) : status === 'pending_incoming' ? (
                      <span className="px-3 py-2 rounded-full text-xs font-semibold text-accent-foreground bg-accent border border-primary shrink-0">
                        Respond above
                      </span>
                    ) : status === 'pending_outgoing' || st === 'sent' ? (
                      <button
                        onClick={() =>
                          entry?.friendshipId && handleCancelTap(r.id, entry.friendshipId)
                        }
                        className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                          confirming
                            ? 'text-white bg-[#e0533d]'
                            : 'text-primary bg-accent border border-primary hover:bg-[#ebfab4]'
                        }`}
                      >
                        {confirming ? 'Cancel?' : <><Check size={12} /> Requested</>}
                      </button>
                    ) : status === 'blocked' ? (
                      <span className="px-3 py-2 rounded-full text-xs font-semibold text-muted-foreground shrink-0">
                        Unavailable
                      </span>
                    ) : st === 'sending' ? (
                      <span className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-muted-foreground shrink-0">
                        <Clock size={12} /> Sending…
                      </span>
                    ) : (
                      <button
                        onClick={() => sendRequest(r)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                          st === 'error'
                            ? 'text-[#e0533d] border border-[#e0533d] hover:bg-[#fdeeeb]'
                            : 'text-foreground bg-primary hover:bg-primary'
                        }`}
                      >
                        <UserPlus size={12} />
                        {st === 'error' ? 'Retry' : 'Add'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Incoming requests */}
          {!incomingLoading && incoming.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Requests
              </p>
              <div className="flex flex-col gap-2.5">
                {incoming.map(req => {
                  const rs = respondState[req.id] ?? 'idle';
                  if (rs === 'done') return null;
                  return (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-primary bg-accent"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground"
                        style={{ background: '#c8f135' }}
                      >
                        {req.requester.username.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {req.requester.display_name || req.requester.username}
                        </p>
                        <p className="text-[11px] text-accent-foreground truncate">
                          @{req.requester.username} wants to connect
                        </p>
                      </div>
                      {rs === 'responding' ? (
                        <span className="text-xs text-muted-foreground shrink-0">…</span>
                      ) : (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => respond(req.id, true)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-primary transition-colors"
                            aria-label="Accept"
                          >
                            <Check size={14} className="text-foreground" />
                          </button>
                          <button
                            onClick={() => respond(req.id, false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                            aria-label="Decline"
                          >
                            <X size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Friends list */}
          {!friendsLoading && friends.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Your friends
              </p>
              <div className="flex flex-col gap-2.5">
                {friends.map(f => {
                  const tierBusy = tierActionState[f.friendshipId] === 'working';
                  const isPartner = f.tier === 'streak_partner';
                  const proposedByMe = f.tierProposedBy === user?.id;
                  const proposedByThem = f.tierProposedBy != null && f.tierProposedBy !== user?.id;
                  const confirmingDemote = demoteConfirm[f.friendshipId];
                  const confirmingUnfriend = unfriendConfirm[f.friendshipId];

                  return (
                    <div
                      key={f.friendshipId}
                      className="flex flex-col gap-2.5 p-3.5 rounded-2xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => goToProfile(navigate, f.profile.id)}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left"
                          aria-label={`View ${f.profile.display_name || f.profile.username}'s profile`}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground"
                            style={{ background: '#c8f135' }}
                          >
                            {f.profile.username.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {f.profile.display_name || f.profile.username}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">@{f.profile.username}</p>
                          </div>
                        </button>
                        <ReactionBar toUserId={f.profile.id} />
                        <button
                          onClick={() => handleUnfriendTap(f.friendshipId)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors shrink-0 ${
                            confirmingUnfriend
                              ? 'text-white bg-[#e0533d]'
                              : 'text-muted-foreground hover:text-[#e0533d] hover:bg-[#fdeeeb]'
                          }`}
                        >
                          {confirmingUnfriend ? 'Unfriend?' : 'Unfriend'}
                        </button>
                      </div>

                      {isPartner ? (
                        <div className="flex items-center justify-between pl-[52px]">
                          <span
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ color: '#8a6a00', background: '#fff5d6', border: '1px solid #ffaa00' }}
                          >
                            <Flame size={11} style={{ color: '#ffaa00' }} /> Streak partner
                          </span>
                          <button
                            onClick={() => handleDemoteTap(f.friendshipId)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                              confirmingDemote
                                ? 'text-white bg-[#e0533d]'
                                : 'text-muted-foreground hover:text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {confirmingDemote ? 'Demote?' : 'Demote'}
                          </button>
                        </div>
                      ) : proposedByMe ? (
                        <div className="flex items-center justify-between pl-[52px]">
                          <span className="text-[11px] text-muted-foreground">Streak-partner request sent</span>
                          <button
                            onClick={() => declineProposal(f.friendshipId)}
                            disabled={tierBusy}
                            className="text-[11px] font-semibold text-muted-foreground hover:text-muted-foreground px-2.5 py-1"
                          >
                            {tierBusy ? '…' : 'Cancel'}
                          </button>
                        </div>
                      ) : proposedByThem ? (
                        <div className="flex items-center justify-between pl-[52px]">
                          <span className="text-[11px] font-semibold text-accent-foreground">
                            Wants to be streak partners
                          </span>
                          {tierBusy ? (
                            <span className="text-[11px] text-muted-foreground">…</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => proposePartner(f.friendshipId)}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-primary hover:bg-primary transition-colors"
                                aria-label="Accept streak partner request"
                              >
                                <Check size={12} className="text-foreground" />
                              </button>
                              <button
                                onClick={() => declineProposal(f.friendshipId)}
                                className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                                aria-label="Decline streak partner request"
                              >
                                <X size={12} className="text-muted-foreground" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pl-[52px] -mt-0.5">
                          <button
                            onClick={() => proposePartner(f.friendshipId)}
                            disabled={tierBusy}
                            className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors py-1"
                          >
                            <Flame size={11} />
                            {tierBusy ? 'Sending…' : 'Make streak partner'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prompt to add friends when loaded but empty (and in search/list mode) */}
          {isLoaded && friends.length === 0 && incoming.length === 0 && query === '' && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Search for a username above to add friends.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
