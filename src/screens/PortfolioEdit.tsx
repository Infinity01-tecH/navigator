import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Copy, Download, ExternalLink, Share2 } from 'lucide-react';
import { useApp } from '../lib/context';
import type { RoadmapEntry } from '../lib/context';
import type { RoadmapStep } from '../lib/generateRoadmap';
import { kvGet } from '../lib/roadmapStore';
import {
  deleteBuild, getMyPortfolio, listMyBuilds, normalizeHandle, portfolioUrl,
  saveBuild, savePortfolio, validateHandle, validateProofUrl,
  type MyBuild,
} from '../lib/portfolioStore';
import { downloadBlob, renderProgressCard, shareOrDownloadCard } from '../lib/shareCard';

// ─── My portfolio (route: /portfolio) ──────────────────────────────────────────
// The owner's side of the public page at /u/:handle: pick a handle, switch the
// page on, choose which roadmaps show, attach proof links to finished builds,
// and make shareable progress cards.

function Switch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'}`}
    >
      <span
        className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-background shadow transition-all"
        style={{ left: value ? 23 : 3 }}
      />
    </button>
  );
}

function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mt-8 mb-3">
      <h2 className="text-[18px] font-bold text-foreground">{children}</h2>
      {hint && <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-[12px] bg-muted px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-border';

function stepsOf(e: RoadmapEntry): RoadmapStep[] {
  return e.roadmap.phases.flatMap(p => p.steps);
}

// ── One build step: attach / change / remove a proof link ───────────────────────
function BuildRow({
  entry, step, existing, onChanged,
}: { entry: RoadmapEntry; step: RoadmapStep; existing?: MyBuild; onChanged: () => void }) {
  const done = !!entry.progress[step.id];
  const [url, setUrl] = useState(existing?.proofUrl ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setUrl(existing?.proofUrl ?? ''); setNote(existing?.note ?? ''); }, [existing?.id, existing?.proofUrl, existing?.note]);

  async function save() {
    const bad = validateProofUrl(url);
    if (bad) { setMsg({ ok: false, text: bad }); return; }
    setBusy(true);
    const err = await saveBuild({ roadmapId: entry.id, stepId: step.id, title: step.title, proofUrl: url, note });
    setBusy(false);
    if (err) { setMsg({ ok: false, text: err }); return; }
    setMsg({ ok: true, text: 'Saved' });
    onChanged();
  }

  async function remove() {
    if (!existing) return;
    setBusy(true);
    await deleteBuild(existing.id);
    setBusy(false);
    setUrl(''); setNote(''); setMsg(null);
    onChanged();
  }

  return (
    <div className="rounded-[14px] border border-border p-3.5">
      <p className="text-[14px] font-semibold text-foreground break-words">{step.title}</p>
      {!done ? (
        <p className="text-[12px] text-muted-foreground mt-1">Finish this step to add proof of it.</p>
      ) : (
        <div className="mt-2.5 space-y-2">
          <input
            className={inputCls}
            placeholder="https://github.com/you/your-project"
            value={url}
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            onChange={e => { setUrl(e.target.value); setMsg(null); }}
          />
          <input
            className={inputCls}
            placeholder="One line about it (optional)"
            value={note}
            maxLength={280}
            onChange={e => { setNote(e.target.value); setMsg(null); }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-[10px] bg-primary px-4 py-2 text-[13px] font-bold text-foreground disabled:opacity-50"
            >
              {existing ? 'Update proof' : 'Add proof'}
            </button>
            {existing && (
              <button onClick={remove} disabled={busy} className="rounded-[10px] bg-muted px-4 py-2 text-[13px] font-semibold text-foreground disabled:opacity-50">
                Remove
              </button>
            )}
            {msg && <span className={`text-[12px] ${msg.ok ? 'text-muted-foreground' : 'text-[#d53f36]'}`}>{msg.text}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export function PortfolioEdit() {
  const navigate = useNavigate();
  const { state, user, authReady, profileName, avatarSvg, currentStreak } = useApp();

  // Only roadmaps saved to the account can appear on a public page.
  const entries = useMemo(
    () => (state.roadmaps as RoadmapEntry[]).filter(r => !(r as { preview?: boolean }).preview && !r.id.startsWith('local_') && !r.id.startsWith('dev-bypass')),
    [state.roadmaps],
  );

  const [loaded, setLoaded] = useState(false);
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  // What is actually saved on the server — drives the "your link" box.
  const [live, setLive] = useState<{ handle: string; isPublic: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [builds, setBuilds] = useState<MyBuild[]>([]);
  const [copied, setCopied] = useState(false);
  const [cardBusy, setCardBusy] = useState<string | null>(null);
  const [cardMsg, setCardMsg] = useState<string | null>(null);

  const handleErr = handle ? validateHandle(handle) : null;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [mine, myBuilds, savedBio] = await Promise.all([
        getMyPortfolio(), listMyBuilds(), kvGet<string>('bio'),
      ]);
      if (cancelled) return;
      setBuilds(myBuilds);
      if (mine) {
        setHandle(mine.handle); setName(mine.displayName); setBio(mine.bio);
        setIsPublic(mine.isPublic); setHidden(mine.hiddenRoadmaps);
        setLive({ handle: mine.handle, isPublic: mine.isPublic });
      } else {
        // First visit: suggest a handle and fill the name/bio from the profile.
        const seed = normalizeHandle(profileName && profileName !== 'Your Profile' ? profileName : (user.email?.split('@')[0] ?? ''));
        setHandle(seed);
        setName(profileName && profileName !== 'Your Profile' ? profileName : '');
        setBio(typeof savedBio === 'string' ? savedBio.slice(0, 280) : '');
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function refreshBuilds() { setBuilds(await listMyBuilds()); }

  async function save() {
    setSaveMsg(null);
    const bad = validateHandle(handle);
    if (bad) { setSaveMsg({ ok: false, text: bad }); return; }
    setSaving(true);
    const err = await savePortfolio(
      { handle, displayName: name, bio, isPublic, hiddenRoadmaps: hidden },
      avatarSvg ?? '',
    );
    setSaving(false);
    if (err) { setSaveMsg({ ok: false, text: err }); return; }
    setLive({ handle, isPublic });
    setSaveMsg({ ok: true, text: isPublic ? 'Saved. Your page is live.' : 'Saved. Your page is private.' });
  }

  async function copyLink() {
    if (!live) return;
    try { await navigator.clipboard.writeText(portfolioUrl(live.handle)); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt('Copy your link:', portfolioUrl(live.handle)); }
  }

  async function shareLink() {
    if (!live) return;
    const url = portfolioUrl(live.handle);
    try {
      if (navigator.share) await navigator.share({ title: `${name || live.handle} on Navigator`, url });
      else await copyLink();
    } catch { /* cancelled */ }
  }

  async function makeCard(entry: RoadmapEntry, mode: 'share' | 'save', size: 'story' | 'post') {
    const steps = stepsOf(entry);
    const done = steps.filter(s => entry.progress[s.id]).length;
    const total = steps.length;
    const percent = total ? Math.round((100 * done) / total) : 0;
    const link = live?.isPublic ? portfolioUrl(live.handle).replace(/^https?:\/\//, '') : window.location.host;
    setCardBusy(entry.id); setCardMsg(null);
    try {
      const blob = await renderProgressCard({
        skill: entry.roadmap.skill, percent, doneSteps: done, totalSteps: total,
        name: name || undefined, streak: currentStreak ?? 0, link, size,
      });
      const file = `navigator-${entry.roadmap.skill.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'progress'}.png`;
      if (mode === 'save') { downloadBlob(blob, file); setCardMsg('Image saved.'); }
      else {
        const text = percent >= 100
          ? `I finished ${entry.roadmap.skill} on Navigator.`
          : `I'm ${percent}% through ${entry.roadmap.skill} on Navigator.`;
        const r = await shareOrDownloadCard(blob, file, text, live?.isPublic ? portfolioUrl(live.handle) : undefined);
        setCardMsg(r === 'downloaded' ? 'Image saved. Post it from your gallery.' : r === 'shared' ? 'Shared.' : null);
      }
    } catch (e) {
      setCardMsg(e instanceof Error ? e.message : 'Could not make the card.');
    } finally {
      setCardBusy(null);
    }
  }

  const toggleHidden = (id: string) =>
    setHidden(h => (h.includes(id) ? h.filter(x => x !== id) : [...h, id]));

  const shell = (children: React.ReactNode) => (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[720px] px-5 pt-5 pb-20">
        <button onClick={() => navigate(-1)} aria-label="Back" className="mb-4 -ml-1 p-1">
          <ArrowLeft size={22} strokeWidth={2.2} className="text-foreground" />
        </button>
        {children}
      </div>
    </div>
  );

  if (!authReady || (user && !loaded)) {
    return shell(<p className="text-[14px] text-muted-foreground text-center pt-24">Loading…</p>);
  }

  if (!user) {
    return shell(
      <div className="text-center pt-16">
        <p className="text-[18px] font-bold text-foreground">Sign in to build your portfolio</p>
        <p className="text-[14px] text-muted-foreground mt-2 leading-snug">
          Your portfolio shows the roadmaps you've worked through, quizzes you've passed and things you've built.
        </p>
        <button onClick={() => navigate('/auth')} className="mt-5 rounded-[12px] bg-primary px-5 py-2.5 text-[14px] font-bold text-foreground">
          Sign in
        </button>
      </div>,
    );
  }

  const link = live ? portfolioUrl(live.handle) : '';

  return shell(
    <>
      <h1 className="text-[26px] font-bold text-foreground leading-tight">My portfolio</h1>
      <p className="text-[14px] text-muted-foreground mt-1 leading-snug">
        A public page that shows your progress and what you've built. It stays private until you switch it on.
      </p>

      {/* On / off */}
      <div className="mt-5 flex items-center justify-between rounded-[16px] border border-border p-4">
        <div className="pr-3">
          <p className="text-[16px] font-bold text-foreground">Public page</p>
          <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
            {isPublic ? 'Anyone with the link can see it.' : 'Only you can see it.'}
          </p>
        </div>
        <Switch value={isPublic} onChange={setIsPublic} label="Make portfolio public" />
      </div>

      {/* Link */}
      {live?.isPublic && (
        <div className="mt-3 rounded-[16px] bg-muted p-4">
          <p className="text-[12px] text-muted-foreground">Your link</p>
          <p className="text-[14px] font-semibold text-foreground break-all mt-0.5">{link}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={copyLink} className="flex items-center gap-1.5 rounded-[10px] bg-background px-3.5 py-2 text-[13px] font-semibold text-foreground">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={shareLink} className="flex items-center gap-1.5 rounded-[10px] bg-background px-3.5 py-2 text-[13px] font-semibold text-foreground">
              <Share2 size={14} /> Share
            </button>
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-[10px] bg-background px-3.5 py-2 text-[13px] font-semibold text-foreground">
              <ExternalLink size={14} /> Preview
            </a>
          </div>
        </div>
      )}

      {/* Profile */}
      <SectionTitle>Profile</SectionTitle>
      <div className="space-y-3">
        <div>
          <label className="text-[12px] text-muted-foreground">Handle (your link)</label>
          <div className="mt-1 flex items-center rounded-[12px] bg-muted px-3.5">
            <span className="text-[15px] text-muted-foreground">/u/</span>
            <input
              className="w-full bg-transparent py-2.5 pl-1 text-[15px] text-foreground outline-none"
              value={handle}
              maxLength={30}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              onChange={e => { setHandle(normalizeHandle(e.target.value)); setSaveMsg(null); }}
              placeholder="your-name"
            />
          </div>
          {handleErr && <p className="text-[12px] text-[#d53f36] mt-1">{handleErr}</p>}
          {live && live.handle !== handle && !handleErr && (
            <p className="text-[12px] text-muted-foreground mt-1">Changing it breaks the old link you've already shared.</p>
          )}
        </div>
        <div>
          <label className="text-[12px] text-muted-foreground">Name shown on the page</label>
          <input className={`${inputCls} mt-1`} value={name} maxLength={60} onChange={e => { setName(e.target.value); setSaveMsg(null); }} placeholder="Your name" />
        </div>
        <div>
          <label className="text-[12px] text-muted-foreground">Bio</label>
          <textarea
            className={`${inputCls} mt-1 min-h-[84px] resize-none`}
            value={bio}
            maxLength={280}
            onChange={e => { setBio(e.target.value); setSaveMsg(null); }}
            placeholder="A line or two about what you're learning and why."
          />
          <p className="text-[11px] text-muted-foreground text-right">{bio.length}/280</p>
        </div>
      </div>

      {/* Roadmaps */}
      <SectionTitle hint="Switch off any roadmap you don't want people to see. Roadmaps with no finished steps never show.">
        Roadmaps on your page
      </SectionTitle>
      {entries.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">Create a roadmap and finish a few steps, then come back.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(e => {
            const steps = stepsOf(e);
            const done = steps.filter(s => e.progress[s.id]).length;
            const pct = steps.length ? Math.round((100 * done) / steps.length) : 0;
            const shown = !hidden.includes(e.id);
            return (
              <div key={e.id} className="rounded-[16px] border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[16px] font-bold text-foreground truncate">{e.roadmap.skill}</p>
                    <p className="text-[12px] text-muted-foreground">{done} of {steps.length} steps · {pct}%</p>
                  </div>
                  <Switch value={shown} onChange={() => toggleHidden(e.id)} label={`Show ${e.roadmap.skill} on my page`} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    disabled={cardBusy === e.id || done === 0}
                    onClick={() => makeCard(e, 'share', 'story')}
                    className="flex items-center gap-1.5 rounded-[10px] bg-primary px-3.5 py-2 text-[13px] font-bold text-foreground disabled:opacity-40"
                  >
                    <Share2 size={14} /> {pct >= 100 ? 'Share completion card' : 'Share progress card'}
                  </button>
                  <button
                    disabled={cardBusy === e.id || done === 0}
                    onClick={() => makeCard(e, 'save', 'post')}
                    className="flex items-center gap-1.5 rounded-[10px] bg-muted px-3.5 py-2 text-[13px] font-semibold text-foreground disabled:opacity-40"
                  >
                    <Download size={14} /> Save for X / feed
                  </button>
                </div>
                {done === 0 && <p className="text-[11px] text-muted-foreground mt-2">Finish a step to make a card.</p>}
              </div>
            );
          })}
          {cardMsg && <p className="text-[12px] text-muted-foreground">{cardMsg}</p>}
        </div>
      )}

      {/* Builds */}
      <SectionTitle hint="Add a link to the real thing you made (GitHub, a live site, a design file). Only https links. It shows on your page once the step is finished.">
        Proof of what you built
      </SectionTitle>
      {entries.every(e => !stepsOf(e).some(s => s.type === 'build')) ? (
        <p className="text-[14px] text-muted-foreground">Your roadmaps have no build steps yet.</p>
      ) : (
        <div className="space-y-5">
          {entries.map(e => {
            const buildSteps = stepsOf(e).filter(s => s.type === 'build');
            if (buildSteps.length === 0) return null;
            return (
              <div key={e.id}>
                <p className="text-[13px] font-semibold text-muted-foreground mb-2">{e.roadmap.skill}</p>
                <div className="space-y-2.5">
                  {buildSteps.map(s => (
                    <BuildRow
                      key={s.id}
                      entry={e}
                      step={s}
                      existing={builds.find(b => b.roadmapId === e.id && b.stepId === s.id)}
                      onChanged={refreshBuilds}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save bar */}
      <div className="mt-10">
        <button
          onClick={save}
          disabled={saving || !!handleErr || !handle}
          className="w-full rounded-[14px] bg-primary px-5 py-3 text-[15px] font-bold text-foreground disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save portfolio'}
        </button>
        {saveMsg && (
          <p className={`mt-2 text-[13px] text-center ${saveMsg.ok ? 'text-muted-foreground' : 'text-[#d53f36]'}`}>{saveMsg.text}</p>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground text-center leading-snug">
          Proof links save as soon as you add them. The switches, handle, name and bio save with this button.
        </p>
      </div>
    </>,
  );
}
