import svgPaths from "./svg-8u0nvmcwum";
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
    <div className="bg-white content-stretch flex h-[59px] items-end justify-center overflow-clip relative shrink-0 w-[393px]" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function BackIconBtn() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] relative shrink-0 w-[393px]" data-name="Back & Icon Btn">
      <Filled className="bg-white relative rounded-[12px] shrink-0" />
      <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
        </div>
      </div>
    </div>
  );
}

function ProgressBar1() {
  return (
    <div className="bg-[#f8f8f8] h-[12px] overflow-clip relative rounded-[100px] shrink-0 w-full" data-name="Progress Bar">
      <div className="absolute bg-[#8cb200] bottom-0 h-[12px] left-0 right-[324.3px]" data-name="% Process" />
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[354px]" data-name="Progress bar">
      <ProgressBar1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col h-[23px] items-start pb-[8px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#9ea2ae] text-[10px] tracking-[1px] uppercase whitespace-nowrap">Skill level</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pb-[4px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131927] text-[24px] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Where are you right now?
      </p>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#131313] text-[16px] tracking-[-0.048px] w-[350px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        This helps us calibrate how much ground your roadmap needs to cover.
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[350.064px]">
      <Paragraph />
      <Heading />
      <ParagraphMargin />
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] whitespace-nowrap">0</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#394050] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Complete beginner
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[263.989px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#9ea2ae] text-[12px] whitespace-nowrap">{`Haven't touched it yet`}</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[264.01_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[16px] shrink-0 w-[349.992px]" data-name="Button">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] whitespace-nowrap">1</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#394050] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Know the basics
      </p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[263.989px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#9ea2ae] text-[12px] whitespace-nowrap">Familiar with fundamentals</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-[264.01_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[16px] shrink-0 w-[349.992px]" data-name="Button">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] whitespace-nowrap">2</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#394050] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Intermediate
      </p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[263.989px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#9ea2ae] text-[12px] whitespace-nowrap">Built a few projects</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[264.01_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[16px] shrink-0 w-[349.992px]" data-name="Button">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] whitespace-nowrap">3</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#394050] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Advanced
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[263.989px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#9ea2ae] text-[12px] whitespace-nowrap">Comfortable with complex patterns</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-[264.01_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[16px] shrink-0 w-[349.992px]" data-name="Button">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] whitespace-nowrap">4</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#394050] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Expert
      </p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[263.989px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#9ea2ae] text-[12px] whitespace-nowrap">Could teach this to others</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-[264.01_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph9 />
      <Paragraph10 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[16px] shrink-0 w-[349.992px]" data-name="Button">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[434.638px] items-start relative shrink-0 w-[349.99px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#8cb200] content-stretch flex h-[51.985px] items-center justify-center opacity-40 relative rounded-[33737400px] shrink-0 w-[349.992px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#131927] text-[14px] text-center whitespace-nowrap">Continue</p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0" data-name="Button:margin">
      <Button5 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-center max-w-[390px] overflow-clip relative shrink-0" data-name="Container">
      <StatusBar />
      <BackIconBtn />
      <ProgressBar />
      <Frame />
      <Container1 />
      <ButtonMargin />
    </div>
  );
}

function Layout() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[852.623px] items-center relative shrink-0 w-[394.137px]" data-name="Layout">
      <Container />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[129px] py-[8px] relative shrink-0" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[42px] items-center relative shrink-0">
      <Layout />
      <HomeIndicator />
    </div>
  );
}

export default function SetupNavigatorPwaProject() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Setup Navigator PWA Project">
      <Frame1 />
    </div>
  );
}