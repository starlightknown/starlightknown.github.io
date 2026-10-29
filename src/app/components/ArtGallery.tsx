import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";

// Add new pieces here. Files live in public/art/ (served from ./art/).
const artworks = [
  {
    title: "Sprinkle Donut",
    medium: "Blender · 3D animation",
    video: "art/sprinkle-donut.mp4",
    poster: "art/sprinkle-donut.jpg",
    tilt: -2,
    tape: "#f4ed45",
  },
  {
    title: "Crystal Core",
    medium: "Blender · Sci-fi loop",
    video: "art/crystal-core.mp4",
    poster: "art/crystal-core.jpg",
    tilt: 2.5,
    tape: "#f4f1e8",
  },
];

const hobbies = ["Blender", "3D animation", "Motion loops", "Illustration"];

function ArtPiece({ piece, index }: { piece: (typeof artworks)[number]; index: number }) {
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
    <motion.figure
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: piece.tilt }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.1 }}
      className="relative border-2 border-black bg-[#f4f1e8] p-3 pb-4 text-black shadow-[8px_8px_0_#111]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] border border-black/20 opacity-90"
        style={{ backgroundColor: piece.tape }}
      />
      <button
        type="button"
        onClick={toggle}
        data-cursor={playing ? "pause" : "play"}
        aria-label={`${playing ? "Pause" : "Play"} ${piece.title}`}
        className="group relative block aspect-[3/4] w-full overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          src={piece.video}
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
      <figcaption className="mt-4 flex items-baseline justify-between gap-3 px-1">
        <span className="font-display text-2xl leading-none">{piece.title}</span>
        <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-black/55">{piece.medium}</span>
      </figcaption>
    </motion.figure>
  );
}

export default function ArtGallery() {
  return (
    <section id="art" className="bg-[#139f58] text-black">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.22em]">02 / Side quests</p>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              Off the clock.
              <br />
              Still making things.
            </h2>
            <p className="mt-7 max-w-md text-base leading-7 text-black/65">
              When I&apos;m not in a Discord thread, I&apos;m usually in Blender—sculpting, lighting, and looping small scenes
              until they feel just right.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <span key={hobby} className="border border-black bg-[#f4f1e8] px-3 py-1.5 font-mono text-[11px] font-bold uppercase">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 px-2 sm:grid-cols-2 sm:gap-8">
            {artworks.map((piece, index) => (
              <ArtPiece key={piece.title} piece={piece} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
