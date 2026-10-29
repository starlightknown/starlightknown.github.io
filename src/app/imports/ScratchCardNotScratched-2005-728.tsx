import imgImage7 from "figma:asset/5f2702c0ca1a184a9c735b01e9e25272ef30c0f4.png";

function Frame11() {
  return (
    <div className="bg-[#f1cc25] box-border content-stretch flex gap-2.5 items-center justify-center overflow-clip p-[24px] relative shrink-0 w-[1000px]">
      <div className="basis-0 font-['Figma_Hand:Bold',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#20344c] text-[24px] text-center">
        <p className="leading-[normal]">Scratch your suffering away</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[24px] relative shrink-0" data-name="Frame">
      <div className="bg-[#cacaca] h-[632px] rounded-bl-[16px] rounded-br-[16px] shrink-0 w-[952px]" />
    </div>
  );
}

export default function ScratchCardNotScratched() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-[28px] size-full" data-name="Scratch Card - Not Scratched">
      <Frame11 />
      <div className="aspect-[4096/2679] bg-center bg-cover bg-no-repeat shrink-0 w-full" data-name="image 7" style={{ backgroundImage: `url('${imgImage7}')` }} />
      <Frame />
    </div>
  );
}