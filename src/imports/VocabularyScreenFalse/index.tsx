import svgPaths from "./svg-ko17kmvfvt";

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

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[20px] tracking-[-0.06px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Your Roadmaps
      </p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-[357px]">
      <Frame8 />
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#9ea2ae] text-[16px] tracking-[-0.048px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        Pin one to drive your Today screen.
      </p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d="M10.0022 5.83354V17.5002" id="Vector" stroke="#85A60C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p30ff8d80} id="Vector_2" stroke="#85A60C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Outline() {
  return (
    <div className="content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Outline">
      <div aria-hidden className="absolute border-2 border-[#8cb200] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon />
    </div>
  );
}

function IconButtonTitle() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Icon Button & Title">
      <Outline />
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Your Notes
      </p>
    </div>
  );
}

function YourNotes() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex items-center justify-between p-[16px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Your Notes">
      <IconButtonTitle />
      <div className="h-[14.001px] relative shrink-0 w-[7px]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" height="16.3339" preserveAspectRatio="none" viewBox="0 0 9.33368 16.3339" width="9.33368">
            <path d={svgPaths.p231809c8} id="Vector" stroke="#8CB200" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33342" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
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
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[13.995px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.9952" preserveAspectRatio="none" viewBox="0 0 13.9952 13.9952" width="13.9952">
        <g clipPath="url(#clip0_0_52)" id="Icon">
          <path d="M6.9976 9.91327V12.8289" id="Vector" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16627" />
          <path d={svgPaths.p21a12fc0} id="Vector_2" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16627" />
          <path d={svgPaths.p9eee980} id="Vector_3" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16627" />
          <path d={svgPaths.p25af7280} id="Vector_4" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16627" />
        </g>
        <defs>
          <clipPath id="clip0_0_52">
            <rect fill="white" height="13.9952" width="13.9952" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f8fde7] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[31.987px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[25px] items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[22.281px] relative shrink-0 text-[#131313] text-[18.567px] tracking-[-0.0557px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development
      </p>
      <Button />
      <div className="h-[6.499px] relative shrink-0 w-[12.997px]" data-name="Stroke 1">
        <div className="absolute inset-[-14.29%_-7.14%]">
          <svg className="block size-full" fill="none" height="8.35537" preserveAspectRatio="none" viewBox="0 0 14.854 8.35537" width="14.854">
            <path d={svgPaths.p8d93f80} id="Stroke 1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.85675" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[267.984px]">
      <Frame5 />
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#9ea2ae] text-[14px] tracking-[-0.042px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        8-12 weeks · 16 steps · 0% · Aug 8
      </p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[14px] items-start relative shrink-0">
      <Container />
      <Frame6 />
    </div>
  );
}

function LearningProgressComponent1() {
  return (
    <div className="-translate-y-1/2 [word-break:break-word] absolute bg-[#8cb200] content-stretch flex font-['SF_Pro:Semibold',sans-serif] font-[590] items-center justify-center leading-[0] left-[19.28px] px-[6.706px] py-[1.677px] rounded-[10.06px] text-[11.736px] text-white top-[calc(50%-0.03px)] tracking-[-0.0469px] whitespace-nowrap" data-name="Learning progress/Component">
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[16.766px]">10</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[16.766px]">%</p>
      </div>
    </div>
  );
}

function LearningProgressComponent() {
  return (
    <div className="bg-[#f8f8f8] h-[10.06px] relative rounded-[10.06px] shrink-0 w-[302.629px]" data-name="Learning progress/Component">
      <div className="absolute bg-[#8cb200] bottom-[0.06px] h-[10.06px] left-0 rounded-[10.06px] w-[37.829px]" />
      <LearningProgressComponent1 />
    </div>
  );
}

function LearningProgress() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-[13.413px] py-[6.706px] relative shrink-0 w-full" data-name="Learning progress">
      <LearningProgressComponent />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <Frame7 />
      <LearningProgress />
    </div>
  );
}

function VocabularyPreview() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.04px)] size-[26.219px] top-1/2" data-name="Vocabulary Preview/1">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.296px] left-[8.54px] text-[#131313] text-[14.637px] top-[3.79px] tracking-[-0.2744px] w-[10.558px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        1
      </p>
    </div>
  );
}

function Image() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip rounded-[46.687px] size-[26.145px] top-1/2" data-name="Image">
      <VocabularyPreview />
    </div>
  );
}

function VocabularyCardComponentPreviewImage() {
  return (
    <div className="absolute bg-[#d7d7d7] left-0 overflow-clip rounded-[46.687px] size-[26.145px] top-[5.93px]" data-name="Vocabulary Card/Component/Preview Image">
      <Image />
    </div>
  );
}

function ImageTitile() {
  return (
    <div className="absolute h-[38px] left-[14.85px] top-[11.14px] w-[270.157px]" data-name="Image & Titile">
      <VocabularyCardComponentPreviewImage />
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.567px] left-[44.57px] text-[#131313] text-[14.854px] top-0 tracking-[-0.2785px] w-[225.585px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Everything you need to know while on vacation
      </p>
    </div>
  );
}

function VocabularyScreenProgressChart() {
  return (
    <div className="absolute left-[-3px] size-[22.281px] top-0" data-name="Vocabulary Screen/Progress Chart">
      <div className="absolute inset-[-5.56%_-21.79%_0_0]">
        <svg className="block size-full" fill="none" height="23.5207" preserveAspectRatio="none" viewBox="0 0 27.1367 23.5207" width="27.1367">
          <g id="Vocabulary Screen/Progress Chart">
            <path clipRule="evenodd" d={svgPaths.p135b6500} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
            <rect height="20" id="Rectangle 6" rx="2" stroke="black" strokeWidth="2" width="6" x="20.1367" y="1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ArrowDown() {
  return (
    <div className="absolute inset-[35.42%_20.83%]" data-name="Arrow - Down 2">
      <div className="absolute inset-[-14.29%_-7.14%_-14.28%_-7.14%]">
        <svg className="block size-full" fill="none" height="8.35537" preserveAspectRatio="none" viewBox="0 0 14.854 8.35537" width="14.854">
          <g id="Arrow - Down 2">
            <path d={svgPaths.p8d93f80} id="Stroke 1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.85675" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ShortArrow() {
  return (
    <div className="absolute left-0 size-[22.281px] top-[22.28px]" data-name="Short Arrow">
      <ArrowDown />
    </div>
  );
}

function InfoIconArrowIcon() {
  return (
    <div className="absolute bottom-[10.86px] left-[299.87px] top-[11.14px] w-[22.281px]" data-name="Info Icon & Arrow Icon">
      <VocabularyScreenProgressChart />
      <ShortArrow />
    </div>
  );
}

function VocabularyCard() {
  return (
    <div className="h-[77px] relative rounded-[11.14px] shrink-0 w-full" data-name="Vocabulary Card">
      <ImageTitile />
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[59px] not-italic text-[#9ea2ae] text-[11px] top-[49px] whitespace-nowrap">0/4 steps · 2-3 weeks</p>
      <InfoIconArrowIcon />
    </div>
  );
}

function VocabularyPreview1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.04px)] size-[26.219px] top-1/2" data-name="Vocabulary Preview/1">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.296px] left-[8.54px] text-[#131313] text-[14.637px] top-[3.79px] tracking-[-0.2744px] w-[10.558px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        2
      </p>
    </div>
  );
}

function Image1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip rounded-[46.687px] size-[26.145px] top-1/2" data-name="Image">
      <VocabularyPreview1 />
    </div>
  );
}

function VocabularyCardComponentPreviewImage1() {
  return (
    <div className="absolute bg-[#d7d7d7] left-0 overflow-clip rounded-[46.687px] size-[26.145px] top-[5.93px]" data-name="Vocabulary Card/Component/Preview Image">
      <Image1 />
    </div>
  );
}

function ImageTitile1() {
  return (
    <div className="absolute h-[38px] left-[14.85px] top-[11.14px] w-[270.157px]" data-name="Image & Titile">
      <VocabularyCardComponentPreviewImage1 />
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.567px] left-[44.57px] text-[#131313] text-[14.854px] top-0 tracking-[-0.2785px] w-[225.585px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Everything you need to know while on vacation
      </p>
    </div>
  );
}

function VocabularyScreenProgressChart1() {
  return (
    <div className="absolute left-[-3px] size-[22.281px] top-0" data-name="Vocabulary Screen/Progress Chart">
      <div className="absolute inset-[-5.56%_-21.79%_0_0]">
        <svg className="block size-full" fill="none" height="23.5207" preserveAspectRatio="none" viewBox="0 0 27.1367 23.5207" width="27.1367">
          <g id="Vocabulary Screen/Progress Chart">
            <path clipRule="evenodd" d={svgPaths.p135b6500} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
            <rect height="20" id="Rectangle 6" rx="2" stroke="black" strokeWidth="2" width="6" x="20.1367" y="1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ArrowDown1() {
  return (
    <div className="absolute inset-[35.42%_20.83%]" data-name="Arrow - Down 2">
      <div className="absolute inset-[-14.29%_-7.14%_-14.28%_-7.14%]">
        <svg className="block size-full" fill="none" height="8.35537" preserveAspectRatio="none" viewBox="0 0 14.854 8.35537" width="14.854">
          <g id="Arrow - Down 2">
            <path d={svgPaths.p8d93f80} id="Stroke 1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.85675" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ShortArrow1() {
  return (
    <div className="absolute left-0 size-[22.281px] top-[22.28px]" data-name="Short Arrow">
      <ArrowDown1 />
    </div>
  );
}

function InfoIconArrowIcon1() {
  return (
    <div className="absolute bottom-[11.14px] left-[299.87px] top-[11.14px] w-[22.281px]" data-name="Info Icon & Arrow Icon">
      <VocabularyScreenProgressChart1 />
      <ShortArrow1 />
    </div>
  );
}

function VocabularyCard1() {
  return (
    <div className="h-[74px] relative rounded-[11.14px] shrink-0 w-full" data-name="Vocabulary Card">
      <ImageTitile1 />
      <InfoIconArrowIcon1 />
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[60.54px] not-italic text-[#9ea2ae] text-[11px] top-[50.84px] whitespace-nowrap">0/4 steps · 2-3 weeks</p>
    </div>
  );
}

function VocabularyPreview2() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.04px)] size-[26.219px] top-1/2" data-name="Vocabulary Preview/1">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.296px] left-[8.54px] text-[#131313] text-[14.637px] top-[3.79px] tracking-[-0.2744px] w-[10.558px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
      </p>
    </div>
  );
}

function Image2() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip rounded-[46.687px] size-[26.145px] top-1/2" data-name="Image">
      <VocabularyPreview2 />
    </div>
  );
}

function VocabularyCardComponentPreviewImage2() {
  return (
    <div className="absolute bg-[#d7d7d7] left-0 overflow-clip rounded-[46.687px] size-[26.145px] top-[5.93px]" data-name="Vocabulary Card/Component/Preview Image">
      <Image2 />
    </div>
  );
}

function ImageTitile2() {
  return (
    <div className="absolute h-[38px] left-[14.85px] top-[11.14px] w-[270.157px]" data-name="Image & Titile">
      <VocabularyCardComponentPreviewImage2 />
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.567px] left-[44.57px] text-[#131313] text-[14.854px] top-0 tracking-[-0.2785px] w-[225.585px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Everything you need to know while on vacation
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[44.68px] not-italic text-[#9ea2ae] text-[11px] top-[41.7px] whitespace-nowrap">0/4 steps · 2-3 weeks</p>
    </div>
  );
}

function VocabularyScreenProgressChart2() {
  return (
    <div className="absolute left-[-3px] size-[22.281px] top-0" data-name="Vocabulary Screen/Progress Chart">
      <div className="absolute inset-[-5.56%_-21.79%_0_0]">
        <svg className="block size-full" fill="none" height="23.5207" preserveAspectRatio="none" viewBox="0 0 27.1367 23.5207" width="27.1367">
          <g id="Vocabulary Screen/Progress Chart">
            <path clipRule="evenodd" d={svgPaths.p135b6500} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
            <rect height="20" id="Rectangle 6" rx="2" stroke="black" strokeWidth="2" width="6" x="20.1367" y="1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ArrowDown2() {
  return (
    <div className="absolute inset-[35.42%_20.83%]" data-name="Arrow - Down 2">
      <div className="absolute inset-[-14.29%_-7.14%_-14.28%_-7.14%]">
        <svg className="block size-full" fill="none" height="8.35537" preserveAspectRatio="none" viewBox="0 0 14.854 8.35537" width="14.854">
          <g id="Arrow - Down 2">
            <path d={svgPaths.p8d93f80} id="Stroke 1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.85675" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ShortArrow2() {
  return (
    <div className="absolute left-0 size-[22.281px] top-[22.28px]" data-name="Short Arrow">
      <ArrowDown2 />
    </div>
  );
}

function InfoIconArrowIcon2() {
  return (
    <div className="absolute bottom-[11.14px] left-[299.87px] top-[11.14px] w-[22.281px]" data-name="Info Icon & Arrow Icon">
      <VocabularyScreenProgressChart2 />
      <ShortArrow2 />
    </div>
  );
}

function VocabularyCard2() {
  return (
    <div className="h-[79px] relative rounded-[11.14px] shrink-0 w-full" data-name="Vocabulary Card">
      <ImageTitile2 />
      <InfoIconArrowIcon2 />
    </div>
  );
}

function VocabularyPreview3() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.04px)] size-[26.219px] top-1/2" data-name="Vocabulary Preview/1">
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.296px] left-[8.54px] text-[#131313] text-[14.637px] top-[3.79px] tracking-[-0.2744px] w-[10.558px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        4
      </p>
    </div>
  );
}

function Image3() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip rounded-[46.687px] size-[26.145px] top-1/2" data-name="Image">
      <VocabularyPreview3 />
    </div>
  );
}

function VocabularyCardComponentPreviewImage3() {
  return (
    <div className="absolute bg-[#d7d7d7] left-0 overflow-clip rounded-[46.687px] size-[26.145px] top-[5.93px]" data-name="Vocabulary Card/Component/Preview Image">
      <Image3 />
    </div>
  );
}

function ImageTitile3() {
  return (
    <div className="absolute h-[38px] left-[14.85px] top-[11.14px] w-[270.157px]" data-name="Image & Titile">
      <VocabularyCardComponentPreviewImage3 />
      <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[18.567px] left-[44.57px] text-[#131313] text-[14.854px] top-0 tracking-[-0.2785px] w-[225.585px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Everything you need to know while on vacation
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-[45.68px] not-italic text-[#9ea2ae] text-[11px] top-[39.7px] whitespace-nowrap">0/4 steps · 2-3 weeks</p>
    </div>
  );
}

function VocabularyScreenProgressChart3() {
  return (
    <div className="absolute left-[-3px] size-[22.281px] top-0" data-name="Vocabulary Screen/Progress Chart">
      <div className="absolute inset-[-5.56%_-21.79%_0_0]">
        <svg className="block size-full" fill="none" height="23.5207" preserveAspectRatio="none" viewBox="0 0 27.1367 23.5207" width="27.1367">
          <g id="Vocabulary Screen/Progress Chart">
            <path clipRule="evenodd" d={svgPaths.p135b6500} fill="#131313" fillRule="evenodd" id="Icon (Stroke)" />
            <rect height="20" id="Rectangle 6" rx="2" stroke="black" strokeWidth="2" width="6" x="20.1367" y="1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ArrowDown3() {
  return (
    <div className="absolute inset-[35.42%_20.83%]" data-name="Arrow - Down 2">
      <div className="absolute inset-[-14.29%_-7.14%_-14.28%_-7.14%]">
        <svg className="block size-full" fill="none" height="8.35537" preserveAspectRatio="none" viewBox="0 0 14.854 8.35537" width="14.854">
          <g id="Arrow - Down 2">
            <path d={svgPaths.p8d93f80} id="Stroke 1" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.85675" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ShortArrow3() {
  return (
    <div className="absolute left-0 size-[22.281px] top-[22.28px]" data-name="Short Arrow">
      <ArrowDown3 />
    </div>
  );
}

function InfoIconArrowIcon3() {
  return (
    <div className="absolute bottom-[10.86px] left-[299.87px] top-[11.14px] w-[22.281px]" data-name="Info Icon & Arrow Icon">
      <VocabularyScreenProgressChart3 />
      <ShortArrow3 />
    </div>
  );
}

function VocabularyCard3() {
  return (
    <div className="h-[77px] relative rounded-[11.14px] shrink-0 w-full" data-name="Vocabulary Card">
      <ImageTitile3 />
      <InfoIconArrowIcon3 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-full">
      <VocabularyCard />
      <VocabularyCard1 />
      <VocabularyCard2 />
      <VocabularyCard3 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-start relative shrink-0 w-[337px]">
      <Frame12 />
      <Frame11 />
    </div>
  );
}

function Frame() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-[305px]" />;
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.982px] items-start left-0 overflow-clip right-0 top-0" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development docs
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-0 overflow-clip top-[20px] w-[259px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#9ea2ae] text-[14px] tracking-[-0.042px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Official documentation for React Development
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[35.982px] relative shrink-0 w-[253.999px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[15.985px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9854" preserveAspectRatio="none" viewBox="0 0 15.9854 15.9854" width="15.9854">
        <g id="Icon">
          <path d={svgPaths.p351c4b80} id="Vector" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p7cb6c40} id="Vector_2" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p2569ad00} id="Vector_3" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex items-center justify-between px-px py-[12px] relative shrink-0 w-full" data-name="Link">
      <Container1 />
      <Icon3 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.982px] items-start left-0 overflow-clip right-0 top-0" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development docs
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-0 overflow-clip top-[20px] w-[259px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#9ea2ae] text-[14px] tracking-[-0.042px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Official documentation for React Development
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[35.982px] relative shrink-0 w-[253.999px]" data-name="Container">
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[15.985px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9854" preserveAspectRatio="none" viewBox="0 0 15.9854 15.9854" width="15.9854">
        <g id="Icon">
          <path d={svgPaths.p351c4b80} id="Vector" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p7cb6c40} id="Vector_2" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p2569ad00} id="Vector_3" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex items-center justify-between px-px py-[12px] relative shrink-0 w-full" data-name="Link">
      <Container2 />
      <Icon4 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.982px] items-start left-0 overflow-clip right-0 top-0" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development docs
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-start left-0 overflow-clip top-[20px] w-[259px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#9ea2ae] text-[14px] tracking-[-0.042px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Official documentation for React Development
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[35.982px] relative shrink-0 w-[253.999px]" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[15.985px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9854" preserveAspectRatio="none" viewBox="0 0 15.9854 15.9854" width="15.9854">
        <g id="Icon">
          <path d={svgPaths.p351c4b80} id="Vector" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p7cb6c40} id="Vector_2" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p2569ad00} id="Vector_3" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex items-center justify-between px-px py-[12px] relative shrink-0 w-full" data-name="Link">
      <Container3 />
      <Icon5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[14px] relative shrink-0 w-[319px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[22.281px] min-w-full relative shrink-0 text-[#131313] text-[18.567px] tracking-[-0.0557px] w-[min-content]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Tools You’ll Use
      </p>
      <Frame />
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Frame3() {
  return <div className="bg-[#f2f2f2] h-[2px] relative shrink-0 w-[305px]" />;
}

function Paragraph6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.982px] items-start left-[33px] overflow-clip right-[-33px] top-[8px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development docs
      </p>
    </div>
  );
}

function Paragraph7() {
  return <div className="absolute h-[16px] left-0 top-[20px] w-[259px]" data-name="Paragraph" />;
}

function Icon6() {
  return (
    <div className="absolute left-0 size-[22px] top-[8.18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="Icon">
          <path d={svgPaths.p1068cf0} id="Vector" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p24329d00} id="Vector_2" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[35.982px] relative shrink-0 w-[253.999px]" data-name="Container">
      <Paragraph6 />
      <Paragraph7 />
      <Icon6 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[15.985px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9854" preserveAspectRatio="none" viewBox="0 0 15.9854 15.9854" width="15.9854">
        <g id="Icon">
          <path d={svgPaths.p351c4b80} id="Vector" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p7cb6c40} id="Vector_2" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p2569ad00} id="Vector_3" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex items-center justify-between px-px py-[12px] relative shrink-0 w-full" data-name="Link">
      <Container4 />
      <Icon7 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.982px] items-start left-[33px] overflow-clip right-[-33px] top-[8px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development docs
      </p>
    </div>
  );
}

function Paragraph9() {
  return <div className="absolute h-[16px] left-0 top-[20px] w-[259px]" data-name="Paragraph" />;
}

function Icon8() {
  return (
    <div className="absolute left-0 size-[22px] top-[8.18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g clipPath="url(#clip0_0_63)" id="Icon">
          <path d={svgPaths.p34f9e600} id="Vector" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p9688780} id="Vector_2" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d="M1.83333 11H20.1667" id="Vector_3" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
        <defs>
          <clipPath id="clip0_0_63">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[35.982px] relative shrink-0 w-[253.999px]" data-name="Container">
      <Paragraph8 />
      <Paragraph9 />
      <Icon8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[15.985px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9854" preserveAspectRatio="none" viewBox="0 0 15.9854 15.9854" width="15.9854">
        <g id="Icon">
          <path d={svgPaths.p351c4b80} id="Vector" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p7cb6c40} id="Vector_2" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p2569ad00} id="Vector_3" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex items-center justify-between px-px py-[12px] relative shrink-0 w-full" data-name="Link">
      <Container5 />
      <Icon9 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.982px] items-start left-[33px] overflow-clip right-[-33px] top-[8px]" data-name="Paragraph">
      <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['SF_Pro:Medium',sans-serif] font-[510] leading-[24px] relative shrink-0 text-[#131313] text-[18px] tracking-[-0.054px] underline whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        React Development docs
      </p>
    </div>
  );
}

function Paragraph11() {
  return <div className="absolute h-[16px] left-0 top-[20px] w-[259px]" data-name="Paragraph" />;
}

function Icon10() {
  return (
    <div className="absolute left-0 size-[22px] top-[8.18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="Icon">
          <path d={svgPaths.p1068cf0} id="Vector" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p24329d00} id="Vector_2" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[35.982px] relative shrink-0 w-[253.999px]" data-name="Container">
      <Paragraph10 />
      <Paragraph11 />
      <Icon10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[15.985px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9854" preserveAspectRatio="none" viewBox="0 0 15.9854 15.9854" width="15.9854">
        <g id="Icon">
          <path d={svgPaths.p351c4b80} id="Vector" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p7cb6c40} id="Vector_2" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
          <path d={svgPaths.p2569ad00} id="Vector_3" stroke="#C8CBD3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33212" />
        </g>
      </svg>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex items-center justify-between px-px py-[12px] relative shrink-0 w-full" data-name="Link">
      <Container6 />
      <Icon11 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start pl-[15px] relative shrink-0 w-[319px]">
      <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[22.281px] min-w-full relative shrink-0 text-[#131313] text-[18.567px] tracking-[-0.0557px] w-[min-content]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Follow The Experts
      </p>
      <Frame3 />
      <Link3 />
      <Link4 />
      <Link5 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#f9ffe5] content-stretch flex flex-col gap-[37px] h-[966px] items-start pb-[27px] pt-[18px] px-[14px] relative rounded-[24px] shrink-0 w-[365px]">
      <Frame13 />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Primary() {
  return (
    <div className="bg-[#8cb200] content-stretch flex items-center justify-center px-[20px] py-[12px] relative rounded-[12px] shrink-0 w-[361px]" data-name="Primary">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white tracking-[-0.408px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100', fontFeatureSettings: '"case" 1' }}>
        <p className="leading-[24px]">Create new Roadmap</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16.988px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.9884" preserveAspectRatio="none" viewBox="0 0 16.9884 16.9884" width="16.9884">
        <g clipPath="url(#clip0_0_81)" id="Icon">
          <path d={svgPaths.p3c525580} id="Vector" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4157" />
          <path d={svgPaths.p1e550260} id="Vector_2" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4157" />
          <path d={svgPaths.p25ee0400} id="Vector_3" stroke="#4E6207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4157" />
        </g>
        <defs>
          <clipPath id="clip0_0_81">
            <rect fill="white" height="16.9884" width="16.9884" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="border-[#d2d5db] border-[1.019px] border-dashed content-stretch flex gap-[8px] h-[53.99px] items-center justify-center p-[16px] relative rounded-[16px] shrink-0 w-[349.991px]" data-name="Button">
      <Icon12 />
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[20px] relative shrink-0 text-[#1c2400] text-[16px] text-center tracking-[-0.064px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Skill Crossover
      </p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0" data-name="Button:margin">
      <Button1 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_34)" id="Icon">
          <path d={svgPaths.p32fdf400} id="Vector" stroke="#85A60C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
        </g>
        <defs>
          <clipPath id="clip0_0_34">
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
      <Icon13 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#85a60c] text-[10.483px] text-center whitespace-nowrap">Today</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_38)" id="Icon">
          <path d={svgPaths.p5f3900} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
          <path d={svgPaths.p96b5400} id="Vector_2" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
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
      <Icon14 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Inspire</p>
    </div>
  );
}

function Icon15() {
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

function Button4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon15 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Roadmap</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[20.965px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.9645" preserveAspectRatio="none" viewBox="0 0 20.9645 20.9645" width="20.9645">
        <g clipPath="url(#clip0_0_36)" id="Icon">
          <path d={svgPaths.p3b53ed00} id="Vector" stroke="#9EA2AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.74704" />
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

function Button5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon16 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Chat</p>
    </div>
  );
}

function Icon17() {
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

function Button6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.193px] h-[45.351px] items-center min-w-px pt-[4.193px] relative" data-name="Button">
      <Icon17 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15.725px] not-italic relative shrink-0 text-[#9ea2ae] text-[10.483px] text-center whitespace-nowrap">Profile</p>
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute backdrop-blur-[10.483px] bg-[#f8f8f8] content-stretch flex gap-px h-[88px] items-start justify-center left-0 pt-[13px] right-0 top-0" data-name="TabBar">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
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

function Frame4() {
  return (
    <div className="h-[91px] relative shrink-0 w-full">
      <TabBar />
      <HomeIndicator />
    </div>
  );
}

export default function VocabularyScreenFalse() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[23px] items-center relative size-full" data-name="Vocabulary Screen/False">
      <div className="bg-white h-[59px] relative shrink-0 w-[393px]" data-name="StatusBar">
        <div className="flex flex-row items-end justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-end justify-center relative size-full">
            <LeftSide />
            <DynamicIsland />
            <RightSide />
          </div>
        </div>
      </div>
      <Frame9 />
      <YourNotes />
      <Frame10 />
      <Primary />
      <ButtonMargin />
      <Frame4 />
    </div>
  );
}