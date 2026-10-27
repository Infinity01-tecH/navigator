import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline, Highlighter, Code2,
  AlignLeft, AlignCenter, AlignRight, ImagePlus, Ban,
} from 'lucide-react';

// ─── Rich text editor ─────────────────────────────────────────────────────────────
// contentEditable-based editor supporting bold / italic / underline / highlight /
// monospace, text alignment, and inline images composed between paragraphs
// (spec §4.2 / §4.3). Stores its value as an HTML string.
//
// Every formatting control is a *true toggle* (§2): each can both apply and
// remove its effect, on a selection or as an active typing state, and the toolbar
// button lights up while that format is active so it's obvious it can be turned
// back off. Highlight offers a color picker plus a "remove highlight" action.

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#fdf3a6' },
  { name: 'Lime',   value: '#e4f7a1' },
  { name: 'Mint',   value: '#c7f5df' },
  { name: 'Sky',    value: '#c9e8ff' },
  { name: 'Pink',   value: '#ffd4e5' },
  { name: 'Peach',  value: '#ffe0c2' },
];

interface Active {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  mono: boolean;
  highlight: boolean;
}

export function RichEditor({
  value, onChange, placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState<Active>({ bold: false, italic: false, underline: false, mono: false, highlight: false });
  const [showColors, setShowColors] = useState(false);

  // Seed the DOM once; afterwards the DOM is the source of truth so the caret
  // isn't reset on every keystroke.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep toolbar active-state in sync with wherever the caret is.
  useEffect(() => {
    function onSel() {
      const el = ref.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const node = sel.anchorNode;
      if (!node || !el.contains(node)) return;
      refreshActive();
    }
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Walk up from the caret to detect formats execCommand can't report.
  function ancestorMatch(test: (el: HTMLElement) => boolean): HTMLElement | null {
    const sel = window.getSelection();
    let node: Node | null = sel?.anchorNode ?? null;
    while (node && node !== ref.current) {
      if (node.nodeType === 1 && test(node as HTMLElement)) return node as HTMLElement;
      node = node.parentNode;
    }
    return null;
  }

  function refreshActive() {
    try {
      const isMono = !!ancestorMatch(el => el.tagName === 'CODE');
      const isHi = !!ancestorMatch(el => {
        const bg = el.style.backgroundColor || '';
        return el.tagName === 'MARK' || (!!bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)');
      });
      setActive({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        mono: isMono,
        highlight: isHi,
      });
    } catch { /* queryCommandState can throw when unfocused */ }
  }

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
    refreshActive();
  }

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  }

  function applyHighlight(color: string) {
    ref.current?.focus();
    setShowColors(false);
    // hiliteColor is the modern name; some engines only know backColor.
    if (!document.execCommand('hiliteColor', false, color)) {
      document.execCommand('backColor', false, color);
    }
    emit();
  }

  function removeHighlight() {
    ref.current?.focus();
    setShowColors(false);
    // Setting the highlight to transparent reliably clears it across engines.
    if (!document.execCommand('hiliteColor', false, 'transparent')) {
      document.execCommand('backColor', false, 'transparent');
    }
    emit();
  }

  function toggleMono() {
    ref.current?.focus();
    const codeEl = ancestorMatch(el => el.tagName === 'CODE');
    if (codeEl) {
      // Un-wrap: hoist the <code>'s children out, then drop the empty <code>.
      const parent = codeEl.parentNode;
      if (parent) {
        while (codeEl.firstChild) parent.insertBefore(codeEl.firstChild, codeEl);
        parent.removeChild(codeEl);
      }
      emit();
      return;
    }
    const sel = window.getSelection();
    const text = sel?.toString();
    if (!text) return;
    document.execCommand(
      'insertHTML', false,
      `<code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#f3f4f6;padding:1px 5px;border-radius:4px;font-size:0.9em">${text}</code>&nbsp;`,
    );
    emit();
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      ref.current?.focus();
      document.execCommand('insertHTML', false,
        `<img src="${reader.result}" alt="" style="max-width:100%;border-radius:12px;margin:8px 0;display:block" /><p><br/></p>`);
      emit();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const Btn = ({ Icon, onClick, title, isActive }: { Icon: typeof Bold; onClick: () => void; title: string; isActive?: boolean }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      aria-pressed={!!isActive}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        isActive ? 'bg-primary text-foreground' : 'text-muted-foreground hover:bg-[#eef0f2]'
      }`}
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 border-b border-border bg-[#fafbfc]">
        <Btn Icon={Bold} title="Bold" isActive={active.bold} onClick={() => exec('bold')} />
        <Btn Icon={Italic} title="Italic" isActive={active.italic} onClick={() => exec('italic')} />
        <Btn Icon={Underline} title="Underline" isActive={active.underline} onClick={() => exec('underline')} />

        {/* Highlight with color picker */}
        <div className="relative">
          <Btn Icon={Highlighter} title="Highlight" isActive={active.highlight} onClick={() => setShowColors(s => !s)} />
          {showColors && (
            <div className="absolute top-full left-0 mt-1.5 z-30 bg-background border border-border rounded-xl shadow-lg p-2 w-[168px]">
              <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                {HIGHLIGHT_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    onMouseDown={e => { e.preventDefault(); applyHighlight(c.value); }}
                    className="w-full h-7 rounded-lg border border-border hover:scale-105 transition-transform"
                    style={{ background: c.value }}
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); removeHighlight(); }}
                className="w-full h-7 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                <Ban size={12} /> Remove highlight
              </button>
            </div>
          )}
        </div>

        <Btn Icon={Code2} title="Monospace" isActive={active.mono} onClick={toggleMono} />
        <div className="w-px h-5 bg-secondary mx-1" />
        <Btn Icon={AlignLeft} title="Align left" onClick={() => exec('justifyLeft')} />
        <Btn Icon={AlignCenter} title="Align center" onClick={() => exec('justifyCenter')} />
        <Btn Icon={AlignRight} title="Align right" onClick={() => exec('justifyRight')} />
        <div className="w-px h-5 bg-secondary mx-1" />
        <Btn Icon={ImagePlus} title="Insert image" onClick={() => fileRef.current?.click()} />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />
      </div>

      {/* Editable surface */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onMouseUp={refreshActive}
        onKeyUp={refreshActive}
        data-placeholder={placeholder ?? 'Start writing…'}
        className="rich-editor min-h-[260px] px-4 py-3.5 text-sm text-foreground leading-relaxed focus:outline-none"
      />

      <style>{`
        .rich-editor:empty:before { content: attr(data-placeholder); color: #c8cbd3; }
        .rich-editor h3 { font-weight: 700; margin: 0.4em 0 0.3em; }
        .rich-editor h4 { font-weight: 700; margin: 0.6em 0 0.2em; color:#4b5162; }
        .rich-editor p { margin: 0.35em 0; }
        .rich-editor ul { list-style: disc; padding-left: 1.2em; margin: 0.35em 0; }
        .rich-editor blockquote { border-left: 3px solid #d2f25e; padding-left: 0.75em; color:#6d717f; margin: 0.5em 0; }
        .rich-editor figure { margin: 0.6em 0; }
        .rich-editor figure img { max-width: 100%; border-radius: 12px; display:block; }
        .rich-editor figcaption { font-size: 11px; color:#9ea2ae; margin-top: 4px; }
        .rich-editor img { max-width: 100%; }
      `}</style>
    </div>
  );
}
