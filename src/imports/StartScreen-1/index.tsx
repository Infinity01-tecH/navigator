import svgPaths from "./svg-g1me5hprom";
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

function TitileDescription() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[4px] items-center leading-[0] left-[16px] text-[#131313] text-center top-[646px]" data-name="Titile & Description">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[32px] tracking-[-0.096px] w-[269px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[40px]">Welcome to your first skill!</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center relative shrink-0 text-[18px] tracking-[-0.054px] w-[361px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Let’s build your roadmap</p>
      </div>
    </div>
  );
}

function Sleeve() {
  return (
    <div className="absolute inset-[20.72%_57.48%_36.34%_9.17%]" data-name="Sleeve">
      <svg className="absolute block inset-0 size-full" fill="none" height="155" preserveAspectRatio="none" viewBox="0 0 120.4 155" width="120.4">
        <g id=" Sleeve">
          <path d={svgPaths.p166c08c0} fill="#8CB200" id="Vector" />
          <path d={svgPaths.p38b2ed00} fill="#131313" id="Vector_2" opacity="0.2" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[5.65%_88.92%_89.94%_8.7%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="15.9" preserveAspectRatio="none" viewBox="0 0 8.6 15.9" width="8.6">
        <g id="Group">
          <path d={svgPaths.p15dfe600} fill="#AA4C20" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[6.81%_91.08%_90.03%_7.29%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.4" preserveAspectRatio="none" viewBox="0 0 5.9 11.4" width="5.9">
        <g id="Group">
          <path d={svgPaths.p3ba78000} fill="#AA4C20" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[5.65%_88.92%_89.94%_7.29%]" data-name="Group">
      <Group3 />
      <Group4 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[3.24%_78.84%_79.09%_6.75%]" data-name="Group">
      <div className="absolute inset-[3.24%_78.84%_79.09%_6.75%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="63.8055" preserveAspectRatio="none" viewBox="0 0 52.0225 63.8055" width="52.0225">
          <path d={svgPaths.p18ace80} fill="#D08B5B" id="Vector" />
        </svg>
      </div>
      <Group2 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[3.24%_78.84%_79.09%_6.75%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Wrist() {
  return (
    <div className="absolute contents inset-[3.24%_78.84%_79.09%_6.75%]" data-name="Wrist">
      <Group />
    </div>
  );
}

function Hand() {
  return (
    <div className="absolute contents inset-[3.24%_28.58%_21.25%_6.75%]" data-name="Hand">
      <div className="absolute inset-[47.48%_28.58%_21.25%_60.06%]" data-name="Sweater piece">
        <svg className="absolute block inset-0 size-full" fill="none" height="112.9" preserveAspectRatio="none" viewBox="0 0 41.0188 112.9" width="41.0188">
          <path d={svgPaths.p3ea9bbf0} fill="#8CB200" id="Sweater piece" />
        </svg>
      </div>
      <div className="absolute inset-[19.58%_80.47%_73.05%_11.72%]" data-name="Hand">
        <svg className="absolute block inset-0 size-full" fill="none" height="26.6338" preserveAspectRatio="none" viewBox="0 0 28.2014 26.6338" width="28.2014">
          <path d={svgPaths.p99af180} fill="#D08B5B" id="Hand" />
        </svg>
      </div>
      <Sleeve />
      <Wrist />
    </div>
  );
}

function Sweater() {
  return (
    <div className="absolute inset-[35.75%_26.45%_0_36.47%]" data-name="Sweater">
      <svg className="absolute block inset-0 size-full" fill="none" height="231.941" preserveAspectRatio="none" viewBox="0 0 133.848 231.941" width="133.848">
        <g id=" Sweater">
          <g id=" Sweater_2">
            <path d={svgPaths.p157724c0} fill="#8CB200" id="Vector" />
            <path d={svgPaths.p3d48e600} fill="#131313" id="Vector_2" opacity="0.2" />
          </g>
          <g id=" Pocket" opacity="0.2">
            <path d={svgPaths.p19ef6700} fill="#131313" id="Vector_3" />
          </g>
          <path d={svgPaths.p3c0a63b0} fill="#131313" id="Vector_4" opacity="0.2" />
        </g>
      </svg>
    </div>
  );
}

function Neck() {
  return (
    <div className="absolute inset-[39.61%_43.27%_48.61%_48.39%]" data-name="Neck">
      <svg className="absolute block inset-0 size-full" fill="none" height="42.5" preserveAspectRatio="none" viewBox="0 0 30.1 42.5" width="30.1">
        <g id=" Neck">
          <path d={svgPaths.p1e998700} fill="#D08B5B" id="Vector" />
          <path d={svgPaths.p36cfda00} fill="#AA4C20" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function HeadSweater() {
  return (
    <div className="absolute contents inset-[35.75%_26.45%_0_36.47%]" data-name="Head &  Sweater">
      <Sweater />
      <Neck />
    </div>
  );
}

function Laptop() {
  return (
    <div className="absolute inset-[63.67%_20.36%_1.47%_49.03%]" data-name="Laptop">
      <svg className="absolute block inset-0 size-full" fill="none" height="125.869" preserveAspectRatio="none" viewBox="0 0 110.504 125.869" width="110.504">
        <g id="Laptop">
          <path d={svgPaths.p2fcfbe80} fill="#F8F8F8" id="Vector" />
          <path d={svgPaths.p33e8b900} fill="white" id="Vector_2" />
          <path d={svgPaths.p527ac00} fill="#F9FFE6" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Hand1() {
  return (
    <div className="absolute inset-[46.46%_4.51%_3.9%_52.16%]" data-name="Hand">
      <svg className="absolute block inset-0 size-full" fill="none" height="179.18" preserveAspectRatio="none" viewBox="0 0 156.429 179.18" width="156.429">
        <g id="Hand">
          <g id=" Wrist">
            <path d={svgPaths.p326f7000} fill="#D08B5B" id="Vector" />
            <path d={svgPaths.p126c1880} fill="#AA4C20" id="Vector_2" />
            <path d={svgPaths.p2abaa700} fill="#AA4C20" id="Vector_3" />
          </g>
          <path d={svgPaths.p2f80e100} fill="#8CB200" id="Vector_4" />
          <path d={svgPaths.p2c13a100} fill="#8CB200" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Lines() {
  return (
    <div className="absolute h-[433.853px] left-0 top-0 w-[587.5px]" data-name="Lines">
      <svg className="absolute block inset-0 size-full" fill="none" height="433.853" preserveAspectRatio="none" viewBox="0 0 587.5 433.853" width="587.5">
        <g id="Lines">
          <path clipRule="evenodd" d={svgPaths.p3df1bc80} fill="#8CB200" fillRule="evenodd" id="Vector 22 (Stroke)" />
          <path clipRule="evenodd" d={svgPaths.p3975c400} fill="#8CB200" fillRule="evenodd" id="Vector 21 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Info() {
  return (
    <div className="absolute inset-[30.72%_51.26%_61.46%_42.77%]" data-name="Info">
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

function Info1() {
  return (
    <div className="absolute inset-[18.9%_19.16%_71.36%_73.74%]" data-name="Info">
      <svg className="absolute block inset-0 size-full" fill="none" height="43.6762" preserveAspectRatio="none" viewBox="0 0 41.6762 43.6762" width="41.6762">
        <g id="Info">
          <path d={svgPaths.p31bc7e00} fill="#131313" id="Bg" />
          <path d={svgPaths.p245d4b00} fill="#F9FFE6" id="Bg_2" />
          <g id="basil:music-solid">
            <path d={svgPaths.p37687400} fill="black" id="Vector" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Info2() {
  return (
    <div className="absolute inset-[44.99%_73.3%_45.74%_19.62%]" data-name="Info">
      <svg className="absolute block inset-0 size-full" fill="none" height="41.6" preserveAspectRatio="none" viewBox="0 0 41.6 41.6" width="41.6">
        <g id="Info">
          <path d={svgPaths.p2f0bf800} fill="#F8F8F8" id="Bg" stroke="#8CB200" strokeWidth="1.5" />
          <g id="mingcute:ai-fill">
            <path clipRule="evenodd" d={svgPaths.p38767580} fill="black" fillRule="evenodd" id="Vector" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group5() {
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

function Group6() {
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
        <g clipPath="url(#clip0_0_66)" id="tabler:writing-sign-filled">
          <path d={svgPaths.p9da0300} fill="black" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_0_66">
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
      <Group5 />
      <Group6 />
      <TablerWritingSignFilled />
    </div>
  );
}

function Group7() {
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
      <Group7 />
    </div>
  );
}

function Flag() {
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

function Flag1() {
  return (
    <div className="absolute inset-[23.45%_36.47%_69.6%_58.26%]" data-name="Flag">
      <svg className="absolute block inset-0 size-full" fill="none" height="31.1643" preserveAspectRatio="none" viewBox="0 0 31.0062 31.1643" width="31.0062">
        <g id="Flag">
          <path d={svgPaths.p1c829d00} fill="#131313" id="Bg" />
          <path d={svgPaths.p328e500} fill="#F9FFE6" id="Bg_2" />
          <g clipPath="url(#clip0_0_132)" id="devicon:figma">
            <path d={svgPaths.p1432d600} fill="#0ACF83" id="Vector" />
            <path d={svgPaths.p36001300} fill="#A259FF" id="Vector_2" />
            <path d={svgPaths.p2c09a100} fill="#F24E1E" id="Vector_3" />
            <path d={svgPaths.p2600fb00} fill="#FF7262" id="Vector_4" />
            <path d={svgPaths.p14244900} fill="#1ABCFE" id="Vector_5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_0_132">
            <rect fill="white" height="16" transform="translate(8.00041 6.60669)" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Flag2() {
  return (
    <div className="absolute inset-[60.6%_13.51%_32.44%_81.23%]" data-name="Flag">
      <svg className="absolute block inset-0 size-full" fill="none" height="31.242" preserveAspectRatio="none" viewBox="0 0 30.9002 31.242" width="30.9002">
        <g id="Flag">
          <path d={svgPaths.p341cc780} fill="#131313" id="Bg" />
          <path d={svgPaths.p21cbce80} fill="#F9FFE6" id="Vector" />
          <g id="selfhst:youtube">
            <path d={svgPaths.p18f81500} fill="#FF0000" id="Vector_2" />
            <path d={svgPaths.p3403c600} fill="white" id="Vector_3" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Roadmap() {
  return (
    <div className="absolute h-[448.451px] left-[-144.25px] top-[-102.75px] w-[587.5px]" data-name="ROADMAP">
      <Lines />
      <Info />
      <Info1 />
      <Info2 />
      <Info3 />
      <Flag />
      <Flag1 />
      <Flag2 />
    </div>
  );
}

function Message() {
  return (
    <div className="absolute inset-[15.24%_4.74%_60.42%_65.65%]" data-name="Message">
      <svg className="absolute block inset-0 size-full" fill="none" height="87.898" preserveAspectRatio="none" viewBox="0 0 106.884 87.898" width="106.884">
        <g id="Message">
          <path d={svgPaths.p3678e80} fill="#131313" id="Vector" />
          <path d={svgPaths.p1445e280} fill="#8CB200" id="Vector_2" />
          <g id="Letâs go!">
            <path d={svgPaths.p2f40f600} fill="white" id="Vector_3" />
            <path d={svgPaths.p36b3fd00} fill="white" id="Vector_4" />
            <path d={svgPaths.pc7bf000} fill="white" id="Vector_5" />
            <path d={svgPaths.p86d3e80} fill="white" id="Vector_6" />
            <path d={svgPaths.pe47d380} fill="white" id="Vector_7" />
            <path d={svgPaths.p13dc5800} fill="white" id="Vector_8" />
            <path d={svgPaths.p1c2ba200} fill="white" id="Vector_9" />
            <path d={svgPaths.p4433d80} fill="white" id="Vector_10" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function HeadStandard25A8446F() {
  return (
    <div className="absolute contents inset-[19.6%_37.01%_50.12%_38.41%]" style={{ containerType: "size" }} data-name="head-standard-25a8446f">
      <div className="absolute flex inset-[40.37%_42.34%_51.22%_47.68%] items-center justify-center mix-blend-multiply" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(15.3784cqw,75.7636cqh)] rotate-[-13.56deg] w-[hypot(-84.6216cqw,24.2364cqh)]">
          <div className="relative size-full" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="23.6545" preserveAspectRatio="none" viewBox="0 0 31.3836 23.6545" width="31.3836">
              <g id="Vector" style={{ mixBlendMode: "multiply" }}>
                <path d={svgPaths.p1a536400} fill="#D08B5B" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[19.6%_37.44%_51.89%_38.41%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(24.0407cqw,84.482cqh)] rotate-[-13.56deg] w-[hypot(-75.9593cqw,15.518cqh)]">
          <div className="relative size-full" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="89.4308" preserveAspectRatio="none" viewBox="0 0 68.1301 89.4308" width="68.1301">
              <path d={svgPaths.pd126880} fill="#D08B5B" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[36.65%_46.3%_57.12%_44.96%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-scale-x-100 flex-none h-[hypot(12.0586cqw,70.2263cqh)] rotate-[-13.56deg] w-[hypot(-87.9414cqw,29.7737cqh)]">
          <div className="relative size-full" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" height="16.2346" preserveAspectRatio="none" viewBox="0 0 28.5468 16.2346" width="28.5468">
              <path d={svgPaths.p142dcc00} fill="white" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function HairFonze25A8446F() {
  return (
    <div className="absolute flex inset-[14.76%_35.01%_58.65%_37.81%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="-scale-x-100 flex-none h-[hypot(18.8693cqw,80.0027cqh)] rotate-[-13.56deg] w-[hypot(-81.1307cqw,19.9973cqh)]">
        <div className="relative size-full" data-name="hair-fonze-25a8446f">
          <div className="absolute inset-[-1.41%_-0.99%_-1.03%_-3.03%]">
            <svg className="block size-full" fill="none" height="80.9284" preserveAspectRatio="none" viewBox="0 0 85.1911 80.9284" width="85.1911">
              <g id="hair-fonze-25a8446f">
                <path d={svgPaths.p3ef4f780} fill="#131313" id="Vector" stroke="black" strokeWidth="1.6222" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Face() {
  return (
    <div className="absolute flex inset-[29.22%_45.48%_66.17%_42.75%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="flex-none h-[hypot(-0.6023cqw,95.9353cqh)] rotate-[0.92deg] w-[hypot(99.3977cqw,4.06474cqh)]">
        <div className="relative size-full" data-name="Face">
          <svg className="absolute block inset-0 size-full" fill="none" height="15.9792" preserveAspectRatio="none" viewBox="0 0 42.2546 15.9792" width="42.2546">
            <g id="Face">
              <path d={svgPaths.p2dec5320} fill="#131313" id="Vector" />
              <path d={svgPaths.p2c85d800} fill="#131313" id="Vector_2" />
              <path d={svgPaths.p61fddf0} fill="#131313" id="Vector_3" />
              <path d={svgPaths.p27a0f80} fill="#131313" id="Vector_4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function NoseCurve25A8446F() {
  return (
    <div className="absolute flex inset-[34.33%_52.12%_62.7%_46.22%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="-scale-x-100 flex-none h-[hypot(16.5873cqw,95.4578cqh)] rotate-[-5.56deg] w-[hypot(-83.4127cqw,4.54223cqh)]">
        <div className="relative size-full" data-name="nose-curve-25a8446f">
          <div className="absolute inset-[-0.7%_-16.15%_-7.9%_-3.18%]">
            <svg className="block size-full" fill="none" height="11.1432" preserveAspectRatio="none" viewBox="0 0 5.98937 11.1432" width="5.98937">
              <g id="nose-curve-25a8446f">
                <path d={svgPaths.p425a000} id="Vector" stroke="black" strokeWidth="1.6222" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarsDetached25A8446F() {
  return (
    <div className="absolute flex inset-[31.38%_38.13%_62.43%_56.26%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="-scale-x-100 flex-none h-[hypot(22.0449cqw,82.9478cqh)] rotate-[-13.56deg] w-[hypot(-77.9551cqw,17.0522cqh)]">
        <div className="relative size-full" data-name="ears-detached-25a8446f">
          <div className="absolute inset-[-4.25%_0_-4.25%_-4.98%]">
            <svg className="block size-full" fill="none" height="20.6911" preserveAspectRatio="none" viewBox="0 0 17.0667 20.6911" width="17.0667">
              <g id="ears-detached-25a8446f">
                <path d={svgPaths.p2d8de1c0} fill="#D08B5B" id="Vector" stroke="black" strokeWidth="1.6222" />
                <path d={svgPaths.p1f076900} fill="#D08B5B" id="Vector_2" />
                <path d={svgPaths.p2cb10100} id="Vector_3" stroke="black" strokeWidth="1.6222" />
                <path d={svgPaths.p15bad80} id="Vector_4" stroke="black" strokeWidth="1.6222" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[14.76%_32.97%_50.12%_37.48%]" style={{ containerType: "size" }} data-name="Group">
      <HeadStandard25A8446F />
      <HairFonze25A8446F />
      <Face />
      <NoseCurve25A8446F />
      <EarsDetached25A8446F />
    </div>
  );
}

function StartIllustration() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-0.5px)] size-[361px] top-[239px]" data-name="Start Illustration">
      <div className="absolute inset-[-16.07%_-4.04%_0.03%_-12.02%]" data-name="Bg">
        <svg className="absolute block inset-0 size-full" fill="none" height="418.9" preserveAspectRatio="none" viewBox="0 0 419 418.9" width="419">
          <path d={svgPaths.p145d640} fill="#F9FFE6" id="Bg" />
        </svg>
      </div>
      <Hand />
      <HeadSweater />
      <Laptop />
      <Hand1 />
      <Roadmap />
      <Message />
      <Group8 />
      <div className="absolute h-[17.64px] left-[204px] top-[219px] w-[21px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="17.64" preserveAspectRatio="none" viewBox="0 0 21 17.64" width="21">
          <path clipRule="evenodd" d={svgPaths.p15d2d480} fill="white" fillRule="evenodd" id="Vector" />
        </svg>
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
    <div className="-translate-x-1/2 absolute content-stretch flex items-center left-[calc(50%-0.5px)] top-[115px]" data-name="Logo & Title">
      <Frame />
      <p className="[word-break:break-word] font-['SF_Pro:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#131313] text-[24px] text-center tracking-[-0.072px] w-[144px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Navigator
      </p>
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
    <div className="-translate-x-1/2 absolute bg-white content-stretch flex h-[59px] items-end justify-center left-[calc(50%-0.5px)] overflow-clip top-0 w-[393px]" data-name="StatusBar">
      <LeftSide />
      <DynamicIsland />
      <RightSide />
    </div>
  );
}

function Filled() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f8f8f8] content-stretch flex items-start left-[calc(50%+160px)] p-[8px] rounded-[12px] top-[75px]" data-name="Filled">
      <WelcomeScreenColorMode className="overflow-clip relative shrink-0 size-[24px]" />
    </div>
  );
}

export default function StartScreen() {
  return (
    <div className="bg-white relative size-full" data-name="Start Screen">
      <HomeIndicator className="-translate-x-1/2 absolute bg-white bottom-0 h-[34px] left-[calc(50%-0.5px)] w-[393px]" />
      <div className="-translate-x-1/2 absolute bg-[#8cb200] left-[calc(50%-0.5px)] rounded-[12px] top-[806px] w-[361px]" data-name="Primary">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[20px] py-[12px] relative size-full">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white tracking-[-0.408px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100', fontFeatureSettings: '"case" 1' }}>
              <p className="leading-[24px]">{`Let's Go!`}</p>
            </div>
          </div>
        </div>
      </div>
      <TitileDescription />
      <StartIllustration />
      <LogoTitle />
      <StatusBar />
      <Filled />
    </div>
  );
}