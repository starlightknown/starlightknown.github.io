export default function RefreshButton() {
  return (
    <div className="bg-[#f1cc25] relative size-full" data-name="Refresh button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-2.5 items-center justify-center px-8 py-4 relative size-full">
          <div className="font-['Figma_Hand:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
            <p className="leading-[normal] whitespace-pre">New Suffering</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_-29px_26px_-8px_inset_rgba(0,0,0,0.25),0px_-12px_5px_-6px_inset_rgba(0,0,0,0.16),0px_26px_25px_-23px_inset_rgba(255,255,255,0.49),0px_3px_9px_0px_inset_rgba(255,255,255,0.22)]" />
    </div>
  );
}