import { useEffect, useState } from 'react';
import quoteSvgPaths from '@/imports/LoadingQuote/svg-8vn12jioyt';

interface Props {
  onDone: () => void;
}

// Famous knowledge/learning quotes — one is picked randomly each time
const FAMOUS_QUOTES = [
  { text: 'There is only one good, knowledge, and one evil, ignorance.', author: 'Socrates' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi' },
  { text: 'The beautiful thing about learning is that nobody can take it away from you.', author: 'B.B. King' },
  { text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.', author: 'Confucius' },
  { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
  { text: 'To know what you know and what you do not know, that is true knowledge.', author: 'Confucius' },
  { text: 'I am always doing that which I cannot do, in order that I may learn how to do it.', author: 'Pablo Picasso' },
  { text: 'Education is the most powerful weapon you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'The more you know, the more you realize you don\'t know.', author: 'Aristotle' },
  { text: 'Learning is not attained by chance; it must be sought with ardor and diligence.', author: 'Abigail Adams' },
  { text: 'Develop a passion for learning. If you do, you will never cease to grow.', author: 'Anthony J. D\'Angelo' },
];

function pickQuote() {
  return FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
}

// Single navigator logo row — 4 icon instances side by side in a 174×16px strip
function LogoSvg() {
  return (
    <svg
      fill="none"
      height="16.1824"
      preserveAspectRatio="none"
      viewBox="0 0 174 16.1824"
      width="174"
      className="absolute block inset-0 size-full"
    >
      <path clipRule="evenodd" d={quoteSvgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" />
      <path clipRule="evenodd" d={quoteSvgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" />
      <path clipRule="evenodd" d={quoteSvgPaths.p9df0d00}  fill="#8CB200" fillRule="evenodd" />
      <path clipRule="evenodd" d={quoteSvgPaths.p6b31000}  fill="#8CB200" fillRule="evenodd" />
    </svg>
  );
}

// 200×209px block of staggered logo rows — matches each half of Frame2 in the import
const ROW_OFFSETS = [
  { left: 0,  top: 0   },
  { left: 26, top: 28  },
  { left: 0,  top: 56  },
  { left: 26, top: 83  },
  { left: 0,  top: 112 },
  { left: 26, top: 138 },
  { left: 0,  top: 168 },
  { left: 26, top: 193 },
];

function LogoBlock({ offsetLeft }: { offsetLeft: number }) {
  return (
    <div className="absolute h-[209.182px] w-[200px]" style={{ left: offsetLeft, top: 0 } as React.CSSProperties}>
      {ROW_OFFSETS.map((r, i) => (
        <div
          key={i}
          className="absolute h-[16.182px] w-[174px]"
          style={{ left: r.left, top: r.top } as React.CSSProperties}
        >
          <LogoSvg />
        </div>
      ))}
    </div>
  );
}

// Bottom decorative pattern — two 200px blocks placed side-by-side.
// Positioned so its top 97px are visible above the screen bottom, matching
// the original Figma frame (747px from top in an 844px-tall design).
function BottomPattern() {
  return (
    <div
      className="absolute opacity-50"
      style={{
        left: -8,
        bottom: -112,
        width: 400,
        height: 209.182,
      } as React.CSSProperties}
    >
      <LogoBlock offsetLeft={0} />
      <LogoBlock offsetLeft={200} />
    </div>
  );
}

export function LoadingQuote({ onDone }: Props) {
  const [{ text, author }] = useState(pickQuote);

  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: '#f9ffe5' }}
    >
      <BottomPattern />

      {/* Centered quote block */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8">
        {/* Opening quote mark — SVG from import */}
        <div className="shrink-0" style={{ width: 56.704, height: 45.184 }}>
          <svg
            fill="none"
            height="45.184"
            viewBox="0 0 56.704 45.184"
            width="56.704"
            className="block size-full"
          >
            <path d={quoteSvgPaths.p37a23b00} fill="#8CB200" />
          </svg>
        </div>

        {/* Quote body */}
        <p
          className="text-foreground text-center text-[24px] font-bold leading-[32px] tracking-[-0.072px] w-[308px]"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          &ldquo;{text}&rdquo;
        </p>

        {/* Attribution */}
        <p
          className="text-center text-[16px] font-semibold leading-[20px] tracking-[-0.064px] w-[308px]"
          style={{ color: '#8cb200', fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          ~ {author}
        </p>
      </div>
    </div>
  );
}
