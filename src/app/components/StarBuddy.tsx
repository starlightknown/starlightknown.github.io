import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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

export const CARD_REVEALED_EVENT = "card-revealed";

// A small star mascot that floats in the corner, watches the pointer,
// and says something when clicked.
export default function StarBuddy() {
  const buddyRef = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [line, setLine] = useState<string | null>(null);
  const [spins, setSpins] = useState(0);
  const nextLine = useRef(1);
  const hideTimer = useRef<number | undefined>(undefined);

  const say = (text: string, duration = 4500) => {
    setLine(text);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setLine(null), duration);
  };

  useEffect(() => {
    const greet = window.setTimeout(() => say(LINES[0], 5000), 2500);
    const onReveal = () => {
      setSpins((value) => value + 1);
      say("You found the human! ✦✦✦");
    };
    const onMove = (event: PointerEvent) => {
      const rect = buddyRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.min(distance / 120, 1) * 3.5;
      setLook({ x: (dx / distance) * reach, y: (dy / distance) * reach });
    };
    window.addEventListener(CARD_REVEALED_EVENT, onReveal);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.clearTimeout(greet);
      window.clearTimeout(hideTimer.current);
      window.removeEventListener(CARD_REVEALED_EVENT, onReveal);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const handleClick = () => {
    setSpins((value) => value + 1);
    say(LINES[nextLine.current]);
    nextLine.current = (nextLine.current + 1) % LINES.length;
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
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
          animate={{ rotate: spins * 360 }}
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
            <ellipse cx={43 + look.x} cy={47 + look.y} rx="3.2" ry="4.2" fill="#111" />
            <ellipse cx={57 + look.x} cy={47 + look.y} rx="3.2" ry="4.2" fill="#111" />
          </g>
          <circle cx="37" cy="56" r="3.5" fill="#ff8fa3" opacity="0.7" />
          <circle cx="63" cy="56" r="3.5" fill="#ff8fa3" opacity="0.7" />
          <path d="M45 57 Q50 62 55 57" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
        </motion.svg>
      </button>
    </div>
  );
}
