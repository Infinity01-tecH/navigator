import svgPaths from "./svg-z2tnn22gdy";
type CalendarLessonScreenRightWrongIconProps = {
  className?: string;
  darkMode?: "False";
  style?: "On Primary" | "Secondary";
  value?: "Right";
};

function CalendarLessonScreenRightWrongIcon({ className, darkMode = "False", style = "On Primary", value = "Right" }: CalendarLessonScreenRightWrongIconProps) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"}>
      {value === "Right" && style === "On Primary" && darkMode === "False" && (
        <div className="absolute inset-[8.33%]" data-name="Icon (Stroke)">
          <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
            <path clipRule="evenodd" d={svgPaths.p3be671c0} fill="white" fillRule="evenodd" id="Icon (Stroke)" />
          </svg>
        </div>
      )}
      {value === "Right" && style === "Secondary" && darkMode === "False" && (
        <div className="absolute inset-[12.5%]" data-name="Icon">
          <div className="absolute inset-[-5.56%]">
            <svg className="block size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
              <path d={svgPaths.pec9e000} id="Icon" stroke="#D7D7D7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
type BasicScreensSettingProps = {
  className?: string;
  darkMode?: "False";
};

function BasicScreensSetting({ className, darkMode = "False" }: BasicScreensSettingProps) {
  return (
    <div className={className || "relative size-[24px]"}>
      <div className="absolute inset-[9.49%_12.23%_10.42%_13.66%]" data-name="Setting">
        <div className="absolute inset-[-5.2%_-5.62%]">
          <svg className="block size-full" fill="none" height="21.222" preserveAspectRatio="none" viewBox="0 0 19.7871 21.222" width="19.7871">
            <g id="Setting">
              <path clipRule="evenodd" d={svgPaths.p38a05e80} fillRule="evenodd" id="Path_33946" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <circle cx="9.89668" cy="10.611" id="Ellipse_737" r="2.63616" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
          </svg>
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
        <BasicScreensSetting className="relative shrink-0 size-[24px]" />
      </div>
    </div>
  );
}
type BasicScreensAddUserProps = {
  className?: string;
  darkMode?: "False";
};

function BasicScreensAddUser({ className, darkMode = "False" }: BasicScreensAddUserProps) {
  return (
    <div className={className || "relative size-[24px]"}>
      <div className="absolute inset-[7.29%_7.29%_8.15%_7.29%]" data-name="Add User">
        <svg className="absolute block inset-0 size-full" fill="none" height="20.2953" preserveAspectRatio="none" viewBox="0 0 20.5 20.2953" width="20.5">
          <g id="Add User">
            <path clipRule="evenodd" d={svgPaths.p1c83d300} fill="#131313" fillRule="evenodd" id="Stroke 1 (Stroke)" />
            <path clipRule="evenodd" d={svgPaths.p35285b00} fill="#131313" fillRule="evenodd" id="Stroke 3 (Stroke)" />
            <path clipRule="evenodd" d={svgPaths.p1c353900} fill="#131313" fillRule="evenodd" id="Stroke 5 (Stroke)" />
            <path clipRule="evenodd" d={svgPaths.p177824f1} fill="#131313" fillRule="evenodd" id="Stroke 7 (Stroke)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
type Filled1Props = {
  className?: string;
  darkMode?: "False";
};

function Filled1({ className, darkMode = "False" }: Filled1Props) {
  return (
    <div className={className || "bg-white relative rounded-[12px]"}>
      <div className="content-stretch flex items-start p-[8px] relative size-full">
        <BasicScreensAddUser className="relative shrink-0 size-[24px]" />
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

function IconBtns() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Btns">
      <Filled1 className="bg-white relative rounded-[12px] shrink-0" />
      <Filled className="bg-white relative rounded-[12px] shrink-0" />
    </div>
  );
}

function TitleIconBtns() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] py-[8px] relative shrink-0 w-full" data-name="Title & Icon Btns">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Profile
      </p>
      <IconBtns />
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 size-[64.5px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="64.5002" preserveAspectRatio="none" viewBox="0 0 64.5 64.5002" width="64.5">
        <g id="Group">
          <path d={svgPaths.p32302380} fill="#F7D67C" id="Vector" />
          <g id="hair-variant30-545fac91">
            <path d={svgPaths.p18023f80} fill="black" id="Vector_2" />
            <g id="head-variant03-545fac91">
              <path d={svgPaths.p606dd00} fill="black" id="Vector_3" />
              <path d={svgPaths.p2ebb1940} fill="white" id="Vector_4" />
              <path d={svgPaths.p10128700} fill="black" id="Vector_5" />
              <g id="eyes-variant23-545fac91">
                <path d={svgPaths.p3e41500} fill="black" id="Vector_6" />
              </g>
              <g id="eyebrows-variant08-545fac91">
                <path d={svgPaths.p23e50900} fill="black" id="Vector_7" />
              </g>
              <g id="nose-variant02-545fac91">
                <path d={svgPaths.p3d768c00} fill="black" id="Vector_8" />
              </g>
              <g id="mouth-happy07-545fac91">
                <path d={svgPaths.p17601980} fill="black" id="Vector_9" />
              </g>
            </g>
            <path d={svgPaths.p27ded300} fill="black" id="Vector_10" />
          </g>
          <g id="hairAccessories-flowers-545fac91">
            <path d={svgPaths.p11388c0} fill="black" id="Vector_11" />
            <path d={svgPaths.p2e97dbf0} fill="white" id="Vector_12" />
            <path d={svgPaths.p2f421780} fill="black" id="Vector_13" />
            <path d={svgPaths.p2fe3e300} fill="white" id="Vector_14" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Avatar() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-center overflow-clip relative rounded-[100px] shrink-0" data-name="Avatar">
      <Group />
    </div>
  );
}

function Username() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Username">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#8cb200] text-[16px] tracking-[-0.048px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        @username
      </p>
    </div>
  );
}

function NameAndUsername() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[89px]" data-name="Name and Username">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[20px] mb-[-1px] relative shrink-0 text-[#131313] text-[16px] tracking-[-0.048px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        Eric Rodd
      </p>
      <Username />
    </div>
  );
}

function AvatarWithNameLocation() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Avatar with name & location">
      <Avatar />
      <NameAndUsername />
    </div>
  );
}

function ProSkill() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex items-center justify-center px-[12px] py-[2px] relative rounded-[12px] shrink-0" data-name="PRO SKILL">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        PRO Skill
      </p>
    </div>
  );
}

function AvatarBadges() {
  return (
    <div className="content-stretch flex gap-[108px] items-center px-[16px] relative shrink-0 w-full" data-name="Avatar & Badges">
      <AvatarWithNameLocation />
      <ProSkill />
    </div>
  );
}

function Frame17() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-full" />;
}

function DividerDefault() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip py-[3px] relative shrink-0 w-[361px]" data-name="Divider Default">
      <Frame17 />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#4e6207] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Level 1 · Navigator
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#85a60c] text-[12px] whitespace-nowrap">0 / 1000 XP</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[316px]" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col h-[23px] items-start pt-[6px] relative shrink-0 w-[316px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] not-italic relative shrink-0 text-[#85a60c] text-[11px] whitespace-nowrap">1000 XP to Level 2</p>
    </div>
  );
}

function LearningProgress() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-[14.116px] py-[7.058px] relative shrink-0 w-[321px]" data-name="Learning progress">
      <div className="bg-[#f8f8f8] h-[10.587px] relative rounded-[12px] shrink-0 w-[318.488px]" data-name="Learning progress/Component">
        <div className="absolute bg-[#8cb200] bottom-0 h-[10.587px] left-0 rounded-[12px] w-[39.811px]" />
        <div className="-translate-y-1/2 absolute bg-[#8cb200] left-[20.29px] rounded-[12px] top-1/2" data-name="Learning progress/Component">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Semibold',sans-serif] font-[590] items-center justify-center leading-[0] px-[7.058px] py-[1.764px] relative size-full text-[10.9px] text-white tracking-[-0.0436px] whitespace-nowrap">
              <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[15.567px]">10</p>
              </div>
              <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[15.567px]">%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[15.74px] top-[43px] w-[333px]" data-name="Container:margin">
      <LearningProgress />
    </div>
  );
}

function Level() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex flex-col gap-[28px] items-start px-[16px] py-[13px] relative rounded-[16px] shrink-0 w-[349px]" data-name="level">
      <Container />
      <Paragraph />
      <ContainerMargin />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-center relative shrink-0 w-[399px]">
      <TitleIconBtns />
      <AvatarBadges />
      <DividerDefault />
      <Level />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <StatusBar />
      <Frame31 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[302px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Streak
      </p>
    </div>
  );
}

function BasicScreensSeries() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Basic Screens/Series">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g id="Basic Screens/Series">
          <path clipRule="evenodd" d={svgPaths.p2f0ce700} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="icon">
      <BasicScreensSeries />
    </div>
  );
}

function Streak() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="streak">
      <Icon />
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#131313] text-[20px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">0</p>
      </div>
    </div>
  );
}

function StreakHeadline() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Streak headline">
      <Frame19 />
      <Streak />
    </div>
  );
}

function Frame5() {
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

function Frame6() {
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

function Frame7() {
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

function Frame8() {
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

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[39px] h-[210px] items-end justify-end mr-[-149px] relative shrink-0 w-[200px]">
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Frame1() {
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

function Frame2() {
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

function Frame3() {
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

function Frame4() {
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
    <div className="content-stretch flex flex-col gap-[40px] h-[210px] items-start relative shrink-0 w-[200px]">
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Pattern() {
  return (
    <div className="absolute content-stretch flex items-center left-[281px] opacity-30 top-[-33px]" data-name="Pattern">
      <Frame25 />
      <Frame24 />
    </div>
  );
}

function Frame9() {
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

function Frame10() {
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

function Frame11() {
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

function Frame12() {
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
    <div className="content-stretch flex flex-col gap-[39px] h-[210px] items-end justify-end mr-[-149px] relative shrink-0 w-[200px]">
      <Frame9 />
      <Frame10 />
      <Frame11 />
      <Frame12 />
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

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[210px] items-start relative shrink-0 w-[200px]">
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Pattern1() {
  return (
    <div className="absolute content-stretch flex items-center left-[-159px] opacity-30 top-[-8px]" data-name="Pattern">
      <Frame27 />
      <Frame28 />
    </div>
  );
}

function DayCheck() {
  return (
    <div className="bg-[#8cb200] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Calendar & Lesson Screen/Right & Wrong Icon">
        <div className="absolute inset-[8.33%]" data-name="Icon (Stroke)">
          <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
            <path clipRule="evenodd" d={svgPaths.p3be671c0} fill="white" fillRule="evenodd" id="Icon (Stroke)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Mo
      </p>
    </div>
  );
}

function DayCheck1() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <CalendarLessonScreenRightWrongIcon className="overflow-clip relative shrink-0 size-[24px]" style="Secondary" />
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck1 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Tu
      </p>
    </div>
  );
}

function DayCheck2() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <CalendarLessonScreenRightWrongIcon className="overflow-clip relative shrink-0 size-[24px]" style="Secondary" />
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck2 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        We
      </p>
    </div>
  );
}

function DayCheck3() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <CalendarLessonScreenRightWrongIcon className="overflow-clip relative shrink-0 size-[24px]" style="Secondary" />
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck3 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Th
      </p>
    </div>
  );
}

function DayCheck4() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <CalendarLessonScreenRightWrongIcon className="overflow-clip relative shrink-0 size-[24px]" style="Secondary" />
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck4 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Fr
      </p>
    </div>
  );
}

function DayCheck5() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <CalendarLessonScreenRightWrongIcon className="overflow-clip relative shrink-0 size-[24px]" style="Secondary" />
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck5 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Sa
      </p>
    </div>
  );
}

function DayCheck6() {
  return (
    <div className="bg-[#f8f8f8] content-stretch flex items-start overflow-clip p-[8px] relative rounded-[10px] shrink-0" data-name="Day check">
      <CalendarLessonScreenRightWrongIcon className="overflow-clip relative shrink-0 size-[24px]" style="Secondary" />
    </div>
  );
}

function ActivityCalendarComponentDayOfTheWeek6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Activity calendar/Component/Day of the week">
      <DayCheck6 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.056px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Su
      </p>
    </div>
  );
}

function WeekCheck() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[361px]" data-name="Week Check">
      <ActivityCalendarComponentDayOfTheWeek />
      <ActivityCalendarComponentDayOfTheWeek1 />
      <ActivityCalendarComponentDayOfTheWeek2 />
      <ActivityCalendarComponentDayOfTheWeek3 />
      <ActivityCalendarComponentDayOfTheWeek4 />
      <ActivityCalendarComponentDayOfTheWeek5 />
      <ActivityCalendarComponentDayOfTheWeek6 />
    </div>
  );
}

function DayCheckDescription() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Day Check & Description">
      <WeekCheck />
    </div>
  );
}

function ActivityCalendar1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] relative shrink-0 w-[393px]" data-name="Activity calendar">
      <DayCheckDescription />
    </div>
  );
}

function ActivityCalendar() {
  return (
    <div className="absolute content-stretch flex flex-col h-[69px] items-start left-[-16px] top-[23px]" data-name="Activity calendar">
      <ActivityCalendar1 />
    </div>
  );
}

function StreakBar() {
  return (
    <div className="bg-[#f9ffe5] h-[112px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Streak bar">
      <Pattern />
      <Pattern1 />
      <ActivityCalendar />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[361px]">
      <StreakHeadline />
      <StreakBar />
    </div>
  );
}

function Div1() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[93px] items-center justify-center leading-[0] pl-[0.18px] pr-[0.841px] relative shrink-0 w-[327px] whitespace-nowrap" data-name="div">
      <div className="flex flex-col font-['SF_Pro:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#4b4b4b] text-[24px] tracking-[-0.072px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[32px]">XP Progress</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#8cb200] text-[14px] tracking-[-0.056px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Total: 30XP</p>
      </div>
    </div>
  );
}

function LearningProgressComponent1() {
  return (
    <div className="-translate-y-1/2 [word-break:break-word] absolute bg-[#8cb200] content-stretch flex font-['SF_Pro:Semibold',sans-serif] font-[590] items-center justify-center leading-[0] left-[15.65px] px-[3.49px] py-[0.873px] rounded-[4.84px] text-[6.108px] text-white top-[calc(50%-0.08px)] tracking-[-0.0244px] w-[14.52px] whitespace-nowrap" data-name="Learning progress/Component">
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[8.726px]">10</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[8.726px]">%</p>
      </div>
    </div>
  );
}

function LearningProgressComponent() {
  return (
    <div className="bg-[#e6e6e6] h-[7.744px] relative rounded-[7.919px] shrink-0 w-[133.584px]" data-name="Learning progress/Component">
      <div className="absolute bg-[#8cb200] bottom-0 h-[7.919px] left-0 rounded-[7.919px] w-[29.78px]" />
      <LearningProgressComponent1 />
    </div>
  );
}

function LearningProgress1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-[10.559px] py-[5.28px] relative shrink-0 w-[134.552px]" data-name="Learning progress">
      <LearningProgressComponent />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-0.3px] top-[1.14px] w-[163.592px]" data-name="Container:margin">
      <LearningProgress1 />
    </div>
  );
}

function Div4() {
  return (
    <div className="content-stretch flex h-[19.36px] items-center pr-[1.151px] relative shrink-0 w-[64.071px]" data-name="div">
      <ContainerMargin1 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Div4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#afafaf] text-[14.52px] text-right whitespace-nowrap">
        <p className="leading-[19.36px]">13/20 XP</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-[232.396px]" data-name="div">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#777] text-[14.52px] w-full">
        <p className="leading-[24.2px]">Daily Goal</p>
      </div>
      <Frame29 />
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex gap-[13.552px] items-center py-[8.228px] relative shrink-0" data-name="div">
      <div className="h-[67.42px] relative shrink-0 w-[60.685px]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.55%]">
          <svg className="block size-full" fill="none" height="74.1604" preserveAspectRatio="none" viewBox="0 0 67.4255 74.1604" width="67.4255">
            <path d={svgPaths.p190a5d80} id="Vector" stroke="#8CB200" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6.74025" />
          </svg>
        </div>
      </div>
      <Div3 />
    </div>
  );
}

function Group3() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">M</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[38.4px] mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">Tu</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[80.18px] mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">W</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[118.58px] mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">Th</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[164.24px] mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">F</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[199.25px] mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">Sa</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[239.58px] mt-0 place-items-start relative row-1" data-name="Group">
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-center whitespace-nowrap">Su</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[28.56px] mt-[166.62px] place-items-start relative row-1" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[9.68px] mt-[145.2px] place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-0 ml-[26.14px] mt-[11.19px] relative row-1 w-[242px]" data-name="Vector">
        <div className="absolute inset-[-0.97px_0]">
          <svg className="block size-full" fill="none" height="1.936" preserveAspectRatio="none" viewBox="0 0 242 1.936" width="242">
            <path d="M0 0.968H242" id="Vector" stroke="#DEDEDE" strokeOpacity="0.5" strokeWidth="1.936" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-right whitespace-nowrap">0</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[9.68px] mt-[108.9px] place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-0 ml-[26.14px] mt-[11.19px] relative row-1 w-[242px]" data-name="Vector">
        <div className="absolute inset-[-0.97px_0]">
          <svg className="block size-full" fill="none" height="1.936" preserveAspectRatio="none" viewBox="0 0 242 1.936" width="242">
            <path d="M0 0.968H242" id="Vector" stroke="#DEDEDE" strokeOpacity="0.5" strokeWidth="1.936" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-right whitespace-nowrap">5</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[1.94px] mt-[72.6px] place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-0 ml-[33.88px] mt-[11.19px] relative row-1 w-[242px]" data-name="Vector">
        <div className="absolute inset-[-0.97px_0]">
          <svg className="block size-full" fill="none" height="1.936" preserveAspectRatio="none" viewBox="0 0 242 1.936" width="242">
            <path d="M0 0.968H242" id="Vector" stroke="#DEDEDE" strokeOpacity="0.5" strokeWidth="1.936" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-right whitespace-nowrap">10</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[1.94px] mt-[36.3px] place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-0 ml-[33.88px] mt-[11.19px] relative row-1 w-[242px]" data-name="Vector">
        <div className="absolute inset-[-0.97px_0]">
          <svg className="block size-full" fill="none" height="1.936" preserveAspectRatio="none" viewBox="0 0 242 1.936" width="242">
            <path d="M0 0.968H242" id="Vector" stroke="#DEDEDE" strokeOpacity="0.5" strokeWidth="1.936" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#cccac9] text-[16.456px] text-right whitespace-nowrap">15</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <div className="col-1 h-0 ml-[35.82px] mt-[11.19px] relative row-1 w-[242px]" data-name="Vector">
        <div className="absolute inset-[-0.97px_0]">
          <svg className="block size-full" fill="none" height="1.936" preserveAspectRatio="none" viewBox="0 0 242 1.936" width="242">
            <path d="M0 0.968H242" id="Vector" stroke="#DEDEDE" strokeOpacity="0.5" strokeWidth="1.936" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] col-1 font-['Inter:Regular',sans-serif] font-normal leading-[normal] ml-0 mt-0 not-italic relative row-1 text-[#8cb200] text-[16.456px] text-right whitespace-nowrap">20</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Group">
      <Group11 />
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
    </div>
  );
}

function Group16() {
  return (
    <div className="col-1 h-[101.64px] ml-[32.19px] mt-[57.9px] relative row-1 w-[249.26px]" data-name="Group">
      <div className="absolute inset-[-0.95%_-0.39%]">
        <svg className="block size-full" fill="none" height="103.576" preserveAspectRatio="none" viewBox="0 0 251.196 103.576" width="251.196">
          <g id="Group">
            <path d={svgPaths.pf53980} fill="#F9FFE6" id="Vector" />
            <path d={svgPaths.p33ebd380} id="Vector_2" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p318c1600} fill="white" id="Vector_3" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p3102d50} fill="white" id="Vector_4" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p231a5e40} fill="white" id="Vector_5" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p90c800} fill="white" id="Vector_6" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p15208500} fill="white" id="Vector_7" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p131ad500} fill="white" id="Vector_8" stroke="#8CB200" strokeWidth="1.936" />
            <path d={svgPaths.p1cd82f80} fill="white" id="Vector_9" stroke="#8CB200" strokeWidth="1.936" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
      <Group2 />
      <Group10 />
      <Group16 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start px-[8px] py-[3px] relative shrink-0" data-name="Frame">
      <Group1 />
    </div>
  );
}

function Chart() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="Chart">
      <Frame />
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-center min-w-px relative" data-name="div">
      <Div1 />
      <Div2 />
      <Chart />
    </div>
  );
}

function XpProgress() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex items-start p-[25.168px] relative rounded-[15.488px] shrink-0 w-[363px]" data-name="XP Progress">
      <Div />
    </div>
  );
}

function Frame18() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-full" />;
}

function DividerDefault1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] overflow-clip py-[3px] top-[450px] w-[361px]" data-name="Divider Default">
      <Frame18 />
    </div>
  );
}

function VocabularyScreenProgressChart() {
  return (
    <div className="relative shrink-0 size-[22.281px]" data-name="Vocabulary Screen/Progress Chart">
      <div className="absolute inset-[-5.56%_-21.79%_0_0]">
        <svg className="block size-full" fill="none" height="23.5207" preserveAspectRatio="none" viewBox="0 0 27.1367 23.5207" width="27.1367">
          <g id="Vocabulary Screen/Progress Chart">
            <rect height="20" id="Rectangle 6" rx="2" stroke="#A9A9A9" strokeWidth="2" width="6" x="20.1367" y="1" />
            <path clipRule="evenodd" d={svgPaths.p135b6500} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Number() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[2px] items-start justify-center leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.042px] whitespace-nowrap" data-name="Number">
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        Phase Completed
      </p>
    </div>
  );
}

function InfoCards() {
  return (
    <div className="bg-[#f8f8f8] flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Info Cards">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[8px] relative size-full">
          <VocabularyScreenProgressChart />
          <Number />
        </div>
      </div>
    </div>
  );
}

function Number1() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[2px] items-start justify-center leading-[20px] relative shrink-0 text-[#131313] text-[14px] tracking-[-0.042px] whitespace-nowrap" data-name="Number">
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        11
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        XP Earned
      </p>
    </div>
  );
}

function InfoCards1() {
  return (
    <div className="bg-[#f8f8f8] flex-[1_0_0] min-w-px relative rounded-[12px]" data-name="Info Cards">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[8px] relative size-full">
          <div className="h-[21.665px] relative shrink-0 w-[19.501px]" data-name="Vector">
            <div className="absolute inset-[-5%_-5.55%]">
              <svg className="block size-full" fill="none" height="23.8312" preserveAspectRatio="none" viewBox="0 0 21.6669 23.8312" width="21.6669">
                <path d={svgPaths.p148b7370} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16596" />
              </svg>
            </div>
          </div>
          <Number1 />
        </div>
      </div>
    </div>
  );
}

function ProgressInfoCards() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start justify-center left-0 px-[16px] top-[368px] w-[393px]" data-name="Progress Info Cards">
      <InfoCards />
      <div className="bg-[#f2f2f2] relative rounded-[100px] self-stretch shrink-0 w-[2px]" data-name="Divider" />
      <InfoCards1 />
    </div>
  );
}

function Percent() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute content-stretch flex items-start leading-[40px] left-1/2 text-[#131313] text-[32px] text-center top-1/2 tracking-[-0.3px] whitespace-nowrap" data-name="Percent">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        50
      </p>
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        %
      </p>
    </div>
  );
}

function Chart1() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[160px]" data-name="Chart">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[160px] top-1/2">
        <svg className="absolute block inset-0 size-full" fill="none" height="160" preserveAspectRatio="none" viewBox="0 0 160 160" width="160">
          <circle cx="80" cy="80" id="Ellipse 3" r="72" stroke="#F9FFE6" strokeWidth="16" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[80px] left-1/2 top-[calc(50%+40px)] w-[160px]" data-name="Percent Mask">
        <svg className="absolute block inset-0 size-full" fill="none" height="80" preserveAspectRatio="none" viewBox="0 0 160 80" width="160">
          <path d={svgPaths.p667500} fill="#8CB200" id="Percent Mask" />
        </svg>
      </div>
      <Percent />
    </div>
  );
}

function ChartDescription() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center justify-center left-[calc(50%+4.5px)] top-[144px] w-[361px]" data-name="Chart & Description">
      <Chart1 />
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Roadmap Progress
      </p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[6px] size-[12px] top-[6px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p1d222180} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999511" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#8cb200] relative rounded-[10.287px] shrink-0 size-[24px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function IconTitle() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Icon & Title">
      <Container1 />
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Full Roadmap
      </p>
    </div>
  );
}

function RoadmapType() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-[5px] px-[16px] top-[106px] w-[388px]" data-name="Roadmap type">
      <IconTitle />
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        —
      </p>
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] text-right tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        16 Steps
      </p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-[90px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Roadmap 1
      </p>
    </div>
  );
}

function TabsComponentBlocks() {
  return (
    <div className="bg-[#f9ffe5] flex-[1_0_0] min-w-px relative rounded-tl-[12px] rounded-tr-[12px]" data-name="Tabs/Component/Blocks">
      <div aria-hidden className="absolute border-[#8cb200] border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[12px] rounded-tr-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[12px] relative size-full">
          <Frame21 />
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-[91px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Roadmap 2
      </p>
    </div>
  );
}

function TabsComponentBlocks1() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-tl-[12px] rounded-tr-[12px]" data-name="Tabs/Component/Blocks">
      <div aria-hidden className="absolute border-[#f2f2f2] border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[12px] rounded-tr-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[12px] relative size-full">
          <Frame22 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-[92px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Roadmap 3
      </p>
    </div>
  );
}

function TabsComponentBlocks2() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-tl-[12px] rounded-tr-[12px]" data-name="Tabs/Component/Blocks">
      <div aria-hidden className="absolute border-[#f2f2f2] border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[12px] rounded-tr-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] py-[12px] relative size-full">
          <Frame23 />
        </div>
      </div>
    </div>
  );
}

function Tabs() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-start left-[calc(50%+4.5px)] px-[16px] top-[40px] w-[393px]" data-name="Tabs">
      <div className="-translate-x-1/2 absolute bg-[#f2f2f2] bottom-0 h-[2px] left-1/2 w-[393px]" data-name="Border" />
      <TabsComponentBlocks />
      <TabsComponentBlocks1 />
      <TabsComponentBlocks2 />
    </div>
  );
}

function TitleNumber() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[24px] px-[16px] relative shrink-0 text-[20px] tracking-[-0.06px] w-full whitespace-nowrap" data-name="Title & Number">
      <p className="font-['SF_Pro:Medium',sans-serif] font-[510] relative shrink-0 text-[#131313]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Roadmaps
      </p>
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] relative shrink-0 text-[#8cb200] text-right" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
      </p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[5px] pr-[10px] py-[10px] top-[-10px] w-[403px]">
      <TitleNumber />
    </div>
  );
}

function Frame34() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[167px] items-start leading-[20px] relative shrink-0 text-[#9ea2ae] text-[16px] tracking-[-0.048px] w-[355px] whitespace-nowrap">
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>{`Achievement `}</p>
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>{` Roadmap 1`}</p>
    </div>
  );
}

function PlaceholderForAchievementBadge() {
  return <div className="relative shrink-0 size-[52.891px]" data-name="Placeholder for AchievementBadge" />;
}

function Icon2() {
  return (
    <div className="absolute flex items-center justify-center left-[0.01px] size-[52.875px] top-[0.01px]">
      <div className="-rotate-90 flex-none">
        <div className="relative size-[52.875px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" height="52.8755" preserveAspectRatio="none" viewBox="0 0 52.8755 52.8755" width="52.8755">
            <g id="Icon">
              <g id="Vector" />
              <path d={svgPaths.p2ca8ba80} fill="url(#paint0_linear_0_161)" id="Vector_2" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_161" x1="42.6653" x2="7.16531" y1="12.4962" y2="39.4962">
                <stop stopColor="#8CB200" />
                <stop offset="1" stopColor="#CDFF14" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[28.93px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="28.9297" preserveAspectRatio="none" viewBox="0 0 28.9297 28.9297" width="28.9297">
        <g id="Icon">
          <path d={svgPaths.p2e8edb80} id="Vector" stroke="#F9FFE6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41081" />
          <path d={svgPaths.p3e179600} id="Vector_2" stroke="#F9FFE6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41081" />
          <path d="M19.2907 20.4919H24.1123" id="Vector_3" stroke="#F9FFE6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41081" />
          <path d="M4.82161 15.6702H9.64323" id="Vector_4" stroke="#F9FFE6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41081" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[52.891px] top-0" data-name="Container">
      <Container5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute left-[30px] size-[52.891px] top-[13.24px]" data-name="Container">
      <Icon2 />
      <Container4 />
    </div>
  );
}

function AchievementBadge() {
  return (
    <div className="bg-[#f8f8f8] col-1 content-stretch flex flex-col gap-[8.137px] items-center justify-self-stretch p-[12.206px] relative rounded-[16.274px] row-1 self-stretch shrink-0" data-name="AchievementBadge">
      <PlaceholderForAchievementBadge />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[12.714px] not-italic relative shrink-0 text-[#6d717f] text-[10.171px] text-center whitespace-nowrap">First Steps</p>
      <Container3 />
    </div>
  );
}

function PlaceholderForAchievementBadge1() {
  return <div className="absolute left-[30.18px] size-[52.891px] top-[13.24px]" data-name="Placeholder for AchievementBadge" />;
}

function TextMargin() {
  return (
    <div className="absolute content-stretch flex flex-col h-[10.171px] items-start left-[48.49px] top-[95.41px] w-[16.274px]" data-name="Text:margin">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.731px] left-[8px] not-italic text-[#9ea2ae] text-[9.154px] text-center top-[-4.07px] whitespace-nowrap">0/4</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute flex items-center justify-center left-[0.01px] size-[52.875px] top-[0.01px]">
      <div className="-rotate-90 flex-none">
        <div className="relative size-[52.875px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" height="52.8755" preserveAspectRatio="none" viewBox="0 0 52.8755 52.8755" width="52.8755">
            <g id="Icon">
              <path d={svgPaths.pc35d700} fill="url(#paint0_linear_0_93)" id="Vector" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_93" x1="46.6653" x2="8.16531" y1="10.6161" y2="41.6161">
                <stop stopColor="#ABA9A9" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[25.363px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="25.3633" preserveAspectRatio="none" viewBox="0 0 25.3633 25.3633" width="25.3633">
        <g id="Icon">
          <path d={svgPaths.p396cf380} id="Vector" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.11361" />
          <path d="M4.22618 23.25V15.8524" id="Vector_2" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.11361" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[52.891px] top-0" data-name="Container">
      <Container8 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute left-[30px] size-[52.891px] top-[13.24px]" data-name="Container">
      <Icon4 />
      <Container7 />
    </div>
  );
}

function AchievementBadge1() {
  return (
    <div className="bg-[#f8f8f8] col-2 h-[117.962px] relative rounded-[16.274px] row-1 shrink-0 w-[113.249px]" data-name="AchievementBadge">
      <PlaceholderForAchievementBadge1 />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[12.714px] left-[56.62px] not-italic text-[#6d717f] text-[10.171px] text-center top-[74.27px] whitespace-nowrap">Phase 1 Done</p>
      <TextMargin />
      <Container6 />
    </div>
  );
}

function PlaceholderForAchievementBadge2() {
  return <div className="absolute left-[30.17px] size-[52.891px] top-[13.24px]" data-name="Placeholder for AchievementBadge" />;
}

function TextMargin1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[10.171px] items-start left-[48.99px] top-[95.41px] w-[15.257px]" data-name="Text:margin">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.731px] left-[7.5px] not-italic text-[#9ea2ae] text-[9.154px] text-center top-[-4.07px] whitespace-nowrap">0/7</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute flex items-center justify-center left-[0.01px] size-[52.875px] top-[0.01px]">
      <div className="-rotate-90 flex-none">
        <div className="relative size-[52.875px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" height="52.8755" preserveAspectRatio="none" viewBox="0 0 52.8755 52.8755" width="52.8755">
            <g id="Icon">
              <path d={svgPaths.p25d0f700} fill="url(#paint0_linear_0_69)" id="Vector" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_69" x1="46.6653" x2="8.16531" y1="10.6149" y2="41.6149">
                <stop stopColor="#ABA9A9" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[27.984px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="27.9844" preserveAspectRatio="none" viewBox="0 0 27.9844 27.9844" width="27.9844">
        <g id="Icon">
          <path d={svgPaths.p25f9180} id="Vector" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33203" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[52.891px] top-0" data-name="Container">
      <Container11 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute left-[30px] size-[52.891px] top-[13.24px]" data-name="Container">
      <Icon6 />
      <Container10 />
    </div>
  );
}

function AchievementBadge2() {
  return (
    <div className="bg-[#f8f8f8] col-3 h-[117.962px] relative rounded-[16.274px] row-1 shrink-0 w-[113.232px]" data-name="AchievementBadge">
      <PlaceholderForAchievementBadge2 />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[12.714px] left-[56.62px] not-italic text-[#6d717f] text-[10.171px] text-center top-[74.27px] whitespace-nowrap">Week Warrior</p>
      <TextMargin1 />
      <Container9 />
    </div>
  );
}

function PlaceholderForAchievementBadge3() {
  return <div className="relative shrink-0 size-[52.891px]" data-name="Placeholder for AchievementBadge" />;
}

function TextMargin2() {
  return (
    <div className="content-stretch flex flex-col h-[10.171px] items-start relative shrink-0 w-[20.343px]" data-name="Text:margin">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.731px] left-[10.5px] not-italic text-[#9ea2ae] text-[9.154px] text-center top-[-4.07px] whitespace-nowrap">0/10</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute flex items-center justify-center left-[0.01px] size-[52.875px] top-[0.01px]">
      <div className="-rotate-90 flex-none">
        <div className="relative size-[52.875px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" height="52.8755" preserveAspectRatio="none" viewBox="0 0 52.8755 52.8755" width="52.8755">
            <g id="Icon">
              <path d={svgPaths.p35b7ac80} fill="url(#paint0_linear_0_147)" id="Vector" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_147" x1="46.665" x2="8.16504" y1="10.6173" y2="41.6173">
                <stop stopColor="#ABA9A9" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[28.742px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="28.7422" preserveAspectRatio="none" viewBox="0 0 28.7422 28.7422" width="28.7422">
        <g id="Icon">
          <path d={svgPaths.p2d3cf840} id="Vector" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.39518" />
          <path d={svgPaths.pc8a1e80} id="Vector_2" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.39518" />
          <path d={svgPaths.p34dbf880} id="Vector_3" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.39518" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[52.891px] top-0" data-name="Container">
      <Container14 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute left-[30px] size-[52.891px] top-[13.24px]" data-name="Container">
      <Icon8 />
      <Container13 />
    </div>
  );
}

function AchievementBadge3() {
  return (
    <div className="bg-[#f8f8f8] col-1 content-stretch flex flex-col gap-[8.137px] items-center justify-self-stretch p-[12.206px] relative rounded-[16.274px] row-2 self-stretch shrink-0" data-name="AchievementBadge">
      <PlaceholderForAchievementBadge3 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[12.714px] not-italic relative shrink-0 text-[#6d717f] text-[10.171px] text-center whitespace-nowrap">Deep Diver</p>
      <TextMargin2 />
      <Container12 />
    </div>
  );
}

function PlaceholderForAchievementBadge4() {
  return <div className="relative shrink-0 size-[52.891px]" data-name="Placeholder for AchievementBadge" />;
}

function TextMargin3() {
  return (
    <div className="content-stretch flex flex-col h-[10.171px] items-start relative shrink-0 w-[16.274px]" data-name="Text:margin">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.731px] left-[8px] not-italic text-[#9ea2ae] text-[9.154px] text-center top-[-4.07px] whitespace-nowrap">0/4</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute flex items-center justify-center left-[0.01px] size-[52.875px] top-[0.01px]">
      <div className="-rotate-90 flex-none">
        <div className="relative size-[52.875px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" height="52.8755" preserveAspectRatio="none" viewBox="0 0 52.8755 52.8755" width="52.8755">
            <g id="Icon">
              <path d={svgPaths.p6c5c000} fill="url(#paint0_linear_0_61)" id="Vector" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_61" x1="46.665" x2="8.16504" y1="10.6161" y2="41.6161">
                <stop stopColor="#ABA9A9" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[27.363px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="27.3633" preserveAspectRatio="none" viewBox="0 0 27.3633 27.3633" width="27.3633">
        <g id="Icon">
          <path d={svgPaths.p169ca680} id="Vector" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.28027" />
          <path d={svgPaths.p8ca0d00} id="Vector_2" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.28027" />
          <path d={svgPaths.p2ba09e00} id="Vector_3" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.28027" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[52.891px] top-0" data-name="Container">
      <Container17 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute left-[30px] size-[52.891px] top-[13.24px]" data-name="Container">
      <Icon10 />
      <Container16 />
    </div>
  );
}

function AchievementBadge4() {
  return (
    <div className="bg-[#f8f8f8] col-2 content-stretch flex flex-col gap-[8.137px] items-center justify-self-stretch p-[12.206px] relative rounded-[16.274px] row-2 self-stretch shrink-0" data-name="AchievementBadge">
      <PlaceholderForAchievementBadge4 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[12.714px] not-italic relative shrink-0 text-[#6d717f] text-[10.171px] text-center whitespace-nowrap">Project Builder</p>
      <TextMargin3 />
      <Container15 />
    </div>
  );
}

function PlaceholderForAchievementBadge5() {
  return <div className="relative shrink-0 size-[52.891px]" data-name="Placeholder for AchievementBadge" />;
}

function TextMargin4() {
  return (
    <div className="content-stretch flex flex-col h-[10.171px] items-start relative shrink-0 w-[20.343px]" data-name="Text:margin">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[13.731px] left-[10px] not-italic text-[#9ea2ae] text-[9.154px] text-center top-[-4.07px] whitespace-nowrap">0/15</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute flex items-center justify-center left-[0.01px] size-[52.875px] top-[0.01px]">
      <div className="-rotate-90 flex-none">
        <div className="relative size-[52.875px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" height="52.8755" preserveAspectRatio="none" viewBox="0 0 52.8755 52.8755" width="52.8755">
            <g id="Icon">
              <path d={svgPaths.p16a23980} fill="url(#paint0_linear_0_59)" id="Vector" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_59" x1="46.665" x2="8.16504" y1="10.6149" y2="41.6149">
                <stop stopColor="#ABA9A9" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[26.984px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="26.9844" preserveAspectRatio="none" viewBox="0 0 26.9844 26.9844" width="26.9844">
        <g id="Icon">
          <path d={svgPaths.p23e98100} id="Vector" stroke="#A7ABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2487" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[52.891px] top-0" data-name="Container">
      <Container20 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute left-[30px] size-[52.891px] top-[13.24px]" data-name="Container">
      <Icon12 />
      <Container19 />
    </div>
  );
}

function AchievementBadge5() {
  return (
    <div className="bg-[#f8f8f8] col-3 content-stretch flex flex-col gap-[8.137px] items-center justify-self-stretch p-[12.206px] relative rounded-[16.274px] row-2 self-stretch shrink-0" data-name="AchievementBadge">
      <PlaceholderForAchievementBadge5 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[12.714px] not-italic relative shrink-0 text-[#6d717f] text-[10.171px] text-center whitespace-nowrap">Speed Runner</p>
      <TextMargin4 />
      <Container18 />
    </div>
  );
}

function Container2() {
  return (
    <div className="gap-x-[8.1371431350708px] gap-y-[8.1371431350708px] grid grid-cols-[___113.23px_113.25px_113.23px] grid-rows-[__117.96px_117.96px] h-[244.114px] relative shrink-0 w-full" data-name="Container">
      <AchievementBadge />
      <AchievementBadge1 />
      <AchievementBadge2 />
      <AchievementBadge3 />
      <AchievementBadge4 />
      <AchievementBadge5 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px pt-[12.206px] relative w-full" data-name="Container:margin">
      <Container2 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col h-[276.32px] items-start p-[10px] relative shrink-0 w-full">
      <ContainerMargin2 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[11px] top-[500px] w-[376px]">
      <Frame34 />
      <Frame35 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="h-[795px] relative shrink-0 w-[402px]">
      <DividerDefault1 />
      <ProgressInfoCards />
      <ChartDescription />
      <RoadmapType />
      <Tabs />
      <Frame30 />
      <Frame33 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[15.17px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.1696" preserveAspectRatio="none" viewBox="0 0 15.1696 15.1696" width="15.1696">
        <g id="Icon">
          <path d={svgPaths.p2d89b680} id="Vector" stroke="#85A60C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26413" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[20px] relative shrink-0 text-[#131927] text-[16px] tracking-[-0.048px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Paste YouTube Video Link
      </p>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[8.091px] items-center relative shrink-0 w-[319.611px]" data-name="Container">
      <Icon14 />
      <Paragraph1 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[8.091px] relative shrink-0 w-full" data-name="Container:margin">
      <Container21 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[44.503px] items-start justify-center left-[-0.02px] overflow-clip px-[14.16px] rounded-[16.183px] top-[-0.02px] w-[319.611px]" data-name="Text Input">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(19,25,39,0.5)] tracking-[-0.042px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>{`https://youtube.com/watch?v=…`}</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[52.812px] relative shrink-0 w-full" data-name="Container">
      <TextInput />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[319.611px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#9ea2ae] text-[14px] tracking-[-0.042px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Videos with captions/transcripts work best.
      </p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16.168px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1681" preserveAspectRatio="none" viewBox="0 0 16.1681 16.1681" width="16.1681">
        <g id="Icon">
          <path d={svgPaths.p1e35bab2} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34734" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#8cb200] content-stretch flex gap-[8.091px] h-[44.503px] items-center justify-center opacity-40 relative rounded-[34582360px] shrink-0 w-[319.611px]" data-name="Button">
      <Icon15 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20.229px] not-italic relative shrink-0 text-[#131927] text-[14.16px] text-center whitespace-nowrap">Watch Video</p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12.137px] relative shrink-0" data-name="Button:margin">
      <Button />
    </div>
  );
}

function PasteYouTube() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col h-[189.909px] items-start p-[16.183px] relative rounded-[16.183px] shrink-0 w-[354px]" data-name="PasteYouTube">
      <ContainerMargin3 />
      <Container22 />
      <Paragraph2 />
      <ButtonMargin />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_57)" id="Icon">
          <path d={svgPaths.p32fdf400} id="Vector" stroke="#85A60C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_57">
            <rect fill="white" height="20.9645" width="20.9645" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon16 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#85a60c] text-[10.483px] text-center whitespace-nowrap">Today</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_48)" id="Icon">
          <path d={svgPaths.p5f3900} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
          <path d={svgPaths.p96b5400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_48">
            <rect fill="white" height="20.9645" width="20.9645" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon17 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Inspire</p>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g id="Icon">
          <path d={svgPaths.p24e50480} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
          <path d="M13.1043 5.03458V18.1374" id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
          <path d="M7.86482 2.82669V15.9295" id="Vector_3" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon18 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Roadmap</p>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_55)" id="Icon">
          <path d={svgPaths.p3b53ed00} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_55">
            <rect fill="white" height="20.9645" width="20.9645" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon19 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Chat</p>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g id="Icon">
          <path d={svgPaths.p18636f80} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
          <path d={svgPaths.p308e1c00} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon20 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Profile</p>
    </div>
  );
}

function TabBar() {
  return (
    <div className="backdrop-blur-[10.483px] bg-[#f8f8f8] content-stretch flex gap-px h-[88px] items-start justify-center pt-[13px] relative shrink-0 w-full" data-name="TabBar">
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[119px] px-[17px] py-[8px] right-[119px] top-[2120px]" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5.242px] relative rounded-[104.835px] shrink-0 w-full" data-name="Home Indicator" />
    </div>
  );
}

export default function ProfileScreenLightMode() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[44px] items-center relative size-full" data-name="Profile Screen/light Mode4">
      <Frame32 />
      <Frame26 />
      <XpProgress />
      <Frame20 />
      <PasteYouTube />
      <TabBar />
      <HomeIndicator />
    </div>
  );
}