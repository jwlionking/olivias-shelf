import { useEffect, useState } from "react";
import type { SceneKind } from "@/data/types";
import { cn } from "@/lib/utils";

const palettes: Record<
  SceneKind,
  { sky: string; ground: string; accent: string }
> = {
  "night-sky": { sky: "#1a2744", ground: "#24301a", accent: "#d45a3a" },
  kite: { sky: "#7eb3d4", ground: "#4a7c59", accent: "#d45a3a" },
  ocean: { sky: "#0d3a4a", ground: "#123048", accent: "#e8b86d" },
  garden: { sky: "#5a4a72", ground: "#3d5a3a", accent: "#d45a3a" },
  snow: { sky: "#1e2a44", ground: "#dce6f0", accent: "#e07a3a" },
  lantern: { sky: "#1a1e38", ground: "#2a241c", accent: "#e8b86d" },
  rice: { sky: "#c9a36a", ground: "#8a6b32", accent: "#d45a3a" },
  festival: { sky: "#67b8d4", ground: "#e8d9a0", accent: "#d45a3a" },
  beach: { sky: "#16344c", ground: "#e6d3a8", accent: "#c9d4dc" },
  bamboo: { sky: "#142418", ground: "#1e301c", accent: "#e8b86d" },
  paris: { sky: "#3a2e4a", ground: "#5c5348", accent: "#e8b86d" },
  newyear: { sky: "#2a1014", ground: "#3a1a16", accent: "#d45a3a" },
  fog: { sky: "#c9b8a6", ground: "#8a8175", accent: "#d45a3a" },
  london: { sky: "#4a5568", ground: "#3a3a40", accent: "#d45a3a" },
  madrid: { sky: "#2a2438", ground: "#8a6a48", accent: "#e8b86d" },
  meadow: { sky: "#1a1633", ground: "#2a3a22", accent: "#e8b4c8" },
  workshop: { sky: "#c9d6e4", ground: "#8a6b48", accent: "#d45a3a" },
  farm: { sky: "#7eb3d4", ground: "#4a7c59", accent: "#c9a36a" },
};

export function PopupScene({
  scene,
  page,
  onTap,
}: {
  scene: SceneKind;
  page: number;
  onTap: () => void;
}) {
  const [pop, setPop] = useState<string | null>(null);
  const pal = palettes[scene];

  useEffect(() => {
    setPop(null);
  }, [page, scene]);

  function tap(id: string) {
    setPop(id);
    onTap();
    window.setTimeout(() => setPop((p) => (p === id ? null : p)), 700);
  }

  return (
    <div
      className="relative isolate overflow-hidden rounded-lg"
      style={{
        background: pal.sky,
        perspective: "900px",
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: pal.ground, opacity: 0.85 }}
      />
      <div
        className="relative mx-auto aspect-4/3 w-full max-w-xl origin-bottom"
        style={{
          transformStyle: "preserve-3d",
          animation: "page-pop 500ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {renderScene(scene, page, pop, tap, pal.accent)}
      </div>
      <p className="pointer-events-none absolute bottom-2 left-3 text-[11px] tracking-wide text-cream/70">
        Touch everything
      </p>
    </div>
  );
}

function Paper({
  className,
  style,
  onClick,
  popped,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  popped?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute border border-black/10 shadow-soft transition-transform duration-300",
        popped && "-translate-y-2 scale-110",
        className,
      )}
      style={style}
    >
      {children}
    </button>
  );
}

function renderScene(
  scene: SceneKind,
  page: number,
  pop: string | null,
  tap: (id: string) => void,
  accent: string,
) {
  const lift = page * 4;
  switch (scene) {
    case "night-sky":
      return (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-1 rounded-full bg-cream"
              style={{
                left: `${12 + ((i * 11) % 80)}%`,
                top: `${10 + ((i * 17) % 40)}%`,
                animation: `twinkle ${1.6 + (i % 3) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
          <Paper
            popped={pop === "moon"}
            onClick={() => tap("moon")}
            className="right-[14%] top-[12%] size-16 rounded-full bg-cream"
            style={{ boxShadow: "0 0 24px #f6f0e4aa" }}
          />
          <Paper
            popped={pop === "balloon"}
            onClick={() => tap("balloon")}
            className="left-[38%] top-[28%] h-20 w-16 rounded-full"
            style={{
              background: accent,
              transform: `translateY(${-lift}px)`,
              animation: "float-y 3.2s ease-in-out infinite",
            }}
          />
          <div
            className="absolute left-1/2 top-[48%] h-24 w-px bg-cream/70"
            style={{ transform: "translateX(-50%)" }}
          />
        </>
      );
    case "meadow":
      return (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-1 rounded-full bg-cream"
              style={{
                left: `${10 + ((i * 13) % 82)}%`,
                top: `${8 + ((i * 19) % 42)}%`,
                animation: `twinkle ${1.5 + (i % 3) * 0.4}s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
          <Paper
            popped={pop === "moon"}
            onClick={() => tap("moon")}
            className="right-[12%] top-[10%] size-14 rounded-full bg-cream"
            style={{ boxShadow: "0 0 24px #f6f0e4aa" }}
          />
          <Paper
            popped={pop === "pony"}
            onClick={() => tap("pony")}
            className="right-[22%] bottom-[22%] h-16 w-24 rounded-[40%]"
            style={{ background: accent, transform: `translateY(${-lift}px)` }}
          />
          <Paper
            popped={pop === "lila"}
            onClick={() => tap("lila")}
            className="left-[24%] bottom-[20%] h-20 w-10 rounded-full bg-cream"
            style={{ transform: `translateY(${-lift * 0.6}px)` }}
          />
        </>
      );
    case "workshop":
      return (
        <>
          <Paper
            popped={pop === "rocket"}
            onClick={() => tap("rocket")}
            className="right-[28%] top-[22%] h-20 w-10 rounded-sm"
            style={{ background: accent, transform: `translateY(${-lift}px)` }}
          />
          <Paper
            popped={pop === "apple"}
            onClick={() => tap("apple")}
            className="left-[30%] top-[30%] size-10 rounded-full"
            style={{ background: "#c23b2e" }}
          />
        </>
      );
    case "farm":
      return (
        <>
          <Paper
            popped={pop === "zero"}
            onClick={() => tap("zero")}
            className="left-[22%] bottom-[22%] h-14 w-24 rounded-[40%]"
            style={{ background: "#5a4632", transform: `translateY(${-lift}px)` }}
          />
          <Paper
            popped={pop === "belle"}
            onClick={() => tap("belle")}
            className="right-[20%] bottom-[20%] h-14 w-24 rounded-[40%]"
            style={{ background: accent, transform: `translateY(${-lift * 0.6}px)` }}
          />
        </>
      );
    case "kite":
      return (
        <>
          <Paper
            className="left-[10%] top-[22%] h-10 w-28 rounded-full bg-cream/70"
            popped={pop === "cloud"}
            onClick={() => tap("cloud")}
          />
          <Paper
            className="right-[12%] top-[16%] h-8 w-20 rounded-full bg-cream/80"
            popped={pop === "cloud2"}
            onClick={() => tap("cloud2")}
          />
          <Paper
            popped={pop === "kite"}
            onClick={() => tap("kite")}
            className="left-[42%] top-[24%] h-16 w-16 rotate-12"
            style={{
              background: accent,
              clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
              animation: "float-y 2.8s ease-in-out infinite",
            }}
          />
          <div className="absolute bottom-[18%] left-[8%] right-[8%] h-16 rounded-t-[40%] bg-leaf" />
        </>
      );
    case "ocean":
      return (
        <>
          <Paper
            popped={pop === "fish"}
            onClick={() => tap("fish")}
            className="left-[36%] top-[38%] h-10 w-20 rounded-full"
            style={{
              background: accent,
              animation: "float-y 2.4s ease-in-out infinite",
            }}
          />
          <span className="absolute left-[52%] top-[40%] size-3 rounded-full bg-cream" />
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-cream/40"
              style={{
                width: 6 + (i % 3) * 4,
                height: 6 + (i % 3) * 4,
                left: `${18 + i * 12}%`,
                top: `${55 + (i % 2) * 10}%`,
                animation: `float-y ${2 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </>
      );
    case "garden":
      return (
        <>
          <Paper
            className="bottom-[22%] left-[42%] h-28 w-4 bg-leaf"
            popped={pop === "stem"}
            onClick={() => tap("stem")}
          />
          <Paper
            popped={pop === "rose"}
            onClick={() => tap("rose")}
            className="bottom-[38%] left-[36%] size-16 rounded-full"
            style={{ background: accent, transform: `scale(${1 + page * 0.04})` }}
          />
          <Paper
            className="bottom-[20%] right-[18%] h-24 w-10 rounded-t-md bg-paper-3"
            popped={pop === "tower"}
            onClick={() => tap("tower")}
          />
        </>
      );
    case "snow":
      return (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-1.5 rounded-full bg-cream"
              style={{
                left: `${8 + ((i * 9) % 84)}%`,
                top: `${6 + ((i * 13) % 50)}%`,
                animation: `twinkle ${2 + (i % 4) * 0.3}s infinite`,
              }}
            />
          ))}
          <Paper
            className="bottom-[22%] left-[30%] h-24 w-28 rounded-t-lg"
            style={{ background: "#c4a574" }}
            popped={pop === "hut"}
            onClick={() => tap("hut")}
          />
          <Paper
            popped={pop === "bird"}
            onClick={() => tap("bird")}
            className="left-[38%] top-[18%] h-10 w-16 rounded-full"
            style={{ background: accent, animation: "float-y 3s ease-in-out infinite" }}
          />
        </>
      );
    case "lantern":
      return (
        <>
          <Paper
            className="left-[18%] top-[20%] size-10 rounded-sm"
            style={{ background: accent }}
            popped={pop === "lantern"}
            onClick={() => tap("lantern")}
          />
          <Paper
            className="right-[20%] top-[24%] size-8 rounded-sm"
            style={{ background: accent }}
            popped={pop === "lantern2"}
            onClick={() => tap("lantern2")}
          />
          <Paper
            popped={pop === "fox"}
            onClick={() => tap("fox")}
            className="bottom-[24%] left-[38%] h-14 w-20 rounded-2xl"
            style={{ background: "#d47a3a" }}
          />
          <Paper
            popped={pop === "crane"}
            onClick={() => tap("crane")}
            className="left-[48%] top-[30%] h-10 w-12 rotate-12 bg-cream"
            style={{ clipPath: "polygon(0 70%, 50% 0, 100% 70%)" }}
          />
        </>
      );
    case "rice":
      return (
        <>
          <div className="absolute bottom-[18%] left-[6%] right-[6%] h-20 rounded-t-[30%] bg-[#6b8f3a]/80" />
          <Paper
            popped={pop === "rocket"}
            onClick={() => tap("rocket")}
            className="left-[46%] top-[22%] h-20 w-5 rounded-full"
            style={{ background: accent, animation: "float-y 2s ease-in-out infinite" }}
          />
        </>
      );
    case "festival":
      return (
        <>
          <Paper
            popped={pop === "ele"}
            onClick={() => tap("ele")}
            className="bottom-[22%] left-[32%] h-24 w-32 rounded-[40%]"
            style={{ background: "#d9d0c2" }}
          />
          <span
            className="absolute bottom-[40%] left-[28%] size-8 rounded-full"
            style={{ background: "color-mix(in oklab, white 40%, transparent)" }}
          />
          <Paper
            popped={pop === "bowl"}
            onClick={() => tap("bowl")}
            className="bottom-[20%] right-[18%] h-8 w-14 rounded-b-full"
            style={{ background: accent }}
          />
        </>
      );
    case "beach":
      return (
        <>
          <Paper
            popped={pop === "fish1"}
            onClick={() => tap("fish1")}
            className="left-[20%] top-[34%] h-6 w-16 rounded-full bg-cream"
            style={{ animation: "float-y 1.8s ease-in-out infinite" }}
          />
          <Paper
            popped={pop === "fish2"}
            onClick={() => tap("fish2")}
            className="left-[50%] top-[28%] h-7 w-20 rounded-full bg-cream"
            style={{ animation: "float-y 2.1s ease-in-out infinite" }}
          />
          <Paper
            popped={pop === "boat"}
            onClick={() => tap("boat")}
            className="bottom-[26%] left-[36%] h-8 w-24 rounded-b-xl"
            style={{ background: "#8a5340" }}
          />
        </>
      );
    case "bamboo":
      return (
        <>
          {[18, 32, 48, 62, 74].map((x) => (
            <Paper
              key={x}
              className="bottom-[16%] w-4 rounded-full bg-leaf"
              style={{ left: `${x}%`, height: `${40 + (x % 17)}%` }}
              popped={pop === `b${x}`}
              onClick={() => tap(`b${x}`)}
            />
          ))}
          <Paper
            popped={pop === "glow"}
            onClick={() => tap("glow")}
            className="left-[44%] top-[30%] size-12 rounded-full"
            style={{ background: accent, boxShadow: `0 0 28px ${accent}` }}
          />
        </>
      );
    case "paris":
      return (
        <>
          <Paper
            popped={pop === "tower"}
            onClick={() => tap("tower")}
            className="bottom-[18%] left-[40%] h-36 w-10 bg-paper-3"
            style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
          />
          <Paper
            popped={pop === "card"}
            onClick={() => tap("card")}
            className="left-[14%] top-[28%] h-16 w-24 rotate-[-8deg] bg-cream"
          />
        </>
      );
    case "newyear":
      return (
        <>
          <Paper
            popped={pop === "lan1"}
            onClick={() => tap("lan1")}
            className="left-[18%] top-[16%] size-12 rounded-sm"
            style={{ background: accent }}
          />
          <Paper
            popped={pop === "lan2"}
            onClick={() => tap("lan2")}
            className="right-[18%] top-[20%] size-10 rounded-sm"
            style={{ background: accent }}
          />
          <Paper
            popped={pop === "beast"}
            onClick={() => tap("beast")}
            className="bottom-[20%] left-[30%] h-20 w-36 rounded-[45%]"
            style={{ background: "#c9a36a" }}
          />
        </>
      );
    case "fog":
      return (
        <>
          <Paper
            popped={pop === "bridge"}
            onClick={() => tap("bridge")}
            className="top-[42%] h-3 w-[80%] left-[10%] rounded-full"
            style={{ background: accent }}
          />
          <Paper
            popped={pop === "car"}
            onClick={() => tap("car")}
            className="bottom-[28%] left-[28%] h-10 w-16 rounded-md"
            style={{ background: "#e8b86d" }}
          />
          <div className="absolute inset-0 bg-cream/25" />
        </>
      );
    case "london":
      return (
        <>
          <Paper
            popped={pop === "bus"}
            onClick={() => tap("bus")}
            className="bottom-[24%] left-[28%] h-20 w-32 rounded-md"
            style={{ background: accent }}
          />
          <Paper
            popped={pop === "bell"}
            onClick={() => tap("bell")}
            className="right-[18%] top-[16%] h-24 w-10 rounded-t-full bg-paper-3"
          />
        </>
      );
    case "madrid":
      return (
        <>
          <Paper
            popped={pop === "tin"}
            onClick={() => tap("tin")}
            className="bottom-[26%] left-[38%] h-14 w-20 rounded-md bg-paper-3"
          />
          <Paper
            popped={pop === "mouse"}
            onClick={() => tap("mouse")}
            className="bottom-[36%] left-[44%] size-10 rounded-full"
            style={{ background: "#8a8175" }}
          />
          <Paper
            popped={pop === "tooth"}
            onClick={() => tap("tooth")}
            className="left-[58%] top-[30%] h-10 w-8 rounded-b-full bg-cream"
          />
        </>
      );
  }
}
