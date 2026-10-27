interface AvatarProps {
  svg: string;
  className?: string;
}

/**
 * Renders a DiceBear SVG string as an <img>. The checkerboard background
 * (transparent.svg) shows through wherever the avatar itself is transparent,
 * so a transparent-background choice is visibly distinguishable from white.
 */
export function Avatar({ svg, className }: AvatarProps) {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return (
    <img
      src={src}
      loading="lazy"
      className={className}
      style={{
        backgroundImage: "url('/transparent.svg')",
        backgroundSize: '100% 100%',
      }}
    />
  );
}
