import { useNavigate, useSearchParams } from 'react-router';
import StartScreen from '@/imports/StartScreen-1';
import { useSmoothScroll } from '../lib/useSmoothScroll';

// "Welcome to your first skill!" — shown right after email confirmation.
// Renders the imported Figma Start Screen verbatim and overlays a transparent,
// functional button exactly over the design's "Let's Go!" button so tapping it
// forwards the user into the onboarding flow (/start by default).
export function FirstSkill() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/start';
  const scrollRef = useSmoothScroll<HTMLDivElement>();

  return (
    <div ref={scrollRef} className="bg-background h-full w-full overflow-y-auto overflow-x-hidden flex justify-center scrollbar-hide">
      <div className="relative w-full max-w-[393px] min-h-[852px] shrink-0">
        <StartScreen />
        <button
          onClick={() => navigate(next, { replace: true })}
          aria-label="Let's Go"
          className="absolute left-1/2 -translate-x-1/2 top-[710px] w-[361px] h-[48px] rounded-[12px] active:opacity-70 transition-opacity"
        />
      </div>
    </div>
  );
}
