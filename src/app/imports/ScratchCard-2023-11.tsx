import imgScratchCard from "figma:asset/5fdc704cb36ff7d9475f365db6bbbf656b346ac4.png";

function Frame3() {
  return (
    <div className="bg-[#139f58] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-full">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col font-['Figma_Hand:Regular',_sans-serif] gap-2 items-center justify-center leading-[0] not-italic p-[24px] relative text-center text-white w-full">
          <div className="relative shrink-0 text-[40px] w-full">
            <p className="leading-[normal]">The Wheel of Suffering™</p>
          </div>
          <div className="relative shrink-0 text-[22px] w-full">
            <p className="leading-[normal]">Odds of winning: 0%. Odds of crying: 100%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[8px] relative rounded-[24px] shrink-0 w-[728px]">
      <div aria-hidden="true" className="absolute border-2 border-[#139f58] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <Frame3 />
      <div className="bg-[#cacaca] h-[363px] rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full" />
    </div>
  );
}

export default function ScratchCard() {
  return (
    <div className="bg-center bg-cover bg-no-repeat relative size-full" data-name="Scratch card" style={{ backgroundImage: `url('${imgScratchCard}')` }}>
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[36px] relative size-full">
          <Frame6 />
        </div>
      </div>
    </div>
  );
}