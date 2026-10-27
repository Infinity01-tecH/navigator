import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useApp } from '../lib/context';
import svgPaths from '@/imports/WelcomeScreenDefault/svg-08km3twcaw';

// ── Logo icon (animated entrance) ────────────────────────────────────────────
// Spring overshoot (0 → ~1.2× → 1) mirrors the motion-context keyframe intent
// (scale 0 → 1.2 → base 1) without ending at scale 0 like the Figma loop does.
function NavLogoIcon() {
  return (
    <motion.div
      className="relative shrink-0"
      style={{ width: 48.32, height: 41, transformOrigin: '50% 50%' }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="41"
        preserveAspectRatio="none"
        viewBox="0 0 48.3201 41"
        width="48.3201"
      >
        <g id="Frame">
          <rect fill="#8CB200" height="41" rx="10.9818" width="48.3201" />
          <path clipRule="evenodd" d={svgPaths.p34fe53f0} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </motion.div>
  );
}

// ── Color mode icon (top-right decorative button) ─────────────────────────────
function ColorModeIcon() {
  return (
    <div className="bg-card p-[8px] rounded-[12px]">
      <div className="overflow-clip relative size-[24px]">
        <div className="absolute inset-[11.02%_11.02%_8.33%_8.33%]">
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            height="19.3542"
            preserveAspectRatio="none"
            viewBox="0 0 19.3542 19.3542"
            width="19.3542"
          >
            <path clipRule="evenodd" d={svgPaths.p1b5c2d80} fill="#131313" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── HelloIllustraton sub-components ──────────────────────────────────────────
// All faithfully copied from WelcomeScreenDefault/index.tsx, using svgPaths
// imported above. The 361×361px container uses absolute percentage insets
// for sub-elements, matching the Figma layout exactly.

function Bg() {
  return (
    <div className="absolute inset-[-9.14%_-14.4%_-0.02%_-14.43%]" data-name="Bg">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="394.084"
        preserveAspectRatio="none"
        viewBox="0 0 465.087 394.084"
        width="465.087"
      >
        <path d={svgPaths.p18088640} fill="var(--color-accent)" />
      </svg>
    </div>
  );
}

function IlluGroup() {
  return (
    <div className="absolute inset-[20.83%_12.5%]">
      <div className="absolute inset-[-7.14%_-5.56%]">
        <svg
          className="block size-full"
          fill="none"
          height="193.799"
          preserveAspectRatio="none"
          viewBox="0 0 242.249 193.799"
          width="242.249"
        >
          <path d={svgPaths.p3871c900} fill="#D53F36" fillOpacity="0.3" stroke="#D53F36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24.2249" />
          <path d={svgPaths.pf9d7580} fill="#D53F36" />
        </svg>
      </div>
    </div>
  );
}

function HeadStandard25A8446F() {
  return (
    <div className="absolute contents inset-[43.58%_34.37%_2.85%_35.19%]">
      <div className="absolute inset-[77.66%_39.8%_2.85%_37.73%]">
        <div className="absolute inset-[-2.56%_-3.15%_-1.86%_-2.1%]">
          <svg className="block size-full" fill="none" height="59.1417" preserveAspectRatio="none" viewBox="0 0 68.7566 59.1417" width="68.7566">
            <path d={svgPaths.p1293ca00} fill="#D08B5B" stroke="black" strokeWidth="2.10742" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[78.19%_44.08%_12.92%_44.12%] mix-blend-multiply">
        <svg className="absolute block inset-0 size-full" fill="none" height="25.8633" preserveAspectRatio="none" viewBox="0 0 34.3141 25.8633" width="34.3141">
          <g style={{ mixBlendMode: 'multiply' }}>
            <path d={svgPaths.pfdbe500} fill="#D08B5B" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[43.58%_34.37%_16.45%_35.19%]">
        <div className="absolute inset-[-0.91%_-1.19%]">
          <svg className="block size-full" fill="none" height="118.288" preserveAspectRatio="none" viewBox="0 0 90.6162 118.288" width="90.6162">
            <path d={svgPaths.p3d3d2c00} fill="#D08B5B" stroke="black" strokeWidth="2.10742" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MouthPucker25A8446F() {
  return (
    <div className="absolute inset-[70.77%_42.88%_24.84%_53.31%]">
      <div className="absolute inset-[-8.26%_-9.53%_-8.26%_-4.63%]">
        <svg className="block size-full" fill="none" height="14.858" preserveAspectRatio="none" viewBox="0 0 12.6309 14.858" width="12.6309">
          <g>
            <path d={svgPaths.p20c61f00} stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function EyebrowsDown25A8446F() {
  return (
    <div className="absolute inset-[54.28%_40.07%_41.41%_42.62%]">
      <div className="absolute inset-[-8.41%_-2.09%]">
        <svg className="block size-full" fill="none" height="14.6286" preserveAspectRatio="none" viewBox="0 0 52.4224 14.6286" width="52.4224">
          <g>
            <path d={svgPaths.p94c3700} stroke="black" strokeLinecap="round" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HairFonze25A8446F() {
  return (
    <div className="absolute inset-[37.15%_34.91%_27.54%_28.49%]">
      <div className="absolute inset-[-1.41%_-0.99%_-1.03%_-3.03%]">
        <svg className="block size-full" fill="none" height="105.135" preserveAspectRatio="none" viewBox="0 0 110.673 105.135" width="110.673">
          <g>
            <path d={svgPaths.p16926980} fill="#131313" stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function EyesEyes25A8446F() {
  return (
    <div className="absolute inset-[57.54%_39.99%_35.41%_44.62%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.4795" preserveAspectRatio="none" viewBox="0 0 44.7548 20.4795" width="44.7548">
        <g>
          <path d={svgPaths.p32d2f000} fill="black" />
          <path d={svgPaths.p324ed680} fill="black" />
        </g>
      </svg>
    </div>
  );
}

function NoseCurve25A8446F() {
  return (
    <div
      className="absolute flex inset-[62.91%_45.47%_32.24%_51.67%] items-center justify-center"
      style={{ containerType: 'size' }}
    >
      <div className="-rotate-8 flex-none h-[hypot(22.3184cqw,93.5674cqh)] w-[hypot(77.6816cqw,-6.43257cqh)]">
        <div className="relative size-full">
          <div className="absolute inset-[-0.7%_-16.15%_-7.9%_-3.18%]">
            <svg className="block size-full" fill="none" height="14.4763" preserveAspectRatio="none" viewBox="0 0 7.78089 14.4763" width="7.78089">
              <g>
                <path d={svgPaths.pcac5780} stroke="black" strokeWidth="2.10742" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarsDetached25A8446F() {
  return (
    <div className="absolute inset-[63.52%_59.17%_27.95%_33.56%]">
      <div className="absolute inset-[-4.25%_0_-4.25%_-4.99%]">
        <svg className="block size-full" fill="none" height="26.8801" preserveAspectRatio="none" viewBox="0 0 22.1714 26.8801" width="22.1714">
          <g>
            <path d={svgPaths.p3c04a2c0} fill="#D08B5B" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.p2f5f4280} fill="#D08B5B" />
            <path d={svgPaths.p3dcd0000} stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.p17d54700} stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClothesCrew25A8446F() {
  return (
    <div className="absolute inset-[87.34%_25.35%_-0.85%_25.11%]">
      <div className="absolute inset-[-2.68%_-1.42%_-2.68%_-1.24%]">
        <svg className="block size-full" fill="none" height="41.3854" preserveAspectRatio="none" viewBox="0 0 147.835 41.3854" width="147.835">
          <g>
            <path d={svgPaths.p20d8b600} fill="#FC909F" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.ped9400} fill="#FC909F" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.ped9400} fill="white" opacity="0.75" stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IlluGroup1() {
  return (
    <div className="absolute contents inset-[37.15%_25.35%_-0.85%_25.11%]">
      <HeadStandard25A8446F />
      <MouthPucker25A8446F />
      <EyebrowsDown25A8446F />
      <HairFonze25A8446F />
      <EyesEyes25A8446F />
      <NoseCurve25A8446F />
      <EarsDetached25A8446F />
      <ClothesCrew25A8446F />
    </div>
  );
}

function LineMdYoutubeTwotone() {
  return (
    <div className="absolute left-[38px] overflow-clip size-[290.699px] top-[5px]">
      <IlluGroup />
      <IlluGroup1 />
      <div className="absolute aspect-[24/24] left-[12.38%] right-[77.64%] top-[234px]" />
      <div className="absolute inset-[86.52%_82.44%_5.21%_9.29%]">
        <svg className="absolute block inset-0 size-full" fill="none" height="24.0528" preserveAspectRatio="none" viewBox="0 0 24.0528 24.0528" width="24.0528">
          <path clipRule="evenodd" d={svgPaths.p322f6872} fill="black" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function Message() {
  return (
    <div className="absolute contents inset-[-28.9%_-23.92%_-23.63%_-28.58%]">
      <div
        className="absolute flex inset-[-28.9%_-23.92%_-23.63%_-28.58%] items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div className="flex-none h-[hypot(-48.0829cqw,47.7597cqh)] rotate-[45.19deg] w-[hypot(51.9171cqw,52.2403cqh)]">
          <div className="relative size-full">
            <svg className="absolute block inset-0 size-full" fill="none" height="373.134" preserveAspectRatio="none" viewBox="0 0 405.505 373.134" width="405.505">
              <path clipRule="evenodd" d={svgPaths.pd441b00} fill="#8CB200" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <LineMdYoutubeTwotone />
    </div>
  );
}

function HairVariant30545Fac() {
  return (
    <div
      className="absolute flex inset-[11.08%_72.87%_56.67%_1.44%] items-center justify-center"
      style={{ containerType: 'size' }}
    >
      <div className="flex-none h-[hypot(22.4888cqw,87.328cqh)] rotate-[-11.6deg] w-[hypot(77.5112cqw,-12.672cqh)]">
        <div className="relative size-full">
          <svg className="absolute block inset-0 size-full" fill="none" height="103.771" preserveAspectRatio="none" viewBox="0 0 73.3873 103.771" width="73.3873">
            <g>
              <path d={svgPaths.p2b4c11c0} fill="black" />
              <g>
                <path d={svgPaths.p2d082c00} fill="black" />
                <path d={svgPaths.p1a022e00} fill="white" />
                <path d={svgPaths.pbc4a780} fill="black" />
                <g>
                  <path d={svgPaths.p292a2d80} fill="black" />
                </g>
                <g>
                  <path d={svgPaths.p26adb2f0} fill="black" />
                </g>
                <g>
                  <path d={svgPaths.pdfff400} fill="black" />
                </g>
                <g>
                  <path d={svgPaths.pd3f4f00} fill="black" />
                </g>
              </g>
              <path d={svgPaths.p79b9280} fill="black" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function HairAccessoriesFlowers545Fac() {
  return (
    <div
      className="absolute flex inset-[21.27%_89.64%_71.91%_2.35%] items-center justify-center"
      style={{ containerType: 'size' }}
    >
      <div className="flex-none h-[hypot(13.8582cqw,79.2583cqh)] rotate-[-11.6deg] w-[hypot(86.1418cqw,-20.7417cqh)]">
        <div className="relative size-full">
          <svg className="absolute block inset-0 size-full" fill="none" height="19.9393" preserveAspectRatio="none" viewBox="0 0 25.43 19.9393" width="25.43">
            <g>
              <path d={svgPaths.p3952f100} fill="black" />
              <path d={svgPaths.p3b33b700} fill="white" />
              <path d={svgPaths.p36b17800} fill="black" />
              <path d={svgPaths.p1348600} fill="white" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function IlluGroup2() {
  return (
    <div className="absolute contents inset-[11.08%_72.86%_56.55%_0.83%]" style={{ containerType: 'size' }}>
      <HairVariant30545Fac />
      <HairAccessoriesFlowers545Fac />
    </div>
  );
}

function HeadDefault494Eadb() {
  return (
    <div className="absolute inset-[17.32%_5.82%_62.43%_71.54%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="73.1176" preserveAspectRatio="none" viewBox="0 0 81.7328 73.1176" width="81.7328">
        <g>
          <path d={svgPaths.p18326200} fill="black" />
          <path clipRule="evenodd" d={svgPaths.pc87fc80} fill="#763900" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function EyesVariant03494Eadb() {
  return (
    <div className="absolute inset-[25.38%_13.28%_68.63%_72.28%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="21.5988" preserveAspectRatio="none" viewBox="0 0 52.1354 21.5988" width="52.1354">
        <g>
          <path d={svgPaths.p190c46e0} fill="black" />
          <path d={svgPaths.p22c33970} fill="white" />
          <path d={svgPaths.p2a172c18} fill="black" />
          <path d={svgPaths.p35cc18e0} fill="white" />
          <path d={svgPaths.pf579e00} fill="black" />
        </g>
      </svg>
    </div>
  );
}

function EyebrowsVariant12494Eadb() {
  return (
    <div className="absolute inset-[23.43%_15.3%_73.93%_72.77%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.52848" preserveAspectRatio="none" viewBox="0 0 43.0694 9.52848" width="43.0694">
        <g>
          <path d={svgPaths.p28709600} fill="black" />
        </g>
      </svg>
    </div>
  );
}

function MouthVariant22494Eadb() {
  return (
    <div className="absolute inset-[32.02%_17.14%_65.23%_75.89%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.94139" preserveAspectRatio="none" viewBox="0 0 25.1574 9.94139" width="25.1574">
        <g>
          <path d={svgPaths.pd851700} fill="black" />
          <path d={svgPaths.p8c65d40} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function GlassesVariant03494Eadb() {
  return (
    <div className="absolute inset-[28.86%_17.53%_68.42%_75.45%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.83999" preserveAspectRatio="none" viewBox="0 0 25.3212 9.83999" width="25.3212">
        <g>
          <path d={svgPaths.p1070a980} fill="black" />
        </g>
      </svg>
    </div>
  );
}

function HairLong23494Eadb() {
  return (
    <div className="absolute inset-[13.3%_5.26%_70.87%_70.91%]">
      <svg className="absolute block inset-0 size-full" fill="none" height="57.1711" preserveAspectRatio="none" viewBox="0 0 86 57.1711" width="86">
        <g>
          <path d={svgPaths.p35b2d340} fill="black" />
          <g>
            <path d={svgPaths.p234a6700} fill="#796A45" />
            <path d={svgPaths.p2d2bb080} fill="#796A45" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IlluGroup3() {
  return (
    <div className="absolute contents inset-[13.3%_5.26%_62.43%_70.91%]">
      <HeadDefault494Eadb />
      <EyesVariant03494Eadb />
      <EyebrowsVariant12494Eadb />
      <MouthVariant22494Eadb />
      <GlassesVariant03494Eadb />
      <HairLong23494Eadb />
    </div>
  );
}

function IlluGroup4() {
  return (
    <div className="absolute inset-[26.59%_-2.49%_68.42%_97.51%]">
      <div className="absolute inset-[-5.56%]">
        <svg className="block size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
          <g>
            <path d={svgPaths.p7173840} fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p22f4b300} fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p34c00d80} fill="black" />
            <path d={svgPaths.pd1d9900} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HelloIllustraton() {
  return (
    <div className="relative shrink-0 size-[361px]">
      <Bg />
      <Message />
      <div className="absolute inset-[88.92%_19.94%_2.22%_71.19%]">
        <svg className="absolute block inset-0 size-full" fill="none" height="31.9983" preserveAspectRatio="none" viewBox="0 0 32 31.9983" width="32">
          <path d={svgPaths.p11889800} fill="black" />
        </svg>
      </div>
      <IlluGroup2 />
      <IlluGroup3 />
      <div className="absolute inset-[-8.03%_82.55%_105.56%_14.4%]">
        <div className="absolute inset-[-9.5%_-7.7%]">
          <svg className="block size-full" fill="none" height="10.6064" preserveAspectRatio="none" viewBox="0 0 12.6935 10.6064" width="12.6935">
            <path d={svgPaths.p19f7a8c8} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.69352" />
          </svg>
        </div>
      </div>
      <IlluGroup4 />
    </div>
  );
}

// ── Welcome screen ────────────────────────────────────────────────────────────
export function Welcome() {
  const navigate = useNavigate();
  const { user } = useApp();

  function handleBuildRoadmap() {
    if (user) navigate('/start');
    else navigate('/auth?mode=signup');
  }

  return (
    <div className="bg-background flex flex-col h-full overflow-y-auto">
      {/* Color mode icon — top-right (webapp-first: no status-bar inset) */}
      <div className="flex justify-end px-4 pt-[24px] pb-2 shrink-0">
        <ColorModeIcon />
      </div>

      {/* Main content — vertically centered within remaining space */}
      <div className="flex flex-col items-center gap-[9px] px-4 pb-8 flex-1 justify-center">
        {/* Logo + "Navigator" title */}
        <div className="flex items-center justify-center">
          <NavLogoIcon />
          <p
            className="font-bold leading-[32px] text-foreground text-[24px] text-center tracking-[-0.072px] w-[144px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Navigator
          </p>
        </div>

        {/* Illustration — 48px below logo (same as import's Frame5 gap) */}
        <div className="mt-[39px]">
          <HelloIllustraton />
        </div>

        {/* Tagline — whitespace-nowrap on each line so the <br/> gives exactly 2 lines */}
        <div className="flex items-center justify-center p-[10px]">
          <p
            className="font-semibold leading-[40px] text-foreground text-[32px] text-center tracking-[-0.096px] whitespace-nowrap"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Build a skill roadmap<br />in 3 minutes
          </p>
        </div>

        {/* Build Roadmap CTA */}
        <button
          onClick={handleBuildRoadmap}
          className="bg-primary flex gap-[10px] items-center justify-center px-[20px] py-[12px] rounded-[12px] w-full max-w-[361px] active:opacity-80 transition-opacity"
        >
          <p
            className="font-semibold text-[20px] text-center text-white tracking-[-0.408px] leading-[24px]"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontFeatureSettings: '"case" 1',
            }}
          >
            Build Roadmap
          </p>
        </button>

        {/* "Already, have an account? Sign in" */}
        <div className="flex items-center justify-center">
          <p
            className="font-normal text-foreground text-[16px] tracking-[-0.048px] leading-[20px] whitespace-nowrap"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Already, have an account?
          </p>
          <div className="flex flex-col gap-[2px] items-center px-[8px] py-[10px]">
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="font-normal text-primary text-[16px] tracking-[-0.048px] leading-[20px] whitespace-nowrap bg-transparent border-0 cursor-pointer p-0"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Sign in
            </button>
            <div className="bg-primary h-px w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
