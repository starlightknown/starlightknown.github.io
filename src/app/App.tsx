import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Check,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Mic2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import CoinCursor from "./imports/CoinCursor-2030-54";
import SiteCursor from "./components/SiteCursor";
import StarBuddy, { CARD_REVEALED_EVENT } from "./components/StarBuddy";

const experience = [
  {
    period: "DEC 2025—NOW",
    role: "Community & Support Associate",
    company: "Zencoder",
    note: "Community, support & automation",
    detail:
      "Own end-to-end customer support across Intercom, Discord, and email; built a custom Discord support bot and launched a structured open-source contributor program.",
  },
  {
    period: "MAR—NOV 2025",
    role: "Product Advocate",
    company: "DevRev",
    note: "Education & community growth",
    detail:
      "Built community programs, courses, workshops, hackathons, and self-serve spaces that turned learners and Discord members into active contributors.",
  },
  {
    period: "2023—MAR 2025",
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

function ScratchIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scratching = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  const paintCover = useCallback(() => {
    setRevealed(false);
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

    context.fillStyle = "#8c8c87";
    context.font = "700 13px 'DM Mono', monospace";
    context.textAlign = "center";
    context.letterSpacing = "2px";
    context.fillText("SCRATCH HERE TO REVEAL THE HUMAN", rect.width / 2, rect.height / 2 - 7);
    context.font = "400 11px 'DM Mono', monospace";
    context.fillText("(YES, THIS ACTUALLY WORKS)", rect.width / 2, rect.height / 2 + 16);
    setReady(true);
  }, []);

  useEffect(() => {
    paintCover();
    window.addEventListener("resize", paintCover);
    return () => window.removeEventListener("resize", paintCover);
  }, [paintCover]);

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
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = Math.max(72, rect.width * 0.13) * ratio;
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
    if (revealed || !canvas || !context) return;
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;
    for (let alpha = 3; alpha < data.length; alpha += 4 * 37) {
      sampled++;
      if (data[alpha] === 0) cleared++;
    }
    if (cleared / sampled > 0.55) {
      setRevealed(true);
      setBurst((value) => value + 1);
      window.dispatchEvent(new Event(CARD_REVEALED_EVENT));
    }
  };

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    setCursor({ x: event.clientX, y: event.clientY, visible: true });
    if (scratching.current) erase(event.clientX, event.clientY);
  };

  return (
    <div className="relative">
      <div className="absolute -left-3 -top-4 z-20 rotate-[-6deg] bg-[#f4ed45] px-3 py-2 font-mono text-[10px] font-bold text-black shadow-[3px_3px_0_#111] sm:-left-8">
        ONE PART COMMUNITY
        <br />
        ONE PART CODE
      </div>
      <div className="absolute -right-2 -bottom-5 z-20 rotate-[4deg] border border-black bg-white px-3 py-2 font-mono text-[10px] font-bold text-black shadow-[3px_3px_0_#139f58] sm:-right-7">
        EST. HYDERABAD
      </div>
      <div className="border border-[#139f58] bg-[#139f58] p-2 shadow-[10px_10px_0_#0b0b0b]">
        <div className="flex items-center justify-between border-b border-black/30 px-3 py-2 font-mono text-[10px] font-bold text-black">
          <span>PORTFOLIO_ID: KT-63</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-[#f4ed45]" />
            AVAILABLE FOR GOOD TROUBLE
          </span>
        </div>
        <div ref={cardRef} className="relative aspect-[4/5] sm:aspect-[4/3] sm:min-h-[330px] overflow-hidden bg-[#f4f1e8]">
          <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center text-black">
            <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-[#139f58]">
              <Sparkles className="size-5" />
            </span>
            <p className="font-display text-3xl leading-[1.04] sm:text-5xl">
              I turn users into contributors—and support signals into better products.
            </p>
            <p className="mt-5 max-w-md font-body text-sm leading-6 text-black/65 sm:text-base">
              Developer advocate and community builder with an engineer&apos;s instinct for fixing the thing, not just explaining it.
            </p>
            <a
              href="#work"
              className="mt-6 inline-flex items-center gap-2 border-b-2 border-black pb-1 font-mono text-xs font-bold uppercase"
            >
              See the community work <ArrowDown className="size-4" />
            </a>
          </div>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-10 size-full touch-none cursor-none transition-opacity duration-700 ${
              revealed ? "pointer-events-none opacity-0" : ""
            }`}
            aria-label="Scratch to reveal Karuna's introduction"
            onPointerDown={(event) => {
              scratching.current = true;
              lastPoint.current = null;
              event.currentTarget.setPointerCapture(event.pointerId);
              erase(event.clientX, event.clientY);
            }}
            onPointerMove={pointFromEvent}
            onPointerUp={() => {
              scratching.current = false;
              lastPoint.current = null;
              checkReveal();
            }}
            onPointerEnter={(event) => setCursor({ x: event.clientX, y: event.clientY, visible: true })}
            onPointerLeave={() => setCursor((value) => ({ ...value, visible: false }))}
          />
        </div>
      </div>
      {burst > 0 && (
        <div key={burst} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-30">
          {Array.from({ length: 20 }, (_, index) => {
            const angle = (index / 20) * Math.PI * 2;
            const distance = 140 + (index % 3) * 70;
            return (
              <motion.span
                key={index}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
                style={{ color: ["#f4ed45", "#139f58", "#111"][index % 3] }}
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
        data-cursor="reset"
        onClick={paintCover}
        className="mt-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white/60 transition-colors hover:text-[#f4ed45]"
      >
        <RefreshCw className="size-3.5" /> Cover it up again
      </button>
      {cursor.visible && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 hidden size-[88px] -translate-x-1/2 -translate-y-1/2 md:block"
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

  return (
    <main className="min-h-screen overflow-hidden bg-background font-body text-foreground selection:bg-[#f4ed45] selection:text-black">
      <header className="sticky top-0 z-40 border-b border-white/15 bg-[#1e1e1e]/90 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a href="#top" className="font-display text-xl tracking-tight">
            KARUNA TATA<span className="text-[#139f58]">.</span>
          </a>
          <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-white/60 sm:flex">
            <a className="transition-colors hover:text-white" href="#work">Work</a>
            <a className="transition-colors hover:text-white" href="#about">About</a>
            <a className="transition-colors hover:text-white" href="#speaking">Speaking</a>
          </div>
          <a
            href="mailto:karunatata63@gmail.com"
            data-cursor="hi!"
            className="group flex items-center gap-2 bg-[#139f58] px-4 py-2 font-mono text-[11px] font-bold uppercase text-black transition-colors hover:bg-[#f4ed45]"
          >
            Say hello <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </nav>
      </header>

      <section id="top" className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            <MapPin className="size-4 text-[#139f58]" /> Bangalore, India
          </div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[#139f58]">
            DevRel × community × engineering
          </p>
          <h1 className="font-display text-[clamp(4.4rem,10vw,9.5rem)] leading-[0.76] tracking-[-0.06em]">
            Karuna
            <br />
            <span className="ml-[0.22em] text-[#f4f1e8]">Tata</span>
          </h1>
          <p className="mt-10 max-w-lg text-lg leading-8 text-white/60">
            I build communities where developers get unblocked, become contributors, and feel like they belong in the room.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-2 bg-white px-5 py-3 font-mono text-xs font-bold uppercase text-black transition-transform hover:-translate-y-1">
              Explore the work <ArrowDown className="size-4" />
            </a>
            <a href="https://github.com/starlightknown" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 font-mono text-xs font-bold uppercase transition-colors hover:border-[#139f58] hover:text-[#139f58]">
              <Github className="size-4" /> GitHub
            </a>
          </div>
        </div>
        <ScratchIntro />
        <Asterisk className="absolute -left-10 top-10 size-40 text-white/[0.025]" strokeWidth={1} />
      </section>

      <div className="rotate-[-1deg] scale-[1.02] overflow-hidden border-y border-black bg-[#f4ed45] py-3 text-black">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-6 font-mono text-xs font-bold uppercase tracking-widest">
          {[...Array(2)].flatMap((_, index) =>
            ["DEVELOPER RELATIONS", "COMMUNITY BUILDING", "OPEN SOURCE", "CUSTOMER ADVOCACY", "TECHNICAL EDUCATION", "PRODUCT FEEDBACK"].map((item) => (
              <span className="flex items-center gap-6" key={`${item}-${index}`}>
                {item} <Asterisk className="size-4" />
              </span>
            )),
          )}
        </div>
      </div>

      <section id="work" className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#139f58]">01 / Experience log</p>
            <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">From first question<br />to lasting community.</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-white/55 lg:justify-self-end">
            I work where community, product, and engineering overlap: resolving the immediate problem, spotting the pattern behind it, and building a system that helps the next person.
          </p>
        </div>

        <div className="border-t border-white/20">
          {experience.map((item, index) => (
            <motion.article
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="group grid gap-5 border-b border-white/20 py-8 transition-colors hover:bg-white/[0.025] sm:grid-cols-[130px_1fr] lg:grid-cols-[150px_1.1fr_1fr] lg:gap-10 lg:py-10"
            >
              <div className="font-mono text-[11px] font-bold tracking-wider text-[#139f58]">{item.period}</div>
              <div>
                <h3 className="font-display text-3xl leading-tight sm:text-4xl">{item.role}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-white/45">{item.company} · {item.note}</p>
              </div>
              <p className="text-sm leading-7 text-white/55 lg:pt-1">{item.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#139f58] text-black">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.22em]">02 / Community impact</p>
              <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">People first.<br />Numbers included.</h2>
              <p className="mt-7 max-w-md text-base leading-7 text-black/65">
                Programs are only useful when people return, learn, contribute, and get unstuck. These are a few outcomes I am proud of.
              </p>
            </div>
            <div className="grid gap-px border border-black/25 bg-black/25 sm:grid-cols-2">
              {[
                ["900+", "Customer conversations", "Owned resolution across Intercom, Discord, and email—escalating to Engineering only when it was genuinely needed."],
                ["3,533+", "Community members", "Created a tiered points system that gave passive members a clear path from active participant to community Champion."],
                ["436", "Course learners", "Released two self-serve courses with a 4.04/5 rating, alongside 14 customer training sessions rated 4.5/5."],
                ["100+", "Hackathon participants", "Hosted student hackathons that brought in eight new regular contributors, plus a GenAI series for 30+ educators."],
              ].map(([number, title, detail]) => (
                <article key={title} className="min-h-64 bg-[#139f58] p-7 transition-colors hover:bg-[#f4ed45]">
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                    <span>{number}</span><Check className="size-4" />
                  </div>
                  <h3 className="mt-12 font-display text-3xl leading-none">{title}</h3>
                  <p className="mt-5 text-sm leading-6 text-black/65">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-[1440px] gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-40">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#139f58]">03 / Toolbox</p>
          <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">Community craft.<br /><span className="text-white/30">Technical depth.</span></h2>
        </div>
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            {(Object.keys(skillGroups) as Array<keyof typeof skillGroups>).map((group) => (
              <button
                type="button"
                key={group}
                onClick={() => setActiveSkills(group)}
                className={`border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  activeSkills === group ? "border-[#f4ed45] bg-[#f4ed45] text-black" : "border-white/20 text-white/55 hover:border-white/60 hover:text-white"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="flex min-h-60 flex-wrap content-start gap-3 border-t border-white/20 pt-7">
            {skillGroups[activeSkills].map((skill, index) => (
              <motion.span
                key={`${activeSkills}-${skill}`}
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: index % 3 === 0 ? -1 : index % 3 === 1 ? 1 : 0 }}
                transition={{ delay: index * 0.04 }}
                className="h-fit border border-white/20 bg-white/[0.04] px-5 py-3 font-display text-2xl transition-colors hover:border-[#139f58] hover:bg-[#139f58] hover:text-black"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section id="speaking" className="border-y border-white/15 bg-[#171717]">
        <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
          <div className="mb-14 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#139f58]">04 / On the mic</p>
              <h2 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">Watch me build<br />community in public.</h2>
            </div>
            <Mic2 className="size-14 text-[#f4ed45]" strokeWidth={1.2} />
          </div>
          <div className="grid gap-px border border-white/15 bg-white/15 md:grid-cols-2">
            {talks.map((video, index) => (
              <article key={video.title} className="group bg-[#171717]">
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
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#139f58]">
                      0{index + 1} / {video.type}
                    </span>
                    <h3 className="mt-3 font-display text-2xl leading-tight transition-colors group-hover:text-[#f4ed45] sm:text-3xl">
                      {video.title}
                    </h3>
                  </div>
                  <a
                    href={video.url}
                    data-cursor="watch"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                    className="mt-1 shrink-0 border border-white/20 p-2 transition-colors hover:border-[#f4ed45] hover:bg-[#f4ed45] hover:text-black"
                  >
                    <ArrowUpRight className="size-5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#f4f1e8] text-black">
        <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pt-32">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-black/45">Building for developers—or a community around them?</p>
          <a href="mailto:karunatata63@gmail.com" data-cursor="email" className="group mt-6 flex items-end justify-between border-b-2 border-black pb-4">
            <span className="font-display text-[clamp(3.3rem,10vw,9rem)] leading-[0.8] tracking-[-0.055em]">Let&apos;s make it.</span>
            <ArrowUpRight className="mb-1 size-10 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2 sm:size-20" strokeWidth={1.2} />
          </a>
          <div className="mt-10 flex flex-col gap-6 font-mono text-[11px] font-bold uppercase tracking-wider sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Karuna Tata · Built with curiosity</span>
            <div className="flex gap-5">
              <a className="flex items-center gap-2 hover:text-[#139f58]" href="mailto:karunatata63@gmail.com"><Mail className="size-4" /> Email</a>
              <a className="flex items-center gap-2 hover:text-[#139f58]" href="https://www.linkedin.com/in/starlightknown/" target="_blank" rel="noreferrer"><Linkedin className="size-4" /> LinkedIn</a>
              <a className="flex items-center gap-2 hover:text-[#139f58]" href="https://github.com/starlightknown" target="_blank" rel="noreferrer"><Github className="size-4" /> GitHub</a>
            </div>
          </div>
        </div>
      </footer>
      <StarBuddy />
      <SiteCursor />
    </main>
  );
}
