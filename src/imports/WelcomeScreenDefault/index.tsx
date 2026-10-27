import svgPaths from "./svg-08km3twcaw";
import { motion } from "motion/react";
type WelcomeScreenColorModeProps = {
  className?: string;
  value?: "For Light Mode";
};

function WelcomeScreenColorMode({ className, value = "For Light Mode" }: WelcomeScreenColorModeProps) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"}>
      <div className="absolute inset-[11.02%_11.02%_8.33%_8.33%]" data-name="Icon (Stroke)">
        <svg className="absolute block inset-0 size-full" fill="none" height="19.3542" preserveAspectRatio="none" viewBox="0 0 19.3542 19.3542" width="19.3542">
          <path clipRule="evenodd" d={svgPaths.p1b5c2d80} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
        </svg>
      </div>
    </div>
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
    <div className="bg-white content-stretch flex h-[59px] items-end justify-center relative shrink-0 w-full" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function Filled() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Filled">
      <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end relative shrink-0 w-full">
      <StatusBar />
      <Filled />
    </div>
  );
}

function Frame() {
  return (
    <motion.div className="h-[41px] relative shrink-0 w-[48.32px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" height="41" preserveAspectRatio="none" viewBox="0 0 48.3201 41" width="48.3201">
        <g id="Frame">
          <rect fill="#8CB200" height="41" rx="10.9818" width="48.3201" />
          <path clipRule="evenodd" d={svgPaths.p34fe53f0} fill="white" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </motion.div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame />
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131313] text-[24px] text-center tracking-[-0.072px] w-[144px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Navigator
      </p>
    </div>
  );
}

function Bg() {
  return (
    <div className="absolute inset-[-9.14%_-14.4%_-0.02%_-14.43%]" data-name="Bg">
      <svg className="absolute block inset-0 size-full" fill="none" height="394.084" preserveAspectRatio="none" viewBox="0 0 465.087 394.084" width="465.087">
        <g id="Bg">
          <path d={svgPaths.p18088640} fill="#F9FFE6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[20.83%_12.5%]" data-name="Group">
      <div className="absolute inset-[-7.14%_-5.56%]">
        <svg className="block size-full" fill="none" height="193.799" preserveAspectRatio="none" viewBox="0 0 242.249 193.799" width="242.249">
          <g id="Group">
            <path d={svgPaths.p3871c900} fill="#D53F36" fillOpacity="0.3" id="Vector" stroke="#D53F36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24.2249" />
            <path d={svgPaths.pf9d7580} fill="#D53F36" id="Vector_2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HeadStandard25A8446F() {
  return (
    <div className="absolute contents inset-[43.58%_34.37%_2.85%_35.19%]" data-name="head-standard-25a8446f">
      <div className="absolute inset-[77.66%_39.8%_2.85%_37.73%]" data-name="Vector">
        <div className="absolute inset-[-2.56%_-3.15%_-1.86%_-2.1%]">
          <svg className="block size-full" fill="none" height="59.1417" preserveAspectRatio="none" viewBox="0 0 68.7566 59.1417" width="68.7566">
            <path d={svgPaths.p1293ca00} fill="#D08B5B" id="Vector" stroke="black" strokeWidth="2.10742" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[78.19%_44.08%_12.92%_44.12%] mix-blend-multiply" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="25.8633" preserveAspectRatio="none" viewBox="0 0 34.3141 25.8633" width="34.3141">
          <g id="Vector" style={{ mixBlendMode: "multiply" }}>
            <path d={svgPaths.pfdbe500} fill="#D08B5B" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[43.58%_34.37%_16.45%_35.19%]" data-name="Vector">
        <div className="absolute inset-[-0.91%_-1.19%]">
          <svg className="block size-full" fill="none" height="118.288" preserveAspectRatio="none" viewBox="0 0 90.6162 118.288" width="90.6162">
            <path d={svgPaths.p3d3d2c00} fill="#D08B5B" id="Vector" stroke="black" strokeWidth="2.10742" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MouthPucker25A8446F() {
  return (
    <div className="absolute inset-[70.77%_42.88%_24.84%_53.31%]" data-name="mouth-pucker-25a8446f">
      <div className="absolute inset-[-8.26%_-9.53%_-8.26%_-4.63%]">
        <svg className="block size-full" fill="none" height="14.858" preserveAspectRatio="none" viewBox="0 0 12.6309 14.858" width="12.6309">
          <g id="mouth-pucker-25a8446f">
            <path d={svgPaths.p20c61f00} id="Vector" stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function EyebrowsDown25A8446F() {
  return (
    <div className="absolute inset-[54.28%_40.07%_41.41%_42.62%]" data-name="eyebrows-down-25a8446f">
      <div className="absolute inset-[-8.41%_-2.09%]">
        <svg className="block size-full" fill="none" height="14.6286" preserveAspectRatio="none" viewBox="0 0 52.4224 14.6286" width="52.4224">
          <g id="eyebrows-down-25a8446f">
            <path d={svgPaths.p94c3700} id="Vector" stroke="black" strokeLinecap="round" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HairFonze25A8446F() {
  return (
    <div className="absolute inset-[37.15%_34.91%_27.54%_28.49%]" data-name="hair-fonze-25a8446f">
      <div className="absolute inset-[-1.41%_-0.99%_-1.03%_-3.03%]">
        <svg className="block size-full" fill="none" height="105.135" preserveAspectRatio="none" viewBox="0 0 110.673 105.135" width="110.673">
          <g id="hair-fonze-25a8446f">
            <path d={svgPaths.p16926980} fill="#131313" id="Vector" stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function EyesEyes25A8446F() {
  return (
    <div className="absolute inset-[57.54%_39.99%_35.41%_44.62%]" data-name="eyes-eyes-25a8446f">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.4795" preserveAspectRatio="none" viewBox="0 0 44.7548 20.4795" width="44.7548">
        <g id="eyes-eyes-25a8446f">
          <path d={svgPaths.p32d2f000} fill="black" id="Vector" />
          <path d={svgPaths.p324ed680} fill="black" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function NoseCurve25A8446F() {
  return (
    <div className="absolute flex inset-[62.91%_45.47%_32.24%_51.67%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="-rotate-8 flex-none h-[hypot(22.3184cqw,93.5674cqh)] w-[hypot(77.6816cqw,-6.43257cqh)]">
        <div className="relative size-full" data-name="nose-curve-25a8446f">
          <div className="absolute inset-[-0.7%_-16.15%_-7.9%_-3.18%]">
            <svg className="block size-full" fill="none" height="14.4763" preserveAspectRatio="none" viewBox="0 0 7.78089 14.4763" width="7.78089">
              <g id="nose-curve-25a8446f">
                <path d={svgPaths.pcac5780} id="Vector" stroke="black" strokeWidth="2.10742" />
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
    <div className="absolute inset-[63.52%_59.17%_27.95%_33.56%]" data-name="ears-detached-25a8446f">
      <div className="absolute inset-[-4.25%_0_-4.25%_-4.99%]">
        <svg className="block size-full" fill="none" height="26.8801" preserveAspectRatio="none" viewBox="0 0 22.1714 26.8801" width="22.1714">
          <g id="ears-detached-25a8446f">
            <path d={svgPaths.p3c04a2c0} fill="#D08B5B" id="Vector" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.p2f5f4280} fill="#D08B5B" id="Vector_2" />
            <path d={svgPaths.p3dcd0000} id="Vector_3" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.p17d54700} id="Vector_4" stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClothesCrew25A8446F() {
  return (
    <div className="absolute inset-[87.34%_25.35%_-0.85%_25.11%]" data-name="clothes-crew-25a8446f">
      <div className="absolute inset-[-2.68%_-1.42%_-2.68%_-1.24%]">
        <svg className="block size-full" fill="none" height="41.3854" preserveAspectRatio="none" viewBox="0 0 147.835 41.3854" width="147.835">
          <g id="clothes-crew-25a8446f">
            <path d={svgPaths.p20d8b600} fill="#FC909F" id="Vector" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.ped9400} fill="#FC909F" id="Vector_2" stroke="black" strokeWidth="2.10742" />
            <path d={svgPaths.ped9400} fill="white" id="Vector_3" opacity="0.75" stroke="black" strokeWidth="2.10742" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[37.15%_25.35%_-0.85%_25.11%]" data-name="Group">
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

function MingcuteAiFill() {
  return <div className="absolute aspect-[24/24] left-[12.38%] right-[77.64%] top-[234px]" data-name="mingcute:ai-fill" />;
}

function LineMdYoutubeTwotone() {
  return (
    <div className="absolute left-[38px] overflow-clip size-[290.699px] top-[5px]" data-name="line-md:youtube-twotone">
      <Group />
      <Group1 />
      <MingcuteAiFill />
      <div className="absolute inset-[86.52%_82.44%_5.21%_9.29%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="24.0528" preserveAspectRatio="none" viewBox="0 0 24.0528 24.0528" width="24.0528">
          <path clipRule="evenodd" d={svgPaths.p322f6872} fill="black" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Message() {
  return (
    <div className="absolute contents inset-[-28.9%_-23.92%_-23.63%_-28.58%]" data-name="Message">
      <div className="absolute flex inset-[-28.9%_-23.92%_-23.63%_-28.58%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(-48.0829cqw,47.7597cqh)] rotate-[45.19deg] w-[hypot(51.9171cqw,52.2403cqh)]">
          <div className="relative size-full" data-name="Line (Stroke)">
            <svg className="absolute block inset-0 size-full" fill="none" height="373.134" preserveAspectRatio="none" viewBox="0 0 405.505 373.134" width="405.505">
              <path clipRule="evenodd" d={svgPaths.pd441b00} fill="#8CB200" fillRule="evenodd" id="Line (Stroke)" />
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
    <div className="absolute flex inset-[11.08%_72.87%_56.67%_1.44%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="flex-none h-[hypot(22.4888cqw,87.328cqh)] rotate-[-11.6deg] w-[hypot(77.5112cqw,-12.672cqh)]">
        <div className="relative size-full" data-name="hair-variant30-545fac91">
          <svg className="absolute block inset-0 size-full" fill="none" height="103.771" preserveAspectRatio="none" viewBox="0 0 73.3873 103.771" width="73.3873">
            <g id="hair-variant30-545fac91">
              <path d={svgPaths.p2b4c11c0} fill="black" id="Vector" />
              <g id="head-variant03-545fac91">
                <path d={svgPaths.p2d082c00} fill="black" id="Vector_2" />
                <path d={svgPaths.p1a022e00} fill="white" id="Vector_3" />
                <path d={svgPaths.pbc4a780} fill="black" id="Vector_4" />
                <g id="eyes-variant23-545fac91">
                  <path d={svgPaths.p292a2d80} fill="black" id="Vector_5" />
                </g>
                <g id="eyebrows-variant08-545fac91">
                  <path d={svgPaths.p26adb2f0} fill="black" id="Vector_6" />
                </g>
                <g id="nose-variant02-545fac91">
                  <path d={svgPaths.pdfff400} fill="black" id="Vector_7" />
                </g>
                <g id="mouth-happy07-545fac91">
                  <path d={svgPaths.pd3f4f00} fill="black" id="Vector_8" />
                </g>
              </g>
              <path d={svgPaths.p79b9280} fill="black" id="Vector_9" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function HairAccessoriesFlowers545Fac() {
  return (
    <div className="absolute flex inset-[21.27%_89.64%_71.91%_2.35%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="flex-none h-[hypot(13.8582cqw,79.2583cqh)] rotate-[-11.6deg] w-[hypot(86.1418cqw,-20.7417cqh)]">
        <div className="relative size-full" data-name="hairAccessories-flowers-545fac91">
          <svg className="absolute block inset-0 size-full" fill="none" height="19.9393" preserveAspectRatio="none" viewBox="0 0 25.43 19.9393" width="25.43">
            <g id="hairAccessories-flowers-545fac91">
              <path d={svgPaths.p3952f100} fill="black" id="Vector" />
              <path d={svgPaths.p3b33b700} fill="white" id="Vector_2" />
              <path d={svgPaths.p36b17800} fill="black" id="Vector_3" />
              <path d={svgPaths.p1348600} fill="white" id="Vector_4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[11.08%_72.86%_56.55%_0.83%]" style={{ containerType: "size" }} data-name="Group">
      <HairVariant30545Fac />
      <HairAccessoriesFlowers545Fac />
    </div>
  );
}

function HeadDefault494Eadb() {
  return (
    <div className="absolute inset-[17.32%_5.82%_62.43%_71.54%]" data-name="head-default-494eadb3">
      <svg className="absolute block inset-0 size-full" fill="none" height="73.1176" preserveAspectRatio="none" viewBox="0 0 81.7328 73.1176" width="81.7328">
        <g id="head-default-494eadb3">
          <path d={svgPaths.p18326200} fill="black" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.pc87fc80} fill="#763900" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EyesVariant03494Eadb() {
  return (
    <div className="absolute inset-[25.38%_13.28%_68.63%_72.28%]" data-name="eyes-variant03-494eadb3">
      <svg className="absolute block inset-0 size-full" fill="none" height="21.5988" preserveAspectRatio="none" viewBox="0 0 52.1354 21.5988" width="52.1354">
        <g id="eyes-variant03-494eadb3">
          <path d={svgPaths.p190c46e0} fill="black" id="Vector" />
          <path d={svgPaths.p22c33970} fill="white" id="Vector_2" />
          <path d={svgPaths.p2a172c18} fill="black" id="Vector_3" />
          <path d={svgPaths.p35cc18e0} fill="white" id="Vector_4" />
          <path d={svgPaths.pf579e00} fill="black" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function EyebrowsVariant12494Eadb() {
  return (
    <div className="absolute inset-[23.43%_15.3%_73.93%_72.77%]" data-name="eyebrows-variant12-494eadb3">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.52848" preserveAspectRatio="none" viewBox="0 0 43.0694 9.52848" width="43.0694">
        <g id="eyebrows-variant12-494eadb3">
          <path d={svgPaths.p28709600} fill="black" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MouthVariant22494Eadb() {
  return (
    <div className="absolute inset-[32.02%_17.14%_65.23%_75.89%]" data-name="mouth-variant22-494eadb3">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.94139" preserveAspectRatio="none" viewBox="0 0 25.1574 9.94139" width="25.1574">
        <g id="mouth-variant22-494eadb3">
          <path d={svgPaths.pd851700} fill="black" id="Vector" />
          <path d={svgPaths.p8c65d40} fill="white" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function GlassesVariant03494Eadb() {
  return (
    <div className="absolute inset-[28.86%_17.53%_68.42%_75.45%]" data-name="glasses-variant03-494eadb3">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.83999" preserveAspectRatio="none" viewBox="0 0 25.3212 9.83999" width="25.3212">
        <g id="glasses-variant03-494eadb3">
          <path d={svgPaths.p1070a980} fill="black" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HairLong23494Eadb() {
  return (
    <div className="absolute inset-[13.3%_5.26%_70.87%_70.91%]" data-name="hair-long23-494eadb3">
      <svg className="absolute block inset-0 size-full" fill="none" height="57.1711" preserveAspectRatio="none" viewBox="0 0 86 57.1711" width="86">
        <g id="hair-long23-494eadb3">
          <path d={svgPaths.p35b2d340} fill="black" id="Vector" />
          <g id="Group">
            <path d={svgPaths.p234a6700} fill="#796A45" id="Vector_2" />
            <path d={svgPaths.p2d2bb080} fill="#796A45" id="Vector_3" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[13.3%_5.26%_62.43%_70.91%]" data-name="Group">
      <HeadDefault494Eadb />
      <EyesVariant03494Eadb />
      <EyebrowsVariant12494Eadb />
      <MouthVariant22494Eadb />
      <GlassesVariant03494Eadb />
      <HairLong23494Eadb />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[26.59%_-2.49%_68.42%_97.51%]" data-name="Group">
      <div className="absolute inset-[-5.56%]">
        <svg className="block size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
          <g id="Group">
            <path d={svgPaths.p7173840} fill="black" id="Vector" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p22f4b300} fill="black" id="Vector_2" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p34c00d80} fill="black" id="Vector_3" />
            <path d={svgPaths.pd1d9900} id="Vector_4" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HelloIllustraton() {
  return (
    <div className="relative shrink-0 size-[361px]" data-name="Hello Illustraton">
      <Bg />
      <Message />
      <div className="absolute inset-[88.92%_19.94%_2.22%_71.19%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="31.9983" preserveAspectRatio="none" viewBox="0 0 32 31.9983" width="32">
          <path d={svgPaths.p11889800} fill="black" id="Vector" />
        </svg>
      </div>
      <Group2 />
      <Group3 />
      <div className="absolute inset-[-8.03%_82.55%_105.56%_14.4%]" data-name="Vector">
        <div className="absolute inset-[-9.5%_-7.7%]">
          <svg className="block size-full" fill="none" height="10.6064" preserveAspectRatio="none" viewBox="0 0 12.6935 10.6064" width="12.6935">
            <path d={svgPaths.p19f7a8c8} id="Vector" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.69352" />
          </svg>
        </div>
      </div>
      <Group4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-center relative shrink-0">
      <Frame1 />
      <HelloIllustraton />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[40px] relative shrink-0 text-[#131313] text-[32px] text-center tracking-[-0.096px] w-[299px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Build a skill roadmap in 3 minutes
      </p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#8cb200] content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white tracking-[-0.408px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100', fontFeatureSettings: '"case" 1' }}>
        <p className="leading-[24px]">Build Roadmap</p>
      </div>
    </div>
  );
}

function TextTextButton() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text & Text Button">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#131313] text-[16px] tracking-[-0.048px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Already, have an account?</p>
      </div>
      <div className="relative shrink-0" data-name="Text Button">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col gap-[2px] items-center justify-center px-[8px] py-[10px] relative size-full">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8cb200] text-[16px] tracking-[-0.048px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Sign in</p>
            </div>
            <div className="bg-[#8cb200] h-px relative shrink-0 w-full" data-name="Underline" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-center relative shrink-0 w-[393px]">
      <Frame2 />
      <Frame5 />
      <Frame3 />
      <Button />
      <TextTextButton />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[129px] py-[8px] relative shrink-0 w-[393px]" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5px] relative rounded-[100px] shrink-0 w-full" data-name="Home Indicator" />
    </div>
  );
}

export default function WelcomeScreenDefault() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[98px] items-start relative size-full" data-name="Welcome Screen/Default">
      <Frame4 />
      <HomeIndicator />
    </div>
  );
}