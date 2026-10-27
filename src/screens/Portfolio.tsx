import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';
import {
  avatarDataUri, fetchPublicPortfolio,
  type PublicPortfolio, type PublicRoadmap,
} from '../lib/portfolioStore';

// ─── Public portfolio  (route: /u/:handle) ─────────────────────────────────────
// Anyone can open this, signed in or not. Data comes from the get_portfolio()
// database function, which returns nothing unless the owner switched their
// portfolio on. Everything shown here is plain text rendered by React, links
// are https-only (enforced by the database), and the avatar goes through an
// <img> data URI rather than raw HTML, so a visitor's browser never runs
// anything the owner typed.

function Bar({ percent, done }: { percent: number; done?: boolean }) {
  return (
    <div className="h-[8px] w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${Math.max(percent > 0 ? 4 : 0, Math.min(100, percent))}%`, opacity: done ? 1 : 0.9 }}
      />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-[14px] bg-muted px-3 py-3 text-center">
      <p className="text-[22px] font-bold text-foreground leading-none">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight">{label}</p>
    </div>
  );
}

const MODE_LABEL: Record<PublicRoadmap['mode'], string> = {
  full: 'Full roadmap', sprint: 'Sprint', youtube: 'Video path',
};

function RoadmapCard({ r }: { r: PublicRoadmap }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[16px] border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[18px] font-bold text-foreground leading-snug break-words">{r.skill}</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">{MODE_LABEL[r.mode] ?? 'Roadmap'}</p>
        </div>
        {r.finished ? (
          <span className="shrink-0 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-foreground">
            <CheckCircle2 size={13} strokeWidth={2.4} /> Finished
          </span>
        ) : (
          <span className="shrink-0 text-[15px] font-bold text-foreground">{r.percent}%</span>
        )}
      </div>

      {r.tagline && (
        <p className="text-[13px] text-muted-foreground mt-2 leading-snug break-words">{r.tagline}</p>
      )}

      <div className="mt-3"><Bar percent={r.percent} done={r.finished} /></div>
      <p className="text-[12px] text-muted-foreground mt-2">
        {r.done} of {r.total} steps
        {r.quizzes > 0 && <> · {r.quizzes} quiz{r.quizzes === 1 ? '' : 'zes'} passed</>}
      </p>

      {r.phases?.length > 0 && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-foreground"
            aria-expanded={open}
          >
            {open ? 'Hide phases' : 'Show phases'}
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <ul className="mt-2 space-y-2">
              {r.phases.map((p, i) => (
                <li key={`${p.title}-${i}`}>
                  <div className="flex items-center justify-between text-[12px] text-foreground">
                    <span className="truncate pr-2">{p.title}</span>
                    <span className="text-muted-foreground shrink-0">{p.done}/{p.total}</span>
                  </div>
                  <div className="mt-1"><Bar percent={p.total ? (100 * p.done) / p.total : 0} /></div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export function Portfolio() {
  const { handle = '' } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'failed'>('loading');
  const [data, setData] = useState<PublicPortfolio | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    const res = await fetchPublicPortfolio(handle);
    if (res.failed) { setState('failed'); return; }
    if (!res.data) { setState('missing'); return; }
    setData(res.data);
    setState('ready');
  }, [handle]);

  useEffect(() => { load(); }, [load]);

  // Tab title for the person's page; restored when they navigate away.
  useEffect(() => {
    if (state !== 'ready' || !data) return;
    const prev = document.title;
    document.title = `${data.display_name || data.handle} · Navigator`;
    return () => { document.title = prev; };
  }, [state, data]);

  const shell = (children: React.ReactNode) => (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[720px] px-5 pt-8 pb-16">{children}</div>
    </div>
  );

  if (state === 'loading') {
    return shell(<p className="text-[14px] text-muted-foreground text-center pt-24">Loading portfolio…</p>);
  }

  if (state === 'failed') {
    return shell(
      <div className="text-center pt-24">
        <p className="text-[18px] font-bold text-foreground">Couldn't load this portfolio</p>
        <p className="text-[14px] text-muted-foreground mt-2">Check your connection and try again.</p>
        <button onClick={load} className="mt-5 rounded-[12px] bg-primary px-5 py-2.5 text-[14px] font-bold text-foreground">
          Try again
        </button>
      </div>,
    );
  }

  if (state === 'missing' || !data) {
    return shell(
      <div className="text-center pt-24">
        <p className="text-[18px] font-bold text-foreground">Nothing here</p>
        <p className="text-[14px] text-muted-foreground mt-2 leading-snug">
          This portfolio doesn't exist, or its owner hasn't made it public.
        </p>
        <button onClick={() => navigate('/')} className="mt-5 rounded-[12px] bg-primary px-5 py-2.5 text-[14px] font-bold text-foreground">
          Build your own roadmap
        </button>
      </div>,
    );
  }

  const name = data.display_name || data.handle;
  const initial = (name[0] || 'N').toUpperCase();

  return shell(
    <>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-[72px] h-[72px] rounded-full bg-primary overflow-hidden shrink-0 flex items-center justify-center">
          {data.avatar_svg ? (
            <img src={avatarDataUri(data.avatar_svg)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[28px] font-bold text-foreground">{initial}</span>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold text-foreground leading-tight break-words">{name}</h1>
          <p className="text-[14px] text-muted-foreground">@{data.handle}</p>
        </div>
      </div>
      {data.bio && <p className="mt-4 text-[15px] text-foreground leading-snug whitespace-pre-line break-words">{data.bio}</p>}

      {/* Stats */}
      <div className="mt-6 flex gap-2">
        <Stat value={data.stats.finished} label="Finished" />
        <Stat value={data.stats.steps} label="Steps done" />
        <Stat value={data.stats.quizzes} label="Quizzes passed" />
        <Stat value={data.stats.builds} label="Builds" />
      </div>

      {/* Roadmaps */}
      <h2 className="mt-8 mb-3 text-[18px] font-bold text-foreground">Roadmaps</h2>
      {data.roadmaps.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">No progress to show yet.</p>
      ) : (
        <div className="space-y-3">{data.roadmaps.map(r => <RoadmapCard key={r.id} r={r} />)}</div>
      )}

      {/* Builds */}
      <h2 className="mt-8 mb-3 text-[18px] font-bold text-foreground">Things I built</h2>
      {data.builds.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">No build proofs added yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.builds.map(b => (
            <li key={`${b.roadmap_id}-${b.proof_url}`} className="rounded-[16px] border border-border p-4">
              <p className="text-[12px] text-muted-foreground">{b.skill}</p>
              <p className="text-[16px] font-bold text-foreground mt-0.5 break-words">{b.title}</p>
              {b.note && <p className="text-[13px] text-foreground mt-1.5 leading-snug break-words">{b.note}</p>}
              <a
                href={b.proof_url}
                target="_blank"
                rel="noopener noreferrer nofollow ugc"
                className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] bg-muted px-3 py-1.5 text-[13px] font-semibold text-foreground"
              >
                View proof <ExternalLink size={13} />
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <p className="mt-10 text-[12px] text-muted-foreground leading-snug">
        Progress and quiz passes on this page are recorded by Navigator. Proof links are added by the
        owner and point to other sites, so open them with the usual care.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-5 w-full rounded-[14px] bg-primary px-5 py-3 text-[15px] font-bold text-foreground"
      >
        Build your own roadmap on Navigator
      </button>
    </>,
  );
}
