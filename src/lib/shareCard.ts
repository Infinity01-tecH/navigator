// ─── Shareable progress / completion cards ─────────────────────────────────────
// Draws a PNG on a <canvas> in the browser (no server, no extra packages) that
// people can post to a WhatsApp status, X, Instagram stories, etc.
//
//   • in progress  → "I'm 40% through Python"
//   • finished     → "I finished Python" with a COMPLETED badge
//
// It is a share card, not an accredited certificate: nobody outside Navigator
// verifies it, so the wording never claims a qualification.

export interface ShareCardInput {
  skill: string;
  percent: number;      // 0–100
  doneSteps: number;
  totalSteps: number;
  name?: string;        // shown as "by <name>"
  streak?: number;      // current streak in days, shown when > 1
  link?: string;        // short link printed at the bottom (host + path)
  size?: 'story' | 'post';
}

const SIZES = {
  story: { w: 1080, h: 1920 }, // WhatsApp / Instagram status
  post:  { w: 1080, h: 1350 }, // X / feed (4:5)
} as const;

// Reads the app's --primary CSS variable so the card matches the theme, and
// falls back if the browser cannot parse it for canvas.
function brandColor(fallback = '#7c5cff'): string {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    if (!raw) return fallback;
    const probe = document.createElement('canvas').getContext('2d');
    if (!probe) return fallback;
    // An invalid colour string leaves fillStyle on its previous value, so set a
    // sentinel first and check whether the assignment changed it.
    probe.fillStyle = '#010203';
    probe.fillStyle = raw;
    return probe.fillStyle !== '#010203' ? raw : fallback;
  } catch { return fallback; }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Shrinks the font until the text fits, then wraps to at most `maxLines` lines.
function fitText(
  ctx: CanvasRenderingContext2D, text: string, maxWidth: number,
  startPx: number, minPx: number, weight: number, maxLines: number,
): { lines: string[]; px: number } {
  for (let px = startPx; px >= minPx; px -= 2) {
    ctx.font = `${weight} ${px}px Inter, system-ui, -apple-system, Segoe UI, sans-serif`;
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(next).width <= maxWidth) cur = next;
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    const fits = lines.length <= maxLines && lines.every(l => ctx.measureText(l).width <= maxWidth);
    if (fits) return { lines, px };
  }
  // Last resort: hard-truncate to one line.
  ctx.font = `${weight} ${minPx}px Inter, system-ui, sans-serif`;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return { lines: [t + '…'], px: minPx };
}

export async function renderProgressCard(input: ShareCardInput): Promise<Blob> {
  const { w, h } = SIZES[input.size ?? 'story'];
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');

  // Wait for the page font so the card does not render in a fallback face.
  try { await (document as any).fonts?.ready; } catch { /* ignore */ }

  const brand = brandColor();
  const percent = Math.max(0, Math.min(100, Math.round(input.percent)));
  const finished = percent >= 100 && input.totalSteps > 0;
  const pad = 96;
  const inner = w - pad * 2;
  const FONT = 'Inter, system-ui, -apple-system, Segoe UI, sans-serif';

  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0b0b10');
  bg.addColorStop(1, '#15131f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Soft brand glow, top right
  const glow = ctx.createRadialGradient(w * 0.85, h * 0.12, 0, w * 0.85, h * 0.12, w * 0.9);
  glow.addColorStop(0, brand);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;

  // Wordmark
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText('Navigator', pad, pad + 40);

  const top = Math.round(h * (input.size === 'post' ? 0.2 : 0.24));

  // Badge / lead-in
  ctx.font = `700 40px ${FONT}`;
  if (finished) {
    const label = 'COMPLETED';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = brand;
    roundRect(ctx, pad, top, tw + 64, 84, 42);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, pad + 32, top + 57);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fillText("I'M LEARNING", pad, top + 40);
  }

  // Skill name (the hero text)
  const skillBlock = fitText(ctx, input.skill, inner, 120, 56, 800, 3);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${skillBlock.px}px ${FONT}`;
  let y = top + 84 + 40 + skillBlock.px;
  for (const line of skillBlock.lines) {
    ctx.fillText(line, pad, y);
    y += Math.round(skillBlock.px * 1.12);
  }

  // Big percentage
  y += 24;
  const pctText = finished ? '100%' : `${percent}%`;
  const pctPx = input.size === 'post' ? 220 : 280;
  ctx.fillStyle = brand;
  ctx.font = `900 ${pctPx}px ${FONT}`;
  y += pctPx * 0.8;
  ctx.fillText(pctText, pad - 6, y);

  // Progress bar
  y += 64;
  const barH = 36;
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  roundRect(ctx, pad, y, inner, barH, barH / 2);
  ctx.fill();
  if (percent > 0) {
    ctx.fillStyle = brand;
    roundRect(ctx, pad, y, Math.max(barH, (inner * percent) / 100), barH, barH / 2);
    ctx.fill();
  }

  // Counts
  y += barH + 64;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `600 44px ${FONT}`;
  ctx.fillText(`${input.doneSteps} of ${input.totalSteps} steps done`, pad, y);
  if ((input.streak ?? 0) > 1) {
    y += 72;
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = `600 40px ${FONT}`;
    ctx.fillText(`${input.streak}-day streak`, pad, y);
  }

  // Footer
  const footerY = h - pad;
  if (input.link) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `600 36px ${FONT}`;
    const l = fitText(ctx, input.link, inner, 36, 24, 600, 1);
    ctx.font = `600 ${l.px}px ${FONT}`;
    ctx.fillText(l.lines[0], pad, footerY);
  }
  if (input.name?.trim()) {
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 48px ${FONT}`;
    const n = fitText(ctx, `by ${input.name.trim()}`, inner, 48, 28, 700, 1);
    ctx.font = `700 ${n.px}px ${FONT}`;
    ctx.fillText(n.lines[0], pad, footerY - (input.link ? 64 : 0));
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not create the image.'))), 'image/png');
  });
}

// Opens the phone's share sheet with the image attached when the browser
// supports sharing files (most phones). Otherwise downloads the PNG so the
// person can post it by hand. Returns what happened so the UI can say so.
export async function shareOrDownloadCard(
  blob: Blob, fileName: string, text: string, url?: string,
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], fileName, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  try {
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], text, ...(url ? { url } : {}) });
      return 'shared';
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
    // fall through to download
  }
  downloadBlob(blob, fileName);
  return 'downloaded';
}

export function downloadBlob(blob: Blob, fileName: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 2000);
}
