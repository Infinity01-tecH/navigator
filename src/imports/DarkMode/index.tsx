function Header() {
  return (
    <div className="bg-[#f8f8f8] relative rounded-[16px] shrink-0 w-full" data-name="Header">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[32px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#131313] text-[40px] tracking-[0.4px] whitespace-nowrap">
            <p className="leading-[normal]">Dark Mode</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label007Aff() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #007aff">
      <p className="relative shrink-0">5</p>
      <p className="relative shrink-0">#007AFF</p>
    </div>
  );
}

function Component5007Aff() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="5 - #007aff">
      <div className="bg-[#8cb200] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #007aff" />
      <Label007Aff />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[284px]">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Primary</p>
      </div>
      <Component5007Aff />
    </div>
  );
}

function Label38Ad() {
  return (
    <div className="[word-break:break-word] bg-[#38ad49] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #38ad49">
      <p className="relative shrink-0">5</p>
      <p className="relative shrink-0">#38AD49</p>
    </div>
  );
}

function Component538Ad() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="5 - #38ad49">
      <div className="bg-[#38ad49] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #38ad49" />
      <Label38Ad />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Success</p>
      </div>
      <Component538Ad />
    </div>
  );
}

function LabelD53F() {
  return (
    <div className="[word-break:break-word] bg-[#d53f36] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #d53f36">
      <p className="relative shrink-0">5</p>
      <p className="relative shrink-0">#D53F36</p>
    </div>
  );
}

function Component5D53F() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="5 - #d53f36">
      <div className="bg-[#d53f36] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #d53f36" />
      <LabelD53F />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Error</p>
      </div>
      <Component5D53F />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0">
      <Frame1 />
      <Frame4 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0">
      <Frame />
      <Frame8 />
    </div>
  );
}

function LabelFb8C() {
  return (
    <div className="col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Label - #fb8c00">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] not-italic overflow-clip px-[16px] relative rounded-[inherit] size-full text-[12px] text-black whitespace-nowrap">
        <p className="relative shrink-0">0</p>
        <p className="relative shrink-0">#FFFFFF</p>
      </div>
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Component5Fb8C() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="5 - #fb8c00">
      <div className="bg-white border border-black border-solid col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #fb8c00" />
      <LabelFb8C />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Body - Primary</p>
      </div>
      <Component5Fb8C />
    </div>
  );
}

function Label() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-black whitespace-nowrap" data-name="Label - #131313">
      <p className="relative shrink-0">0</p>
      <p className="relative shrink-0">#FFFFFF</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="9.5 - #131313">
      <div className="bg-white border border-black border-solid col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #131313" />
      <Label />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Body - On Primary</p>
      </div>
      <Component2 />
    </div>
  );
}

function Label4C4C4C() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #4c4c4c">
      <p className="relative shrink-0">8</p>
      <p className="relative shrink-0">#4C4C4C</p>
    </div>
  );
}

function Component84C4C4C() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="8 - #4c4c4c">
      <div className="bg-[#4c4c4c] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #4c4c4c" />
      <Label4C4C4C />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">{`Body - Secondary `}</p>
      </div>
      <Component84C4C4C />
    </div>
  );
}

function Label3() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #393939">
      <p className="relative shrink-0">8.5</p>
      <p className="relative shrink-0">#393939</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="8.5 - #393939">
      <div className="bg-[#393939] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #393939" />
      <Label3 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">{`Border & Divider`}</p>
      </div>
      <Component1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0">
      <Frame5 />
      <Frame10 />
      <Frame6 />
      <Frame12 />
    </div>
  );
}

function Label1() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #131313">
      <p className="relative shrink-0">9.5</p>
      <p className="relative shrink-0">#131313</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="9.5 - #131313">
      <div className="bg-[#131313] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #131313" />
      <Label1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[201px]">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Bg</p>
      </div>
      <Component3 />
    </div>
  );
}

function Label2() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #262626">
      <p className="relative shrink-0">9</p>
      <p className="relative shrink-0">#262626</p>
    </div>
  );
}

function Component() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="9 - #262626">
      <div className="bg-[#262626] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #262626" />
      <Label2 />
    </div>
  );
}

function Label00254D() {
  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[16px] items-center justify-center leading-[normal] ml-0 mt-0 not-italic overflow-clip px-[16px] relative rounded-[16px] row-1 size-[100px] text-[12px] text-white whitespace-nowrap" data-name="Label - #00254d">
      <p className="relative shrink-0">8.5</p>
      <p className="relative shrink-0">#00254D</p>
    </div>
  );
}

function Component8500254D() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="8.5 - #00254d">
      <div className="bg-[#1c2400] col-1 ml-0 mt-0 relative rounded-[16px] row-1 size-[100px]" data-name="Swatch - #00254d" />
      <Label00254D />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[20px] text-black tracking-[-0.5px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[24px]">Surfaces</p>
      </div>
      <Component />
      <Component8500254D />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0">
      <Frame7 />
      <Frame13 />
    </div>
  );
}

function Colors() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start leading-[0] relative shrink-0" data-name="Colors">
      <Frame9 />
      <Frame11 />
    </div>
  );
}

export default function DarkMode() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[32px] relative rounded-[20px] size-full" data-name="Dark Mode">
      <Header />
      <Colors />
    </div>
  );
}