// Pointer events stop reaching the page once the pointer moves into an
// iframe (e.g. the YouTube embeds). Call from a `pointerout` listener to tell
// when that is happening, so pointer-following effects can stand down.
export function isEnteringIframe(event: PointerEvent) {
  if (event.relatedTarget instanceof HTMLIFrameElement) return true;
  return document.elementFromPoint(event.clientX, event.clientY) instanceof HTMLIFrameElement;
}

export const CARD_REVEALED_EVENT = "card-revealed";
export const CARD_COVERED_EVENT = "card-covered";
