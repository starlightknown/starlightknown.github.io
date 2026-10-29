import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CARD_COVERED_EVENT, CARD_REVEALED_EVENT, isEnteringIframe } from "./pointer";

const LINES = [
  "psst… scratch the card up top ✦",
  "I'm the community manager's community manager.",
  "PRs welcome. Good first issues even more welcome.",
  "Have you tried turning the Discord bot off and on again?",
  "Fun fact: I was a 1950 rupee in a past life. Long story.",
  "Support tickets are just feature requests in disguise.",
  "Ship it! (after the docs, please)",
  "Go look at the donut. Trust me. 🍩",
];

const REVEAL_LINE = "You found the human! ✦✦✦";

// A small star mascot that floats in the corner, watches the pointer,
// and says something when clicked.
export default function StarBuddy() {
  const buddyRef = useRef<HTMLButtonElement>(null);
  const leftEyeRef = useRef<SVGEllipseElement>(null);
  const rightEyeRef = useRef<SVGEllipseElement>(null);
  const [line, setLine] = useState<string | null>(null);
  const [spins, setSpins] = useState(0);
  const reducedMotion = useReducedMotion();
  const nextLine = useRef(1);
  const hideTimer = useRef<number | undefined>(undefined);
  const greetTimer = useRef<number | undefined>(undefined);

  const say = (text: string, duration = 4500) => {
    // Anything said before the greeting fires takes its place
    window.clearTimeout(greetTimer.current);
    setLine(text);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setLine(null), duration);
  };

  useEffect(() => {
    greetTimer.current = window.setTimeout(() => say(LINES[0], 5000), 2500);
    const onReveal = () => {
      setSpins((value) => value + 1);
      say(REVEAL_LINE);
    };
    const onCovered = () => setLine((current) => (current === REVEAL_LINE ? null : current));

    // Eyes are moved through refs, at most once per frame, to avoid a React
    // render on every pointer event
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    const placeEyes = () => {
      frame = 0;
      let lookX = 0;
      let lookY = 0;
      const rect = buddyRef.current?.getBoundingClientRect();
      if (pointer && rect) {
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(distance / 120, 1) * 3.5;
        lookX = (dx / distance) * reach;
        lookY = (dy / distance) * reach;
      }
      leftEyeRef.current?.setAttribute("transform", `translate(${lookX} ${lookY})`);
      rightEyeRef.current?.setAttribute("transform", `translate(${lookX} ${lookY})`);
    };
    const track = (next: typeof pointer) => {
      pointer = next;
      if (!frame) frame = requestAnimationFrame(placeEyes);
    };
    const onMove = (event: PointerEvent) => track({ x: event.clientX, y: event.clientY });
    // Look straight ahead when the pointer leaves for an iframe or the window
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget === null || isEnteringIframe(event)) track(null);
    };

    window.addEventListener(CARD_REVEALED_EVENT, onReveal);
    window.addEventListener(CARD_COVERED_EVENT, onCovered);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onOut);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(greetTimer.current);
      window.clearTimeout(hideTimer.current);
      window.removeEventListener(CARD_REVEALED_EVENT, onReveal);
      window.removeEventListener(CARD_COVERED_EVENT, onCovered);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  const handleClick = () => {
    setSpins((value) => value + 1);
    say(LINES[nextLine.current]);
    nextLine.current = (nextLine.current + 1) % LINES.length;
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence mode="wait">
        {line && (
          <motion.p
            key={line}
            role="status"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="relative mb-3 max-w-[220px] origin-bottom-right border-2 border-black bg-[#f4f1e8] px-3 py-2 font-mono text-[11px] font-bold leading-snug text-black shadow-[4px_4px_0_#139f58]"
          >
            {line}
            <span className="absolute -bottom-[9px] right-6 size-4 rotate-45 border-b-2 border-r-2 border-black bg-[#f4f1e8]" />
          </motion.p>
        )}
      </AnimatePresence>
      <button
        ref={buddyRef}
        type="button"
        onClick={handleClick}
        data-cursor="boop"
        aria-label="Star buddy: click for a message"
        className="star-buddy-float pointer-events-auto size-16 sm:size-20"
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="size-full overflow-visible drop-shadow-[3px_3px_0_#111]"
          animate={{ rotate: reducedMotion ? 0 : spins * 360 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
        >
          <path
            d="M50 3 C55 34 66 45 97 50 C66 55 55 66 50 97 C45 66 34 55 3 50 C34 45 45 34 50 3 Z"
            fill="#f4ed45"
            stroke="#111"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <g className="star-buddy-eyes">
            <ellipse ref={leftEyeRef} cx="43" cy="47" rx="3.2" ry="4.2" fill="#111" />
            <ellipse ref={rightEyeRef} cx="57" cy="47" rx="3.2" ry="4.2" fill="#111" />
          </g>
          <circle cx="37" cy="56" r="3.5" fill="#ff8fa3" opacity="0.7" />
          <circle cx="63" cy="56" r="3.5" fill="#ff8fa3" opacity="0.7" />
          <path d="M45 57 Q50 62 55 57" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
        </motion.svg>
      </button>
    </div>
  );
}
