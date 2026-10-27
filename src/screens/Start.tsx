import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Map, Zap, Play, Search, Check, Clock, User } from 'lucide-react';
import { useApp, type Mode, type LearningType } from '../lib/context';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import svgPaths from '@/imports/SignUpScreenEmailDarkMode4/svg-9n4kzjgen9';
import { SKILLS } from '../data';
import { NaviPreloader } from '../components/NaviPreloader';

// SF-Pro-family texts render as SF on Apple devices via the system stack; Inter
// is the secondary face used across the app.
const SF = 'system-ui, -apple-system, sans-serif';
const INTER = "'Inter', system-ui, -apple-system, sans-serif";

// Brand logo exactly as exported from Figma: green rounded rect + white mark.
function NavLogo() {
  return (
    <div className="relative shrink-0" style={{ width: 48.32, height: 41 }}>
      <svg className="absolute block inset-0 size-full" fill="none" height="41" preserveAspectRatio="none" viewBox="0 0 48.3201 41" width="48.3201">
        <g>
          <rect fill="#8CB200" height="41" rx="10.9818" width="48.3201" />
          <path clipRule="evenodd" d={svgPaths.p34fe53f0} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

const MODES: { id: Mode; label: string; desc: string; Icon: typeof Zap }[] = [
  { id: 'full',    label: 'Full Roadmap',     desc: 'Personalized multi-phase curriculum',   Icon: Map  },
  { id: 'sprint',  label: 'Sprint Blueprint', desc: 'Intensive 1–4 week focused plan',       Icon: Zap  },
  { id: 'youtube', label: 'YouTube-Based',    desc: 'Built around creators you already trust', Icon: Play },
];

export function Start() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, set, reset, user, authReady, avatarSvg, roadmapsHydrated, activeEntry } = useApp();

  // Skill Crossover (Main.tsx) sends the tapped skill name here via
  // navigate('/', { state: { skill: node.name } }) — this is the flow that
  // diagram code flagged as UNVERIFIED. It's real now: on mount, if a skill
  // came in through navigation state, it wins over whatever was already
  // sitting in global state, and the input is prefilled with it.
  const scrollRef = useSmoothScroll<HTMLDivElement>();
  const incomingSkill = (location.state as { skill?: string } | null)?.skill;
  // Navigation flags captured once on arrival. location.state gets cleared below
  // (navigate('.', { state: null })), so reading it live later would make the
  // returning-user redirect / loader think the user arrived without them.
  const arrival = useRef({
    skip: !!(location.state as { skipAutoRedirect?: boolean } | null)?.skipAutoRedirect,
    skill: !!incomingSkill,
  });
  const [query, setQuery] = useState(incomingSkill ?? state.skill);
  const [showDrop, setShowDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (incomingSkill) {
      set({ skill: incomingSkill });
      // Clear the navigation state after consuming it. Without this, if the
      // user later lands on '/' again some other way while React Router
      // still has this history entry's state attached, the same old skill
      // name could silently reappear in the box.
      navigate('.', { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestions = query.length > 0
    ? SKILLS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : SKILLS.slice(0, 7);

  const isYouTubeUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(query.trim());

  const handleBuild = () => {
    if (isYouTubeUrl) {
      navigate(`/watch?url=${encodeURIComponent(query.trim())}`);
      return;
    }
    set({ skill: query, roadmapSkill: query || 'React Development' });
    if (state.mode === 'full') navigate('/fingerprint');
    else if (state.mode === 'sprint') navigate('/sprint');
    else navigate('/youtube');
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowDrop(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Returning-user redirect: this is the piece context.tsx's own comment on
  // `roadmapsHydrated` says Start.tsx depends on but that never actually
  // existed here. Every "Create New Roadmap" button across Main.tsx sends
  // `skipAutoRedirect: true` specifically to opt out of this — until now
  // that flag had nothing to opt out of, which is why tapping that button
  // and just opening the app looked identical: neither path went anywhere
  // that felt like "new roadmap," because there was no redirect to skip in
  // the first place.
  //
  // Waits on roadmapsHydrated, not authReady — authReady only means "we
  // know if there's a session," it says nothing about whether roadmaps have
  // been fetched yet. Redirecting before hydration would either bounce a
  // signed-in user with roadmaps back to a blank form (flash of wrong
  // screen) or fail to redirect someone who does have one, depending on
  // timing — both wrong, so this waits for the real signal.
  //
  // Only checked once per mount, not kept reactive to later roadmap changes:
  // this is a "where do I land on arrival" decision, not a rule that should
  // yank a user off the form mid-edit if a roadmap finishes hydrating while
  // they're already looking at Start on purpose (e.g. via skipAutoRedirect).
  useEffect(() => {
    if (arrival.current.skip || arrival.current.skill) return;
    if (roadmapsHydrated && activeEntry && !activeEntry.preview) {
      navigate('/main', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapsHydrated]);

  // While we still don't know whether this is a returning user (auth or roadmaps
  // not resolved yet), show the preloader instead of flashing the form and then
  // bouncing to /main. Skipped for "Create New Roadmap" / crossover arrivals,
  // which always want the form. Guests (no user) go straight to the form.
  const checking = !arrival.current.skip && !arrival.current.skill
    && (!authReady || (!!user && !roadmapsHydrated));
  if (checking) {
    return (
      <div className="relative h-full w-full">
        <NaviPreloader label="Loading" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex flex-col h-full overflow-y-auto pt-[20px] pb-6 px-5 scrollbar-hide [&>*]:shrink-0">
      {/* Logo + Title (16px gap) + account chrome */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-[16px]">
          <NavLogo />
          <span
            className="text-foreground"
            style={{ fontFamily: SF, fontSize: 24, lineHeight: '32px', letterSpacing: '-0.072px', fontWeight: 700 }}
          >
            Navigator
          </span>
        </div>
        {authReady && (
          user ? (
            <button
              onClick={() => navigate('/main')}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground overflow-hidden"
              style={{ background: '#8cb200' }}
              title={user.name}
            >
              {avatarSvg ? (
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                  // Same trust level and same reason as Settings.tsx's identical
                  // avatar circle: editor-produced SVG (Header.tsx's onSave ->
                  // Avatar.toString()), never raw user input, not sanitized here
                  // for the same reason it isn't there. [&>svg]:w-full/h-full
                  // forces DiceBear's own viewBox to scale into this 36px
                  // circle instead of just clipping a corner of full-size art.
                  dangerouslySetInnerHTML={{ __html: avatarSvg }}
                />
              ) : (
                user.initial
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:border-border transition-colors"
            >
              <User size={13} className="text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">Sign in</span>
            </button>
          )
        )}
      </div>

      <h1
        className="text-foreground mb-[9px]"
        style={{ fontFamily: SF, fontSize: 32, lineHeight: '40px', letterSpacing: '-0.096px', fontWeight: 600 }}
      >
        What do you want<br />to learn?
      </h1>
      <p
        className="text-foreground mb-[38px]"
        style={{ fontFamily: SF, fontSize: 16, lineHeight: '20px', letterSpacing: '-0.048px' }}
      >
        Build a personalized roadmap in 3 minutes.
      </p>

      {/* Learning Type */}
      <p
        className="text-foreground mb-[7px]"
        style={{ fontFamily: SF, fontSize: 18, lineHeight: '24px', letterSpacing: '-0.054px', fontWeight: 510 }}
      >
        Learning type
      </p>
      <div className="grid grid-cols-2 gap-2 mb-[20px]">
        {(['skill', 'subject'] as LearningType[]).map((lt) => {
          const sel = state.learningType === lt;
          return (
            <button
              key={lt}
              onClick={() => set({ learningType: lt })}
              className={`p-[14px] rounded-[18px] text-left transition-all duration-200 ${sel ? 'bg-accent' : 'bg-card'}`}
            >
              <p
                className={`capitalize ${sel ? 'text-foreground' : 'text-foreground'}`}
                style={{ fontFamily: INTER, fontSize: 16, lineHeight: '22px', fontWeight: 600 }}
              >
                {lt}
              </p>
              <p
                className="text-muted-foreground mt-[2px]"
                style={{ fontFamily: INTER, fontSize: 12, lineHeight: '18px', fontWeight: 500 }}
              >
                {lt === 'skill' ? 'e.g. React, Python' : 'e.g. Computer Science'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Mode Selector */}
      <p
        className="text-foreground mb-[7px]"
        style={{ fontFamily: SF, fontSize: 18, lineHeight: '24px', letterSpacing: '-0.054px', fontWeight: 510 }}
      >
        Mode
      </p>
      <div className="flex flex-col gap-2 mb-[20px]">
        {MODES.map(({ id, label, desc, Icon }) => {
          const sel = state.mode === id;
          return (
            <button
              key={id}
              onClick={() => set({ mode: id })}
              className={`flex items-center gap-3 p-[14px] rounded-[16px] text-left transition-all duration-200 ${sel ? 'bg-accent' : 'bg-card'}`}
            >
              <div className={`rounded-[16px] flex items-center justify-center shrink-0 ${sel ? 'bg-primary' : 'bg-accent'}`} style={{ width: 36, height: 36 }}>
                <Icon size={17} className={sel ? 'text-white' : 'text-muted-foreground'} />
              </div>
              <div className="flex-1">
                <p
                  className={sel ? 'text-foreground' : 'text-foreground'}
                  style={{ fontFamily: INTER, fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
                >
                  {label}
                </p>
                <p
                  className="text-muted-foreground mt-[2px]"
                  style={{ fontFamily: INTER, fontSize: 11, lineHeight: '16.5px', fontWeight: 500 }}
                >
                  {desc}
                </p>
              </div>
              <div className={`rounded-full border flex items-center justify-center shrink-0 transition-all ${sel ? 'border-primary bg-primary' : 'border-border'}`} style={{ width: 18, height: 18 }}>
                {sel && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Skill Input */}
      <p
        className="text-foreground mb-[8px]"
        style={{ fontFamily: SF, fontSize: 18, lineHeight: '24px', letterSpacing: '-0.054px', fontWeight: 510 }}
      >
        {state.learningType === 'skill' ? 'Skill' : 'Subject'}
      </p>
      <div className="relative mb-[24px]" ref={dropRef}>
        <div className="relative">
          <Search size={15} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
            onFocus={() => setShowDrop(true)}
            placeholder={state.learningType === 'skill' ? 'e.g. React Development' : 'e.g. Computer Science'}
            className="w-full h-[48px] pl-[40px] pr-4 bg-muted rounded-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#8cb200] transition-shadow"
            style={{ fontFamily: INTER, fontSize: 14 }}
          />
        </div>
        {showDrop && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-20">
            {suggestions.map(s => (
              <button
                key={s}
                onMouseDown={() => { setQuery(s); set({ skill: s }); setShowDrop(false); }}
                className="w-full px-4 py-2.5 text-left text-foreground hover:bg-muted transition-colors border-b border-[#f9fafb] last:border-0"
                style={{ fontFamily: INTER, fontSize: 14 }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleBuild}
        disabled={!query.trim()}
        className="w-full h-[56px] bg-primary text-foreground rounded-full flex items-center justify-center transition-opacity active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
        style={{ fontFamily: INTER, fontSize: 16, lineHeight: '24px', fontWeight: 600 }}
      >
        {isYouTubeUrl ? 'Enter Immersive Mode' : 'Build My Roadmap'}
      </button>

      {/* Bottom hint */}
      <p
        className="text-center text-muted-foreground mt-[12px] flex items-center justify-center gap-1"
        style={{ fontFamily: INTER, fontSize: 12, lineHeight: '16px' }}
      >
        <Clock size={11} />
        {isYouTubeUrl ? 'Chapters + quizzes generated automatically' : 'Takes about 3 minutes'}
      </p>
    </div>
  );
}
