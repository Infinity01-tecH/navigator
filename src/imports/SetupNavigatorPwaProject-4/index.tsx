import svgPaths from "./svg-upgd4ezqsn";
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
type LongArrowProps = {
  className?: string;
  darkMode?: "False";
  direction?: "Left";
};

function LongArrow({ className, darkMode = "False", direction = "Left" }: LongArrowProps) {
  return (
    <div className={className || "relative size-[24px]"}>
      <div className="absolute flex inset-[26.04%_19.79%_23.76%_17.71%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[100cqw] rotate-90 w-[100cqh]">
          <div className="relative size-full" data-name="Arrow - Left">
            <div className="absolute inset-[-6.67%_-8.3%]">
              <svg className="block size-full" fill="none" height="17.0002" preserveAspectRatio="none" viewBox="0 0 14.049 17.0002" width="14.049">
                <g id="Arrow - Left">
                  <path d="M7.0246 16V1" id="Stroke 1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.pcca5f60} id="Stroke 3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type FilledProps = {
  className?: string;
  darkMode?: "False";
};

function Filled({ className, darkMode = "False" }: FilledProps) {
  return (
    <div className={className || "bg-white relative rounded-[12px]"}>
      <div className="content-stretch flex items-start p-[8px] relative size-full">
        <LongArrow className="relative shrink-0 size-[24px]" />
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
    <div className="bg-white content-stretch flex h-[59px] items-end justify-center overflow-clip relative shrink-0 w-full" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function BackIconBtn() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] relative shrink-0 w-full" data-name="Back & Icon Btn">
      <Filled className="bg-white relative rounded-[12px] shrink-0" />
      <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <StatusBar />
      <BackIconBtn />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20.002px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.0022" preserveAspectRatio="none" viewBox="0 0 20.0022 20.0022" width="20.0022">
        <g id="Icon">
          <path d={svgPaths.p35f45400} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66684" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#8cb200] content-stretch flex items-center p-[10px] relative rounded-[17.147px] shrink-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0">
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131313] text-[24px] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Immersive mode
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Container />
      <Frame3 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-18px] p-[10px] relative shrink-0">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[40px] relative shrink-0 text-[#131927] text-[32px] tracking-[-0.096px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Paste a YouTube link
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#131313] text-[16px] tracking-[-0.048px] w-[350px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`We'll parse the transcript, generate chapters, and quiz you at the end of each concept — no passive watching.`}</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start pb-[8px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        YouTube URL
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[12px] top-[8px] w-[231px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] underline whitespace-nowrap">{`https://youtube.com/watch?v=...`}</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[37px] relative shrink-0 w-[139.962px]" data-name="Container">
      <Paragraph1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-center justify-between p-[14px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Container2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0 w-[319px]">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[17.875px] relative shrink-0 text-[#9ea2ae] text-[11px] w-[313px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Works best with tutorials that have chapter timestamps in the description or auto-generated captions enabled.
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-start pl-[10px] relative shrink-0 w-[371px]">
      <Paragraph />
      <Container1 />
      <Frame6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[371.074px]">
      <Frame4 />
      <Frame2 />
      <Frame5 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[13px] items-center relative shrink-0 w-full">
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#8cb200] content-stretch flex h-[55.991px] items-center justify-center opacity-40 relative rounded-[33737400px] shrink-0 w-full" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#131927] text-[16px] text-center whitespace-nowrap">Analyze Video</p>
    </div>
  );
}

function ButtonAlign() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[349.992px]" data-name="Button:align">
      <Button />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[304px] items-center relative shrink-0 w-full">
      <Frame9 />
      <ButtonAlign />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[393.43px]">
      <Frame10 />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[129px] py-[8px] relative shrink-0 w-full" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5px] relative rounded-[100px] shrink-0 w-full" data-name="Home Indicator" />
    </div>
  );
}

export default function SetupNavigatorPwaProject() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[48px] items-start relative size-full" data-name="Setup Navigator PWA Project">
      <Frame11 />
      <HomeIndicator />
    </div>
  );
}