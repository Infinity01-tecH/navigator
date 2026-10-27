import svgPaths from "./svg-gu15avigsp";
type DividerDefaultProps = {
  className?: string;
  darkMode?: "False";
};

function DividerDefault({ className, darkMode = "False" }: DividerDefaultProps) {
  return (
    <div className={className || "relative w-[361px]"}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start py-[3px] relative size-full">
          <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-full" />
        </div>
      </div>
    </div>
  );
}
type NotificationToggleComponentKnobProps = {
  className?: string;
  darkMode?: boolean;
};

function NotificationToggleComponentKnob({ className, darkMode = false }: NotificationToggleComponentKnobProps) {
  const isDarkMode = darkMode;
  return (
    <div className={className || "relative size-[20px]"}>
      <div className="absolute inset-[-45%_-60%_-75%_-60%]">
        <svg className="block size-full" fill="none" height="44" preserveAspectRatio="none" viewBox="0 0 44 44" width="44">
          <g filter={isDarkMode ? "url(#filter0_dd_0_59)" : "url(#filter0_dd_0_61)"} id="Knob">
            <path clipRule="evenodd" d={svgPaths.p1e44ce00} fill="white" fillRule="evenodd" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44" id={isDarkMode ? "filter0_dd_0_59" : "filter0_dd_0_61"} width="44" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="0.5" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result={isDarkMode ? "effect1_dropShadow_0_59" : "effect1_dropShadow_0_61"} />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
              <feBlend in2={isDarkMode ? "effect1_dropShadow_0_59" : "effect1_dropShadow_0_61"} mode="normal" result={isDarkMode ? "effect2_dropShadow_0_59" : "effect2_dropShadow_0_61"} />
              <feBlend in="SourceGraphic" in2={isDarkMode ? "effect2_dropShadow_0_59" : "effect2_dropShadow_0_61"} mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
type NotificationToggleProps = {
  className?: string;
  darkMode?: "False";
  turnOn?: boolean;
};

function NotificationToggle({ className, darkMode = "False", turnOn = true }: NotificationToggleProps) {
  const isNotTurnOnAndFalse = !turnOn && darkMode === "False";
  return (
    <div className={className || "h-[26px] relative w-[40px]"}>
      <div className="absolute h-[26px] right-0 top-0 w-[40px]" data-name="Background">
        <svg className="absolute block inset-0 size-full" fill="none" height="26" preserveAspectRatio="none" viewBox="0 0 40 26" width="40">
          <path clipRule="evenodd" d={svgPaths.p2b57fa00} fill={isNotTurnOnAndFalse ? "#F8F8F8" : "#8CB200"} fillRule="evenodd" id="Background" />
        </svg>
      </div>
      <NotificationToggleComponentKnob className={`-translate-y-1/2 absolute size-[20px] top-1/2 ${isNotTurnOnAndFalse ? "right-[17px]" : "right-[3px]"}`} darkMode={isNotTurnOnAndFalse ? true : undefined} />
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

function Container() {
  return (
    <div className="absolute h-[16.068px] left-[12px] top-[7px] w-[36.298px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.068" preserveAspectRatio="none" viewBox="0 0 36.2983 16.068" width="36.2983">
        <g id="Container">
          <path d="M4 7L8 11L12 7" id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return <div className="absolute h-[6px] left-[5px] top-[9.03px] w-[10px]" data-name="Icon" />;
}

function Container1() {
  return (
    <div className="absolute h-[24.068px] left-[48.3px] top-[4px] w-[20px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-[#f3f4f6] h-[30px] left-[341px] rounded-[12px] top-[470px] w-[39px]" data-name="Dropdown">
      <Container />
      <Container1 />
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

function ArrowTitle() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Arrow & Title">
      <Filled className="bg-white relative rounded-[12px] shrink-0" />
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Settings
      </p>
    </div>
  );
}

function IconBtnTitleDivider() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] px-[16px] relative shrink-0 w-full" data-name="Icon Btn & Title & Divider">
      <ArrowTitle />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col h-[115px] items-start relative shrink-0 w-[420px]">
      <StatusBar />
      <IconBtnTitleDivider />
    </div>
  );
}

function Headline() {
  return (
    <div className="relative shrink-0 w-full" data-name="Headline">
      <div className="content-stretch flex items-start px-[16px] relative size-full">
        <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          Account
        </p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between px-[16px] py-[4px] relative shrink-0 text-[#131313] w-[393px] whitespace-nowrap">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        User Name
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-right tracking-[-0.048px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Text
      </p>
    </div>
  );
}

function TableViewsComponentTableItem() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Table Views/Component/Table Item">
      <Frame1 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="h-[32.905px] mr-[-9px] relative shrink-0 w-[32px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="32.9055" preserveAspectRatio="none" viewBox="0 0 32 32.9055" width="32">
        <g id="Group">
          <path d={svgPaths.p25ad1e80} fill="#F7D67C" id="Vector" />
          <g id="hair-variant30-545fac91">
            <path d={svgPaths.p296a5e00} fill="black" id="Vector_2" />
            <g id="head-variant03-545fac91">
              <path d={svgPaths.p35e1b00} fill="black" id="Vector_3" />
              <path d={svgPaths.p18002000} fill="white" id="Vector_4" />
              <path d={svgPaths.p3d268300} fill="black" id="Vector_5" />
              <g id="eyes-variant23-545fac91">
                <path d={svgPaths.p39e32200} fill="black" id="Vector_6" />
              </g>
              <g id="eyebrows-variant08-545fac91">
                <path d={svgPaths.p3b043f00} fill="black" id="Vector_7" />
              </g>
              <g id="nose-variant02-545fac91">
                <path d={svgPaths.p2fd34c00} fill="black" id="Vector_8" />
              </g>
              <g id="mouth-happy07-545fac91">
                <path d={svgPaths.p3e4aae00} fill="black" id="Vector_9" />
              </g>
            </g>
            <path d={svgPaths.p39259970} fill="black" id="Vector_10" />
          </g>
          <g id="hairAccessories-flowers-545fac91">
            <path d={svgPaths.p35166b80} fill="black" id="Vector_11" />
            <path d={svgPaths.p7817500} fill="white" id="Vector_12" />
            <path d={svgPaths.p14f87800} fill="black" id="Vector_13" />
            <path d={svgPaths.p33f3cf00} fill="white" id="Vector_14" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[6.743px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="6.74263" preserveAspectRatio="none" viewBox="0 0 6.74263 6.74263" width="6.74263">
        <g clipPath="url(#clip0_0_63)" id="Icon">
          <path d={svgPaths.p321d4d00} id="Vector" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.561886" />
          <path d={svgPaths.p22a5c120} id="Vector_2" stroke="#6D717F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.561886" />
        </g>
        <defs>
          <clipPath id="clip0_0_63">
            <rect fill="white" height="6.74263" width="6.74263" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-white border-[#e5e7ea] border-[0.754px] border-solid content-stretch flex items-center justify-center relative rounded-[25314166px] shrink-0 size-[12px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute content-stretch flex items-end justify-center left-[345px] top-[-2.03px]">
      <Group />
      <Container2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[220px] items-center px-[16px] py-[3px] relative shrink-0 w-[393px]">
      <Frame40 />
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Avatar
      </p>
    </div>
  );
}

function TableViewsComponentTableItem1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Table Views/Component/Table Item">
      <Frame2 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between px-[16px] py-[4px] relative shrink-0 text-[#131313] w-[393px] whitespace-nowrap">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Bio
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-right tracking-[-0.048px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Write a little about yourself
      </p>
    </div>
  );
}

function TableViewsComponentTableItem2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Table Views/Component/Table Item">
      <Frame3 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between px-[16px] py-[4px] relative shrink-0 text-[#131313] w-[393px] whitespace-nowrap">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Email
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-right tracking-[-0.048px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        username@gmail.com
      </p>
    </div>
  );
}

function TableViewsComponentTableItem3() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Table Views/Component/Table Item">
      <Frame4 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between px-[16px] py-[4px] relative shrink-0 text-[#131313] w-[393px] whitespace-nowrap">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Pro skill
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-right tracking-[-0.048px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Brand Identity Design
      </p>
    </div>
  );
}

function TableViewsComponentTableItem4() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Table Views/Component/Table Item">
      <Frame5 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function TableItems() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Table Items">
      <TableViewsComponentTableItem />
      <TableViewsComponentTableItem1 />
      <TableViewsComponentTableItem2 />
      <TableViewsComponentTableItem3 />
      <TableViewsComponentTableItem4 />
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[280px] items-start py-[8px] relative shrink-0 w-[408px]" data-name="Account Settings">
      <Headline />
      <TableItems />
    </div>
  );
}

function Headline1() {
  return (
    <div className="content-stretch flex h-[24px] items-start px-[16px] relative shrink-0 w-full" data-name="Headline">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Sharing
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[30px] relative shrink-0 w-[393px]">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[15px] text-[#131313] text-[18px] top-[3px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Friends
      </p>
    </div>
  );
}

function TableViewsComponentTableItem5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Table Views/Component/Table Item">
      <Frame6 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[16.068px] left-[12px] top-[7px] w-[36.298px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.068" preserveAspectRatio="none" viewBox="0 0 36.2983 16.068" width="36.2983">
        <g id="Container">
          <path d="M4 7L8 11L12 7" id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return <div className="absolute h-[6px] left-[5px] top-[9.03px] w-[10px]" data-name="Icon" />;
}

function Container4() {
  return (
    <div className="absolute h-[24.068px] left-[48.3px] top-[4px] w-[20px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute bg-[#f3f4f6] h-[30px] left-[340px] rounded-[12px] top-0 w-[39px]" data-name="Dropdown">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[30px] relative shrink-0 w-[393px]">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[15px] text-[#131313] text-[18px] top-[3px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Streak Partner
      </p>
      <Dropdown1 />
    </div>
  );
}

function TableViewsComponentTableItem6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Table Views/Component/Table Item">
      <Frame7 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function SharingSettings() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[128px] items-start relative shrink-0 w-[394px]" data-name="Sharing settings">
      <Headline1 />
      <TableViewsComponentTableItem5 />
      <TableViewsComponentTableItem6 />
    </div>
  );
}

function Headline2() {
  return (
    <div className="content-stretch flex h-[24px] items-start px-[16px] relative shrink-0 w-full" data-name="Headline">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        General
      </p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[3px] relative shrink-0 w-[393px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Notification
      </p>
      <NotificationToggle className="h-[26px] relative shrink-0 w-[40px]" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between px-[16px] py-[4px] relative shrink-0 text-[#131313] w-[393px] whitespace-nowrap">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Interface language
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-right tracking-[-0.048px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        English
      </p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[3px] relative shrink-0 w-[393px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Dark Mode
      </p>
      <div className="h-[26px] relative shrink-0 w-[40px]" data-name="Notification Toggle">
        <div className="absolute h-[26px] right-0 top-0 w-[40px]" data-name="Background">
          <svg className="absolute block inset-0 size-full" fill="none" height="26" preserveAspectRatio="none" viewBox="0 0 40 26" width="40">
            <path clipRule="evenodd" d={svgPaths.p2b57fa00} fill="#F8F8F8" fillRule="evenodd" id="Background" />
          </svg>
        </div>
        <NotificationToggleComponentKnob className="-translate-y-1/2 absolute right-[17px] size-[20px] top-1/2" darkMode />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[16.068px] left-[12px] overflow-clip top-[7px] w-[36.298px]" data-name="Container">
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#131927] text-[14px] top-[-0.47px] whitespace-nowrap">1.5h</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[6px] left-[5px] top-[9.03px] w-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 10 6" width="10">
        <g id="Icon">
          <path d="M1 1L5 5L9 1" id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[24.068px] left-[48.3px] top-[4px] w-[20px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="bg-[#f3f4f6] h-[30px] relative rounded-[12px] shrink-0 w-[72px]" data-name="Dropdown">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[3px] relative shrink-0 w-[393px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Daily time budget
      </p>
      <Dropdown2 />
    </div>
  );
}

function TableViewsComponentTableItem7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 top-[144px]" data-name="Table Views/Component/Table Item">
      <Frame11 />
      <DividerDefault className="relative shrink-0 w-[361px]" />
    </div>
  );
}

function TableItems1() {
  return (
    <div className="h-[188px] relative shrink-0 w-full" data-name="Table Items">
      <div className="absolute left-0 top-0" data-name="Table Views/Component/Table Item">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Frame8 />
            <DividerDefault className="relative shrink-0 w-[361px]" />
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-[48px]" data-name="Table Views/Component/Table Item">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Frame9 />
            <DividerDefault className="relative shrink-0 w-[361px]" />
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-[96px]" data-name="Table Views/Component/Table Item">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center relative size-full">
            <Frame10 />
            <DividerDefault className="relative shrink-0 w-[361px]" />
          </div>
        </div>
      </div>
      <TableViewsComponentTableItem7 />
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[236px] items-start py-[8px] relative shrink-0 w-[394px]" data-name="General Settings">
      <Headline2 />
      <TableItems1 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[15px] relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] min-w-px relative text-[#d53f36] text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Danger Zone
      </p>
    </div>
  );
}

function LogOut() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Log out">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[16px] text-[#d53f36] text-[18px] top-0 tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Reset My Progress
      </p>
    </div>
  );
}

function Frame29() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-[358px]" />;
}

function LogOut1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Log out">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[16px] text-[#d53f36] text-[18px] top-0 tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Delete Roadmap
      </p>
    </div>
  );
}

function Frame30() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-[358px]" />;
}

function Frame31() {
  return <div className="bg-[#f2f2f2] col-1 h-[2px] ml-[13px] mt-[29px] relative row-1 w-[358px]" />;
}

function LogOut2() {
  return (
    <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[393px]" data-name="Log out">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[16px] text-[#d53f36] text-[18px] top-0 tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Sign out
      </p>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame31 />
      <LogOut2 />
    </div>
  );
}

function Frame32() {
  return <div className="bg-[#f2f2f2] col-1 h-[2px] ml-[13px] mt-[29px] relative row-1 w-[358px]" />;
}

function LogOut3() {
  return (
    <div className="col-1 h-[24px] ml-0 mt-0 relative row-1 w-[393px]" data-name="Log out">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-[16px] text-[#d53f36] text-[18px] top-0 tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Delete Account
      </p>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame32 />
      <LogOut3 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-full">
      <LogOut />
      <Frame29 />
      <LogOut1 />
      <Frame30 />
      <Group1 />
      <Group2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[13px] h-[199px] items-start pt-[13px] relative shrink-0 w-[394px]" data-name="Frame">
      <Frame39 />
      <Frame38 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between px-[16px] py-[4px] relative shrink-0 text-[#131313] w-[393px] whitespace-nowrap">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[18px] tracking-[-0.054px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Support
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] text-right tracking-[-0.048px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Contact us
      </p>
    </div>
  );
}

function Frame33() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-full" />;
}

function DividerDefault1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip py-[3px] relative shrink-0 w-[361px]" data-name="Divider Default">
      <Frame33 />
    </div>
  );
}

function TableViewsComponentTableItem8() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-center relative shrink-0 w-full" data-name="Table Views/Component/Table Item">
      <Frame12 />
      <DividerDefault1 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[39px] h-[210px] items-end justify-end mr-[-149px] relative shrink-0 w-[200px]">
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame19() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[210px] items-start relative shrink-0 w-[200px]">
      <Frame17 />
      <Frame18 />
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Pattern() {
  return (
    <div className="content-stretch flex items-center opacity-30 relative shrink-0" data-name="Pattern">
      <Frame35 />
      <Frame34 />
    </div>
  );
}

function Version() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[166px]" data-name="Version">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[29px] relative shrink-0 text-[#d7d7d7] text-[21.75px] text-center tracking-[-0.3625px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        31.10.3(906071)
      </p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame24() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[39px] h-[210px] items-end justify-end mr-[-149px] relative shrink-0 w-[200px]">
      <Frame21 />
      <Frame22 />
      <Frame23 />
      <Frame24 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame27() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="h-[16.182px] relative shrink-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Frame 12">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[210px] items-start relative shrink-0 w-[200px]">
      <Frame25 />
      <Frame26 />
      <Frame27 />
      <Frame28 />
    </div>
  );
}

function Pattern1() {
  return (
    <div className="content-stretch flex items-center opacity-30 relative shrink-0" data-name="Pattern">
      <Frame36 />
      <Frame37 />
    </div>
  );
}

function PremiumCard() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex gap-[4px] h-[55px] items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Premium Card">
      <Pattern />
      <Version />
      <Pattern1 />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="content-stretch flex flex-col h-[21px] items-start px-[129px] py-[8px] relative shrink-0 w-full" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5px] relative rounded-[100px] shrink-0 w-full" data-name="Home Indicator" />
    </div>
  );
}

export default function SettingsScreenFalse() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] items-center relative size-full" data-name="Settings Screen/False">
      <Dropdown />
      <Frame41 />
      <AccountSettings />
      <SharingSettings />
      <GeneralSettings />
      <Frame />
      <TableViewsComponentTableItem8 />
      <PremiumCard />
      <HomeIndicator />
    </div>
  );
}