import { useEffect, useState } from "react";

// Easter egg: "night mode" swaps in the Night studio palette (palette.css).
// Triggers: the Konami code, typing "night", or tapping the star buddy five
// times fast (it dispatches NIGHT_TOGGLE_EVENT). The choice is remembered.

export const NIGHT_TOGGLE_EVENT = "night-mode-toggle";
export const NIGHT_CHANGED_EVENT = "night-mode-changed";

const STORAGE_KEY = "night-mode";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const WORD = "night";

const isNight = () => document.documentElement.dataset.mode === "night";

function applyNight(night: boolean) {
  const root = document.documentElement;
  // Swap every colour in one frame rather than letting each transition fire
  root.classList.add("switching-palette");
  if (night) root.dataset.mode = "night";
  else delete root.dataset.mode;
  void getComputedStyle(root).color;
  requestAnimationFrame(() => root.classList.remove("switching-palette"));
  try {
    localStorage.setItem(STORAGE_KEY, night ? "1" : "0");
  } catch {
    // Storage can be unavailable (private mode); the toggle still works for this visit
  }
}

function setNight(night: boolean) {
  if (night === isNight()) return;
  applyNight(night);
  window.dispatchEvent(new CustomEvent(NIGHT_CHANGED_EVENT, { detail: { night } }));
}

export function useNightMode() {
  const [night, setNightState] = useState(() => typeof document !== "undefined" && isNight());
  useEffect(() => {
    const onChange = (event: Event) => setNightState((event as CustomEvent<{ night: boolean }>).detail.night);
    window.addEventListener(NIGHT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(NIGHT_CHANGED_EVENT, onChange);
  }, []);
  return night;
}

// Listens for the secret codes; renders nothing
export function NightModeKeys() {
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setNight(true);
    } catch {
      // No stored preference available
    }

    const keys: string[] = [];
    let typed = "";
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      keys.push(key);
      if (keys.length > KONAMI.length) keys.shift();
      typed = (typed + (key.length === 1 ? key : " ")).slice(-WORD.length);

      if (keys.join() === KONAMI.join() || typed === WORD) {
        keys.length = 0;
        typed = "";
        setNight(!isNight());
      }
    };
    const onToggle = () => setNight(!isNight());

    window.addEventListener("keydown", onKey);
    window.addEventListener(NIGHT_TOGGLE_EVENT, onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(NIGHT_TOGGLE_EVENT, onToggle);
    };
  }, []);
  return null;
}

// Deterministic scatter so the sky doesn't reshuffle on every render
const STARS = Array.from({ length: 42 }, (_, index) => {
  const random = (seed: number) => {
    const x = Math.sin(index * 97.13 + seed * 13.7) * 10000;
    return x - Math.floor(x);
  };
  return {
    left: random(1) * 100,
    top: random(2) * 100,
    size: 1 + Math.round(random(3) * 2),
    delay: random(4) * 4,
    duration: 2.5 + random(5) * 3,
  };
});

export function NightSky() {
  const night = useNightMode();
  if (!night) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((star, index) => (
        <span
          key={index}
          className="night-star absolute rounded-full bg-ink"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
