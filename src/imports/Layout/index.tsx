import svgPaths from "./svg-xujsplzxtl";
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

function TopBar() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Top Bar">
      <StatusBar />
      <BackIconBtn />
    </div>
  );
}

function Subheader() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Subheader">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[40px] relative shrink-0 text-[#131927] text-[32px] tracking-[-0.096px] w-[408px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        How much time can you commit
      </p>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-start pb-[28px] relative shrink-0 w-full" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] w-[350px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        We will calibrate the roadmap to fit your actual life.
      </p>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[13px] items-start relative shrink-0 w-[408px]" data-name="Header">
      <Subheader />
      <ParagraphMargin />
    </div>
  );
}

function Number() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
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
        1
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
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-[calc(50%+0.5px)] text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        0.5
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
        2
      </p>
    </div>
  );
}

function TimePickerComponentNumber3() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[12px] shrink-0" data-name="Time Picker/Component/Number">
      <Number3 />
    </div>
  );
}

function NumberText() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[96px]" data-name="Number & Text">
      <TimePickerComponentNumber3 />
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] min-w-full relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] w-[min-content]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Hours per day</p>
      </div>
      <div className="absolute flex h-[44px] items-center justify-center left-[64px] top-[15px] w-px">
        <div className="flex-none rotate-[88.7deg]">
          <div className="h-0 relative w-[44.011px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 44.0114 1" width="44.0114">
                <line id="Line 1" stroke="black" x2="44.0114" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Number4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        4
      </p>
    </div>
  );
}

function TimePickerComponentNumber4() {
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
      <TimePickerComponentNumber4 />
    </div>
  );
}

function Number5() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        6
      </p>
    </div>
  );
}

function TimePickerComponentNumber5() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-[280px] p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number5 />
    </div>
  );
}

function Number6() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        4
      </p>
    </div>
  );
}

function TimePickerComponentNumber6() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-[88px] p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number6 />
    </div>
  );
}

function Number7() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
      </p>
    </div>
  );
}

function TimePickerComponentNumber7() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-0 opacity-40 p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number7 />
    </div>
  );
}

function Number8() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[48px] left-[calc(50%+0.5px)] text-[#131313] text-[40px] text-center top-[calc(50%-24px)] tracking-[-0.12px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        5
      </p>
    </div>
  );
}

function NumberText1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Number & Text">
      <div className="bg-[#f9ffe5] relative rounded-[12px] shrink-0" data-name="Time Picker/Component/Number">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center p-[12px] relative size-full">
            <Number8 />
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Days per week</p>
      </div>
    </div>
  );
}

function Number9() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Number">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] left-1/2 text-[#131313] text-[24px] text-center top-[calc(50%-16px)] tracking-[-0.072px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        7
      </p>
    </div>
  );
}

function TimePickerComponentNumber8() {
  return (
    <div className="absolute bg-[#f8f8f8] content-stretch flex flex-col items-center justify-center left-[368px] opacity-40 p-[12px] rounded-[12px] top-[8px]" data-name="Time Picker/Component/Number">
      <Number9 />
    </div>
  );
}

function TimePicker1() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Time Picker">
      <TimePickerComponentNumber5 />
      <TimePickerComponentNumber6 />
      <TimePickerComponentNumber7 />
      <NumberText1 />
      <TimePickerComponentNumber8 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="content-stretch flex flex-col gap-[43px] items-start py-[23px] relative shrink-0 w-[403px]" data-name="Container:margin">
      <TimePicker />
      <TimePicker1 />
    </div>
  );
}

function Sprint() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip pb-[6px] pl-[24px] pt-[18px] relative shrink-0 w-full" data-name="Sprint">
      <Header />
      <ContainerMargin1 />
    </div>
  );
}

function Label() {
  return <div className="h-[24px] relative shrink-0 w-full" data-name="Label" />;
}

function LabelMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Label:margin">
      <Label />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d717f] text-[14px] tracking-[-0.042px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Weekly learning time
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131927] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        7.5h
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d717f] text-[14px] tracking-[-0.042px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Estimated completion
      </p>
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131927] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        9+ weeks
      </p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[30px] items-center justify-between pt-[10px] relative shrink-0 w-[315.995px]" data-name="Container">
      <Text2 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d717f] text-[14px] tracking-[-0.042px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Total sessions
      </p>
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131927] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        ~42 sessions
      </p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[30px] items-center justify-between pt-[10px] relative shrink-0 w-[315.995px]" data-name="Container">
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col h-[92px] items-start pt-[12px] relative shrink-0 w-[315.995px]" data-name="Container">
      <Container3 />
      <Container4 />
      <Container5 />
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex flex-col h-[130px] items-start overflow-clip px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-[350px]" data-name="Text Area">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#9ea2ae] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Timeline Estimate
      </p>
      <Container2 />
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

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[27px] items-start py-[27px] relative shrink-0 w-full" data-name="Container">
      <TextArea />
      <Button />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col h-[240px] items-center justify-center relative shrink-0" data-name="Container">
      <LabelMargin />
      <Container1 />
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

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[70px] items-center relative shrink-0 w-full">
      <Container />
      <HomeIndicator />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[917px] items-start relative shrink-0 w-[394px]" data-name="Container:margin">
      <TopBar />
      <Sprint />
      <Frame />
    </div>
  );
}

export default function Layout() {
  return (
    <div className="bg-white content-stretch flex items-start justify-center relative size-full" data-name="Layout">
      <ContainerMargin />
    </div>
  );
}