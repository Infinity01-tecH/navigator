import { useEffect } from 'react';
import splashSvgPaths from '@/imports/SplashScreen/svg-1sq1oufnkx';

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="bg-background relative w-full h-full overflow-hidden">
      {/*
        Decorative dashed loop path — drawn with a single compound fill path
        that produces the appearance of a large dashed arc across the screen.
        Extends well beyond all four edges; clipped by parent overflow-hidden.
      */}
      <div
        className="absolute flex items-center justify-center"
        style={{ inset: '7.04% -68.18% -14.23% -64.12%', containerType: 'size' } as React.CSSProperties}
      >
        <div
          style={{
            flexShrink: 0,
            height: 'hypot(-48.0829cqw, 47.7597cqh)',
            width: 'hypot(51.9171cqw, 52.2403cqh)',
            transform: 'rotate(45.19deg)',
          }}
        >
          <div className="relative size-full">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 672.487 618.803"
            >
              <path
                clipRule="evenodd"
                d={splashSvgPaths.p2405e200}
                fill="#8CB200"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Vertically and horizontally centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {/* Static app icon */}
        <div
          className="relative shrink-0"
          style={{ width: 68, height: 57.699 }}
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            viewBox="0 0 68 57.6986"
          >
            <rect fill="#8CB200" height="57.6986" rx="15.4545" width="68" />
            <path
              clipRule="evenodd"
              d={splashSvgPaths.p2f841a00}
              fill="white"
              fillRule="evenodd"
            />
          </svg>
        </div>

        <p
          className="text-foreground text-center text-[24px] font-bold leading-[32px] tracking-[-0.072px]"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Navigator
        </p>
        <p
          className="text-foreground text-center text-[20px] font-normal leading-[24px] tracking-[-0.06px] w-[268px]"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Guiding you Every step of the way
        </p>
      </div>
    </div>
  );
}
