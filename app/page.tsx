"use client";

import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Image as ImgIcon, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// =============================
// LUX – Angelical Cinematográfica (MOBILE-FIRST, Story 1080x1920)
// Estética basada en motivos del sitio oficial (azules profundos, velos/halo, acentos dorados)
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

// Paleta inspirada en rosalia.com (azules etéreos + dorado)
const palette = {
  bg1: "#070b2a", // casi negro azulado
  bg2: "#0e1b5c", // azul medianoche
  bg3: "#1b2f8a", // azul real
  ink: "#f7f8ff", // blanco suave
  mist: "#cbd6ff", // neblina
  gold: "#d7b467", // dorado
  goldDim: "#b39243",
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  return next;
}

function Halo() {
  return (
    <svg viewBox="0 0 1200 1200" className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="luxHalo" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.40" />
          <stop offset="45%" stopColor="#d7e2ff" stopOpacity="0.16" />
          <stop offset="80%" stopColor="#9ab0ff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6c81ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="1200" fill="url(#luxHalo)" />
      <g opacity="0.9">
        <circle cx="600" cy="360" r="230" fill="none" stroke={palette.gold} strokeWidth="3" />
        <circle cx="600" cy="360" r="240" fill="none" stroke={palette.goldDim} strokeOpacity="0.5" />
      </g>
    </svg>
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
  // Story: 1080x1920 – se verá escalado en preview para mobile
  const W = 1080, H = 1920;
  return (
    <div
      id="lux-story"
      className="relative rounded-[32px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      style={{ width: W, height: H, background: `linear-gradient(180deg, ${palette.bg1} 0%, ${palette.bg2} 45%, ${palette.bg3} 100%)` }}
    >
      {bgImage && (
        <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-[0.18]" />
      )}

      {/* Vignette para cine */}
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.45)" }} />

      {/* Halo */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-[70%]">
        <Halo />
      </div>

      {/* Header */}
      <div className="absolute top-24 left-0 right-0 text-center px-10">
        <div className="uppercase tracking-[0.40em] text-[30px] sm:text-[34px]" style={{ color: palette.mist }}>ROSALÍA</div>
        <div className="mt-1 text-[120px] sm:text-[140px] leading-none font-light" style={{ color: palette.ink, letterSpacing: "0.01em" }}>{title}</div>
        <div className="mt-3 text-[26px] sm:text-[28px]" style={{ color: palette.mist }}>{subtitle} · {year}</div>
      </div>

      {/* Ranking compacto para story */}
      <div className="absolute left-10 right-10 bottom-24">
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {top.map((name, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.45 }} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full grid place-items-center text-2xl font-semibold" style={{ background: palette.gold, color: "#1a1a1a", boxShadow: "0 8px 30px rgba(215,180,103,0.45)" }}>{i + 1}</div>
                <div className="flex-1 p-5 rounded-3xl border backdrop-blur-[8px]" style={{ borderColor: "rgba(255,255,255,0.18)", background: "linear-gradient(90deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))", color: palette.ink }}>
                  <div className="text-[26px] leading-tight tracking-wide">{name}</div>
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
    const file = new File([blob], `LUX-story-${Date.now()}.png", { type: "image/png" });
    // @ts-ignore
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      // @ts-ignore
      await navigator.share({ files: [file], title: "Mi Top LUX", text: "Mi Top LUX" });
    } else {
      exportPNG();
    }
  };

  // —— UI MOBILE-FIRST ——
  return (
    <div className="min-h-screen w-full" style={{ background: `radial-gradient(1600px 1000px at 20% -10%, #2338a0 0%, ${palette.bg2} 35%, ${palette.bg1} 70%)` }}>
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Toolbar compacta para mobile */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: palette.ink }}>LUX – Historia Compartible</h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: palette.mist }}>Elegí tu Top y generá la imagen 1080×1920 lista para IG.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="px-3 py-2 rounded-xl border cursor-pointer text-sm" style={{ borderColor: "rgba(255,255,255,0.2)", color: palette.ink }}>
              <ImgIcon size={16}/> Fondo
              <input type="file" accept="image/*" className="hidden" onChange={onChangeBg} />
            </label>
            <button onClick={exportPNG} className="px-3 py-2 rounded-xl font-medium border text-sm" style={{ color: palette.ink, borderColor: "rgba(255,255,255,0.2)" }}> <Download size={16} className="inline -mt-1 mr-1"/> PNG</button>
            <button onClick={tryShare} className="px-3 py-2 rounded-xl font-medium border text-sm" style={{ color: palette.ink, borderColor: "rgba(255,255,255,0.2)" }}> <Share2 size={16} className="inline -mt-1 mr-1"/> Compartir</button>
          </div>
        </div>

        {/* Controles de ranking (SIN escribir; tap-friendly) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 border" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: palette.mist }}>Ordená tu Top (tap en ▲▼)</span>
              <div className="flex items-center gap-3 text-sm" style={{ color: palette.mist }}>
                <span>Top</span>
                <input type="range" min={3} max={10} value={topN} onChange={(e)=>setTopN(parseInt(e.target.value,10))} />
                <span className="w-8 text-center" style={{ color: palette.ink }}>{topN}</span>
              </div>
            </div>
            <ol className="space-y-2 max-h-[52vh] md:max-h-[420px] overflow-auto pr-1">
              {tracks.map((t, i) => (
                <li key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.15)", color: palette.ink }}>
                  <span className="w-6 opacity-70">{i + 1}</span>
                  <span className="flex-1 truncate">{t}</span>
                  <button aria-label="Subir" className="p-1 rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.15)" }} onClick={()=> i>0 && setTracks(move(tracks, i, i-1))}>
                    <ArrowUp size={16} />
                  </button>
                  <button aria-label="Bajar" className="p-1 rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.15)" }} onClick={()=> i<tracks.length-1 && setTracks(move(tracks, i, i+1))}>
                    <ArrowDown size={16} />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Preview responsive – escala automática para mobile */}
          <div className="flex items-center justify-center">
            <div className="[transform-origin:top_left] scale-[0.33] sm:scale-[0.45] md:scale-[0.6] lg:scale-[0.8] xl:scale-[1]">
              <PosterStory title="LUX" subtitle="Mi Top" year={"2025"} top={top} bgImage={bgImage} username={username || undefined} />
            </div>
          </div>
        </div>

        {/* Username simple (opcional) */}
        <div className="mt-3">
          <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: palette.mist }}>Usuario (opcional)</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="tu @usuario" className="w-full px-3 py-2 rounded-lg bg-transparent border" style={{ borderColor: "rgba(255,255,255,0.2)", color: palette.ink }} />
        </div>
      </div>
    </div>
  );
}
