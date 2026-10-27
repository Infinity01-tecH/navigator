import svgPaths from "./svg-hsrnd1n8h7";
import { motion } from "motion/react";
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
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <div className="bg-white h-[59px] relative shrink-0 w-full" data-name="StatusBar">
        <div className="flex flex-row items-end justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-end justify-center relative size-full">
            <LeftSide />
            <DynamicIsland />
            <RightSide />
          </div>
        </div>
      </div>
      <BackIconBtn />
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
    <div className="content-stretch flex items-center relative shrink-0" data-name="Logo & Title">
      <Frame />
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131313] text-[24px] text-center tracking-[-0.072px] w-[144px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Navigator
      </p>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center py-[10px] relative rounded-[16px] shrink-0 w-[169px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[13px] text-center tracking-[0.2px] whitespace-nowrap">Sign in</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#131313] content-stretch flex flex-col h-full items-center justify-center py-[10px] relative rounded-[16px] shrink-0 w-[169px]" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[13px] text-center text-white tracking-[0.2px] whitespace-nowrap">Sign in</p>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex h-[47px] items-start p-[4px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-[361px]">
      <LogoTitle />
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[32px] min-w-full relative shrink-0 text-[#131313] text-[24px] tracking-[-0.072px] w-[min-content]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Sign in to continue from where you left off
      </p>
      <Container />
    </div>
  );
}

function Description() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Description">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-0 text-[#131313] text-[12px] top-[8px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[16px]">Username</p>
      </div>
    </div>
  );
}

function InputText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="input-text">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d7d7d7] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Username</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pr-[16px] py-[10px] relative size-full">
          <InputText />
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function Email() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[361px]" data-name="Email">
      <Description />
      <Input />
    </div>
  );
}

function Description1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center pr-[298px] relative shrink-0" data-name="Description">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#131313] text-[12px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[16px]">Password</p>
      </div>
    </div>
  );
}

function InputText1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="input-text">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d7d7d7] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Enter password</p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pr-[16px] py-[10px] relative size-full">
          <InputText1 />
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex h-[44px] items-center pl-[16px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Input">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
      <Content1 />
    </div>
  );
}

function Email1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Email">
      <Description1 />
      <Input1 />
    </div>
  );
}

function Description2() {
  return (
    <div className="content-stretch flex items-center justify-end pl-[111px] relative shrink-0 w-full" data-name="Description">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8cb200] text-[12px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[16px]">Forgot Password</p>
      </div>
    </div>
  );
}

function Frame1() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-full" />;
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip py-[3px] relative">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-full" />;
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip py-[3px] relative">
      <Frame4 />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center pl-[16px] pr-[24px] py-[12px] relative shrink-0" data-name="state-layer">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Google">
        <div className="absolute inset-[12.73%_14.65%_12.86%_12.59%]" data-name="coolicon">
          <svg className="absolute block inset-0 size-full" fill="none" height="17.8581" preserveAspectRatio="none" viewBox="0 0 17.4642 17.8581" width="17.4642">
            <path d={svgPaths.pc4ec200} fill="#111112" id="coolicon" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#111112] text-[20px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Sign in with Google</p>
      </div>
    </div>
  );
}

function SocialMediaButtons() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Social Media Buttons">
      <div className="bg-[#f9ffe5] relative rounded-[12px] shrink-0 w-[361px]" data-name="Social Button">
        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <StateLayer />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start pl-[25px] relative shrink-0 w-full">
      <Email />
      <Email1 />
      <Description2 />
      <div className="bg-[#8cb200] relative rounded-[12px] shrink-0 w-[361px]" data-name="Primary">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[20px] py-[12px] relative size-full">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white tracking-[-0.408px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100', fontFeatureSettings: '"case" 1' }}>
              <p className="leading-[24px]">Sign in</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-[361px]" data-name="Divider With condition">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[16px] items-center relative size-full">
            <Frame2 />
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d7d7d7] text-[16px] tracking-[-0.048px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">or</p>
            </div>
            <Frame3 />
          </div>
        </div>
      </div>
      <SocialMediaButtons />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[35px] items-center relative shrink-0 w-[393px]">
      <Frame7 />
      <Frame5 />
      <Frame6 />
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d7d7d7] text-[14px] text-center tracking-[-0.042px] w-[361px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">By joining, I declare that I have read and accent the Terms and Privacy Policy</p>
      </div>
    </div>
  );
}

export default function SignUpScreenEmailDarkMode() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[87px] items-start relative size-full" data-name="Sign Up Screen - Email/Dark Mode4">
      <Frame8 />
      <HomeIndicator className="bg-white h-[34px] relative shrink-0 w-[393px]" />
    </div>
  );
}