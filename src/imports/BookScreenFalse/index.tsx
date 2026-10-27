import svgPaths from "./svg-7l40jk6qas";
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
type BasicScreensSeriesProps = {
  className?: string;
  darkMode?: "False";
};

function BasicScreensSeries({ className, darkMode = "False" }: BasicScreensSeriesProps) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"}>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Icon (Stroke)">
        <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 18 20" width="18">
          <path clipRule="evenodd" d={svgPaths.p14ed6c80} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
        </svg>
      </div>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="content-stretch flex flex-col h-[59px] items-center justify-center pb-[3px] pl-[10px] relative shrink-0 w-[134px]" data-name="Left Side">
      <div className="h-[21px] relative rounded-[24px] shrink-0 w-[54px]" data-name="_StatusBar-time">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] h-[20px] leading-[21px] left-[27px] text-[#131313] text-[16px] text-center top-px tracking-[-0.32px] w-[54px]" style={{ fontVariationSettings: '"wdth" 100' }}>
          9:41
        </p>
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
    <div className="content-stretch flex flex-col h-[59px] items-center justify-center relative shrink-0 w-[125px]" data-name="Dynamic Island">
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
    <div className="content-stretch flex h-[59px] items-center justify-center pr-[11px] relative shrink-0 w-[134px]" data-name="Right Side">
      <SignalWifiBattery />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="bg-white content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 size-[53px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="53" preserveAspectRatio="none" viewBox="0 0 53 53" width="53">
        <g id="Group">
          <path d={svgPaths.p2b972880} fill="#F7D67C" id="Vector" />
          <g id="hair-variant30-545fac91">
            <path d={svgPaths.p45afa80} fill="black" id="Vector_2" />
            <g id="head-variant03-545fac91">
              <path d={svgPaths.p39a33d80} fill="black" id="Vector_3" />
              <path d={svgPaths.p3349bc00} fill="white" id="Vector_4" />
              <path d={svgPaths.p1c26d300} fill="black" id="Vector_5" />
              <g id="eyes-variant23-545fac91">
                <path d={svgPaths.pa705700} fill="black" id="Vector_6" />
              </g>
              <g id="eyebrows-variant08-545fac91">
                <path d={svgPaths.p3b23d1f0} fill="black" id="Vector_7" />
              </g>
              <g id="nose-variant02-545fac91">
                <path d={svgPaths.p3dd31800} fill="black" id="Vector_8" />
              </g>
              <g id="mouth-happy07-545fac91">
                <path d={svgPaths.p1668c000} fill="black" id="Vector_9" />
              </g>
            </g>
            <path d={svgPaths.p177df900} fill="black" id="Vector_10" />
          </g>
          <g id="hairAccessories-flowers-545fac91">
            <path d={svgPaths.p3e66f600} fill="black" id="Vector_11" />
            <path d={svgPaths.p21cb6e00} fill="white" id="Vector_12" />
            <path d={svgPaths.p31f7fc00} fill="black" id="Vector_13" />
            <path d={svgPaths.p1da9c580} fill="white" id="Vector_14" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LanguageIconArrowIcon() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Language Icon & Arrow Icon">
      <Group />
    </div>
  );
}

function ShareResult() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Share result">
      <div className="bg-white relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <BasicScreensSeries className="overflow-clip relative shrink-0 size-[24px]" />
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#131313] text-[20px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">0</p>
      </div>
    </div>
  );
}

function Star() {
  return (
    <div className="absolute inset-[15.28%_18.75%]" data-name="Star">
      <div className="absolute inset-[-5%_-5.55%]">
        <svg className="block size-full" fill="none" height="18.3307" preserveAspectRatio="none" viewBox="0 0 16.666 18.3307" width="16.666">
          <g id="Star">
            <path d={svgPaths.pada00} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66604" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function BasicScreensRating() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Basic Screens/Rating">
      <Star />
    </div>
  );
}

function Filled() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Filled">
      <BasicScreensRating />
    </div>
  );
}

function EarnedRating() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Earned rating">
      <Filled />
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#131313] text-[20px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">0</p>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#131313] text-[20px] tracking-[0.4px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">XP</p>
      </div>
    </div>
  );
}

function ShareRatingNotification() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Share & Rating & Notification">
      <ShareResult />
      <EarnedRating />
      <div className="bg-white relative rounded-[12px] shrink-0" data-name="Filled">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Basic Screens/Notification">
            <div className="absolute inset-[8.33%_12.5%]" data-name="Icon (Stroke)">
              <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 18.0001 20" width="18.0001">
                <path clipRule="evenodd" d={svgPaths.p219fdc00} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvartarStats() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[16px] px-[16px] relative shrink-0 w-full" data-name="Avartar & stats">
      <LanguageIconArrowIcon />
      <ShareRatingNotification />
    </div>
  );
}

function Welcom() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="welcom">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.08px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Hey Divine, welcome back!
      </p>
    </div>
  );
}

function Welcome() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[354px]" data-name="Welcome">
      <Welcom />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-center relative shrink-0 w-full">
      <AvartarStats />
      <Welcome />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[393px]">
      <StatusBar />
      <Frame23 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[20px] relative shrink-0 text-[#131313] text-[16px] tracking-[-0.048px] w-[343px] whitespace-nowrap">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        Daily XP
      </p>
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        0/200 XP
      </p>
    </div>
  );
}

function LearningProgressComponent1() {
  return (
    <div className="-translate-y-1/2 [word-break:break-word] absolute bg-[#8cb200] content-stretch flex font-['SF_Pro:Semibold',sans-serif] font-[590] items-center justify-center leading-[0] left-[23px] px-[8px] py-[2px] rounded-[12px] text-[14px] text-white top-1/2 tracking-[-0.056px] whitespace-nowrap" data-name="Learning progress/Component">
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">10</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">%</p>
      </div>
    </div>
  );
}

function LearningProgressComponent() {
  return (
    <div className="bg-[#f8f8f8] h-[12px] relative rounded-[12px] shrink-0 w-[343px]" data-name="Learning progress/Component">
      <div className="absolute bg-[#8cb200] bottom-0 h-[12px] left-0 rounded-[12px] w-[45.125px]" />
      <LearningProgressComponent1 />
    </div>
  );
}

function LearningProgress() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-[16px] py-[8px] relative shrink-0 w-[343px]" data-name="Learning progress">
      <LearningProgressComponent />
    </div>
  );
}

function DailyXp() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-[393px]" data-name="Daily XP">
      <Frame18 />
      <LearningProgress />
    </div>
  );
}

function StreakHeadline() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Streak headline">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Streak
      </p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute h-[16.182px] left-0 top-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[28px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[83px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[138px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[193px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute h-[16.182px] left-0 top-[56px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute h-[16.182px] left-0 top-[112px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute h-[16.182px] left-0 top-[168px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[209.182px] left-[298px] opacity-30 top-[-33px] w-[200px]">
      <Group1 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group2 />
      <Group3 />
      <Group4 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute h-[16.182px] left-0 top-0 w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[28px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[83px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[138px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute h-[16.182px] left-[26px] top-[193px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute h-[16.182px] left-0 top-[56px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute h-[16.182px] left-0 top-[112px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute h-[16.182px] left-0 top-[168px] w-[174px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
        <g id="Group 8">
          <path clipRule="evenodd" d={svgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[209.182px] left-[-135px] opacity-30 top-[-8px] w-[200px]">
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
    </div>
  );
}

function Title() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Title">
      <div className="relative size-full" />
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
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[-16px] top-[-12px]" data-name="Activity calendar">
      <Title />
      <ActivityCalendar1 />
    </div>
  );
}

function Streak() {
  return (
    <div className="bg-[#f9ffe5] h-[112px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Streak">
      <Frame />
      <Frame1 />
      <ActivityCalendar />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-[362px]">
      <StreakHeadline />
      <Streak />
    </div>
  );
}

function TitileNumber() {
  return (
    <div className="h-[24px] relative shrink-0 w-[117px]" data-name="Titile & Number">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] left-0 text-[#131313] text-[20px] top-0 tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Today’s Plan
      </p>
    </div>
  );
}

function ChapterNameChapter() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] relative shrink-0 w-[393px]" data-name="Chapter & Name Chapter">
      <TitileNumber />
    </div>
  );
}

function Numbers() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 text-[#8cb200]" data-name="Numbers">
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        0
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        /4
      </p>
    </div>
  );
}

function LessonsInfo() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal items-center justify-between leading-[20px] px-[16px] relative shrink-0 text-[16px] tracking-[-0.048px] w-[393px] whitespace-nowrap" data-name="Lessons Info">
      <p className="relative shrink-0 text-[#131313]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Lessons completed
      </p>
      <Numbers />
    </div>
  );
}

function LessonsImage() {
  return (
    <div className="absolute bg-[#d7d7d7] left-[5.85px] overflow-clip rounded-[100px] size-[27.3px] top-[5.85px]" data-name="Lessons Image">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[27.3px] top-1/2" data-name="Lessons Preview/Traveling/1" />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_104)" id="Icon">
          <path d="M4.49788 2.62376V7.87129" id="Vector" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.p6978400} id="Vector_2" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_104">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TypeBadge() {
  return (
    <div className="bg-[#e6f4ff] content-stretch flex gap-[4px] items-center px-[6px] py-[2px] relative rounded-[10px] shrink-0" data-name="TypeBadge">
      <Icon />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#003f6b] text-[10px] whitespace-nowrap">Watch</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_55)" id="Icon">
          <path d={svgPaths.peed3400} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.pc4d0400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_55">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Text">
      <Icon1 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">3-5 days</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[88px] pt-[4px] top-[68px] w-[255.97px]" data-name="Container">
      <TypeBadge />
      <Text />
    </div>
  );
}

function LessonsPreviewName() {
  return (
    <div className="absolute h-[80px] left-[8px] top-[8px] w-[274px]" data-name="Lessons Preview & Name">
      <div className="absolute left-[15px] rounded-[100px] size-[39px] top-[20px]" data-name="Lesson Card/Component/Preview">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <LessonsImage />
        </div>
        <div aria-hidden className="absolute border-[#8cb200] border-[1.463px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      </div>
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[24px] left-[88px] text-[#131313] text-[20px] top-[16px] tracking-[-0.06px] w-[186px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        We’re going on vacation
      </p>
      <Container />
    </div>
  );
}

function LessonsCard() {
  return (
    <div className="bg-[#f9ffe5] h-[110px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Lessons Card">
      <LessonsPreviewName />
      <div className="absolute h-[7px] left-[318px] top-[46px] w-[14px]" data-name="Vector">
        <div className="absolute inset-[-18.75%_-9.38%_-18.75%_-9.37%]">
          <svg className="block size-full" fill="none" height="9.625" preserveAspectRatio="none" viewBox="0 0 16.625 9.625" width="16.625">
            <path d={svgPaths.p3175c600} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.625" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LessonsImage1() {
  return (
    <div className="absolute bg-[#d7d7d7] left-[5.85px] overflow-clip rounded-[100px] size-[27.3px] top-[5.85px]" data-name="Lessons Image">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[27.3px] top-1/2" data-name="Lessons Preview/Traveling/1" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_104)" id="Icon">
          <path d="M4.49788 2.62376V7.87129" id="Vector" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.p6978400} id="Vector_2" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_104">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TypeBadge1() {
  return (
    <div className="bg-[#e6f4ff] content-stretch flex gap-[4px] items-center px-[6px] py-[2px] relative rounded-[10px] shrink-0" data-name="TypeBadge">
      <Icon2 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#003f6b] text-[10px] whitespace-nowrap">Watch</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_55)" id="Icon">
          <path d={svgPaths.peed3400} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.pc4d0400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_55">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Text">
      <Icon3 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">3-5 days</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[88px] pt-[4px] top-[68px] w-[255.97px]" data-name="Container">
      <TypeBadge1 />
      <Text1 />
    </div>
  );
}

function LessonsPreviewName1() {
  return (
    <div className="absolute h-[80px] left-[8px] top-[8px] w-[274px]" data-name="Lessons Preview & Name">
      <div className="absolute left-[15px] rounded-[100px] size-[39px] top-[20px]" data-name="Lesson Card/Component/Preview">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <LessonsImage1 />
        </div>
        <div aria-hidden className="absolute border-[#8cb200] border-[1.463px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      </div>
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[24px] left-[88px] text-[#131313] text-[20px] top-[16px] tracking-[-0.06px] w-[186px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        We’re going on vacation
      </p>
      <Container1 />
    </div>
  );
}

function LessonsCard1() {
  return (
    <div className="bg-[#f9ffe5] h-[110px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Lessons Card">
      <LessonsPreviewName1 />
      <div className="absolute h-[7px] left-[318px] top-[46px] w-[14px]" data-name="Vector">
        <div className="absolute inset-[-18.75%_-9.38%_-18.75%_-9.37%]">
          <svg className="block size-full" fill="none" height="9.625" preserveAspectRatio="none" viewBox="0 0 16.625 9.625" width="16.625">
            <path d={svgPaths.p3175c600} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.625" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LessonsImage2() {
  return (
    <div className="absolute bg-[#d7d7d7] left-[5.85px] overflow-clip rounded-[100px] size-[27.3px] top-[5.85px]" data-name="Lessons Image">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[27.3px] top-1/2" data-name="Lessons Preview/Traveling/1" />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_104)" id="Icon">
          <path d="M4.49788 2.62376V7.87129" id="Vector" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.p6978400} id="Vector_2" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_104">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TypeBadge2() {
  return (
    <div className="bg-[#e6f4ff] content-stretch flex gap-[4px] items-center px-[6px] py-[2px] relative rounded-[10px] shrink-0" data-name="TypeBadge">
      <Icon4 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#003f6b] text-[10px] whitespace-nowrap">Watch</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_55)" id="Icon">
          <path d={svgPaths.peed3400} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.pc4d0400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_55">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Text">
      <Icon5 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">3-5 days</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[88px] pt-[4px] top-[68px] w-[255.97px]" data-name="Container">
      <TypeBadge2 />
      <Text2 />
    </div>
  );
}

function LessonsPreviewName2() {
  return (
    <div className="absolute h-[80px] left-[8px] top-[8px] w-[274px]" data-name="Lessons Preview & Name">
      <div className="absolute left-[15px] rounded-[100px] size-[39px] top-[20px]" data-name="Lesson Card/Component/Preview">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <LessonsImage2 />
        </div>
        <div aria-hidden className="absolute border-[#8cb200] border-[1.463px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      </div>
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[24px] left-[88px] text-[#131313] text-[20px] top-[16px] tracking-[-0.06px] w-[186px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        We’re going on vacation
      </p>
      <Container2 />
    </div>
  );
}

function LessonsCard2() {
  return (
    <div className="bg-[#f9ffe5] h-[110px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Lessons Card">
      <LessonsPreviewName2 />
      <div className="absolute h-[7px] left-[318px] top-[46px] w-[14px]" data-name="Vector">
        <div className="absolute inset-[-18.75%_-9.38%_-18.75%_-9.37%]">
          <svg className="block size-full" fill="none" height="9.625" preserveAspectRatio="none" viewBox="0 0 16.625 9.625" width="16.625">
            <path d={svgPaths.p3175c600} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.625" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LessonsImage3() {
  return (
    <div className="absolute bg-[#d7d7d7] left-[5.85px] overflow-clip rounded-[100px] size-[27.3px] top-[5.85px]" data-name="Lessons Image">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[27.3px] top-1/2" data-name="Lessons Preview/Traveling/1" />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_104)" id="Icon">
          <path d="M4.49788 2.62376V7.87129" id="Vector" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.p6978400} id="Vector_2" stroke="#003F6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_104">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TypeBadge3() {
  return (
    <div className="bg-[#e6f4ff] content-stretch flex gap-[4px] items-center px-[6px] py-[2px] relative rounded-[10px] shrink-0" data-name="TypeBadge">
      <Icon6 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] not-italic relative shrink-0 text-[#003f6b] text-[10px] whitespace-nowrap">Watch</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[8.996px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.99576" preserveAspectRatio="none" viewBox="0 0 8.99576 8.99576" width="8.99576">
        <g clipPath="url(#clip0_0_55)" id="Icon">
          <path d={svgPaths.peed3400} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
          <path d={svgPaths.pc4d0400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.749647" />
        </g>
        <defs>
          <clipPath id="clip0_0_55">
            <rect fill="white" height="8.99576" width="8.99576" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Text">
      <Icon7 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#9ea2ae] text-[11px] whitespace-nowrap">3-5 days</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[23px] items-center left-[88px] pt-[4px] top-[68px] w-[255.97px]" data-name="Container">
      <TypeBadge3 />
      <Text3 />
    </div>
  );
}

function LessonsPreviewName3() {
  return (
    <div className="absolute h-[80px] left-[8px] top-[8px] w-[274px]" data-name="Lessons Preview & Name">
      <div className="absolute left-[15px] rounded-[100px] size-[39px] top-[20px]" data-name="Lesson Card/Component/Preview">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <LessonsImage3 />
        </div>
        <div aria-hidden className="absolute border-[#8cb200] border-[1.463px] border-solid inset-0 pointer-events-none rounded-[100px]" />
      </div>
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[24px] left-[88px] text-[#131313] text-[20px] top-[16px] tracking-[-0.06px] w-[186px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        We’re going on vacation
      </p>
      <Container3 />
    </div>
  );
}

function LessonsCard3() {
  return (
    <div className="bg-[#f9ffe5] h-[110px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Lessons Card">
      <LessonsPreviewName3 />
      <div className="absolute h-[7px] left-[318px] top-[46px] w-[14px]" data-name="Vector">
        <div className="absolute inset-[-18.75%_-9.38%_-18.75%_-9.37%]">
          <svg className="block size-full" fill="none" height="9.625" preserveAspectRatio="none" viewBox="0 0 16.625 9.625" width="16.625">
            <path d={svgPaths.p3175c600} id="Vector" stroke="#131927" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.625" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LessonsCardsList() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-name="Lessons Cards List">
      <LessonsCard />
      <LessonsCard1 />
      <LessonsCard2 />
      <LessonsCard3 />
    </div>
  );
}

function TodaysPlan() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[375px]" data-name="Today's plan">
      <ChapterNameChapter />
      <LessonsInfo />
      <LessonsCardsList />
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

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[39px] h-[210px] items-end justify-end mr-[-149px] relative shrink-0 w-[200px]">
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
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

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[210px] items-start relative shrink-0 w-[200px]">
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Pattern() {
  return (
    <div className="content-stretch flex items-center opacity-30 relative shrink-0" data-name="Pattern">
      <Frame20 />
      <Frame19 />
    </div>
  );
}

function Quotes() {
  return (
    <div className="h-[29.401px] relative shrink-0 w-[36.897px]" data-name="Quotes">
      <svg className="absolute block inset-0 size-full" fill="none" height="29.401" preserveAspectRatio="none" viewBox="0 0 36.897 29.401" width="36.897">
        <g id="Quotes">
          <path d={svgPaths.pc35ee40} fill="#8CB200" id="â" />
        </g>
      </svg>
    </div>
  );
}

function QuotesQuote() {
  return (
    <div className="content-stretch flex flex-col gap-[5.206px] items-center relative shrink-0" data-name="Quotes & Quote">
      <Quotes />
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[20.822px] relative shrink-0 text-[#131313] text-[15.617px] text-center tracking-[-0.0468px] w-[200.414px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        “There is only one good, knowledge, and one evil, ignorance.”
      </p>
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[13.014px] relative shrink-0 text-[#8cb200] text-[10.411px] text-center tracking-[-0.0416px] w-[200.414px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        ~ Socrates
      </p>
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

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[39px] h-[210px] items-end justify-end mr-[-149px] relative shrink-0 w-[200px]">
      <Frame10 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
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

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[210px] items-start relative shrink-0 w-[200px]">
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Pattern1() {
  return (
    <div className="content-stretch flex items-center opacity-30 relative shrink-0" data-name="Pattern">
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Quote() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex h-[129px] items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[386px]" data-name="Quote">
      <Pattern />
      <QuotesQuote />
      <Pattern1 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_36)" id="Icon">
          <path d={svgPaths.p32fdf400} id="Vector" stroke="#85A60C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_36">
            <rect fill="white" height="20.9645" width="20.9645" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon8 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#85a60c] text-[10.483px] text-center whitespace-nowrap">Today</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_95)" id="Icon">
          <path d={svgPaths.p5f3900} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
          <path d={svgPaths.p96b5400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_95">
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
      <Icon9 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Inspire</p>
    </div>
  );
}

function Icon10() {
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

function Button2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon10 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Roadmap</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_38)" id="Icon">
          <path d={svgPaths.p3b53ed00} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_38">
            <rect fill="white" height="20.9645" width="20.9645" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon11 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Chat</p>
    </div>
  );
}

function Icon12() {
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

function Button4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon12 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Profile</p>
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute backdrop-blur-[10.483px] bg-[#f8f8f8] content-stretch flex gap-px h-[88px] items-start justify-center left-0 pt-[13px] right-0 top-0" data-name="TabBar">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[119px] px-[17px] py-[8px] top-[68px] w-[174px]" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5.242px] relative rounded-[104.835px] shrink-0 w-full" data-name="Home Indicator" />
    </div>
  );
}

function Frame26() {
  return (
    <div className="h-[91px] relative shrink-0 w-full">
      <TabBar />
      <HomeIndicator />
    </div>
  );
}

export default function BookScreenFalse() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[37px] items-center relative size-full" data-name="Book Screen/False">
      <Frame25 />
      <DailyXp />
      <Frame24 />
      <TodaysPlan />
      <Quote />
      <Frame26 />
    </div>
  );
}