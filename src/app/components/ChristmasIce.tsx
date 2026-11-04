import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Music2, X } from "lucide-react";

// Christmas easter egg: in December the scratch card is frozen in ice. Three
// taps, clicks or scratches (or Enter on the keyboard) crack and shatter it,
// which also starts Mariah Carey via the official YouTube video. Add
// ?christmas to the URL to preview it in any month.

export const ICE_SHATTERED_EVENT = "ice-shattered";

const HITS_TO_SHATTER = 3;
// Official video: "Mariah Carey - All I Want for Christmas Is You"
const VIDEO_ID = "yXQViqx6GMY";

export function isChristmasSeason() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("christmas")) return true;
  return new Date().getMonth() === 11;
}

// ---------- Sound: synthesized, so no audio files ship with the site ----------

let audio: AudioContext | null = null;

function iceSound(strength: number) {
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    const length = 0.12 + strength * 0.35;

    // A burst of filtered noise for the crack
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * length), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
    const noise = audio.createBufferSource();
    noise.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200 + Math.random() * 800;
    const noiseGain = audio.createGain();
    noiseGain.gain.value = 0.25 + strength * 0.2;
    noise.connect(filter).connect(noiseGain).connect(audio.destination);
    noise.start(now);

    // Glassy "tinks" on top
    for (let i = 0; i < 1 + Math.round(strength * 4); i++) {
      const tink = audio.createOscillator();
      const gain = audio.createGain();
      const start = now + Math.random() * length * 0.6;
      tink.type = "sine";
      tink.frequency.value = 2400 + Math.random() * 2600;
      gain.gain.setValueAtTime(0.06, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      tink.connect(gain).connect(audio.destination);
      tink.start(start);
      tink.stop(start + 0.2);
    }
  } catch {
    // No Web Audio: the ice still breaks, just silently
  }
}

// ---------- Geometry ----------

type Crack = { id: number; paths: string[] };

// Jagged rays from the hit point, in a 0–100 viewBox
function makeCrack(x: number, y: number, id: number): Crack {
  const rays = 5 + Math.floor(Math.random() * 3);
  const paths = Array.from({ length: rays }, (_, ray) => {
    let angle = (ray / rays) * Math.PI * 2 + Math.random() * 0.6;
    let px = x;
    let py = y;
    let d = `M${px.toFixed(1)} ${py.toFixed(1)}`;
    const segments = 3 + Math.floor(Math.random() * 3);
    for (let s = 0; s < segments; s++) {
      angle += (Math.random() - 0.5) * 0.9;
      const step = 5 + Math.random() * 9;
      px += Math.cos(angle) * step;
      py += Math.sin(angle) * step;
      d += ` L${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    return d;
  });
  return { id, paths };
}

// Jittered triangle mesh over the ice for the shatter
function makeShards() {
  const cols = 5;
  const rows = 4;
  const point = (c: number, r: number) => {
    const edgeX = c === 0 || c === cols;
    const edgeY = r === 0 || r === rows;
    const jitter = (edge: boolean) => (edge ? 0 : (Math.random() - 0.5) * 12);
    return [(c / cols) * 100 + jitter(edgeX), (r / rows) * 100 + jitter(edgeY)];
  };
  const grid = Array.from({ length: rows + 1 }, (_, r) => Array.from({ length: cols + 1 }, (_, c) => point(c, r)));
  const shards: { points: number[][]; cx: number; cy: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [a, b, d, e] = [grid[r][c], grid[r][c + 1], grid[r + 1][c], grid[r + 1][c + 1]];
      for (const tri of [[a, b, e], [a, e, d]]) {
        shards.push({ points: tri, cx: (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy: (tri[0][1] + tri[1][1] + tri[2][1]) / 3 });
      }
    }
  }
  return shards;
}

// ---------- The ice ----------

const LABELS = ["Tap to break the ice", "Crack! Keep going", "Almost there…"];

export function IceOverlay({ onFirstHit, onShattered }: { onFirstHit: () => void; onShattered: () => void }) {
  const [hits, setHits] = useState(0);
  const [cracks, setCracks] = useState<Crack[]>([]);
  const [shattering, setShattering] = useState(false);
  const shards = useMemo(makeShards, []);
  const lastScratch = useRef<{ x: number; y: number; time: number } | null>(null);
  const pressed = useRef(false);
  const reducedMotion = useReducedMotion();
  // The hammer: "held" follows a mouse over the ice; "tap" pops up briefly
  // where a finger or the keyboard hits
  const [hammer, setHammer] = useState<{ x: number; y: number; mode: "held" | "tap" } | null>(null);
  const [swing, setSwing] = useState(0);
  const tapTimer = useRef<number | undefined>(undefined);

  const swingAt = (x: number, y: number, mode: "held" | "tap") => {
    setHammer({ x, y, mode });
    setSwing((value) => value + 1);
    window.clearTimeout(tapTimer.current);
    if (mode === "tap") tapTimer.current = window.setTimeout(() => setHammer(null), 600);
  };

  const hit = (x: number, y: number) => {
    if (shattering) return;
    const next = hits + 1;
    setHits(next);
    setCracks((current) => [...current, makeCrack(x, y, next)]);
    navigator.vibrate?.(next >= HITS_TO_SHATTER ? [20, 30, 40] : 12);
    iceSound(next >= HITS_TO_SHATTER ? 1 : 0.2);
    if (next === 1) onFirstHit();
    if (next >= HITS_TO_SHATTER) {
      setShattering(true);
      window.setTimeout(onShattered, 1300);
    }
  };

  const pointIn = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 };
  };

  return (
    <div className="absolute -inset-2.5 z-30 sm:-inset-3">
      {!shattering && (
        <button
          type="button"
          data-own-cursor
          aria-label={`${LABELS[Math.min(hits, LABELS.length - 1)]}. The card is frozen for Christmas`}
          className="ice-block group absolute inset-0 touch-pan-y"
          onPointerEnter={(event) => {
            if (event.pointerType !== "touch") setHammer({ x: event.clientX, y: event.clientY, mode: "held" });
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "touch") setHammer(null);
          }}
          onPointerDown={(event) => {
            pressed.current = true;
            const { x, y } = pointIn(event);
            lastScratch.current = { x, y, time: event.timeStamp };
            swingAt(event.clientX, event.clientY, event.pointerType === "touch" ? "tap" : "held");
            hit(x, y);
          }}
          // Scratching across the ice counts too, about four times a second
          onPointerMove={(event) => {
            if (event.pointerType !== "touch") setHammer({ x: event.clientX, y: event.clientY, mode: "held" });
            if (!pressed.current || !lastScratch.current) return;
            const { x, y } = pointIn(event);
            const moved = Math.hypot(x - lastScratch.current.x, y - lastScratch.current.y);
            if (moved > 12 && event.timeStamp - lastScratch.current.time > 250) {
              lastScratch.current = { x, y, time: event.timeStamp };
              swingAt(event.clientX, event.clientY, event.pointerType === "touch" ? "tap" : "held");
              hit(x, y);
            }
          }}
          onPointerUp={() => (pressed.current = false)}
          onPointerCancel={() => (pressed.current = false)}
          onClick={(event) => {
            // Keyboard activation (Enter/Space) arrives as a click with no pointer
            if (event.detail !== 0) return;
            const x = 50 + (Math.random() - 0.5) * 30;
            const y = 50 + (Math.random() - 0.5) * 30;
            const rect = event.currentTarget.getBoundingClientRect();
            swingAt(rect.left + (rect.width * x) / 100, rect.top + (rect.height * y) / 100, "tap");
            hit(x, y);
          }}
        >
          {/* Cartoon glints: two long shines top-left, a short one bottom-right */}
          <span aria-hidden="true" className="ice-glint left-[7%] top-[11%] h-[5%] w-[30%]" />
          <span aria-hidden="true" className="ice-glint left-[9%] top-[20%] h-[3.5%] w-[16%]" />
          <span aria-hidden="true" className="ice-glint right-[7%] top-[40%] h-[3.5%] w-[14%]" />
          {SPARKLES.map((sparkle, index) => (
            <svg
              key={index}
              aria-hidden="true"
              className="ice-sparkle"
              viewBox="0 0 100 100"
              style={{ left: sparkle.left, top: sparkle.top, width: sparkle.size, height: sparkle.size, animationDelay: sparkle.delay }}
            >
              <path d="M50 4 C54 36 64 46 96 50 C64 54 54 64 50 96 C46 64 36 54 4 50 C36 46 46 36 50 4 Z" fill="white" stroke={ICE_LINE} strokeWidth="7" strokeLinejoin="round" />
            </svg>
          ))}
          <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {cracks.map((crack) => (
              <g key={crack.id}>
                {crack.paths.map((d, index) => (
                  <g key={index}>
                    <path d={d} fill="none" stroke={ICE_LINE} strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                    <path d={d} fill="none" stroke="white" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                  </g>
                ))}
              </g>
            ))}
          </svg>
          <SnowCap />
          <Icicles />
          {/* The hammer rests on the ice until a mouse picks it up */}
          {hammer?.mode !== "held" && (
            <span aria-hidden="true" className="pointer-events-none absolute bottom-[5%] left-[3%] size-20 -scale-x-100 rotate-[14deg] sm:size-24">
              <Hammer />
            </span>
          )}
          {/* Bottom-left, clear of the star buddy in the bottom-right corner */}
          <span className="ice-tag pointer-events-none absolute bottom-[9%] left-[27%] rotate-2 py-2 pl-6 pr-3 text-start sm:left-[20%]">
            <span className="block font-display text-sm italic leading-tight sm:text-base">This is a good ice breaker</span>
            <span className="block font-mono text-[10px] font-medium uppercase tracking-wider">(literally)</span>
          </span>
          <span className="ice-label absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider">
            ❄ {LABELS[Math.min(hits, LABELS.length - 1)]}
          </span>
        </button>
      )}
      {hammer && !shattering && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[60] size-[112px]"
          // The striking face of the head sits on the pointer
          style={{ transform: `translate3d(${hammer.x - 112 * 0.12}px, ${hammer.y - 112 * 0.47}px, 0)` }}
        >
          <motion.div
            key={swing}
            className="size-full"
            style={{ transformOrigin: "88% 88%" }}
            initial={{ rotate: 14 }}
            animate={swing ? { rotate: [14, 38, -12, 8] } : { rotate: 14 }}
            transition={{ duration: 0.32, times: [0, 0.35, 0.7, 1], ease: "easeOut" }}
          >
            <Hammer />
          </motion.div>
        </div>
      )}
      {shattering && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {shards.map((shard, index) => {
            const dx = (shard.cx - 50) * (2 + Math.random() * 3);
            return (
              <motion.svg
                key={index}
                className="absolute inset-0 size-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ transformOrigin: `${shard.cx}% ${shard.cy}%` }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                // Reduced motion: the shards fade where they are instead of flying
                animate={
                  reducedMotion
                    ? { opacity: 0 }
                    : {
                        x: dx,
                        y: [0, -40 - Math.random() * 60, 420 + Math.random() * 200],
                        rotate: (Math.random() - 0.5) * 240,
                        opacity: [1, 1, 0],
                      }
                }
                transition={reducedMotion ? { duration: 0.6 } : { duration: 1 + Math.random() * 0.3, ease: [0.3, 0, 0.7, 1] }}
              >
                <polygon
                  points={shard.points.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill={SHARD_FILLS[index % SHARD_FILLS.length]}
                  stroke={ICE_LINE}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </motion.svg>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Cartoon trimmings ----------

const ICE_LINE = "#1d3a52";
const SHARD_FILLS = ["#d9f3fd", "#bfe8f8", "#a9def4", "#e9f9ff"];
const SPARKLES = [
  { left: "80%", top: "10%", size: 34, delay: "0s" },
  { left: "11%", top: "68%", size: 26, delay: "0.8s" },
  { left: "67%", top: "60%", size: 18, delay: "1.6s" },
];

// A cartoon mallet: steel head up-left, wooden handle down-right
function Hammer() {
  return (
    <svg viewBox="0 0 100 100" className="size-full overflow-visible">
      <line x1="38" y1="28" x2="88" y2="88" stroke={ICE_LINE} strokeWidth="19" strokeLinecap="round" />
      <line x1="38" y1="28" x2="88" y2="88" stroke="#c98a4b" strokeWidth="12" strokeLinecap="round" />
      <line x1="54" y1="50" x2="80" y2="81" stroke="#e7b77f" strokeWidth="3" strokeLinecap="round" />
      <g transform="rotate(-40 36 26)">
        <rect x="4" y="9" width="64" height="34" rx="8" fill="#a9b6c2" stroke={ICE_LINE} strokeWidth="4" />
        <rect x="4" y="9" width="13" height="34" rx="6" fill="#7f8e9c" stroke={ICE_LINE} strokeWidth="4" />
        <rect x="23" y="15" width="36" height="6" rx="3" fill="white" opacity="0.85" />
      </g>
    </svg>
  );
}

// A puffy snow drift sitting on the top edge
function SnowCap() {
  return (
    <svg aria-hidden="true" className="absolute -left-1.5 -top-7 h-10 w-[calc(100%+0.75rem)] overflow-visible" viewBox="0 0 200 36" preserveAspectRatio="none">
      <path
        d="M2 32 C0 20 8 12 18 16 C20 3 38 0 44 12 C50 1 66 1 70 14 C78 3 92 3 96 16 C102 3 118 1 124 14 C130 3 146 3 150 16 C156 3 172 3 176 14 C184 6 198 10 198 24 L198 32 Z"
        fill="white"
        stroke={ICE_LINE}
        strokeWidth="3"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Outlined icicles dripping off the bottom edge
function Icicles() {
  const drips = [
    [6, 18], [14, 30], [21, 14], [30, 36], [39, 20], [47, 28], [55, 16], [63, 34], [72, 22], [80, 30], [88, 15], [94, 24],
  ];
  const d = `M3 0 ${drips.map(([x, depth]) => `L${x - 3} 0 L${x} ${depth} L${x + 3} 0`).join(" ")} L97 0 Z`;
  return (
    <svg aria-hidden="true" className="absolute left-0 top-full h-10 w-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path d={d} fill="#d4f0fb" stroke={ICE_LINE} strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {drips.map(([x, depth]) => (
        <path key={x} d={`M${x - 1.2} 3 L${x - 0.3} ${depth * 0.6}`} stroke="white" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

// ---------- Snow ----------

const FLAKES = Array.from({ length: 28 }, (_, index) => {
  const random = (seed: number) => {
    const x = Math.sin(index * 51.7 + seed * 9.3) * 10000;
    return x - Math.floor(x);
  };
  return { left: random(1) * 100, top: random(6) * 95, size: 3 + random(2) * 5, delay: -random(3) * 12, duration: 8 + random(4) * 8, drift: (random(5) - 0.5) * 60 };
});

export function Snowfall() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLAKES.map((flake, index) => (
        <span
          key={index}
          className="snowflake absolute top-0 rounded-full"
          style={
            {
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.size,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              "--drift": `${flake.drift}px`,
              "--rest-top": `${flake.top}%`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ---------- The music ----------

// YouTube requires an embedded player to stay visible and at least 200×200,
// so the song plays in a small "Now playing" card rather than hidden audio.
// On phones it sits in the page under the card, so it never covers the ice.
export function ChristmasRadio({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Now playing"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="relative mt-8 w-[228px] border-2 border-on-paper bg-paper p-3 text-on-paper shadow-[6px_6px_0_var(--accent)] sm:fixed sm:bottom-6 sm:left-6 sm:z-[70] sm:mt-0"
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="font-mono text-[10px] font-medium uppercase leading-snug tracking-wider">
            <Music2 aria-hidden="true" className="mb-0.5 mr-1 inline size-3" />
            Now playing
            <span className="block font-body text-xs normal-case tracking-normal text-on-paper-muted">Mariah Carey · All I Want for Christmas Is You</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stop the music"
            data-cursor="stop"
            className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center hover:bg-on-paper hover:text-paper"
          >
            <X className="size-4" />
          </button>
        </div>
        <iframe
          className="block size-[200px] bg-ink"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&rel=0`}
          title="Mariah Carey – All I Want for Christmas Is You (official video)"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <a
          href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block font-mono text-[10px] font-medium uppercase tracking-wider text-on-paper-muted underline-offset-4 hover:underline"
        >
          Not playing? Open on YouTube
        </a>
      </motion.aside>
    </AnimatePresence>
  );
}
