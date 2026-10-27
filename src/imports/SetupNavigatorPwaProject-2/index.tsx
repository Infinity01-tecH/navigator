import svgPaths from "./svg-pfkvgqwnnf";
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

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <StatusBar />
      <BackIconBtn />
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

function Icon() {
  return (
    <div className="relative shrink-0 size-[20.002px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.0022" preserveAspectRatio="none" viewBox="0 0 20.0022 20.0022" width="20.0022">
        <g id="Icon">
          <path d={svgPaths.p2fe5f600} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66604" />
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

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131313] text-[24px] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Sprint Blueprint
      </p>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex gap-[6px] h-[40.002px] items-center pl-[21px] relative shrink-0 w-full" data-name="Heading">
      <Container />
      <Frame />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-name="Header">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[40px] relative shrink-0 text-[#131927] text-[32px] tracking-[-0.096px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Define your sprint
      </p>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[28px] pl-[11px] relative shrink-0 w-full" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] w-[350px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        An intensive short-term plan focused on one concrete outcome.
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col h-[136px] items-start pl-[13px] relative shrink-0 w-full">
      <Header />
      <ParagraphMargin />
    </div>
  );
}

function Number() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        14
      </p>
    </div>
  );
}

function TimePickerComponentNumber() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-[280px] p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number />
    </div>
  );
}

function Number1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        5
      </p>
    </div>
  );
}

function TimePickerComponentNumber1() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-[88px] p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number1 />
    </div>
  );
}

function Number2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
      </p>
    </div>
  );
}

function TimePickerComponentNumber2() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-0 opacity-40 p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number2 />
    </div>
  );
}

function Number3() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[48px] left-[calc(50%+0.5px)] text-[#131313] text-[40px] text-center top-[calc(50%-24px)] tracking-[-0.12px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        7
      </p>
    </div>
  );
}

function NumberText() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Number & Text">
      <div className="bg-[#f9ffe5] relative rounded-[12px] shrink-0" data-name="Time Picker/Component/Number">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center p-[12px] relative size-full">
            <Number3 />
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Duration (days)</p>
      </div>
    </div>
  );
}

function Number4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-[calc(50%+0.5px)] text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        21
      </p>
    </div>
  );
}

function TimePickerComponentNumber3() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-[368px] opacity-40 p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number4 />
    </div>
  );
}

function TimePicker() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Time Picker">
      <TimePickerComponentNumber />
      <TimePickerComponentNumber1 />
      <TimePickerComponentNumber2 />
      <NumberText />
      <TimePickerComponentNumber3 />
    </div>
  );
}

function NumberInput() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex flex-col h-[39.998px] items-start justify-center overflow-clip px-[12px] relative rounded-[16px] shrink-0 w-[95.989px]" data-name="Number Input">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#131927] text-[14px] w-full">7</p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] whitespace-nowrap">custom days</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <NumberInput />
      <Text />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[12px] relative shrink-0 w-[311px]" data-name="Container:margin">
      <Container1 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col gap-[35px] h-[242.998px] items-center justify-center py-[30px] relative shrink-0 w-full" data-name="Container:margin">
      <TimePicker />
      <ContainerMargin1 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        What do you want to achieve?
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

function TextArea() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex flex-col h-[116.915px] items-start overflow-clip px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-[349.992px]" data-name="Text Area">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] w-full">e.g. Build and deploy a working REST API with Node.js and Express by the end of the sprint.</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#8cb200] content-stretch flex h-[55.991px] items-center justify-center opacity-40 relative rounded-[33737400px] shrink-0 w-[349.992px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#131927] text-[16px] text-center whitespace-nowrap">Build Sprint Blueprint</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-start relative shrink-0 w-full" data-name="Container">
      <TextArea />
      <Button />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col h-[313.372px] items-start relative shrink-0" data-name="Container">
      <LabelMargin />
      <Container3 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="content-stretch flex flex-col h-[364px] items-center justify-end pb-[24px] relative shrink-0 w-full" data-name="Container:margin">
      <Container2 />
    </div>
  );
}

function Sprint() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] h-[784px] items-start left-[2px] overflow-clip py-[27px] top-[89.5px] w-[390px]" data-name="Sprint">
      <Heading />
      <Frame1 />
      <ContainerMargin />
      <ContainerMargin2 />
    </div>
  );
}

export default function SetupNavigatorPwaProject() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[743px] items-center justify-center relative size-full" data-name="Setup Navigator PWA Project">
      <Frame2 />
      <HomeIndicator />
      <Sprint />
    </div>
  );
}