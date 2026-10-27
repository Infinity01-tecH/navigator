import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import {
  ArrowLeft, LogOut, Trash2, RotateCcw, AlertTriangle,
  Check, X, ChevronLeft, ChevronDown, Bell,
} from 'lucide-react';
import { useApp, sortedRoadmaps } from '../lib/context';
import { useViewMode } from '../lib/viewMode';
import { clearAllNotes } from '../lib/notes';
import { supabase } from '../lib/supabase';
import { kvGet, kvSet } from '../lib/roadmapStore';
import { AvatarEditor } from '../components/avatarEditor/AvatarEditor';
import type { AvatarSavePayload } from '../components/avatarEditor/Header';
import svgPaths from '../imports/SettingsScreenFalse/svg-gu15avigsp';

const APP_VERSION = '0.9.0';

type Tier = 'friend' | 'streak_partner';

// ─── Version card wave pattern ────────────────────────────────────────────────

function VersionWaveLine() {
  return (
    <svg fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
      <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" />
    </svg>
  );
}

function VersionCard() {
  return (
    <div className="bg-accent rounded-[12px] h-[55px] flex items-center justify-center overflow-hidden relative w-full">
      <div className="absolute left-0 top-0 bottom-0 flex items-end justify-end opacity-30 overflow-hidden" style={{ width: 51 }}>
        <div className="flex flex-col gap-[39px] items-end justify-end" style={{ transform: 'translateX(-149px)' }}>
          {[0,1,2,3].map(i => <VersionWaveLine key={i} />)}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex items-end justify-start opacity-30 overflow-hidden" style={{ width: 51 }}>
        <div className="flex flex-col gap-[40px] items-start justify-start">
          {[0,1,2,3].map(i => <VersionWaveLine key={i} />)}
        </div>
      </div>
      <p className="text-muted-foreground text-[18px] font-normal tracking-tight z-10">{APP_VERSION}</p>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="h-[26px] w-[40px] rounded-full transition-colors relative shrink-0"
      style={{ background: value ? '#8CB200' : '#F0F0F0' }}
      aria-pressed={value}
    >
      <span
        className="absolute top-[3px] w-5 h-5 rounded-full bg-background shadow-sm transition-all"
        style={{ left: value ? '17px' : '3px' }}
      />
    </button>
  );
}

// ─── Inline editable text field ───────────────────────────────────────────────
// No visible input box — just a blinking cursor appears over the existing text.

function InlineEdit({
  value,
  placeholder,
  onSave,
  inputClassName = '',
}: {
  value: string;
  placeholder: string;
  onSave: (next: string) => void;
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    onSave(draft.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { setEditing(false); setDraft(value); }
        }}
        className={`bg-transparent border-none outline-none text-right text-[16px] text-foreground min-w-0 ${inputClassName}`}
        placeholder={placeholder}
        style={{ caretColor: '#8cb200', WebkitTapHighlightColor: 'transparent' }}
      />
    );
  }

  return (
    <button onClick={() => { setDraft(value); setEditing(true); }} className="text-right min-w-0">
      <span className={`text-[16px] ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
        {value || placeholder}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Settings() {
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { mode: viewMode, canDesktop, setMode: setViewMode } = useViewMode();
  const {
    state, user, signOut, profileName, setProfileName,
    avatarSvg, setAvatarSvg,
    resetRoadmapProgress, deleteRoadmap,
  } = useApp();

  // ── Avatar editor ──────────────────────────────────────────────────────────
  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);

  // ── Bio ────────────────────────────────────────────────────────────────────
  // Stored in user_kv under key 'bio' — same cross-device pattern as avatar_svg
  const [bio, setBio] = useState('');

  // ── Pro Skill ──────────────────────────────────────────────────────────────
  // Stored in user_kv under key 'pro_skill' + localStorage mirror
  const [proSkill, setProSkill] = useState('');

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notificationOn, setNotificationOn] = useState(
    () => !!localStorage.getItem(NOTIF_TIME_KEY),
  );
  const [storedTime, setStoredTime] = useState<string | null>(
    () => localStorage.getItem(NOTIF_TIME_KEY),
  );

  function handleNotifConfirm(time24: string) {
    if (time24 === '__off__') {
      setNotificationOn(false);
      setStoredTime(null);
    } else {
      localStorage.setItem(NOTIF_TIME_KEY, time24);
      setNotificationOn(true);
      setStoredTime(time24);
    }
    setNotifModalOpen(false);
  }

  // ── Dark mode ─────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('nav_dark_mode') === '1'; } catch { return false; }
  });

  function handleDarkMode(val: boolean) {
    setDarkMode(val);
    try {
      localStorage.setItem('nav_dark_mode', val ? '1' : '0');
      document.documentElement.classList.toggle('dark', val);
    } catch { /* ignore */ }
  }

  // ── Danger-zone flows ──────────────────────────────────────────────────────
  const [resetPick, setResetPick] = useState(false);
  const [deletePick, setDeletePick] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string | 'all'; label: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState<{ id: string | 'all'; label: string } | null>(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);
  const [deleteAccountConfirmText, setDeleteAccountConfirmText] = useState('');

  // ── Roadmap visibility (both tiers) ────────────────────────────────────────
  const [sharedRoadmapIds, setSharedRoadmapIds] = useState<Record<Tier, Set<string>>>({
    friend: new Set(),
    streak_partner: new Set(),
  });
  const [visLoading, setVisLoading] = useState(true);
  const [visBusy, setVisBusy] = useState<Record<string, boolean>>({});
  const [rmPicker, setRmPicker] = useState<Tier | null>(null);

  const roadmaps = sortedRoadmaps(state.roadmaps);

  // ── Dev taps ───────────────────────────────────────────────────────────────
  const [devTaps, setDevTaps] = useState(0);
  const [devOpen, setDevOpen] = useState(false);

  // ── Load bio + pro_skill from user_kv on mount ─────────────────────────────
  useEffect(() => {
    if (!user || user.id === 'dev-bypass') {
      // localStorage only for dev bypass
      try {
        setProSkill(localStorage.getItem(`nav_pro_skill_${user?.id}`) ?? '');
      } catch { /* ignore */ }
      return;
    }
    // Load from user_kv (same infra as avatar/profile name)
    kvGet<string>('bio').then(v => { if (v) setBio(v); });
    kvGet<string>('pro_skill').then(v => {
      if (v) {
        setProSkill(v);
        try { localStorage.setItem(`nav_pro_skill_${user.id}`, v); } catch { /* ignore */ }
      } else {
        // Fallback to localStorage
        try { setProSkill(localStorage.getItem(`nav_pro_skill_${user.id}`) ?? ''); } catch { /* ignore */ }
      }
    });
  }, [user?.id]);

  // ── Load roadmap visibility from Supabase ──────────────────────────────────
  const loadVisibility = useCallback(async () => {
    if (!user || user.id === 'dev-bypass') { setVisLoading(false); return; }
    setVisLoading(true);
    const { data: rv } = await supabase
      .from('roadmap_visibility')
      .select('roadmap_id, tier')
      .in('roadmap_id', state.roadmaps.map(r => r.id));

    const next: Record<Tier, Set<string>> = { friend: new Set(), streak_partner: new Set() };
    (rv ?? []).forEach((row: any) => {
      if (row.tier === 'friend' || row.tier === 'streak_partner') {
        next[row.tier as Tier].add(row.roadmap_id);
      }
    });
    setSharedRoadmapIds(next);
    setVisLoading(false);
  }, [user, state.roadmaps]);

  useEffect(() => { loadVisibility(); }, [loadVisibility]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleSaveBio(val: string) {
    setBio(val);
    await kvSet('bio', val);
    // Also mirror to profiles.bio if column exists (graceful)
    if (user && user.id !== 'dev-bypass') {
      supabase.from('profiles').update({ bio: val } as any).eq('id', user.id).then(() => {});
    }
  }

  async function handleSaveProSkill(val: string) {
    setProSkill(val);
    await kvSet('pro_skill', val);
    if (user) {
      try { localStorage.setItem(`nav_pro_skill_${user.id}`, val); } catch { /* ignore */ }
    }
    // Also mirror to profiles.pro_skill if column exists (graceful)
    if (user && user.id !== 'dev-bypass') {
      supabase.from('profiles').update({ pro_skill: val } as any).eq('id', user.id).then(() => {});
    }
  }

  function handleSaveName(val: string) {
    if (val) setProfileName(val);
  }

  async function toggleRoadmapShare(tier: Tier, roadmapId: string, next: boolean) {
    if (!user || user.id === 'dev-bypass') return;
    const key = `${tier}:${roadmapId}`;
    setVisBusy(b => ({ ...b, [key]: true }));
    const { error } = next
      ? await supabase.from('roadmap_visibility').upsert(
          { roadmap_id: roadmapId, tier },
          { onConflict: 'roadmap_id,tier' }
        )
      : await supabase.from('roadmap_visibility').delete()
          .eq('roadmap_id', roadmapId).eq('tier', tier);
    setVisBusy(b => ({ ...b, [key]: false }));
    if (!error) {
      setSharedRoadmapIds(s => {
        const set = new Set(s[tier]);
        if (next) set.add(roadmapId); else set.delete(roadmapId);
        return { ...s, [tier]: set };
      });
    }
  }

  function handleAvatarSaved(payload: AvatarSavePayload) {
    setAvatarSvg(payload.svg);
    setAvatarEditorOpen(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    setDeleteAccountError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Session expired — please sign in again.');
      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (error) {
        let msg = String(error.message ?? 'Could not delete account.');
        try {
          const body = await (error as any).context?.json?.();
          if (body?.error) msg = typeof body.error === 'string' ? body.error : (body.error.message ?? msg);
        } catch { /* ignore */ }
        throw new Error(msg);
      }
      if (!data?.success) throw new Error('Deletion did not complete. Please try again.');
      setConfirmDeleteAccount(false);
      await signOut();
      navigate('/');
    } catch (err: any) {
      setDeleteAccountError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setDeletingAccount(false);
    }
  }

  function doReset(id: string | 'all') {
    resetRoadmapProgress(id);
    setConfirmReset(null);
    setResetPick(false);
  }

  function doDelete(id: string | 'all') {
    deleteRoadmap(id);
    if (id === 'all') clearAllNotes();
    setConfirmDelete(null);
    setDeletePick(false);
    if (id === 'all' || state.roadmaps.length <= 1) navigate('/');
  }

  // 7 taps in a row on the version card also reveals the hidden DEV button (Layout.tsx).
  const versionTaps = useRef({ n: 0, last: 0 });
  function tapVersion() {
    const now = Date.now();
    const vt = versionTaps.current;
    vt.n = now - vt.last < 2000 ? vt.n + 1 : 1;
    vt.last = now;
    if (vt.n >= 7) { window.dispatchEvent(new Event('nav-show-dev')); vt.n = 0; }
    const next = devTaps + 1;
    setDevTaps(next);
    if (next >= 6) { setDevOpen(true); setDevTaps(0); }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div ref={smoothRef} className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-background">

      {/* Header */}
      <div className="pt-14 shrink-0">
        <div className="flex items-center px-4 pt-2 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-[12px]"
            aria-label="Back"
          >
            <ArrowLeft size={22} strokeWidth={2.2} className="text-foreground" />
          </button>
          <p className="text-[20px] font-medium text-foreground ml-1" style={{ fontWeight: 510 }}>Settings</p>
        </div>
        <div className="h-[2px] bg-secondary" />
      </div>

      <div className="flex-1 px-4 pb-8 flex flex-col gap-6 mt-4">

        {/* ── ACCOUNT ──────────────────────────────────────────────────────── */}
        <section>
          <SectionHeadline>Account</SectionHeadline>

          {/* Avatar row */}
          <SettingsRow label="Avatar" divider>
            <button
              onClick={() => setAvatarEditorOpen(true)}
              className="flex items-center gap-1.5"
              aria-label="Edit avatar"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                {avatarSvg ? (
                  <div
                    className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                    dangerouslySetInnerHTML={{ __html: avatarSvg }}
                  />
                ) : (
                  <span className="text-sm font-bold text-foreground">{(profileName[0] || 'N').toUpperCase()}</span>
                )}
              </div>
            </button>
          </SettingsRow>

          {/* User Name */}
          <SettingsRow label="User Name" divider>
            <InlineEdit
              value={profileName !== 'Your Profile' ? profileName : ''}
              placeholder="Your name"
              onSave={handleSaveName}
            />
          </SettingsRow>

          {/* Bio */}
          <SettingsRow label="Bio" divider>
            <InlineEdit
              value={bio}
              placeholder="Write a little about yourself"
              onSave={handleSaveBio}
              inputClassName="max-w-[190px]"
            />
          </SettingsRow>

          {/* Email */}
          <SettingsRow label="Email" divider>
            <span className="text-[16px] text-muted-foreground">{user?.email ?? '—'}</span>
          </SettingsRow>

          {/* Pro Skill */}
          <SettingsRow label="Pro skill">
            <InlineEdit
              value={proSkill}
              placeholder="e.g. Brand Identity Design"
              onSave={handleSaveProSkill}
              inputClassName="max-w-[190px]"
            />
          </SettingsRow>
        </section>

        {/* ── SHARING ──────────────────────────────────────────────────────── */}
        <section>
          <SectionHeadline>Sharing</SectionHeadline>

          {/* Friends roadmap visibility */}
          <SettingsRow label="Friends" divider>
            <button
              onClick={() => setRmPicker('friend')}
              disabled={visLoading}
              className="bg-muted rounded-[12px] flex items-center px-2.5 gap-1 disabled:opacity-40"
              style={{ height: 30 }}
              aria-label="Choose what friends can see"
            >
              <span className="text-[13px] font-medium text-foreground">
                {sharedRoadmapIds.friend.size > 0
                  ? `${sharedRoadmapIds.friend.size} roadmap${sharedRoadmapIds.friend.size !== 1 ? 's' : ''}`
                  : 'Choose'}
              </span>
              <ChevronDown size={13} className="text-foreground" strokeWidth={1.5} />
            </button>
          </SettingsRow>

          {/* Streak Partner roadmap visibility */}
          <SettingsRow label="Streak Partner" divider>
            <button
              onClick={() => setRmPicker('streak_partner')}
              disabled={visLoading}
              className="bg-muted rounded-[12px] flex items-center px-2.5 gap-1 disabled:opacity-40"
              style={{ height: 30 }}
              aria-label="Choose what streak partners can see"
            >
              <span className="text-[13px] font-medium text-foreground">
                {sharedRoadmapIds.streak_partner.size > 0
                  ? `${sharedRoadmapIds.streak_partner.size} roadmap${sharedRoadmapIds.streak_partner.size !== 1 ? 's' : ''}`
                  : 'Choose'}
              </span>
              <ChevronDown size={13} className="text-foreground" strokeWidth={1.5} />
            </button>
          </SettingsRow>

          {/* Public portfolio page (/u/<handle>) */}
          <SettingsRow label="Portfolio">
            <button
              onClick={() => navigate('/portfolio')}
              className="bg-muted rounded-[12px] flex items-center px-2.5 gap-1"
              style={{ height: 30 }}
              aria-label="Open my portfolio"
            >
              <span className="text-[13px] font-medium text-foreground">Open</span>
            </button>
          </SettingsRow>

          <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">
            Friends see XP, streak &amp; chosen roadmaps without achievements. Streak partners see everything including achievements and your daily plan.
          </p>
        </section>

        {/* ── GENERAL ──────────────────────────────────────────────────────── */}
        <section>
          <SectionHeadline>General</SectionHeadline>
          <SettingsRow
            label={
              <span className="flex flex-col">
                <span>Notification</span>
                {notificationOn && storedTime && (
                  <span className="text-[11px] text-primary font-normal">{fmt12(storedTime)}</span>
                )}
              </span>
            }
            divider
          >
            <Toggle
              value={notificationOn}
              onChange={() => setNotifModalOpen(true)}
            />
          </SettingsRow>
          <SettingsRow label="Interface language" divider>
            <span className="text-[16px] text-foreground">English</span>
          </SettingsRow>
          <SettingsRow label="Dark Mode" divider>
            <Toggle value={darkMode} onChange={handleDarkMode} />
          </SettingsRow>
          <SettingsRow
            label={
              <span className="flex flex-col">
                <span>Desktop view</span>
                {!canDesktop && (
                  <span className="text-[11px] text-muted-foreground font-normal">Needs a wider screen</span>
                )}
              </span>
            }
            divider
          >
            <Toggle value={viewMode === 'desktop'} onChange={v => setViewMode(v ? 'desktop' : 'mobile')} />
          </SettingsRow>
          <SettingsRow label="Daily time budget">
            <div className="bg-muted rounded-[12px] px-3 flex items-center gap-1" style={{ height: 30 }}>
              <span className="text-[13px] font-semibold text-foreground">1.5h</span>
              <ChevronDown size={11} className="text-foreground" strokeWidth={1.5} />
            </div>
          </SettingsRow>
        </section>

        {/* ── DANGER ZONE ───────────────────────────────────────────────────── */}
        <section>
          <p className="text-[18px] font-medium text-[#d53f36] mb-3" style={{ fontWeight: 510 }}>Danger Zone</p>
          <DangerTextRow label="Reset My Progress" onClick={() => setResetPick(true)} />
          <div className="h-[2px] bg-secondary" />
          <DangerTextRow label="Delete Roadmap" onClick={() => setDeletePick(true)} />
          <div className="h-[2px] bg-secondary" />
          <DangerTextRow label="Sign out" onClick={handleSignOut} />
          <div className="h-[2px] bg-secondary" />
          <DangerTextRow
            label="Delete Account"
            onClick={() => { setDeleteAccountError(null); setDeleteAccountConfirmText(''); setConfirmDeleteAccount(true); }}
          />
        </section>

        {/* ── SUPPORT ───────────────────────────────────────────────────────── */}
        <SettingsRow label="Support">
          <button
            onClick={() => window.open('mailto:support@navigatorapp.co', '_blank', 'noopener')}
            className="text-[16px] text-foreground"
          >
            Contact us
          </button>
        </SettingsRow>

        {/* ── VERSION CARD ──────────────────────────────────────────────────── */}
        <button onClick={tapVersion} className="w-full">
          <VersionCard />
        </button>

        {devOpen && (
          <div className="bg-muted rounded-2xl overflow-hidden">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-4 py-2">Developer</p>
            <p className="text-[11px] text-muted-foreground break-all px-4 pb-2">
              user: {user?.id ?? 'none'} · roadmaps: {state.roadmaps.length}
            </p>
            <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm font-semibold text-[#e0533d] border-t border-border">
              Force re-auth
            </button>
            <button onClick={() => setDevOpen(false)} className="w-full text-left px-4 py-3 text-sm text-muted-foreground border-t border-border">
              Hide developer menu
            </button>
          </div>
        )}
      </div>

      {/* ── Picker sheet: friend roadmap visibility ─────────────────────────── */}
      {rmPicker && (
        <PickerSheet
          title={rmPicker === 'friend' ? 'Roadmaps for friends' : 'Roadmaps for streak partner'}
          subtitle={
            rmPicker === 'friend'
              ? 'Friends see your progress on checked roadmaps, but never achievements.'
              : 'Streak partners see full detail including achievements and your daily plan. By default only your pinned roadmap is shared.'
          }
          onClose={() => setRmPicker(null)}
        >
          {roadmaps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No roadmaps yet.</p>
          ) : (
            roadmaps.map(r => {
              const shared = sharedRoadmapIds[rmPicker].has(r.id);
              const key = `${rmPicker}:${r.id}`;
              const busy = !!visBusy[key];
              return (
                <button
                  key={r.id}
                  onClick={() => !busy && toggleRoadmapShare(rmPicker, r.id, !shared)}
                  disabled={busy}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-left transition-colors ${
                    shared ? 'bg-[#f4fde0]' : 'bg-card'
                  } ${busy ? 'opacity-60' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.roadmap.skill}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      shared ? 'bg-primary' : 'bg-[#e0e0e0]'
                    }`}
                  >
                    {shared && <Check size={12} className="text-white" />}
                  </div>
                </button>
              );
            })
          )}
        </PickerSheet>
      )}

      {/* ── Reset picker ──────────────────────────────────────────────────── */}
      {resetPick && (
        <PickerSheet
          title="Reset progress"
          subtitle="Progress & achievements are wiped; the roadmap structure stays so you can start again."
          onClose={() => setResetPick(false)}
        >
          {roadmaps.map(r => (
            <PickerRow
              key={r.id}
              label={`Reset ${r.roadmap.skill} Progress`}
              Icon={RotateCcw}
              onClick={() => setConfirmReset({ id: r.id, label: r.roadmap.skill })}
            />
          ))}
          <PickerRow
            label="Reset All Progress"
            Icon={RotateCcw}
            danger
            onClick={() => setConfirmReset({ id: 'all', label: 'all roadmaps' })}
          />
        </PickerSheet>
      )}

      {/* ── Delete picker ─────────────────────────────────────────────────── */}
      {deletePick && (
        <PickerSheet
          title="Delete roadmap"
          subtitle="Deletes the roadmap along with its progress and achievements. This can't be undone."
          onClose={() => setDeletePick(false)}
        >
          {roadmaps.map(r => (
            <PickerRow
              key={r.id}
              label={`Delete ${r.roadmap.skill}`}
              Icon={Trash2}
              danger
              onClick={() => setConfirmDelete({ id: r.id, label: r.roadmap.skill })}
            />
          ))}
          <PickerRow
            label="Delete All Roadmaps"
            Icon={Trash2}
            danger
            onClick={() => setConfirmDelete({ id: 'all', label: 'all roadmaps' })}
          />
        </PickerSheet>
      )}

      {/* ── Reset confirm ─────────────────────────────────────────────────── */}
      {confirmReset && (
        <ConfirmDialog
          Icon={RotateCcw}
          title="Reset progress?"
          body={<>Clear progress for <b className="text-foreground">{confirmReset.label}</b>. The roadmap structure stays. This can't be undone.</>}
          confirmLabel="Reset progress"
          onCancel={() => setConfirmReset(null)}
          onConfirm={() => doReset(confirmReset.id)}
        />
      )}

      {/* ── Delete confirm ────────────────────────────────────────────────── */}
      {confirmDelete && (
        <ConfirmDialog
          Icon={AlertTriangle}
          title="Delete roadmap?"
          body={<>Permanently remove <b className="text-foreground">{confirmDelete.label}</b> — roadmap, progress, and achievements. This can't be undone.</>}
          confirmLabel="Delete"
          requireWord="DELETE"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => doDelete(confirmDelete.id)}
        />
      )}

      {/* ── Delete account confirm ────────────────────────────────────────── */}
      {confirmDeleteAccount && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center px-6"
          onClick={() => { if (!deletingAccount) { setConfirmDeleteAccount(false); setDeleteAccountConfirmText(''); } }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-[360px] bg-background rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-[#fdeeeb] flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-[#e0533d]" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Delete account?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Permanently deletes your account, every roadmap, and all progress. There's no recovering your data afterward.
            </p>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Type DELETE to confirm</label>
            <input
              value={deleteAccountConfirmText}
              onChange={e => setDeleteAccountConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={deletingAccount}
              className="w-full h-11 px-3.5 text-sm bg-muted rounded-xl focus:outline-none mb-4 disabled:opacity-60"
              style={{ border: 'none' }}
            />
            {deleteAccountError && <p className="text-sm text-[#e0533d] mb-4">{deleteAccountError}</p>}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount || deleteAccountConfirmText.trim().toUpperCase() !== 'DELETE'}
                className="w-full h-11 rounded-full text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#e0533d' }}
              >
                {deletingAccount ? 'Deleting…' : 'Delete account'}
              </button>
              <button
                onClick={() => { setConfirmDeleteAccount(false); setDeleteAccountConfirmText(''); }}
                disabled={deletingAccount}
                className="w-full h-11 rounded-full text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Avatar editor ─────────────────────────────────────────────────── */}
      {notifModalOpen && (
        <NotificationModal
          initialTime24={storedTime}
          onConfirm={handleNotifConfirm}
          onClose={() => setNotifModalOpen(false)}
        />
      )}

      {avatarEditorOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center bg-black/40">
          <div className="w-full max-w-[390px] bg-background flex flex-col">
            <div className="shrink-0 h-12 flex items-center justify-end px-3 border-b border-border">
              <button
                onClick={() => setAvatarEditorOpen(false)}
                aria-label="Close avatar editor"
                className="w-9 h-9 flex items-center justify-center rounded-full"
              >
                <X size={20} className="text-foreground" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <AvatarEditor
                onSave={handleAvatarSaved}
                initialLetter={
                  profileName && profileName !== 'Your Profile'
                    ? profileName[0]?.toUpperCase()
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notification time picker ─────────────────────────────────────────────────

const NOTIF_TIME_KEY = 'nav_notification_time';
const NOTIF_SHOWN_KEY = 'nav_notification_last_shown';
const HOURS = ['12','1','2','3','4','5','6','7','8','9','10','11'];
const MINUTES = ['00','05','10','15','20','25','30','35','40','45','50','55'];
const ITEM_H = 52;

function fmt12(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function parseTime24(time24: string | null): { hIdx: number; mIdx: number; ampm: 'AM' | 'PM' } {
  if (!time24) return { hIdx: 7, mIdx: 0, ampm: 'AM' }; // default 8:00 AM
  const [h, m] = time24.split(':').map(Number);
  const ampm: 'AM' | 'PM' = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const hIdx = HOURS.indexOf(String(h12));
  const mIdx = MINUTES.indexOf(String(m).padStart(2, '0'));
  return { hIdx: hIdx < 0 ? 7 : hIdx, mIdx: mIdx < 0 ? 0 : mIdx, ampm };
}

// Scroll-snap drum-roll column
function ScrollPicker({ items, selectedIdx, onChange }: {
  items: string[];
  selectedIdx: number;
  onChange: (idx: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current) return;
    programmatic.current = true;
    ref.current.scrollTop = selectedIdx * ITEM_H;
    const t = setTimeout(() => { programmatic.current = false; }, 300);
    return () => clearTimeout(t);
  }, [selectedIdx]);

  function onScroll() {
    if (programmatic.current || !ref.current) return;
    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    if (clamped !== selectedIdx) onChange(clamped);
  }

  return (
    <div className="relative shrink-0" style={{ width: 72, height: ITEM_H * 3 }}>
      {/* centre highlight band */}
      <div
        className="absolute inset-x-0 pointer-events-none rounded-[14px] bg-muted"
        style={{ top: ITEM_H, height: ITEM_H }}
      />
      <div
        ref={ref}
        onScroll={onScroll}
        className="overflow-y-scroll scrollbar-hide"
        style={{ height: ITEM_H * 3, scrollSnapType: 'y mandatory' }}
      >
        {/* top padding so first item can centre */}
        <div style={{ height: ITEM_H, scrollSnapAlign: 'none', flexShrink: 0 }} />
        {items.map((item, i) => (
          <div
            key={i}
            style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
            className={`flex items-center justify-center select-none transition-all duration-100 ${
              i === selectedIdx
                ? 'text-[26px] font-bold text-foreground'
                : 'text-[18px] font-medium text-muted-foreground'
            }`}
          >
            {item}
          </div>
        ))}
        {/* bottom padding */}
        <div style={{ height: ITEM_H, scrollSnapAlign: 'none', flexShrink: 0 }} />
      </div>
    </div>
  );
}

function NotificationModal({ initialTime24, onConfirm, onClose }: {
  initialTime24: string | null;
  onConfirm: (time24: string) => void;
  onClose: () => void;
}) {
  const init = parseTime24(initialTime24);
  const [hIdx, setHIdx] = useState(init.hIdx);
  const [mIdx, setMIdx] = useState(init.mIdx);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(init.ampm);
  const [denied, setDenied] = useState(Notification.permission === 'denied');
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    setConfirming(true);
    // Build 24-hour time
    let h24 = parseInt(HOURS[hIdx], 10);
    if (ampm === 'PM' && h24 !== 12) h24 += 12;
    if (ampm === 'AM' && h24 === 12) h24 = 0;
    const time24 = `${String(h24).padStart(2, '0')}:${MINUTES[mIdx]}`;

    // Request permission if not yet decided
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      if (result === 'denied') { setDenied(true); setConfirming(false); return; }
    } else if (Notification.permission === 'denied') {
      setDenied(true); setConfirming(false); return;
    }

    onConfirm(time24);
  }

  function handleTurnOff() {
    localStorage.removeItem(NOTIF_TIME_KEY);
    localStorage.removeItem(NOTIF_SHOWN_KEY);
    onConfirm('__off__');
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-[420px] bg-background rounded-t-3xl px-5 pt-5 pb-8"
        style={{ animation: 'sheetUp 0.25s ease' }}
      >
        <style>{`@keyframes sheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Bell size={15} className="text-primary" />
            </div>
            <p className="text-[15px] font-bold text-foreground">Daily reminder</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-[13px] text-muted-foreground mb-6 ml-10">
          {"We'll remind you to keep your streak going."}
        </p>

        {denied && (
          <div className="mb-4 px-3 py-2.5 rounded-[12px] bg-[#fdeeeb]">
            <p className="text-[12px] text-[#e0533d] leading-relaxed">
              Notifications are blocked in your browser. Open browser settings → Site Settings → Notifications and allow this site, then try again.
            </p>
          </div>
        )}

        {/* Drum-roll pickers */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <ScrollPicker items={HOURS} selectedIdx={hIdx} onChange={setHIdx} />

          <span className="text-[32px] font-bold text-foreground pb-1 select-none">:</span>

          <ScrollPicker items={MINUTES} selectedIdx={mIdx} onChange={setMIdx} />

          {/* AM / PM toggle */}
          <div className="flex flex-col gap-2 ml-1">
            {(['AM', 'PM'] as const).map(p => (
              <button
                key={p}
                onClick={() => setAmpm(p)}
                className={`w-[52px] h-[38px] rounded-[12px] text-[13px] font-bold transition-all ${
                  ampm === p
                    ? 'bg-primary text-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={confirming || denied}
          className="w-full h-[56px] bg-primary text-foreground text-[16px] font-semibold rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Set reminder
        </button>

        {/* Turn off link — only shown when a reminder is already set */}
        {initialTime24 && (
          <button
            onClick={handleTurnOff}
            className="w-full mt-3 h-10 text-muted-foreground text-[13px] font-medium"
          >
            Turn off reminders
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Building blocks ──────────────────────────────────────────────────────────

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[18px] font-medium text-foreground mb-3" style={{ fontWeight: 510 }}>{children}</p>
  );
}

function SettingsRow({ label, children, divider }: { label: React.ReactNode; children: React.ReactNode; divider?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between min-h-[44px] py-[6px]">
        <p className="text-[18px] font-medium text-foreground" style={{ fontWeight: 510 }}>{label}</p>
        <div className="flex items-center ml-2">{children}</div>
      </div>
      {divider && <div className="h-[2px] bg-secondary" />}
    </div>
  );
}

function DangerTextRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left py-[10px] flex items-center">
      <p className="text-[18px] font-medium text-[#d53f36]" style={{ fontWeight: 510 }}>{label}</p>
    </button>
  );
}

// ─── Picker sheet ─────────────────────────────────────────────────────────────

function PickerSheet({
  title, subtitle, children, onClose,
}: { title: string; subtitle: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8 max-h-[80%] overflow-y-auto scrollbar-hide"
        style={{ animation: 'sheetUp 0.25s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onClose} className="w-8 h-8 -ml-1.5 flex items-center justify-center rounded-xl bg-card">
            <ChevronLeft size={20} strokeWidth={2.6} className="text-foreground" />
          </button>
          <p className="text-base font-bold text-foreground">{title}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4 px-1">{subtitle}</p>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}

// ─── Picker row (no border — subtle background only) ──────────────────────────

function PickerRow({
  Icon, label, onClick, danger,
}: { Icon: typeof RotateCcw; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-left transition-colors ${
        danger ? 'bg-[#fff2f0] active:bg-[#ffe0db]' : 'bg-card active:bg-[#ededed]'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-[#ffe9e5]' : 'bg-[#ececec]'}`}>
        <Icon size={15} className={danger ? 'text-[#e0533d]' : 'text-muted-foreground'} />
      </div>
      <span className={`flex-1 text-sm font-semibold ${danger ? 'text-[#c0392b]' : 'text-foreground'}`}>{label}</span>
    </button>
  );
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  Icon, title, body, confirmLabel, requireWord, onCancel, onConfirm,
}: {
  Icon: typeof RotateCcw; title: string; body: React.ReactNode; confirmLabel: string;
  requireWord?: string; onCancel: () => void; onConfirm: () => void;
}) {
  const [text, setText] = useState('');
  const armed = !requireWord || text.trim().toUpperCase() === requireWord.toUpperCase();

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center px-6" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-[360px] bg-background rounded-3xl p-6" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-[#fff2f0] flex items-center justify-center mb-4">
          <Icon size={22} className="text-[#e0533d]" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{body}</p>
        {requireWord && (
          <>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Type {requireWord} to confirm</label>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={requireWord}
              className="w-full h-11 px-3.5 text-sm bg-card rounded-xl focus:outline-none mb-4"
              style={{ border: 'none' }}
            />
          </>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={!armed}
            className="w-full h-11 rounded-full text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#e0533d' }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full h-11 rounded-full text-sm font-semibold text-muted-foreground bg-card transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
