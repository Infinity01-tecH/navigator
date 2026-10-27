function Header() {
  return (
    <div className="bg-[#f8f8f8] relative rounded-[16px] shrink-0 w-full" data-name="Header">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[32px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#131313] text-[40px] tracking-[0.4px] whitespace-nowrap">
            <p className="leading-[normal]">Typography - SF Pro Text</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Headline() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic relative shrink-0 text-[#131313] whitespace-nowrap" data-name="Headline">
      <div className="flex flex-col font-['SF_Pro_Text:Bold',sans-serif] justify-center relative shrink-0 text-[40px] tracking-[-0.12px]">
        <p className="leading-[48px]">Headline Large - 40/48 .-0.3</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[32px] tracking-[-0.096px]">
        <p className="leading-[40px]">Headline Medium - 32/40 .-0.3</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Bold',sans-serif] justify-center relative shrink-0 text-[24px] tracking-[-0.072px]">
        <p className="leading-[32px]">Headline Small - 24/32 .-0.3</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[20px] tracking-[-0.06px]">
        <p className="leading-[24px]">Headline Extra Small - 20/24 .-0.3</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['SF_Pro_Text:Medium',sans-serif] gap-[16px] items-start leading-[0] not-italic relative shrink-0 text-[#131313] whitespace-nowrap" data-name="Title">
      <div className="flex flex-col justify-center relative shrink-0 text-[24px] tracking-[-0.072px]">
        <p className="leading-[32px]">Title Large - 24/32 .-0.3</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px] tracking-[-0.06px]">
        <p className="leading-[24px]">Title Medium - 20/24 .-0.3</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[18px] tracking-[-0.054px]">
        <p className="leading-[24px]">Title Small - 18/24 .-0.3</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[16px] tracking-[-0.048px]">
        <p className="leading-[20px]">Title Extra Small - 16/20 -0.3</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] gap-[16px] items-start leading-[0] not-italic relative shrink-0 text-[#131313]" data-name="Label">
      <div className="flex flex-col justify-center relative shrink-0 text-[20px] tracking-[-0.08px] whitespace-nowrap">
        <p className="leading-[24px]">Label Large - 20/24 .-0.4</p>
      </div>
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[16px] tracking-[-0.064px] w-[min-content]">
        <p className="leading-[20px]">Label Medium - 16/20.-0.4</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] tracking-[-0.056px] whitespace-nowrap">
        <p className="leading-[20px]">Label Small - 14/20 .-0.4</p>
      </div>
    </div>
  );
}

function BodyText() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['SF_Pro_Text:Regular',sans-serif] gap-[16px] items-start leading-[0] not-italic relative shrink-0 text-[#131313] whitespace-nowrap" data-name="Body Text">
      <div className="flex flex-col justify-center relative shrink-0 text-[20px] tracking-[-0.06px]">
        <p className="leading-[24px]">Body Text Large - 20/24 .-0.3</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[16px] tracking-[-0.048px]">
        <p className="leading-[20px]">Body Text Medium - 16/20 .-0.3</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[14px] tracking-[-0.042px]">
        <p className="leading-[20px]">Body Text Small - 14/20 .-0.3</p>
      </div>
    </div>
  );
}

export default function Typography() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[32px] relative rounded-[20px] size-full" data-name="Typography">
      <Header />
      <Headline />
      <Title />
      <Label />
      <BodyText />
    </div>
  );
}