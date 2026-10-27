import svgPaths from "./svg-dsft6oh16u";
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
    <div className="absolute content-stretch flex items-center justify-between left-0 px-[16px] top-[59px] w-[393px]" data-name="Back & Icon Btn">
      <Filled className="bg-white relative rounded-[12px] shrink-0" />
      <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
        </div>
      </div>
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

function LogoTitle() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-[19.93px] top-[20px]" data-name="Logo & Title">
      <Frame />
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131313] text-[24px] text-center tracking-[-0.072px] w-[115px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Navigator
      </p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[69px] left-[20px] top-[105px] w-[349.99px]" data-name="Heading 1">
      <div className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[0] left-[-0.07px] text-[#131927] text-[32px] top-[-21px] tracking-[-0.096px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[40px] mb-0">What do you want</p>
        <p className="leading-[40px]">to learn?</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[44px] left-[20px] top-[174px] w-[349.99px]" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#131313] text-[16px] top-0 tracking-[-0.048px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Build a personalized roadmap in 3 minutes.
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[25px] left-[20px] top-[231px] w-[349.99px]" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[-0.07px] text-[#131313] text-[18px] top-[-11px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Learning type
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[17.02px] top-[16.72px] w-[159.894px]" data-name="Paragraph">
      <p className="[word-break:break-word] capitalize font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.683px] not-italic relative shrink-0 text-[#131927] text-[15.878px] whitespace-nowrap">skill</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[21.549px] items-start left-[17.02px] pt-[2.268px] top-[39.4px] w-[159.894px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18.713px] not-italic relative shrink-0 text-[#9ea2ae] text-[12.476px] whitespace-nowrap">e.g. React, Python</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#f9ffe5] h-[77.667px] left-0 rounded-[18.146px] top-0 w-[193.926px]" data-name="Button">
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[11.28px] top-[11.08px] w-[105.997px]" data-name="Paragraph">
      <p className="[word-break:break-word] capitalize font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.035px] not-italic relative shrink-0 text-[#394050] text-[10.525px] whitespace-nowrap">subject</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[14.283px] items-start left-[11.28px] pt-[1.504px] top-[26.12px] w-[105.997px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[12.404px] not-italic relative shrink-0 text-[#9ea2ae] text-[8.269px] whitespace-nowrap">e.g. Computer Science</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#f7f7f7] h-[68.481px] left-[204.93px] rounded-[12.028px] top-[5px] w-[128.554px]" data-name="Button">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[68.481px] left-0 right-0 top-0" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="absolute h-[88.481px] left-[20px] right-[20px] top-[256px]" data-name="Container:margin">
      <Container1 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[25px] left-[20px] top-[364.48px] w-[349.99px]" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-0 text-[#131313] text-[18px] top-0 tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Mode
      </p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16.998px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.9984" preserveAspectRatio="none" viewBox="0 0 16.9984 16.9984" width="16.9984">
        <g id="Icon">
          <path d={svgPaths.p302f8d80} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41653" />
          <path d="M10.624 4.08245V14.7064" id="Vector_2" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41653" />
          <path d="M6.3744 2.29195V12.916" id="Vector_3" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41653" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#8cb200] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#131927] text-[14px] whitespace-nowrap">Full Roadmap</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex flex-col h-[19px] items-start pt-[2px] relative shrink-0 w-[242px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">Personalized multi-phase curriculum</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[242.031_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[8.986px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.98623" preserveAspectRatio="none" viewBox="0 0 8.98623 8.98623" width="8.98623">
        <g id="Icon">
          <path d={svgPaths.p2774be80} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.748852" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#8cb200] border-[#8cb200] border-[1.005px] border-solid content-stretch flex items-center justify-center relative rounded-[33737400px] shrink-0 size-[17.988px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#f8fde7] content-stretch flex gap-[12px] items-center left-0 p-[14px] rounded-[16px] top-0 w-[349.992px]" data-name="Button">
      <Container3 />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16.998px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.9984" preserveAspectRatio="none" viewBox="0 0 16.9984 16.9984" width="16.9984">
        <g clipPath="url(#clip0_0_54)" id="Icon">
          <path d={svgPaths.p3aea1100} id="Vector" stroke="#767676" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41653" />
        </g>
        <defs>
          <clipPath id="clip0_0_54">
            <rect fill="white" height="16.9984" width="16.9984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#e8e9e2] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] whitespace-nowrap">Sprint Blueprint</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex flex-col h-[19px] items-start pt-[2px] relative shrink-0 w-[242px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">Intensive 1–4 week focused plan</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[242.031_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph9 />
      <Paragraph10 />
    </div>
  );
}

function Container8() {
  return <div className="border-[#d2d5db] border-[1.005px] border-solid relative rounded-[33737400px] shrink-0 size-[17.988px]" data-name="Container" />;
}

function Button3() {
  return (
    <div className="absolute bg-[#f7f7f7] content-stretch flex gap-[12px] items-center left-0 p-[14px] rounded-[16px] top-[77.01px] w-[349.992px]" data-name="Button">
      <Container6 />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16.998px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.9984" preserveAspectRatio="none" viewBox="0 0 16.9984 16.9984" width="16.9984">
        <g id="Icon">
          <path d={svgPaths.p1909c600} id="Vector" stroke="#767676" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41653" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#e8e9e2] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[35.992px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] whitespace-nowrap">YouTube-Based</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex flex-col h-[19px] items-start pt-[2px] relative shrink-0 w-[242px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">Built around creators you already trust</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[242.031_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Container11() {
  return <div className="border-[#d2d5db] border-[1.005px] border-solid relative rounded-[33737400px] shrink-0 size-[17.988px]" data-name="Container" />;
}

function Button4() {
  return (
    <div className="absolute bg-[#f7f7f7] content-stretch flex gap-[12px] items-center left-0 p-[14px] rounded-[16px] top-[154.02px] w-[349.992px]" data-name="Button">
      <Container9 />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[243.033px] left-[20px] top-[396.48px] w-[349.99px]" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[25px] items-start left-[20px] pb-[8px] top-[639.51px] w-[349.99px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Skill
      </p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[14px] size-[14.988px] top-[16.5px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14.9875" preserveAspectRatio="none" viewBox="0 0 14.9875 14.9875" width="14.9875">
        <g id="Icon">
          <path d={svgPaths.p3dcae980} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
          <path d={svgPaths.pc672c80} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24896" />
        </g>
      </svg>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[47.995px] items-start justify-center left-0 overflow-clip pl-[40px] pr-[16px] rounded-[16px] top-0 w-[349.992px]" data-name="Text Input">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#9ea2ae] text-[14px] w-full">e.g. React Development</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[63.995px] left-[20px] right-[20px] top-[664.51px]" data-name="Container">
      <Icon4 />
      <TextInput />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#8cb200] content-stretch flex h-[55.991px] items-center justify-center opacity-40 relative rounded-[1000px] shrink-0 w-[349.992px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#131927] text-[16px] text-center whitespace-nowrap">Build My Roadmap</p>
    </div>
  );
}

function ButtonAlign() {
  return (
    <div className="absolute content-stretch flex flex-col h-[112.115px] items-start justify-end left-[20px] top-[688.51px]" data-name="Button:align">
      <Button5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[10.997px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.9971" preserveAspectRatio="none" viewBox="0 0 10.9971 10.9971" width="10.9971">
        <g clipPath="url(#clip0_0_42)" id="Icon">
          <path d={svgPaths.pb39e480} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916425" />
          <path d={svgPaths.p2e798700} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916425" />
        </g>
        <defs>
          <clipPath id="clip0_0_42">
            <rect fill="white" height="10.9971" width="10.9971" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[28px] items-center justify-center left-[20px] pt-[12px] top-[800.62px] w-[349.99px]" data-name="Paragraph">
      <Icon5 />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#9ea2ae] text-[12px] text-center whitespace-nowrap">Takes about 3 minutes</p>
    </div>
  );
}

function Start() {
  return (
    <div className="absolute h-[852.623px] left-0 overflow-clip top-0 w-[389.99px]" data-name="Start">
      <LogoTitle />
      <Heading />
      <Paragraph />
      <Paragraph1 />
      <ContainerMargin />
      <Paragraph6 />
      <Container2 />
      <Paragraph13 />
      <Container12 />
      <ButtonAlign />
      <Paragraph14 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[852.623px] left-[2.07px] overflow-clip top-0 w-[389.99px]" data-name="Container">
      <Start />
    </div>
  );
}

function Layout() {
  return (
    <div className="-translate-x-1/2 absolute bg-white h-[852.623px] left-[calc(50%+0.07px)] top-[99px] w-[394.137px]" data-name="Layout">
      <Container />
      <div className="-translate-x-1/2 absolute bg-white bottom-[-17.38px] h-[31px] left-[calc(50%-0.57px)] w-[393px]" data-name="HomeIndicator">
        <div className="-translate-x-1/2 absolute bg-[#131313] bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-[-17.38px] h-[31px] left-[calc(50%-0.57px)] w-[393px]" data-name="HomeIndicator">
        <div className="-translate-x-1/2 absolute bg-[#131313] bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
      </div>
    </div>
  );
}

export default function SetupNavigatorPwaProject() {
  return (
    <div className="bg-white relative size-full" data-name="Setup Navigator PWA Project">
      <div className="absolute bg-white h-[59px] left-0 top-0 w-[393px]" data-name="StatusBar">
        <div className="flex flex-row items-end justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-end justify-center relative size-full">
            <LeftSide />
            <DynamicIsland />
            <RightSide />
          </div>
        </div>
      </div>
      <BackIconBtn />
      <Layout />
    </div>
  );
}