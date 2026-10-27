import svgPaths from "./svg-xm81me6lhy";
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

function Bg() {
  return (
    <div className="absolute inset-[38.73%_-4.85%_15.01%_-13.49%]" data-name="Bg">
      <svg className="absolute block inset-0 size-full" fill="none" height="394.084" preserveAspectRatio="none" viewBox="0 0 465.087 394.084" width="465.087">
        <g id="Bg">
          <path d={svgPaths.p18088640} fill="#F9FFE6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Info() {
  return (
    <div className="absolute inset-[30.72%_64.28%_61.46%_29.74%]" data-name="Info">
      <svg className="absolute block inset-0 size-full" fill="none" height="35.1001" preserveAspectRatio="none" viewBox="0 0 35.1001 35.1001" width="35.1001">
        <g id="Info">
          <path d={svgPaths.p56c3600} fill="#F8F8F8" id="Bg" stroke="#8CB200" strokeWidth="1.5" />
          <g id="Lamp">
            <path d={svgPaths.p16c5c900} fill="#FFBC00" id="Vector" />
            <path d={svgPaths.p1579a300} fill="white" id="Vector_2" />
            <path d={svgPaths.p7e6f000} fill="white" id="Vector_3" />
            <path d={svgPaths.p29e91950} fill="#131313" id="Vector_4" />
            <path d={svgPaths.p22a96800} fill="#131313" id="Vector_5" />
            <path d={svgPaths.pfeed480} fill="#FFD75D" id="Vector_6" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function BasilMusicSolid() {
  return (
    <div className="absolute aspect-[24/24] left-[62.43%] overflow-clip right-[33.49%] top-[93.75px]" data-name="basil:music-solid">
      <div className="absolute inset-[9.38%_13.54%_9.37%_17.71%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="19.5009" preserveAspectRatio="none" viewBox="0 0 16.4993 19.5009" width="16.4993">
          <path d={svgPaths.p21560f80} fill="black" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Info1() {
  return (
    <div className="absolute contents inset-[18.9%_32.18%_71.36%_60.72%]" data-name="Info">
      <div className="absolute flex inset-[19.57%_32.35%_71.36%_60.72%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(99.5718cqw,0.428155cqh)] rotate-[-89.75deg] w-[hypot(0.428155cqw,-99.5718cqh)]">
          <div className="relative size-full" data-name="Bg">
            <svg className="absolute block inset-0 size-full" fill="none" height="40.502" preserveAspectRatio="none" viewBox="0 0 40.502 40.502" width="40.502">
              <path d={svgPaths.p3a38c300} fill="#131313" id="Bg" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[18.9%_32.18%_72.03%_60.89%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(99.5718cqw,0.428155cqh)] rotate-[-89.75deg] w-[hypot(0.428155cqw,-99.5718cqh)]">
          <div className="relative size-full" data-name="Bg">
            <svg className="absolute block inset-0 size-full" fill="none" height="40.502" preserveAspectRatio="none" viewBox="0 0 40.502 40.502" width="40.502">
              <path d={svgPaths.p3a38c300} fill="#F9FFE6" id="Bg" />
            </svg>
          </div>
        </div>
      </div>
      <BasilMusicSolid />
    </div>
  );
}

function MingcuteAiFill() {
  return (
    <div className="absolute aspect-[24/24] left-[8.42%] overflow-clip right-[87.5%] top-[210.75px]" data-name="mingcute:ai-fill">
      <div className="absolute inset-[8.33%_8.33%_8.73%_8.73%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="19.9058" preserveAspectRatio="none" viewBox="0 0 19.9058 19.9058" width="19.9058">
          <path clipRule="evenodd" d={svgPaths.p2ecff880} fill="black" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Info2() {
  return (
    <div className="absolute contents inset-[44.99%_86.32%_45.74%_6.6%]" data-name="Info">
      <div className="absolute inset-[44.99%_86.32%_45.74%_6.6%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="41.6" preserveAspectRatio="none" viewBox="0 0 41.6 41.6" width="41.6">
          <path d={svgPaths.p2f0bf800} fill="#F8F8F8" id="Bg" stroke="#8CB200" strokeWidth="1.5" />
        </svg>
      </div>
      <MingcuteAiFill />
    </div>
  );
}

function DeviconFigma() {
  return (
    <div className="absolute aspect-[16/16] left-[46.6%] overflow-clip right-[50.68%] top-[111.75px]" data-name="devicon:figma">
      <div className="absolute inset-[67.19%_47.66%_-0.78%_18.75%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="5.375" preserveAspectRatio="none" viewBox="0 0 5.375 5.375" width="5.375">
          <path d={svgPaths.p1d20a0} fill="#0ACF83" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[33.59%_47.66%_32.81%_18.75%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="5.375" preserveAspectRatio="none" viewBox="0 0 5.375 5.375" width="5.375">
          <path d={svgPaths.p3f77ad00} fill="#A259FF" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_47.66%_66.41%_18.75%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="5.375" preserveAspectRatio="none" viewBox="0 0 5.375 5.375" width="5.375">
          <path d={svgPaths.p3f77ad00} fill="#F24E1E" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_14.06%_66.41%_52.34%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="5.375" preserveAspectRatio="none" viewBox="0 0 5.375 5.375" width="5.375">
          <path d={svgPaths.p31049f00} fill="#FF7262" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[33.59%_14.06%_32.81%_52.34%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="5.375" preserveAspectRatio="none" viewBox="0 0 5.375 5.375" width="5.375">
          <path d={svgPaths.p3a1db400} fill="#1ABCFE" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Flag() {
  return (
    <div className="absolute contents inset-[23.45%_49.49%_69.6%_45.23%]" data-name="Flag">
      <div className="absolute inset-[23.89%_49.83%_69.6%_45.23%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="29.1643" preserveAspectRatio="none" viewBox="0 0 29.0058 29.1643" width="29.0058">
          <path d={svgPaths.p22724580} fill="#131313" id="Bg" />
        </svg>
      </div>
      <div className="absolute inset-[23.45%_49.49%_70.05%_45.57%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="29.1643" preserveAspectRatio="none" viewBox="0 0 29.0058 29.1643" width="29.0058">
          <path d={svgPaths.p22724580} fill="#F9FFE6" id="Bg" />
        </svg>
      </div>
      <DeviconFigma />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[4.6%] right-[22.72%] top-0">
      <div className="absolute inset-[0_22.72%_46.97%_4.6%]" data-name="Vector 21 (Stroke)">
        <svg className="absolute block inset-0 size-full" fill="none" height="237.825" preserveAspectRatio="none" viewBox="0 0 427 237.825" width="427">
          <path clipRule="evenodd" d={svgPaths.p3ed8a800} fill="#8CB200" fillRule="evenodd" id="Vector 21 (Stroke)" />
        </svg>
      </div>
      <Info />
      <Info1 />
      <Info2 />
      <Flag />
    </div>
  );
}

function Lines() {
  return (
    <div className="absolute contents left-0 top-[263.48px]" data-name="Lines">
      <div className="absolute h-[170.377px] left-0 top-[263.48px] w-[587.5px]" data-name="Vector 22 (Stroke)">
        <svg className="absolute block inset-0 size-full" fill="none" height="170.377" preserveAspectRatio="none" viewBox="0 0 587.5 170.377" width="587.5">
          <path clipRule="evenodd" d={svgPaths.p163d3100} fill="#8CB200" fillRule="evenodd" id="Vector 22 (Stroke)" />
        </svg>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[89.14%_60.4%_0.33%_31.57%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="47.2007" preserveAspectRatio="none" viewBox="0 0 47.2 47.2007" width="47.2">
        <g id="Group">
          <path d={svgPaths.p20add780} fill="#131313" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[89.47%_60.77%_0_31.19%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="47.2" preserveAspectRatio="none" viewBox="0 0 47.2 47.2" width="47.2">
        <g id="Group">
          <path d={svgPaths.p7b9080} fill="#F9FFE6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TablerWritingSignFilled() {
  return (
    <div className="absolute left-[195.25px] size-[24px] top-[412.75px]" data-name="tabler:writing-sign-filled">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g clipPath="url(#clip0_0_82)" id="tabler:writing-sign-filled">
          <path d={svgPaths.p9da0300} fill="black" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_0_82">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Info3() {
  return (
    <div className="absolute contents inset-[89.14%_60.4%_0_31.19%]" data-name="Info">
      <Group />
      <Group1 />
      <TablerWritingSignFilled />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[6.25%_6.67%_6.24%_6.25%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="14.001" preserveAspectRatio="none" viewBox="0 0 13.934 14.001" width="13.934">
        <g id="Group">
          <path d={svgPaths.p355d1600} fill="#FF7043" id="Vector" />
          <path d={svgPaths.p25f957f2} fill="#FF7043" id="Vector_2" />
          <path d={svgPaths.p25e1d300} fill="#FF7043" id="Vector_3" />
          <path d={svgPaths.p312aaec0} fill="#FF7043" id="Vector_4" />
          <path d={svgPaths.p3da85d00} fill="#FF7043" id="Vector_5" />
          <path d={svgPaths.p3b7f8800} fill="#FF7043" id="Vector_6" />
          <path d={svgPaths.p1ae09480} fill="#FF7043" id="Vector_7" />
          <path d={svgPaths.p39f96770} fill="#FF7043" id="Vector_8" />
          <path d={svgPaths.pea03580} fill="#FF7043" id="Vector_9" />
          <path d={svgPaths.p39cc5b80} fill="#FF7043" id="Vector_10" />
          <path d={svgPaths.pc5ed600} fill="#FF7043" id="Vector_11" />
          <path d={svgPaths.p11268f80} fill="#FF7043" id="Vector_12" />
        </g>
      </svg>
    </div>
  );
}

function MaterialIconThemeClaude() {
  return (
    <div className="absolute left-[130.25px] overflow-clip size-[16px] top-[306.75px]" data-name="material-icon-theme:claude">
      <Group2 />
    </div>
  );
}

function Flag1() {
  return (
    <div className="absolute contents inset-[66.47%_73.61%_26.42%_20.79%]" data-name="Flag">
      <div className="absolute inset-[66.47%_73.61%_26.64%_21.13%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="30.9049" preserveAspectRatio="none" viewBox="0 0 30.9349 30.9049" width="30.9349">
          <path d={svgPaths.p1515cc00} fill="#131313" id="Bg" />
        </svg>
      </div>
      <div className="absolute inset-[66.69%_73.95%_26.42%_20.79%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="30.9049" preserveAspectRatio="none" viewBox="0 0 30.9349 30.9049" width="30.9349">
          <path d={svgPaths.p1515cc00} fill="#F9FFE6" id="Bg" />
        </svg>
      </div>
      <MaterialIconThemeClaude />
    </div>
  );
}

function SelfhstYoutube() {
  return (
    <div className="absolute left-[484.25px] size-[16px] top-[279.75px]" data-name="selfhst:youtube">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="selfhst:youtube">
          <path d={svgPaths.p12dc1b00} fill="#FF0000" id="Vector" />
          <path d={svgPaths.p16df2a80} fill="white" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Flag2() {
  return (
    <div className="absolute contents inset-[60.6%_13.51%_32.44%_81.23%]" data-name="Flag">
      <div className="absolute inset-[61.04%_13.51%_32.44%_81.52%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="29.2796" preserveAspectRatio="none" viewBox="0 0 29.2344 29.2796" width="29.2344">
          <path d={svgPaths.p16ee4170} fill="#131313" id="Bg" />
        </svg>
      </div>
      <div className="absolute inset-[60.6%_13.76%_32.9%_81.23%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="29.1404" preserveAspectRatio="none" viewBox="0 0 29.4195 29.1404" width="29.4195">
          <path d={svgPaths.p21cbce80} fill="#F9FFE6" id="Vector" />
        </svg>
      </div>
      <SelfhstYoutube />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-0 top-[263.48px]">
      <Lines />
      <Info3 />
      <Flag1 />
      <Flag2 />
    </div>
  );
}

function Roadmap() {
  return (
    <div className="absolute inset-[31.81%_-35.75%_15.56%_-13.74%]" data-name="ROADMAP">
      <Group4 />
      <Group5 />
    </div>
  );
}

function UilUser() {
  return (
    <div className="absolute left-[152px] size-[120px] top-[487px]" data-name="uil:user">
      <svg className="absolute block inset-0 size-full" fill="none" height="120" preserveAspectRatio="none" viewBox="0 0 120 120" width="120">
        <g id="uil:user">
          <path d={svgPaths.p1102ae00} fill="#8CB200" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[-54px] top-[271px]">
      <Bg />
      <Roadmap />
      <UilUser />
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
    <div className="absolute content-stretch flex items-center justify-between left-0 px-[16px] top-[75px] w-[393px]" data-name="Back & Icon Btn">
      <div className="bg-white relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <LongArrow className="relative shrink-0 size-[24px]" />
        </div>
      </div>
      <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
        </div>
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Description">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#131313] text-[12px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[16px]">User Name</p>
      </div>
    </div>
  );
}

function InputText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="input-text">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d7d7d7] text-[20px] text-left tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">username001</p>
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
    <button className="bg-[#f8f8f8] cursor-pointer relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#f2f2f2] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <Content />
        </div>
      </div>
    </button>
  );
}

export default function SignUpScreenUsernameDarkMode() {
  return (
    <div className="bg-white relative size-full" data-name="Sign Up Screen - Username/Dark Mode2">
      <Group3 />
      <div className="-translate-x-1/2 absolute bg-white h-[59px] left-1/2 top-0 w-[393px]" data-name="StatusBar">
        <div className="flex flex-row items-end justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-end justify-center relative size-full">
            <LeftSide />
            <DynamicIsland />
            <RightSide />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-0 h-[34px] left-1/2 w-[393px]" data-name="HomeIndicator">
        <div className="-translate-x-1/2 absolute bg-[#131313] bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
      </div>
      <BackIconBtn />
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[32px] left-[16px] text-[#131313] text-[24px] top-[123px] tracking-[-0.072px] w-[361px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Create your User Name
      </p>
      <div className="absolute left-[16px] top-[163px] w-[361px]" data-name="User Name">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[4px] items-center relative size-full">
            <Description />
            <Input />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-0 h-[34px] left-1/2 w-[393px]" data-name="HomeIndicator">
        <div className="-translate-x-1/2 absolute bg-[#131313] bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] w-[134px]" data-name="Home Indicator" />
      </div>
      <div className="absolute bg-[#8cb200] bottom-[58px] left-[16px] rounded-[12px] w-[361px]" data-name="Primary">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[20px] py-[12px] relative size-full">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white tracking-[-0.408px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100', fontFeatureSettings: '"case" 1' }}>
              <p className="leading-[24px]">Continue</p>
            </div>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[16px] text-[#131313] text-[16px] top-[265px] tracking-[-0.048px] w-[361px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Create a unique username, you can use numbers from 0 to 9 and underscores and dashes</p>
      </div>
    </div>
  );
}