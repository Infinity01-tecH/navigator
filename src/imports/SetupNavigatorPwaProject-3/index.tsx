import svgPaths from "./svg-nupu4r7fj9";
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

function BackIconBtn() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[0.57px] px-[16px] top-[59px] w-[393px]" data-name="Back & Icon Btn">
      <Filled className="bg-white relative rounded-[12px] shrink-0" />
      <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[10px] size-[20.002px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.0022" preserveAspectRatio="none" viewBox="0 0 20.0022 20.0022" width="20.0022">
        <g id="Icon">
          <path d={svgPaths.p35f45400} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66684" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#8cb200] left-[-2px] rounded-[17.147px] size-[40.004px] top-[-13px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[15px] left-[44px] top-[6.5px] w-[100px]" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#131313] text-[24px] top-[-13.5px] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        YouTube-Based
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[31.996px] left-[22.93px] top-[30px] w-[349.99px]" data-name="Container">
      <Container2 />
      <Paragraph />
    </div>
  );
}

function Heading() {
  return <div className="absolute h-[36px] left-[20px] top-[140px] w-[349.99px]" data-name="Heading 2" />;
}

function ParagraphMargin() {
  return (
    <div className="absolute h-[64px] left-[20px] right-[20px] top-[176px]" data-name="Paragraph:margin">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] left-px text-[#131313] text-[16px] top-[-42px] tracking-[-0.048px] w-[350px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`We'll build your roadmap around YouTube creators whose style matches how you learn.`}</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[25px] items-start left-[20px] pb-[8px] top-[210px] w-[349.99px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Creator source
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[159.894px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.683px] not-italic relative shrink-0 text-[#131927] text-[15.878px] whitespace-nowrap">One Creator</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex flex-col h-[21.549px] items-start pt-[2.268px] relative shrink-0 w-[159.894px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18.713px] not-italic relative shrink-0 text-[#9ea2ae] text-[12.476px] whitespace-nowrap">Deep dive with one voice</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#f9ffe5] content-stretch flex flex-col h-[77.667px] items-start justify-center left-0 p-[15.878px] rounded-[18.146px] top-0 w-[193.926px]" data-name="Button">
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[120.437px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.083px] not-italic relative shrink-0 text-[#394050] text-[11.958px] whitespace-nowrap">Multiple</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex flex-col h-[16.229px] items-start pt-[1.708px] relative shrink-0 w-[120.437px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[14.094px] not-italic relative shrink-0 text-[#9ea2ae] text-[9.396px] whitespace-nowrap">Curated from several</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#f7f7f7] content-stretch flex flex-col h-[58.494px] items-start justify-center left-[203.93px] p-[11.958px] rounded-[13.667px] top-[11px] w-[146.068px]" data-name="Button">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[68.481px] left-0 right-0 top-0" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="absolute h-[88.481px] left-[20px] right-[20px] top-[235px]" data-name="Container:margin">
      <Container3 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14.988px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14.9875" preserveAspectRatio="none" viewBox="0 0 14.9875 14.9875" width="14.9875">
        <g clipPath="url(#clip0_0_41)" id="Icon">
          <path d={svgPaths.p18b8da80} id="Vector" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
          <path d="M12.4896 1.87344V4.37135" id="Vector_2" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
          <path d="M13.7385 3.1224H11.2406" id="Vector_3" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
          <path d="M2.49792 10.6161V11.8651" id="Vector_4" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
          <path d="M3.1224 11.2406H1.87344" id="Vector_5" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
        </g>
        <defs>
          <clipPath id="clip0_0_41">
            <rect fill="white" height="14.9875" width="14.9875" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#e8e9e2] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[31.986px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#131927] text-[14px] whitespace-nowrap">Let AI choose</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">Best creators for your level</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[139.962px]" data-name="Container">
      <Paragraph6 />
      <Paragraph7 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Text() {
  return <div className="absolute bg-white left-[2px] rounded-[33737400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[19.999px] top-[2px]" data-name="Text" />;
}

function Button2() {
  return (
    <div className="bg-[#d2d5db] h-[23.989px] relative rounded-[33737400px] shrink-0 w-[43.989px]" data-name="Button">
      <Text />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-center justify-between p-[14px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Container5 />
      <Button2 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[20px] pb-[20px] right-[20px] top-[353.48px]" data-name="Container:margin">
      <Container4 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131927] text-[16px] tracking-[-0.064px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Creator name
      </p>
    </div>
  );
}

function LabelMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Label:margin">
      <Label />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f7f7f7] content-stretch flex flex-col h-[47.995px] items-start justify-center left-0 overflow-clip px-[16px] rounded-[16px] top-0 w-[349.992px]" data-name="Text Input">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] w-full">e.g. Fireship, Kevin Powell, The Primeagen</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[47.991px] relative shrink-0 w-full" data-name="Container">
      <TextInput />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col h-[75.991px] items-start relative shrink-0 w-[349.992px]" data-name="Container">
      <LabelMargin />
      <Container9 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[20px] pb-[20px] right-[20px] top-[440.49px]" data-name="Container:margin">
      <Container8 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#8cb200] content-stretch flex h-[55.991px] items-center justify-center left-0 opacity-40 rounded-[33737400px] top-0 w-[349.992px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#131927] text-[16px] text-center whitespace-nowrap">Build YouTube Roadmap</p>
    </div>
  );
}

function ButtonAlign() {
  return (
    <div className="absolute h-[55.991px] left-[20.93px] top-[649px] w-[349.992px]" data-name="Button:align">
      <Button3 />
    </div>
  );
}

function YouTube() {
  return (
    <div className="absolute h-[852.623px] left-0 overflow-clip top-0 w-[389.99px]" data-name="YouTube">
      <Container1 />
      <Heading />
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[40px] left-[19.93px] text-[#131927] text-[32px] top-[87px] tracking-[-0.096px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Set up your sources
      </p>
      <ParagraphMargin />
      <Paragraph1 />
      <ContainerMargin />
      <ContainerMargin1 />
      <ContainerMargin2 />
      <ButtonAlign />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[852.623px] left-[2.07px] overflow-clip top-[99px] w-[389.99px]" data-name="Container">
      <YouTube />
    </div>
  );
}

function Layout() {
  return (
    <div className="bg-white h-[852.623px] relative shrink-0 w-[394.137px]" data-name="Layout">
      <div className="absolute bg-white h-[59px] left-[0.57px] top-0 w-[393px]" data-name="StatusBar">
        <div className="flex flex-row items-end justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-end justify-center relative size-full">
            <LeftSide />
            <DynamicIsland />
            <RightSide />
          </div>
        </div>
      </div>
      <BackIconBtn />
      <Container />
      <div className="-translate-x-1/2 absolute bg-white bottom-[-0.38px] h-[31px] left-[calc(50%+0.43px)] w-[393px]" data-name="HomeIndicator">
        <div className="-translate-x-1/2 absolute bg-[#131313] bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
      </div>
    </div>
  );
}

export default function SetupNavigatorPwaProject() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Setup Navigator PWA Project">
      <Layout />
    </div>
  );
}