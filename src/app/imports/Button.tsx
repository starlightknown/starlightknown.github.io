export default function Button() {
  return (
    <div className="bg-[#139f58] relative rounded-[8px] size-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[3px] border-[rgba(19,159,88,0.3)] border-solid inset-[-3px] pointer-events-none rounded-[11px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-2 items-center justify-center p-[16px] relative size-full">
          <div className="font-['Figma_Hand:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white">
            <p className="leading-[normal] whitespace-pre">New suffering</p>
          </div>
        </div>
      </div>
    </div>
  );
}