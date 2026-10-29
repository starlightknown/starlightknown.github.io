import svgPaths from "./svg-2164yr758z";
import imgImage7 from "figma:asset/5f2702c0ca1a184a9c735b01e9e25272ef30c0f4.png";

function Frame11() {
  return (
    <div className="bg-[#eddd64] box-border content-stretch flex gap-2.5 items-center justify-center overflow-clip p-[24px] relative shrink-0 w-[1000px]">
      <div className="basis-0 font-['Figma_Hand:Bold',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#20344c] text-[24px] text-center">
        <p className="leading-[normal]">Scratch your suffering away</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[632px] relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-2.5 h-[632px] items-center justify-start px-[163px] py-[277px] relative w-full">
          <div className="absolute h-[632px] left-0 top-0 w-[952px]" data-name="Subtract">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 952 632">
              <path d={svgPaths.p1dc05800} fill="var(--fill-0, #CACACA)" id="Subtract" />
            </svg>
          </div>
          <div className="basis-0 font-['Instrument_Sans:Medium',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[64px] text-black text-center text-nowrap">
            <p className="leading-[normal] whitespace-pre">Make the logo bigger</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[24px] relative shrink-0" data-name="Frame">
      <Frame />
    </div>
  );
}

export default function ScratchCardNotScratched() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-[28px] shadow-[24px_24px_64px_0px_rgba(255,255,255,0.08)] size-full" data-name="Scratch Card - Not Scratched">
      <Frame11 />
      <div className="aspect-[4096/2679] bg-center bg-cover bg-no-repeat shrink-0 w-full" data-name="image 7" style={{ backgroundImage: `url('${imgImage7}')` }} />
      <Frame1 />
    </div>
  );
}