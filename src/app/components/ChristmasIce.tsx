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
          data-cursor="break"
          aria-label={`${LABELS[Math.min(hits, LABELS.length - 1)]}. The card is frozen for Christmas`}
          className="ice-sheet group absolute inset-0 touch-pan-y"
          onPointerDown={(event) => {
            pressed.current = true;
            const { x, y } = pointIn(event);
            lastScratch.current = { x, y, time: event.timeStamp };
            hit(x, y);
          }}
          // Scratching across the ice counts too, about four times a second
          onPointerMove={(event) => {
            if (!pressed.current || !lastScratch.current) return;
            const { x, y } = pointIn(event);
            const moved = Math.hypot(x - lastScratch.current.x, y - lastScratch.current.y);
            if (moved > 12 && event.timeStamp - lastScratch.current.time > 250) {
              lastScratch.current = { x, y, time: event.timeStamp };
              hit(x, y);
            }
          }}
          onPointerUp={() => (pressed.current = false)}
          onPointerCancel={() => (pressed.current = false)}
          onClick={(event) => {
            // Keyboard activation (Enter/Space) arrives as a click with no pointer
            if (event.detail === 0) hit(50 + (Math.random() - 0.5) * 30, 50 + (Math.random() - 0.5) * 30);
          }}
        >
          <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {cracks.map((crack) => (
              <g key={crack.id}>
                {crack.paths.map((d, index) => (
                  <g key={index}>
                    <path d={d} fill="none" stroke="rgb(70 110 140 / 0.55)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                    <path d={d} fill="none" stroke="white" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  </g>
                ))}
              </g>
            ))}
          </svg>
          <span className="ice-snowcap" aria-hidden="true" />
          <span className="ice-icicles" aria-hidden="true" />
          <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white bg-white/85 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-[#1d3a52] shadow-sm">
            ❄ {LABELS[Math.min(hits, LABELS.length - 1)]}
          </span>
        </button>
      )}
      {shattering && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {shards.map((shard, index) => {
            const dx = (shard.cx - 50) * (2 + Math.random() * 3);
            return (
              <motion.div
                key={index}
                className="ice-sheet absolute inset-0"
                style={{ clipPath: `polygon(${shard.points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`, transformOrigin: `${shard.cx}% ${shard.cy}%` }}
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
              />
            );
          })}
        </div>
      )}
    </div>
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
