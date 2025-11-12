"use client";

import React, { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, ArrowUp, ArrowDown, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- TRACKLIST (con nombre corregido) ----------
const TRACKS: string[] = [
  "Sexo, Violencia y Llantas",
  "Reliquia",
  "Divinize",
  "Porcelana",
  "Mio Cristo Piange Diamanti",
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

// ---------- ESTILO ----------
const palette = {
  ink: "#161616",
  paper: "#f3f3f1",
  gold: "#b99251",
  goldDark: "#94723d",
  whiteInk: "#f7f7f7",
};

const TEXTURE_URL = "/lux-texture.jpg"; // <— poné la imagen en public/ con este nombre

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  return next;
}

// ---------- POSTER STORY 1080x1920 ----------
function PosterStory({
  top,
  username,
  bgUrl = TEXTURE_URL,
}: {
  top: string[];
  username?: string;
  bgUrl?: string;
}) {
  const W = 1080,
    H = 1920;

  return (
    <div
      id="lux-story"
      className="relative overflow-hidden rounded-[36px] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
      style={{
        width: W,
        height: H,
        background: `url(${bgUrl}) center/cover no-repeat`,
        fontFamily: `'Times New Roman', Times, serif`,
      }}
    >
      {/* Velo suave y viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.75) 0%, rgba(255,255,255,.78) 48%, rgba(255,255,255,.82) 100%)",
          boxShadow: "inset 0 0 260px rgba(0,0,0,0.35)",
        }}
      />

      {/* Header: R O S A L Í A */}
      <div className="absolute top-24 left-0 right-0 text-center px-10 select-none">
        <div
          className="tracking-[1.2em] text-[28px] sm:text-[32px]"
          style={{ color: palette.ink, opacity: 0.85 }}
        >
          R O S A L Í A
        </div>

        {/* Título L U X — L en negrita */}
        <div
          className="mt-6 text-[120px] sm:text-[140px] leading-none"
          style={{ color: palette.ink, letterSpacing: "0.35em" }}
        >
          <span style={{ fontWeight: 700 }}>L</span>
          <span style={{ fontWeight: 400 }}> U X</span>
        </div>

        <div
          className="mt-6 text-[26px]"
          style={{ color: palette.ink, opacity: 0.8, letterSpacing: "0.15em" }}
        >
          M I  T O P · 2 0 2 5
        </div>
      </div>

      {/* Lista (tarjetas vidrio + ribete dorado) */}
      <div className="absolute left-12 right-12 bottom-24">
        <div className="grid grid-cols-1 gap-14">
          <AnimatePresence>
            {top.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="flex items-center gap-6"
              >
                <div
                  className="w-20 h-20 rounded-full grid place-items-center text-[28px] leading-none"
                  style={{
                    background: palette.gold,
                    color: "white",
                    boxShadow: "0 8px 30px rgba(185,146,81,0.45)",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>

                <div
                  className="flex-1 p-8 rounded-[28px] border backdrop-blur-[6px]"
                  style={{
                    borderColor: "rgba(0,0,0,0.15)",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.35))",
                    color: palette.ink,
                    fontSize: 30,
                    lineHeight: 1.15,
                  }}
                >
                  {name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="mt-12 flex items-center justify-between"
          style={{ color: palette.ink, fontSize: 18 }}
        >
          <div
            className="tracking-[0.35em]"
            style={{ opacity: 0.75, textTransform: "uppercase" }}
          >
            Fan ranking
          </div>
          <div style={{ color: palette.gold, fontWeight: 700 }}>
            {username ? `@${username}` : "#LUXTop"}
          </div>
        </div>
      </div>

      {/* Borde dorado fino */}
      <div
        className="absolute inset-4 rounded-[30px] pointer-events-none"
        style={{ border: `2px solid ${palette.gold}`, opacity: 0.8 }}
      />
    </div>
  );
}

// ---------- APP ----------
export default function LuxWrapped() {
  // Dos paneles: Disponibles + Tu selección (estilo Receiptify)
  const [available] = useState<string[]>(TRACKS);
  const [selected, setSelected] = useState<string[]>([]);
  const [topN, setTopN] = useState<number>(5);
  const [username, setUsername] = useState<string>("");

  const top = useMemo(
    () => selected.slice(0, clamp(topN, 1, 10)),
    [selected, topN]
  );

  const addTrack = (t: string) => {
    if (selected.includes(t)) return;
    setSelected((prev) => [...prev, t]);
  };
  const removeTrack = (t: string) =>
    setSelected((prev) => prev.filter((x) => x !== t));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;
    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `LUX-story-${Date.now()}.png`;
    a.click();
  };

  const tryShare = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return exportPNG();
    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 2,
    });
    const blob = await (await fetch(canvas.toDataURL("image/png"))).blob();
    const file = new File([blob], `LUX-story-${Date.now()}.png`, {
      type: "image/png",
    });
    // @ts-ignore
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      // @ts-ignore
      await navigator.share({
        files: [file],
        title: "Mi Top LUX",
        text: "Mi Top LUX",
      });
    } else {
      exportPNG();
    }
  };

  // ---------- UI (MOBILE FIRST) ----------
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `url(${TEXTURE_URL}) center/cover fixed no-repeat`,
        fontFamily: `'Times New Roman', Times, serif`,
      }}
    >
      <div
        className="min-h-screen w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.80) 0%, rgba(255,255,255,.86) 45%, rgba(255,255,255,.92) 100%)",
        }}
      >
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Hero simple */}
          <div className="text-center mb-6">
            <div
              className="tracking-[1.2em] text-sm md:text-base"
              style={{ color: palette.ink, opacity: 0.75 }}
            >
              R O S A L Í A
            </div>
            <div
              className="mt-2 text-4xl md:text-5xl leading-none"
              style={{ color: palette.ink, letterSpacing: "0.35em" }}
            >
              <span style={{ fontWeight: 700 }}>L</span>
              <span> U X</span>
            </div>
            <p
              className="mt-3 text-xs md:text-sm"
              style={{ color: palette.ink, opacity: 0.8 }}
            >
              Elegí y ordená tus favoritas · exportá una historia 1080×1920
            </p>
          </div>

          {/* Controles principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Disponibles */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                borderColor: "rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base" style={{ color: palette.ink }}>
                  Canciones disponibles
                </h3>
              </div>
              <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                {available.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                    style={{ borderColor: "rgba(0,0,0,0.12)", color: palette.ink }}
                  >
                    <span className="flex-1 truncate">{t}</span>
                    <button
                      className="px-2 py-1 text-sm rounded-lg border"
                      style={{ borderColor: "rgba(0,0,0,0.15)", color: palette.ink }}
                      onClick={() => addTrack(t)}
                    >
                      <Plus size={16} className="inline -mt-1 mr-1" />
                      Agregar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tu selección */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                borderColor: "rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base" style={{ color: palette.ink }}>
                  Tu selección
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: palette.ink, opacity: 0.75 }}>
                    Top
                  </span>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={topN}
                    onChange={(e) => setTopN(parseInt(e.target.value, 10))}
                  />
                  <span style={{ color: palette.ink }}>{topN}</span>
                </div>
              </div>

              <ol className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                {selected.map((t, i) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                    style={{ borderColor: "rgba(0,0,0,0.12)", color: palette.ink }}
                  >
                    <span className="w-6 opacity-70">{i + 1}</span>
                    <span className="flex-1 truncate">{t}</span>
                    <button
                      aria-label="Subir"
                      className="p-1 rounded-lg border"
                      style={{ borderColor: "rgba(0,0,0,0.15)" }}
                      onClick={() => i > 0 && setSelected(move(selected, i, i - 1))}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      aria-label="Bajar"
                      className="p-1 rounded-lg border"
                      style={{ borderColor: "rgba(0,0,0,0.15)" }}
                      onClick={() =>
                        i < selected.length - 1 && setSelected(move(selected, i, i + 1))
                      }
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      aria-label="Quitar"
                      className="p-1 rounded-lg border"
                      style={{ borderColor: "rgba(0,0,0,0.15)" }}
                      onClick={() => removeTrack(t)}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Username + acciones */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label
                className="text-sm"
                style={{ color: palette.ink, opacity: 0.8, minWidth: 90 }}
              >
                Usuario:
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu @usuario (opcional)"
                className="px-3 py-2 rounded-lg bg-white/80 border w-full sm:w-72"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: palette.ink }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportPNG}
                className="px-4 py-2 rounded-xl font-medium border"
                style={{ color: palette.ink, borderColor: "rgba(0,0,0,0.2)" }}
              >
                <Download size={18} className="inline -mt-1 mr-2" />
                Exportar PNG
              </button>
              <button
                onClick={tryShare}
                className="px-4 py-2 rounded-xl font-medium border"
                style={{ color: palette.ink, borderColor: "rgba(0,0,0,0.2)" }}
              >
                <Share2 size={18} className="inline -mt-1 mr-2" />
                Compartir
              </button>
            </div>
          </div>

          {/* PREVIEW story escalada (mobile-first) */}
          <div className="mt-8 w-full flex items-center justify-center">
            <div className="[transform-origin:top_left] scale-[0.34] sm:scale-[0.48] md:scale-[0.62] lg:scale-[0.8] xl:scale-[1]">
              <PosterStory top={top} username={username || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
