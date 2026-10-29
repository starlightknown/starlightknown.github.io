import svgPaths from "./svg-9n49ewwg5f";

function Frame11() {
  return (
    <div className="bg-[#eddd64] box-border content-stretch flex gap-2.5 items-center justify-center overflow-clip px-6 py-4 relative shrink-0 w-[1000px]">
      <div className="font-['Edu_NSW_ACT_Foundation:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#0a631c] text-[40px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">Scratch your suffering away</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-6 items-center justify-start leading-[0] relative shrink-0 text-center text-white w-full">
      <div className="[text-shadow:#0a631c_12px_0px_0px] font-['Cantata_One:Regular',_sans-serif] not-italic relative shrink-0 text-[100px] w-full">
        <p className="leading-[112px]">The Wheel of Suffering</p>
      </div>
      <div className="[text-shadow:#0a631c_3px_0px_0px] font-['Edu_NSW_ACT_Foundation:Medium',_sans-serif] font-medium relative shrink-0 text-[48px] w-full">
        <p className="leading-[normal]">No jackpots, just pixel-perfect disappointment.</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#139f58] relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center px-8 py-[72px] relative w-full">
          <div className="absolute left-[-644.5px] size-[2289px] top-[-450px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2289 2289">
              <g id="Vector">
                <path d={svgPaths.p2711700} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p39985f00} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p3ecd6800} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p335b8000} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p3ee76d80} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p13a4d300} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p371f3680} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p304d9c80} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p1639b780} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p1fd7fb00} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p37837580} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p943d80} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p3e128700} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.pc620000} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p1a872c80} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p38a9f00} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p4428d00} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p153bb700} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p17826000} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p117e9c80} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p21572180} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p11623f00} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p2b815d00} fill="var(--fill-0, #1DA962)" />
                <path d={svgPaths.p39e7e000} fill="var(--fill-0, #1DA962)" />
              </g>
            </svg>
          </div>
          <Frame12 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[24px] relative shrink-0" data-name="Frame">
      <div className="bg-[#cacaca] h-[632px] rounded-bl-[16px] rounded-br-[16px] shrink-0 w-[952px]" />
    </div>
  );
}

export default function ScratchCardNotScratched() {
  return (
    <div className="relative rounded-[28px] size-full" data-name="Scratch Card - Not Scratched">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative size-full">
        <Frame11 />
        <Frame />
        <Frame1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ececec] border-solid inset-0 pointer-events-none rounded-[28px] shadow-[24px_24px_64px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}