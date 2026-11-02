import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Mic2,
  Pause,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import CoinCursor from "./imports/CoinCursor-2030-54";
import ArtGallery from "./components/ArtGallery";
import SiteCursor from "./components/SiteCursor";
import StarBuddy from "./components/StarBuddy";
import { CARD_COVERED_EVENT, CARD_REVEALED_EVENT } from "./components/pointer";
import VariantPicker, { useVariantParam } from "./variants/VariantPicker";
import "./variants/picker.css";

const experience = [
  {
    period: "Dec 2025–now",
    role: "Community & Support Associate",
    company: "Zencoder",
    note: "Community, support & automation",
    detail:
      "Own end-to-end customer support across Intercom, Discord, and email; built a custom Discord support bot and launched a structured open-source contributor program.",
  },
  {
    period: "Mar–Nov 2025",
    role: "Product Advocate",
    company: "DevRev",
    note: "Education & community growth",
    detail:
      "Built community programs, courses, workshops, hackathons, and self-serve spaces that turned learners and Discord members into active contributors.",
  },
  {
    period: "2023–Mar 2025",
    role: "Frontend Engineer",
    company: "DevRev",
    note: "Product engineering",
    detail:
      "Shipped React product features, Cypress tests, AI-assisted workflows, message translation, and production fixes rooted in real customer problems.",
  },
  {
    period: "2022",
    role: "Technical Writer",
    company: "AsyncAPI · Google Season of Docs",
    note: "Open-source documentation",
    detail:
      "Improved accessibility and content discovery on the AsyncAPI site, and created a documentation style guide for community contributors.",
  },
];

const skillGroups = {
  Community: ["Discord", "Intercom", "Notion", "Zendesk", "GitHub Discussions", "Workshops", "Contributor programs"],
  Building: ["React", "TypeScript", "JavaScript", "Node.js", "Python", "Bash", "Markdown"],
  Operations: ["GitHub Issues", "Git", "Slack", "WorkOS", "Railway", "Support triage", "SSO troubleshooting"],
};

const talks = [
  {
    type: "Zencoder roundtable",
    title: "Community, Code & Conversations That Matter",
    year: "Recent",
    embed: "https://www.youtube.com/embed/TBbdI84RIk8",
    url: "https://www.youtube.com/live/TBbdI84RIk8",
  },
  {
    type: "Build session",
    title: "Building with Appwrite's MCP server and Zenflow",
    year: "Recent",
    embed: "https://www.youtube.com/embed/2LrGEiPz_dY",
    url: "https://youtu.be/2LrGEiPz_dY",
  },
  {
    type: "Zencoder community hours",
    title: "Products and Launch Stories",
    year: "Recent",
    embed: "https://www.youtube.com/embed/F5MEDLsTOr4",
    url: "https://www.youtube.com/live/F5MEDLsTOr4",
  },
  {
    type: "Podcast series",
    title: "KlassTime with Karuna",
    year: "Series",
    embed: "https://www.youtube.com/embed/videoseries?list=PLg2hbSmyqB5bKQJMFKdgXVQUKsaAhCqav",
    url: "https://youtube.com/playlist?list=PLg2hbSmyqB5bKQJMFKdgXVQUKsaAhCqav",
  },
];

// Touch screens get a wider brush, an easier reveal and different instructions
const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

function ScratchIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scratching = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const lastBuzz = useRef(0);
  const [ready, setReady] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const [burst, setBurst] = useState(0);
  const reducedMotion = useReducedMotion();

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const rect = card.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#b7b7b2";
    context.fillRect(0, 0, rect.width, rect.height);

    const touch = isTouch();
    context.fillStyle = "#8c8c87";
    context.font = "500 13px 'DM Mono', monospace";
    context.textAlign = "center";
    context.letterSpacing = "2px";
    context.fillText(touch ? "SWIPE SIDEWAYS TO SCRATCH" : "SCRATCH HERE TO REVEAL THE HUMAN", rect.width / 2, rect.height / 2 - 7);
    context.font = "400 11px 'DM Mono', monospace";
    context.fillText(touch ? "(SCROLL UP AND DOWN AS USUAL)" : "(YES, THIS ACTUALLY WORKS)", rect.width / 2, rect.height / 2 + 16);
    setReady(true);
  }, []);

  useEffect(() => {
    paintCover();
    // A revealed card stays revealed; only an unrevealed cover is redrawn to fit
    const onResize = () => {
      if (!revealedRef.current) paintCover();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintCover]);

  const reveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    setBurst((value) => value + 1);
    window.dispatchEvent(new Event(CARD_REVEALED_EVENT));
  };

  const coverAgain = () => {
    revealedRef.current = false;
    setRevealed(false);
    setBurst(0);
    paintCover();
    window.dispatchEvent(new Event(CARD_COVERED_EVENT));
  };

  const erase = useCallback(
    (clientX: number, clientY: number) => {
      if (!ready) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const ratio = canvas.width / rect.width;
      const x = (clientX - rect.left) * ratio;
      const y = (clientY - rect.top) * ratio;
      const context = canvas.getContext("2d");
      if (!context) return;
      // paintCover leaves a devicePixelRatio scale on the context; these
      // coordinates are already in device pixels, so draw unscaled
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = (isTouch() ? Math.max(80, rect.width * 0.18) : Math.max(72, rect.width * 0.13)) * ratio;
      const previous = lastPoint.current;
      context.beginPath();
      context.moveTo(previous?.x ?? x, previous?.y ?? y);
      context.lineTo(x, y);
      context.stroke();
      lastPoint.current = { x, y };
    },
    [ready],
  );

  // Once most of the cover is gone, fade the rest and celebrate
  const checkReveal = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (revealedRef.current || !canvas || !context) return;
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;
    for (let alpha = 3; alpha < data.length; alpha += 4 * 37) {
      sampled++;
      if (data[alpha] === 0) cleared++;
    }
    if (cleared / sampled > (isTouch() ? 0.5 : 0.55)) reveal();
  };

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    // Fingers don't need a coin drawn under them
    if (event.pointerType !== "touch") setCursor({ x: event.clientX, y: event.clientY, visible: true });
    if (!scratching.current) return;
    erase(event.clientX, event.clientY);
    // A faint tick under the finger, on phones that support it
    if (event.pointerType === "touch" && event.timeStamp - lastBuzz.current > 70) {
      lastBuzz.current = event.timeStamp;
      navigator.vibrate?.(4);
    }
  };

  // Shared by pointerup and pointercancel, so an interrupted scratch still ends cleanly
  const endScratch = () => {
    if (!scratching.current) return;
    scratching.current = false;
    lastPoint.current = null;
    checkReveal();
  };

  return (
    <div className="relative">
      <div className="absolute -left-3 -top-4 z-20 rotate-[-6deg] bg-highlight px-3 py-2 font-mono text-[10px] font-medium text-on-highlight shadow-[3px_3px_0_var(--shade)] sm:-left-8">
        ONE PART COMMUNITY
        <br />
        ONE PART CODE
      </div>
      <div className="border border-accent bg-accent p-2 shadow-[10px_10px_0_var(--shade)]">
        <div className="flex items-center justify-between border-b border-on-accent/30 px-3 py-2 font-mono text-[10px] font-medium text-on-accent">
          <span>PORTFOLIO_ID: KT-63</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-highlight motion-safe:animate-pulse" />
            AVAILABLE FOR GOOD TROUBLE
          </span>
        </div>
        <div ref={cardRef} className="relative aspect-[4/5] sm:aspect-[4/3] sm:min-h-[330px] overflow-hidden bg-paper">
          {/* Tabbing into the card reveals it, so keyboard focus never sits under the cover */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center text-on-paper"
            onFocus={reveal}
          >
            <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-accent text-on-accent">
              <Sparkles className="size-5" />
            </span>
            <p className="font-display text-3xl leading-[1.04] sm:text-5xl">
              I turn users into contributors—and support signals into better products.
            </p>
            <p className="mt-5 max-w-md font-body text-sm leading-6 text-on-paper-muted sm:text-base">
              Developer advocate and community builder with an engineer&apos;s instinct for fixing the thing, not just explaining it.
            </p>
            <a
              href="#work"
              className="mt-6 inline-flex items-center gap-2 border-b-2 border-on-paper pb-1 font-mono text-xs font-medium uppercase"
            >
              See the community work <ArrowDown className="size-4" />
            </a>
          </div>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-10 size-full touch-pan-y cursor-none transition-opacity duration-700 ${
              revealed ? "pointer-events-none opacity-0" : ""
            }`}
            aria-hidden="true"
            onPointerDown={(event) => {
              scratching.current = true;
              lastPoint.current = null;
              event.currentTarget.setPointerCapture(event.pointerId);
              erase(event.clientX, event.clientY);
            }}
            onPointerMove={pointFromEvent}
            onPointerUp={endScratch}
            onPointerCancel={endScratch}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setCursor({ x: event.clientX, y: event.clientY, visible: true });
            }}
            onPointerLeave={() => setCursor((value) => ({ ...value, visible: false }))}
          />
        </div>
      </div>
      {burst > 0 && !reducedMotion && (
        <div key={burst} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-30">
          {Array.from({ length: 20 }, (_, index) => {
            const angle = (index / 20) * Math.PI * 2;
            const distance = 140 + (index % 3) * 70;
            return (
              <motion.span
                key={index}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
                style={{ color: ["var(--highlight)", "var(--accent)", "var(--shade)"][index % 3] }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: [0, 1.5, 0.6],
                  opacity: [1, 1, 0],
                  rotate: 220,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                ✦
              </motion.span>
            );
          })}
        </div>
      )}
      <button
        type="button"
        data-cursor={revealed ? "reset" : "reveal"}
        onClick={revealed ? coverAgain : reveal}
        className="mt-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted transition-colors hover:text-ink"
      >
        {revealed ? (
          <>
            <RefreshCw className="size-3.5" /> Cover it up again
          </>
        ) : (
          <>
            <Sparkles className="size-3.5" /> Reveal without scratching
          </>
        )}
      </button>
      {cursor.visible && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 size-[88px] -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `translate3d(${cursor.x - 44}px, ${cursor.y - 44}px, 0)` }}
        >
          <CoinCursor />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeSkills, setActiveSkills] = useState<keyof typeof skillGroups>("Community");
  const [tickerPaused, setTickerPaused] = useState(false);
  const reviewingVariants = useVariantParam();

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen overflow-hidden bg-background font-body text-foreground selection:bg-highlight selection:text-on-highlight">
      <a
        href="#content"
        className="sr-only z-50 bg-highlight px-4 py-2 font-mono text-xs font-medium uppercase text-on-highlight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-ink/15 bg-page/90 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a href="#top" className="font-display text-xl uppercase tracking-tight">
            Karuna Tata<span className="text-accent">.</span>
          </a>
          <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-ink-muted sm:flex">
            <a className="transition-colors hover:text-ink" href="#work">Work</a>
            <a className="transition-colors hover:text-ink" href="#art">Art</a>
            <a className="transition-colors hover:text-ink" href="#about">About</a>
            <a className="transition-colors hover:text-ink" href="#speaking">Speaking</a>
          </div>
          <a
            href="mailto:karunatata63@gmail.com"
            data-cursor="hi!"
            className="group flex items-center gap-2 bg-accent px-4 py-2 font-mono text-[11px] font-medium uppercase text-on-accent transition-colors hover:bg-highlight hover:text-on-highlight"
          >
            Say hello <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </a>
        </nav>
      </header>

      <main id="content" tabIndex={-1} className="focus:outline-none">

      <section id="top" className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            <MapPin className="size-4 text-accent" /> Bangalore, India
          </div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-accent">
            DevRel × community × engineering
          </p>
          <h1 className="font-display text-[clamp(4.4rem,10vw,9.5rem)] leading-[0.76] tracking-[-0.06em]">
            Karuna
            <br />
            <span className="ml-[0.22em] text-ink">Tata</span>
          </h1>
          <p className="mt-10 max-w-lg text-lg leading-8 text-ink-muted">
            I build communities where developers get unblocked, become contributors, and feel like they belong in the room.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-xs font-medium uppercase text-page transition-transform motion-safe:hover:-translate-y-1">
              Explore the work <ArrowDown className="size-4" />
            </a>
            <a href="https://github.com/starlightknown" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-ink/25 px-5 py-3 font-mono text-xs font-medium uppercase transition-colors hover:border-accent hover:text-accent">
              <Github className="size-4" /> GitHub
            </a>
          </div>
        </div>
        <ScratchIntro />
        <Asterisk className="absolute -left-10 top-10 size-40 text-ink/[0.025]" strokeWidth={1} />
      </section>

      <div className="relative rotate-[-1deg] scale-[1.02] overflow-hidden border-y border-on-highlight bg-highlight py-3 text-on-highlight">
        <div
          className="flex w-max gap-6 font-mono text-xs font-medium uppercase tracking-widest motion-safe:animate-[marquee_24s_linear_infinite]"
          style={{ animationPlayState: tickerPaused ? "paused" : "running" }}
        >
          {[...Array(2)].flatMap((_, index) =>
            ["Developer relations", "Community building", "Open source", "Customer advocacy", "Technical education", "Product feedback"].map((item) => (
              <span className="flex items-center gap-6" key={`${item}-${index}`} aria-hidden={index > 0 || undefined}>
                {item} <Asterisk className="size-4" />
              </span>
            )),
          )}
        </div>
        <button
          type="button"
          onClick={() => setTickerPaused((value) => !value)}
          data-cursor={tickerPaused ? "play" : "pause"}
          aria-label={tickerPaused ? "Play ticker" : "Pause ticker"}
          className="absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center bg-on-highlight text-highlight motion-reduce:hidden sm:left-6"
        >
          {tickerPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
      </div>

      <section id="work" className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-accent">01 / Experience log</p>
            <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">From first question<br />to lasting community.</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-ink-muted lg:justify-self-end">
            I work where community, product, and engineering overlap: resolving the immediate problem, spotting the pattern behind it, and building a system that helps the next person.
          </p>
        </div>

        <div className="border-t border-ink/20">
          {experience.map((item, index) => (
            <motion.article
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="group grid gap-5 border-b border-ink/20 py-8 transition-colors hover:bg-ink/[0.025] sm:grid-cols-[130px_1fr] lg:grid-cols-[150px_1.1fr_1fr] lg:gap-10 lg:py-10"
            >
              <div className="font-mono text-[11px] font-medium uppercase tracking-wider text-accent">{item.period}</div>
              <div>
                <h3 className="font-display text-3xl leading-tight sm:text-4xl">{item.role}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-ink-muted">{item.company} · {item.note}</p>
              </div>
              <p className="text-sm leading-7 text-ink-muted lg:pt-1">{item.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <ArtGallery />

      <section id="about" className="mx-auto grid max-w-[1440px] gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-40">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-accent">03 / Toolbox</p>
          <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">Community craft.<br /><span className="text-ink-subtle">Technical depth.</span></h2>
        </div>
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            {(Object.keys(skillGroups) as Array<keyof typeof skillGroups>).map((group) => (
              <button
                type="button"
                key={group}
                aria-pressed={activeSkills === group}
                onClick={() => setActiveSkills(group)}
                className={`border px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  activeSkills === group ? "border-highlight bg-highlight text-on-highlight" : "border-ink/20 text-ink-muted hover:border-ink/60 hover:text-ink"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="flex min-h-60 flex-wrap content-start gap-3 border-t border-ink/20 pt-7">
            {skillGroups[activeSkills].map((skill, index) => (
              <span
                key={`${activeSkills}-${skill}`}
                style={{ rotate: `${index % 3 === 0 ? -1 : index % 3 === 1 ? 1 : 0}deg` }}
                className="h-fit border border-ink/20 bg-ink/[0.04] px-5 py-3 font-display text-2xl transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="speaking" className="border-y border-ink/15 bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
          <div className="mb-14 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-accent">04 / On the mic</p>
              <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">Watch me build<br />community in public.</h2>
            </div>
            <Mic2 className="size-14 text-highlight" strokeWidth={1.2} />
          </div>
          <div className="grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2">
            {talks.map((video, index) => (
              <article key={video.title} className="group bg-surface">
                <div className="relative aspect-video overflow-hidden bg-black">
                  <iframe
                    className="absolute inset-0 size-full"
                    src={video.embed}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="flex min-h-36 items-start justify-between gap-6 p-6">
                  <div>
                    <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
                      0{index + 1} / {video.type}
                    </span>
                    <h3 className="mt-3 font-display text-2xl leading-tight transition-colors group-hover:text-accent sm:text-3xl">
                      {video.title}
                    </h3>
                  </div>
                  <a
                    href={video.url}
                    data-cursor="watch"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                    className="mt-1 shrink-0 border border-ink/20 p-2 transition-colors hover:border-highlight hover:bg-highlight hover:text-on-highlight"
                  >
                    <ArrowUpRight className="size-5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      </main>

      <footer className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pt-32">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-on-paper-muted">Building for developers—or a community around them?</p>
          <a href="mailto:karunatata63@gmail.com" data-cursor="email" className="group mt-6 flex items-end justify-between border-b-2 border-on-paper pb-4">
            <span className="font-display text-[clamp(3.3rem,10vw,9rem)] leading-[0.8] tracking-[-0.055em]">Let&apos;s make it.</span>
            <ArrowUpRight className="mb-1 size-10 transition-transform motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:translate-x-2 sm:size-20" strokeWidth={1.2} />
          </a>
          <div className="mt-10 flex flex-col gap-6 font-mono text-[11px] font-medium uppercase tracking-wider sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Karuna Tata · Built with curiosity</span>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <a className="flex items-center gap-2 underline-offset-4 hover:underline" href="mailto:karunatata63@gmail.com"><Mail className="size-4" /> Email</a>
              <a className="flex items-center gap-2 underline-offset-4 hover:underline" href="https://www.linkedin.com/in/starlightknown/" target="_blank" rel="noreferrer"><Linkedin className="size-4" /> LinkedIn</a>
              <a className="flex items-center gap-2 underline-offset-4 hover:underline" href="https://github.com/starlightknown" target="_blank" rel="noreferrer"><Github className="size-4" /> GitHub</a>
              <a className="flex items-center gap-2 underline-offset-4 hover:underline" href="https://www.instagram.com/orbitingstart/" target="_blank" rel="noreferrer"><Instagram className="size-4" /> Instagram</a>
            </div>
          </div>
        </div>
      </footer>
      <StarBuddy />
      <SiteCursor />
      {reviewingVariants && <VariantPicker />}
    </div>
    </MotionConfig>
  );
}
