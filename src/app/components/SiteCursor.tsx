import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [data-cursor]";
const SPARKLE_COLORS = ["#f4ed45", "#139f58", "#f4f1e8"];

// Site-wide cursor: a dot that tracks the pointer exactly, a ring that trails
// behind it and grows over links, and a light star trail when moving fast.
// Only mounts for mouse/trackpad users; touch devices keep native behaviour.
export default function SiteCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-site-cursor");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let lastSparkle = 0;
    let frame = 0;

    const spawnSparkle = (x: number, y: number) => {
      const trail = trailRef.current;
      if (!trail || trail.childElementCount > 24) return;
      const sparkle = document.createElement("span");
      sparkle.className = "site-cursor-sparkle";
      sparkle.textContent = "✦";
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      sparkle.style.setProperty("--drift", `${(Math.random() - 0.5) * 30}px`);
      sparkle.addEventListener("animationend", () => sparkle.remove());
      trail.appendChild(sparkle);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const speed = Math.hypot(event.clientX - target.x, event.clientY - target.y);
      target.x = event.clientX;
      target.y = event.clientY;

      const element = event.target as Element | null;
      // The scratch card draws its own coin cursor
      const overCanvas = element?.closest("canvas") != null;
      const interactive = element?.closest(INTERACTIVE) as HTMLElement | null;
      const root = document.documentElement;
      root.dataset.siteCursor = overCanvas ? "hidden" : interactive ? "hover" : "default";
      if (labelRef.current) {
        labelRef.current.textContent = interactive?.dataset.cursor ?? "";
      }

      const now = performance.now();
      if (!reducedMotion && !overCanvas && speed > 18 && now - lastSparkle > 45) {
        lastSparkle = now;
        spawnSparkle(event.clientX, event.clientY);
      }
    };

    const onDown = () => document.documentElement.classList.add("site-cursor-pressed");
    const onUp = () => document.documentElement.classList.remove("site-cursor-pressed");
    const onLeave = () => (document.documentElement.dataset.siteCursor = "hidden");

    const tick = () => {
      const ease = reducedMotion ? 1 : 0.2;
      ring.x += (target.x - ring.x) * ease;
      ring.y += (target.y - ring.y) * ease;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-site-cursor", "site-cursor-pressed");
      delete document.documentElement.dataset.siteCursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={trailRef} className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" />
      <div ref={ringRef} className="site-cursor-ring pointer-events-none fixed left-0 top-0 z-[101]">
        <div className="site-cursor-ring-shape">
          <span ref={labelRef} className="site-cursor-label" />
        </div>
      </div>
      <div ref={dotRef} className="site-cursor-dot pointer-events-none fixed left-0 top-0 z-[102]" />
    </div>
  );
}
