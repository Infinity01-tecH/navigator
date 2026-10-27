import { motion } from "motion/react";
import svgPaths from "./svg-1sq1oufnkx";
type HomeIndicatorProps = {
  className?: string;
  darkMode?: "False";
};

function HomeIndicator({ className, darkMode = "False" }: HomeIndicatorProps) {
  return (
    <div className={className || "bg-white h-[34px] relative w-[393px]"}>
      <div className="-translate-x-1/2 absolute bg-[#131313] bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Frame() {
  return (
    <motion.div className="absolute h-[57.699px] left-[163px] top-[354px] w-[68px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" height="57.6986" preserveAspectRatio="none" viewBox="0 0 68 57.6986" width="68">
        <g id="Frame">
          <rect fill="#8CB200" height="57.6986" rx="15.4545" width="68" />
          <path clipRule="evenodd" d={svgPaths.p2f841a00} fill="white" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </motion.div>
  );
}

function Frame1() {
  return (
    <motion.div className="absolute h-[57.699px] left-[163px] top-[354px] w-[68px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" height="57.6986" preserveAspectRatio="none" viewBox="0 0 68 57.6986" width="68">
        <g id="Frame">
          <rect fill="#8CB200" height="57.6986" rx="15.4545" width="68" />
          <path clipRule="evenodd" d={svgPaths.p2f841a00} fill="white" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </motion.div>
  );
}

function LeftSide() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Left Side">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[3px] pl-[10px] relative size-full">
          <div className="h-[21px] relative rounded-[24px] shrink-0 w-[54px]" data-name="_StatusBar-time">
            <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] h-[20px] leading-[21px] left-[27px] text-[#131313] text-[16px] text-center top-px tracking-[-0.32px] w-[54px]" style={{ fontVariationSettings: '"wdth" 100' }}>
              9:41
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrueDepthCamera() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#131313] h-[37px] left-[calc(50%-22.5px)] rounded-[100px] top-1/2 w-[80px]" data-name="TrueDepth camera" />;
}

function FaceTimeCamera() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#131313] left-[calc(50%+44px)] rounded-[100px] size-[37px] top-1/2" data-name="FaceTime camera" />;
}

function DynamicIsland() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center relative shrink-0" data-name="Dynamic Island">
      <div className="bg-[#131313] h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-name="StatusBar-dynamicIsland">
        <TrueDepthCamera />
        <FaceTimeCamera />
      </div>
    </div>
  );
}

function SignalWifiBattery() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Signal, Wifi, Battery">
      <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Icon / Mobile Signal">
        <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 18 12" width="18">
          <g id="Icon / Mobile Signal">
            <path d={svgPaths.p1ec31400} fill="#131313" />
            <path d={svgPaths.p19f8d480} fill="#131313" />
            <path d={svgPaths.p13f4aa00} fill="#131313" />
            <path d={svgPaths.p1bfb7500} fill="#131313" />
          </g>
        </svg>
      </div>
      <div className="h-[11.834px] relative shrink-0 w-[17px]" data-name="Wifi">
        <svg className="absolute block inset-0 size-full" fill="none" height="11.8338" preserveAspectRatio="none" viewBox="0 0 17 11.8338" width="17">
          <path d={svgPaths.p17a4bf30} fill="#131313" id="Wifi" />
        </svg>
      </div>
      <div className="h-[13px] relative shrink-0 w-[27.401px]" data-name="_StatusBar-battery">
        <div className="-translate-y-1/2 absolute h-[13px] left-0 right-[2.4px] top-1/2" data-name="Outline">
          <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 25 13" width="25">
            <path d={svgPaths.p3f827980} id="Outline" opacity="0.35" stroke="#131313" />
          </svg>
        </div>
        <div className="-translate-y-1/2 absolute h-[4.22px] right-0 top-[calc(50%+0.61px)] w-[1.401px]" data-name="Battery End">
          <svg className="absolute block inset-0 size-full" fill="none" height="4.22034" preserveAspectRatio="none" viewBox="0 0 1.40119 4.22034" width="1.40119">
            <path d={svgPaths.p237cb000} fill="#131313" id="Battery End" opacity="0.4" />
          </svg>
        </div>
        <div className="-translate-y-1/2 absolute h-[9px] left-[2px] right-[4.4px] top-1/2" data-name="Fill">
          <svg className="absolute block inset-0 size-full" fill="none" height="9" preserveAspectRatio="none" viewBox="0 0 21 9" width="21">
            <path d={svgPaths.pa544c00} fill="#131313" id="Fill" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Right Side">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[11px] relative size-full">
          <SignalWifiBattery />
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="-translate-x-1/2 absolute bg-white content-stretch flex h-[59px] items-end justify-center left-1/2 top-0 w-[393px]" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

export default function SplashScreen() {
  return (
    <div className="bg-white relative size-full" data-name="Splash Screen">
      <HomeIndicator className="-translate-x-1/2 absolute bg-white bottom-0 h-[34px] left-1/2 w-[393px]" />
      <div className="absolute flex inset-[7.04%_-68.18%_-14.23%_-64.12%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(-48.0829cqw,47.7597cqh)] rotate-[45.19deg] w-[hypot(51.9171cqw,52.2403cqh)]">
          <div className="relative size-full" data-name="Line (Stroke)">
            <svg className="absolute block inset-0 size-full" fill="none" height="618.803" preserveAspectRatio="none" viewBox="0 0 672.487 618.803" width="672.487">
              <path clipRule="evenodd" d={svgPaths.p2405e200} fill="#8CB200" fillRule="evenodd" id="Line (Stroke)" />
            </svg>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] left-[197px] text-[#131313] text-[20px] text-center top-[469px] tracking-[-0.06px] w-[268px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Guiding you Every step of the way
      </p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-[197px] text-[#131313] text-[24px] text-center top-[419px] tracking-[-0.072px] w-[144px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Navigator
      </p>
      <Frame />
      <Frame1 />
      <StatusBar />
    </div>
  );
}