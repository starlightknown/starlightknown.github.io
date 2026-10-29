import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Instagram, Pause, Play, X } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/orbitingstart/";

type Artwork = {
  title: string;
  medium: string;
  // Files live in public/art/ (served from ./art/)
  src: string;
  poster?: string;
  kind: "image" | "video";
  width: number;
  height: number;
};

// Add new pieces here; tilt and tape colour are assigned by position.
const artworks: Artwork[] = [
  { title: "Embers", medium: "Watercolour & gold", src: "art/embers.jpg", kind: "image", width: 666, height: 1128 },
  { title: "Sprinkle Donut", medium: "Blender · 3D loop", src: "art/sprinkle-donut.mp4", poster: "art/sprinkle-donut.jpg", kind: "video", width: 720, height: 960 },
  { title: "Comet Night", medium: "Acrylic on canvas", src: "art/comet.jpg", kind: "image", width: 670, height: 1010 },
  { title: "Nebula", medium: "Acrylic on canvas", src: "art/nebula.jpg", kind: "image", width: 762, height: 934 },
  { title: "Lantern Tree", medium: "Acrylic on canvas", src: "art/lantern-tree.jpg", kind: "image", width: 560, height: 824 },
  { title: "Crystal Core", medium: "Blender · Sci-fi loop", src: "art/crystal-core.mp4", poster: "art/crystal-core.jpg", kind: "video", width: 720, height: 960 },
  { title: "Waterfall Valley", medium: "Acrylic on canvas", src: "art/waterfall.jpg", kind: "image", width: 900, height: 696 },
];

const TILTS = [-2, 1.5, -1, 2.5, -2.5, 1, 2];
const TAPES = ["#f4ed45", "#f4f1e8", "#ff8fa3", "#f4ed45", "#f4f1e8"];
const hobbies = ["Acrylics", "Watercolour", "Blender", "3D animation"];

function LoopingVideo({ piece }: { piece: Artwork }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Autoplay while on screen, unless the viewer prefers reduced motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor={playing ? "pause" : "play"}
      aria-label={`${playing ? "Pause" : "Play"} ${piece.title}`}
      className="group relative block w-full overflow-hidden bg-black"
      style={{ aspectRatio: `${piece.width} / ${piece.height}` }}
    >
      <video
        ref={videoRef}
        src={piece.src}
        poster={piece.poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="size-full object-cover"
      />
      <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center border border-black bg-[#f4ed45] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </span>
    </button>
  );
}

function Polaroid({ piece, index, onOpen }: { piece: Artwork; index: number; onOpen: () => void }) {
  const tilt = TILTS[index % TILTS.length];
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: (index % 4) * 0.08 }}
      className="relative mb-10 inline-block w-full break-inside-avoid border-2 border-black bg-[#f4f1e8] p-3 pb-4 text-black shadow-[8px_8px_0_#111]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-[-3deg] border border-black/20 opacity-90"
        style={{ backgroundColor: TAPES[index % TAPES.length] }}
      />
      {piece.kind === "video" ? (
        <LoopingVideo piece={piece} />
      ) : (
        <button type="button" onClick={onOpen} data-cursor="look" aria-label={`View ${piece.title} larger`} className="block w-full">
          <img
            src={piece.src}
            alt={`${piece.title}, ${piece.medium.toLowerCase()} by Karuna Tata`}
            width={piece.width}
            height={piece.height}
            loading="lazy"
            className="block h-auto w-full"
          />
        </button>
      )}
      <figcaption className="mt-4 flex items-baseline justify-between gap-3 px-1">
        <span className="font-display text-2xl leading-none">{piece.title}</span>
        <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-black/55">{piece.medium}</span>
      </figcaption>
    </motion.figure>
  );
}

function Lightbox({ piece, onClose }: { piece: Artwork; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={piece.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-5 backdrop-blur-sm"
    >
      <motion.figure
        initial={{ scale: 0.9, rotate: -3 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-full border-2 border-black bg-[#f4f1e8] p-3 pb-4 text-black shadow-[10px_10px_0_#139f58]"
      >
        <img src={piece.src} alt={piece.title} className="block max-h-[78vh] w-auto max-w-full" />
        <figcaption className="mt-4 flex items-baseline justify-between gap-6 px-1">
          <span className="font-display text-3xl leading-none">{piece.title}</span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black/55">{piece.medium}</span>
        </figcaption>
        <button
          type="button"
          onClick={onClose}
          data-cursor="close"
          aria-label="Close"
          autoFocus
          className="absolute -right-4 -top-4 flex size-10 items-center justify-center border-2 border-black bg-[#f4ed45] transition-transform hover:rotate-90"
        >
          <X className="size-5" />
        </button>
      </motion.figure>
    </motion.div>
  );
}

export default function ArtGallery() {
  const [open, setOpen] = useState<Artwork | null>(null);

  return (
    <section id="art" className="bg-[#139f58] text-black">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.22em]">02 / Side quests</p>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              Off the clock.
              <br />
              Still making things.
            </h2>
          </div>
          <div>
            <p className="max-w-md text-base leading-7 text-black/65">
              When I&apos;m not in a Discord thread, I&apos;m painting skies, nebulae, and small glowing worlds—or looping little
              scenes in Blender until they feel just right.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {hobbies.map((hobby) => (
                <span key={hobby} className="border border-black bg-[#f4f1e8] px-3 py-1.5 font-mono text-[11px] font-bold uppercase">
                  {hobby}
                </span>
              ))}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                data-cursor="follow"
                className="group ml-1 inline-flex items-center gap-1.5 border border-black bg-black px-3 py-1.5 font-mono text-[11px] font-bold uppercase text-[#f4ed45] transition-colors hover:bg-[#f4ed45] hover:text-black"
              >
                <Instagram className="size-3.5" /> More on Instagram
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
        <div className="columns-1 gap-10 px-2 sm:columns-2 lg:columns-3">
          {artworks.map((piece, index) => (
            <Polaroid key={piece.title} piece={piece} index={index} onOpen={() => setOpen(piece)} />
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <Lightbox piece={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
