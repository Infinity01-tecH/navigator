import svgPaths from "./svg-i8mhn8rzzt";
type SearchProps = {
  className?: string;
  darkMode?: "False";
  state?: "Default";
};

function Search({ className, darkMode = "False", state = "Default" }: SearchProps) {
  return (
    <div className={className || "relative"}>
      <div className="content-stretch flex items-start relative size-full">
        <div className="bg-[#f8f8f8] relative rounded-[12px] shrink-0" data-name="Filled">
          <div className="content-stretch flex items-start p-[8px] relative size-full">
            <div className="relative shrink-0 size-[24px]" data-name="Basic Screens/Search">
              <div className="absolute inset-[7.41%_6.07%_4.17%_7.41%]" data-name="Search">
                <svg className="absolute block inset-0 size-full" fill="none" height="21.222" preserveAspectRatio="none" viewBox="0 0 20.7643 21.222" width="20.7643">
                  <g id="Search">
                    <path clipRule="evenodd" d={svgPaths.p3c7c4b00} fill="#131313" fillRule="evenodd" id="Ellipse_739 (Stroke)" />
                    <path clipRule="evenodd" d={svgPaths.p264ff00} fill="#131313" fillRule="evenodd" id="Line_181 (Stroke)" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
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

function TitleSearch() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[16px] px-[16px] relative shrink-0 w-full" data-name="Title & Search">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Friends
      </p>
      <Search className="relative shrink-0" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[393px]">
      <StatusBar />
      <TitleSearch />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute flex inset-[2.77%_54.19%_48.39%_-3.34%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="flex-none h-[hypot(-18.4193cqw,81.2787cqh)] rotate-[12.85deg] w-[hypot(81.5807cqw,18.7213cqh)]">
        <div className="relative size-full" data-name="Group">
          <svg className="absolute block inset-0 size-full" fill="none" height="146.983" preserveAspectRatio="none" viewBox="0 0 148.459 146.983" width="148.459">
            <g id="Group">
              <path d={svgPaths.pbfd0180} fill="black" fillOpacity="0.1" id="Vector" />
              <path d={svgPaths.p3e841b00} fill="#F7D67C" id="Vector_2" />
              <g id="hair-variant30-545fac91">
                <path d={svgPaths.pbd6d00} fill="black" id="Vector_3" />
                <g id="head-variant03-545fac91">
                  <path d={svgPaths.p28d5a080} fill="black" id="Vector_4" />
                  <path d={svgPaths.p3e325880} fill="white" id="Vector_5" />
                  <path d={svgPaths.pcd34880} fill="black" id="Vector_6" />
                  <g id="eyes-variant23-545fac91">
                    <path d={svgPaths.pddf1100} fill="black" id="Vector_7" />
                  </g>
                  <g id="eyebrows-variant08-545fac91">
                    <path d={svgPaths.p15768840} fill="black" id="Vector_8" />
                  </g>
                  <g id="nose-variant02-545fac91">
                    <path d={svgPaths.p195f9f00} fill="black" id="Vector_9" />
                  </g>
                  <g id="mouth-happy07-545fac91">
                    <path d={svgPaths.p3c8f1300} fill="black" id="Vector_10" />
                  </g>
                </g>
                <path d={svgPaths.p3a1d8480} fill="black" id="Vector_11" />
              </g>
              <g id="hairAccessories-flowers-545fac91">
                <path d={svgPaths.p9788ff0} fill="black" id="Vector_12" />
                <path d={svgPaths.p1b574c00} fill="white" id="Vector_13" />
                <path d={svgPaths.pad9bb80} fill="black" id="Vector_14" />
                <path d={svgPaths.p2f5cadc0} fill="white" id="Vector_15" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute flex inset-[43.21%_2.4%_12.68%_52.88%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="flex-none h-[hypot(-20.5852cqw,78.6378cqh)] rotate-[14.86deg] w-[hypot(79.4148cqw,21.3622cqh)]">
        <div className="relative size-full" data-name="Group">
          <svg className="absolute block inset-0 size-full" fill="none" height="129.553" preserveAspectRatio="none" viewBox="0 0 132.626 129.553" width="132.626">
            <g id="Group">
              <path d={svgPaths.p176ac9c0} fill="black" fillOpacity="0.1" id="Vector" />
              <path d={svgPaths.p2e8652b0} fill="#CFE58C" id="Vector_2" />
              <g id="head-default-494eadb3">
                <path d={svgPaths.p3d01fb6c} fill="black" id="Vector_3" />
                <path clipRule="evenodd" d={svgPaths.p38ba6300} fill="#763900" fillRule="evenodd" id="Vector_4" />
              </g>
              <g id="eyes-variant03-494eadb3">
                <path d={svgPaths.p2607ed00} fill="black" id="Vector_5" />
                <path d={svgPaths.p17c49500} fill="white" id="Vector_6" />
                <path d={svgPaths.p17ef500} fill="black" id="Vector_7" />
                <path d={svgPaths.p3b7bbe00} fill="white" id="Vector_8" />
                <path d={svgPaths.p2a395680} fill="black" id="Vector_9" />
              </g>
              <g id="eyebrows-variant12-494eadb3">
                <path d={svgPaths.p1fc8bb00} fill="black" id="Vector_10" />
              </g>
              <g id="mouth-variant22-494eadb3">
                <path d={svgPaths.p2caa6a00} fill="black" id="Vector_11" />
                <path d={svgPaths.p2c0e2a80} fill="white" id="Vector_12" />
              </g>
              <g id="glasses-variant03-494eadb3">
                <path d={svgPaths.p33919600} fill="black" id="Vector_13" />
              </g>
              <g id="hair-long23-494eadb3">
                <path d={svgPaths.p2192a080} fill="black" id="Vector_14" />
                <g id="Group_2">
                  <path d={svgPaths.p3d19c126} fill="#796A45" id="Vector_15" />
                  <path d={svgPaths.p11301b00} fill="#796A45" id="Vector_16" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Flag2() {
  return (
    <div className="absolute inset-[3.65%_10.31%_82.76%_76.48%]" data-name="Flag 3">
      <svg className="absolute block inset-0 size-full" fill="none" height="49.0659" preserveAspectRatio="none" viewBox="0 0 47.6668 49.0659" width="47.6668">
        <g id="Flag 3">
          <path d={svgPaths.p7150ec0} fill="#131313" id="Vector" />
          <g id="Group">
            <path d={svgPaths.p6e96180} fill="white" id="Vector_2" />
            <g clipPath="url(#clip0_0_29)" id="devicon:figma">
              <path d={svgPaths.p3d018b00} fill="#0ACF83" id="Vector_3" />
              <path d={svgPaths.pb390a00} fill="#A259FF" id="Vector_4" />
              <path d={svgPaths.p22f6340} fill="#F24E1E" id="Vector_5" />
              <path d={svgPaths.p1637b80} fill="#FF7262" id="Vector_6" />
              <path d={svgPaths.p39b7b80} fill="#1ABCFE" id="Vector_7" />
            </g>
          </g>
        </g>
        <defs>
          <clipPath id="clip0_0_29">
            <rect fill="white" height="26.1875" transform="translate(11.8995 9.83643)" width="26.1875" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[72.02%_88.04%_21.53%_5.54%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.2764" preserveAspectRatio="none" viewBox="0 0 23.1641 23.2764" width="23.1641">
        <g id="Group">
          <path d={svgPaths.pb131400} fill="#FF7043" id="Vector" />
          <path d={svgPaths.p1acad500} fill="#FF7043" id="Vector_2" />
          <path d={svgPaths.p371c3f80} fill="#FF7043" id="Vector_3" />
          <path d={svgPaths.p4ad2280} fill="#FF7043" id="Vector_4" />
          <path d={svgPaths.p3da1b800} fill="#FF7043" id="Vector_5" />
          <path d={svgPaths.p24b93980} fill="#FF7043" id="Vector_6" />
          <path d={svgPaths.p64fbac0} fill="#FF7043" id="Vector_7" />
          <path d={svgPaths.p501d4f2} fill="#FF7043" id="Vector_8" />
          <path d={svgPaths.p19198600} fill="#FF7043" id="Vector_9" />
          <path d={svgPaths.pa709580} fill="#FF7043" id="Vector_10" />
          <path d={svgPaths.p28754780} fill="#FF7043" id="Vector_11" />
          <path d={svgPaths.p27a656f2} fill="#FF7043" id="Vector_12" />
        </g>
      </svg>
    </div>
  );
}

function Flag1() {
  return (
    <div className="absolute contents inset-[72.02%_88.04%_21.53%_5.54%]" data-name="Flag 2">
      <Group2 />
    </div>
  );
}

function Flag() {
  return (
    <div className="absolute inset-[91.21%_29.06%_0.63%_63.02%]" data-name="Flag 1">
      <svg className="absolute block inset-0 size-full" fill="none" height="29.4795" preserveAspectRatio="none" viewBox="0 0 28.5834 29.4795" width="28.5834">
        <g id="Flag 1">
          <path d={svgPaths.p38efd0c0} fill="#131313" id="Vector" />
          <path d={svgPaths.p109ba400} fill="#F9FFE6" id="Vector_2" />
          <g id="basil:music-solid">
            <path d={svgPaths.p3cd48880} fill="black" id="Vector_3" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function FindFriendsIllustration() {
  return (
    <div className="relative shrink-0 size-[361px]" data-name="Find Friends Illustration">
      <div className="absolute inset-[0.05%_-1.65%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="360.628" preserveAspectRatio="none" viewBox="0 0 372.924 360.628" width="372.924">
          <path d={svgPaths.p23144f80} fill="#F9FFE6" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[5.87%_2.35%_-4.96%_-10.03%]" data-name="Line (Stroke)">
        <svg className="absolute block inset-0 size-full" fill="none" height="357.719" preserveAspectRatio="none" viewBox="0 0 388.753 357.719" width="388.753">
          <path clipRule="evenodd" d={svgPaths.p2270a000} fill="#8CB200" fillRule="evenodd" id="Line (Stroke)" />
        </svg>
      </div>
      <Group />
      <Group1 />
      <Flag2 />
      <div className="absolute inset-[69.48%_84.64%_19.35%_4.17%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="40.3222" preserveAspectRatio="none" viewBox="0 0 40.3732 40.3222" width="40.3732">
          <path d={svgPaths.p1c5a940} fill="#131313" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[69.76%_85.54%_19.1%_3.3%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="40.2092" preserveAspectRatio="none" viewBox="0 0 40.2777 40.2092" width="40.2777">
          <path d={svgPaths.p77faef0} fill="#F9FFE6" id="Vector" />
        </svg>
      </div>
      <Flag1 />
      <Flag />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <FindFriendsIllustration />
    </div>
  );
}

function TitleDescription() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#131313] text-center" data-name="Title & Description">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[24px] relative shrink-0 text-[20px] tracking-[-0.06px] w-[361px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Makes friends with people like you, intentional for growth
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[16px] tracking-[-0.048px] w-[361px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`It's kind of quiet here... Add friends! You can check each other's streak and achievements.`}</p>
    </div>
  );
}

function Primary() {
  return (
    <div className="bg-[#8cb200] content-stretch flex items-center justify-center px-[20px] py-[12px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Primary">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white tracking-[-0.408px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100', fontFeatureSettings: '"case" 1' }}>
        <p className="leading-[24px]">Find friends</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0">
      <Frame1 />
      <Frame />
      <TitleDescription />
      <Primary />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="content-stretch flex flex-col items-start px-[129px] py-[8px] relative shrink-0 w-[393px]" data-name="HomeIndicator">
      <div className="bg-[#131313] h-[5px] relative rounded-[100px] shrink-0 w-full" data-name="Home Indicator" />
    </div>
  );
}

export default function SettingsScreenChatScreen2DarkMode() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[122px] items-center pb-[13px] relative size-full" data-name="Settings Screen/Chat Screen - 2/Dark Mode4">
      <Frame2 />
      <HomeIndicator />
    </div>
  );
}