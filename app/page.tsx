"use client";

import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Image as ImgIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// =============================
// LUX – Angelical Cinematográfica (STORY 1080x1920)
// =============================

const TRACKS: string[] = [
  "Sexo, Violencia y Llantas",
  "Reliquia",
  "Divinize",
  "Porcelana",
  "Mio Cristo",
  "Berghain",
  "La Perla",
  "Mundo Nuevo",
  "De Madrugá",
  "Dios Es Un Stalker",
  "La Yugular",
  "Focu ‘ranni [physical exclusive]",
  "Sauvignon Blanc",
  "Jeanne [physical exclusive]",
  "Novia Robot [physical exclusive]",
  "La Rumba Del Perdón",
  "Memória",
  "Magnolias",
];

// Paleta etérea (azules fríos + dorado suave)
const palette = {
  bg1: "#070b2a",
  bg2: "#0e1b5c",
  bg3: "#1b2f8a",
  ink: "#f7f8ff",
  mist: "#cbd6ff",
  gold: "#d7b467",
  goldDim: "#b39243",
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function Halo() {
  return (
    <svg viewBox="0 0 1200 1200" className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="luxHalo" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#cfe1ff" stopOpacity="0.16" />
          <stop offset="80%" stopColor="#8aa4ff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6c81ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="1200" fill="url(#luxHalo)" />
      <g opacity="0.85">
        <circle cx="600" cy="360" r="220" fill="none" stroke={palette.gold} strokeWidth="3" />
        <circle cx="600" cy="360" r="230" fill="none" stroke={palette.goldDim} strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

function Particles() {
  // simple decorative stars
  const stars = Array.from({ length: 28 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2 + 0.6,
    o: Math.random() * 0.7 + 0.2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {stars.map((st) => (
        <div key={st.id} className="absolute rounded-full" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, background: palette.mist, opacity: st.o }} />
      ))}
    </div>
  );
}

function PosterStory({
  title,
  subtitle,
  year,
  top,
  bgImage,
  username,
}: {
  title: string;
  subtitle: string;
  year: string | number;
  top: string[];
  bgImage?: string;
  username?: string;
}) {
  // Story: 1080x1920
  const W = 1080, H = 1920;
  return (
    <div
      id="lux-story"
      className="relative rounded-[40px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      style={{ width: W, height: H, background: `linear-gradient(180deg, ${palette.bg1} 0%, ${palette.bg2} 45%, ${palette.bg3} 100%)` }}
    >
      {bgImage && (
        <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-[0.18]" />
      )}

      {/* Vignette */}
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.45)" }} />

      {/* Halo + Partículas */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-[70%]">
        <Halo />
      </div>
      <Particles />

      {/* Header Cinematográfico */}
      <div className="absolute top-20 left-0 right-0 text-center">
        <div className="uppercase tracking-[0.40em] text-[32px]" style={{ color: palette.mist }}>ROSALÍA</div>
        <div className="mt-2 text-[140px] leading-none font-light" style={{ color: palette.ink, letterSpacing: "0.01em" }}>{title}</div>
        <div className="mt-4 text-[28px]" style={{ color: palette.mist }}>{subtitle} · {year}</div>
      </div>

      {/* Ranking Top 5 */}
      <div className="absolute left-10 right-10 bottom-24">
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {top.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full grid place-items-center text-2xl font-semibold"
                     style={{ background: palette.gold, color: "#1a1a1a", boxShadow: "0 8px 30px rgba(215,180,103,0.45)" }}>
                  {i + 1}
                </div>
                <div className="flex-1 p-5 rounded-3xl border backdrop-blur-[8px]"
                     style={{
                       borderColor: "rgba(255,255,255,0.18)",
                       background: "linear-gradient(90deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
                       color: palette.ink,
                     }}
                >
                  <div className="text-xl md:text-2xl leading-tight tracking-wide">{name}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between">
          <div className="uppercase tracking-[0.35em] text-sm" style={{ color: palette.mist }}>Mi Top LUX</div>
          <div className="text-sm" style={{ color: palette.gold }}>{username ? `@${username}` : "#LUXTop"}</div>
        </div>
      </div>
    </div>
  );
}

export default function LuxStoryApp() {
  const [tracks, setTracks] = useState<string[]>(TRACKS);
  const [topN, setTopN] = useState<number>(5);
  const [bgImage, setBgImage] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const top = useMemo(() => tracks.slice(0, clamp(topN, 1, 10)), [tracks, topN]);

  const onChangeBg: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBgImage(URL.createObjectURL(f));
  };

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;
    const canvas = await html2canvas(node as HTMLElement, { backgroundColor: null, useCORS: true, scale: 2 });
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `LUX-story-${Date.now()}.png`;
    a.click();
  };

  const tryShare = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return exportPNG();
    const canvas = await html2canvas(node as HTMLElement, { backgroundColor: null, useCORS: true, scale: 2 });
    const blob = await (await fetch(canvas.toDataURL("image/png"))).blob();
    const file = new File([blob], `LUX-story-${Date.now()}.png`, { type: "image/png" });
    // Usa Web Share API si está disponible
    // @ts-ignore
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      // @ts-ignore
      await navigator.share({ files: [file], title: "Mi Top LUX", text: "Mi Top LUX" });
    } else {
      exportPNG();
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ background: `radial-gradient(1600px 1000px at 20% -10%, #2338a0 0%, ${palette.bg2} 35%, ${palette.bg1} 70%)` }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: palette.ink }}>LUX – Historia Compartible</h1>
            <p className="text-sm mt-1" style={{ color: palette.mist }}>Elegí tu Top 5 y generá una imagen 1080×1920 lista para Instagram.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="px-3 py-2 rounded-xl border cursor-pointer flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.2)", color: palette.ink }}>
              <ImgIcon size={18}/> Fondo
              <input type="file" accept="image/*" className="hidden" onChange={onChangeBg} />
            </label>
            <button onClick={exportPNG} className="px-4 py-2 rounded-xl font-medium border" style={{ color: palette.ink, borderColor: "rgba(255,255,255,0.2)" }}>
              <Download size={18} className="inline -mt-1 mr-2"/> Exportar PNG
            </button>
            <button onClick={tryShare} className="px-4 py-2 rounded-xl font-medium border" style={{ color: palette.ink, borderColor: "rgba(255,255,255,0.2)" }}>
              <Share2 size={18} className="inline -mt-1 mr-2"/> Compartir
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl p-5 border" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
            <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: palette.mist }}>Usuario (opcional)</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="tu @usuario" className="w-full px-3 py-2 rounded-lg bg-transparent border" style={{ borderColor: "rgba(255,255,255,0.2)", color: palette.ink }} />
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm" style={{ color: palette.mist }}>Top N</span>
              <input type="range" min={3} max={10} value={topN} onChange={(e)=>setTopN(parseInt(e.target.value,10))} className="flex-1" />
              <span className="text-sm" style={{ color: palette.ink }}>{topN}</span>
            </div>
          </div>

          <div className="rounded-3xl p-5 border md:col-span-2" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
            <div className="text-sm mb-2" style={{ color: palette.mist }}>Arrastrá para ordenar (Click y mover, o editá el orden pegando una lista)</div>
            <ol className="space-y-2 max-h-64 overflow-auto pr-2">
              {tracks.map((t, i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.15)", color: palette.ink }}>
                  <span className="w-6 opacity-70">{i + 1}</span>
                  <input value={t} onChange={(e)=>{ const next=[...tracks]; next[i]=e.target.value; setTracks(next); }} className="flex-1 bg-transparent outline-none" />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Story Preview */}
        <div className="mt-8 w-full flex items-center justify-center">
          <PosterStory title="LUX" subtitle="Mi Top" year={"2025"} top={top} bgImage={bgImage} username={username || undefined} />
        </div>
      </div>
    </div>
  );
}
