import Frame37141 from '@/imports/Frame37141';
import Group18 from '@/imports/Group18';
import Frame37140 from '@/imports/Frame37140';

// The "empty space" roadmap illustrations exported from Figma. Each frame is
// captured at its native 587.5 × 448.451px (wider than the 393px screen, so it
// bleeds off both edges exactly like the design). We render the imports as-is
// inside a correctly-sized, bottom-anchored frame and never redraw them.
function IllustrationFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-[96px] flex justify-center pointer-events-none overflow-hidden">
      <div className="relative w-[587.5px] h-[448.451px] shrink-0">
        {children}
      </div>
    </div>
  );
}

// Create-your-password page (Frame 37141)
export function PasswordIllustration() {
  return (
    <IllustrationFrame>
      <Frame37141 />
    </IllustrationFrame>
  );
}

// Create-username page (Group 18)
export function UsernameIllustration() {
  return (
    <IllustrationFrame>
      <Group18 />
    </IllustrationFrame>
  );
}

// Reset-password page (Frame 37140)
export function ResetIllustration() {
  return (
    <IllustrationFrame>
      <Frame37140 />
    </IllustrationFrame>
  );
}
