"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Undo2, Download } from "lucide-react";

// ---------------- DATA ----------------
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
  "Focu ‘ranni",
  "Sauvignon Blanc",
  "Jeanne",
  "Novia Robot",
  "La Rumba Del Perdón",
  "Memória",
  "Magnolias",
];

// ---------------- LOOK ----------------
const BG_URL = "https://www.rosalia.com/images/rl-wide.jpg";
const palette = { ink: "#111", gold: "#b99251" };
const W = 1080, H = 1920;

const toUpperPretty = (s: string) => s.toLocaleUpperCase();

// =============== JUSTIFIED LINE (SVG, pixel-perfect) ===============
/**
 * Renderiza un renglón tipográfico como SVG:
 * - Ocupa el 100% del ancho.
 * - Distribuye cada carácter con x fijas (sin ligaduras ni kerning).
 * - Ajusta automáticamente la fuente para que quepa (binary search).
 */
function JustifiedLine({
  text,
  max = 88,
  min = 26,
  color = "#111",
  family = "'Times New Roman', Times, serif",
}: {
  text: string;
  max?: number;
  min?: number;
  color?: string;
  family?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);
  const [w, setW] = useState(0);
  const [h, setH] = useState(Math.ceil(max * 1.12)); // alto del SVG

  const letters = [...text.replace(/\s+/g, " ")];

  // medir ancho del contenedor y auto-fit de fuente
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const width = Math.max(0, Math.floor(box.width));
      setW(width);
      // auto-fit por altura disponible del renglón (aprox 1.12x fs)
      // reducimos si el nombre es MUY largo (más letras => un poco menos de fs)
      const len = letters.filter(c => c !== " ").length || 1;
      const penalty = Math.max(0, len - 14) * 1.2; // suaviza títulos larguísimos
      const hi = Math.max(min, max - penalty);
      let lo = min, hi2 = hi, best = min;
      // búsqueda binaria para evitar overflow vertical
      for (let i = 0; i < 10; i++) {
        const mid = Math.floor((lo + hi2) / 2);
        const estHeight = Math.ceil(mid * 1.12);
        // nunca usamos “wrap”; solo verificamos que el SVG quepa en la fila
        if (estHeight <= Math.max(38, hi * 1.12)) {
          best = mid; lo = mid + 1;
        } else {
          hi2 = mid - 1;
        }
      }
      setFs(best);
      setH(Math.ceil(best * 1.12));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Promise.resolve().then(() => requestAnimationFrame(measure));
    return () => ro.disconnect();
  }, [text]);

  // posiciones x para cada letra (distribución equidistante a lo ancho)
  const xs = useMemo(() => {
    const slots = letters.length;
    if (!w || slots === 0) return [] as number[];
    const left = 0, right = w;
    const step = slots > 1 ? (right - left) / (slots - 1) : 0;
    return Array.from({ length: slots }, (_, i) => left + i * step);
  }, [w, letters.length]);

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${Math.max(1, w)} ${h}`}
        preserveAspectRatio="none"
      >
        <g
          fontFamily={family}
          fontSize={fs}
          fill={color}
          fontVariantLigatures="none"
          style={{ fontKerning: "none" as any }}
          dominantBaseline="alphabetic"
        >
          {letters.map((ch, i) => (
            <text
              key={i}
              x={xs[i] ?? 0}
              y={Math.floor(h * 0.82)} // baseline aproximada
              textAnchor="middle"
            >
              {ch === " " ? " " : ch}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

// ================= POSTER =================
function PosterStory({ top, name }: { top: string[]; name?: string }) {
  // tamaños base seguros por cantidad de líneas
  const base = top.length <= 5 ? 100 : top.length <= 6 ? 92 : top.length <= 7 ? 86 : 80;

  return (
    <div
      id="lux-story"
      style={{
        width: W, height: H, position: "relative", overflow: "hidden",
        borderRadius: 36, boxShadow: "0 40px 120px rgba(0,0,0,.55)",
        fontFamily: "'Times New Roman', Times, serif",
        background: `url(${BG_URL}) center/cover no-repeat`,
      }}
    >
      {/* Velo */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,.86) 0%, rgba(255,255,255,.90) 40%, rgba(255,255,255,.95) 100%)",
      }} />
      {/* Marco dorado */}
      <div style={{
        position: "absolute", inset: 16,
        border: `2px solid ${palette.gold}`, borderRadius: 28, pointerEvents: "none",
      }} />

      {/* Header compacto */}
      <div style={{ position: "absolute", top: 96, left: 72, right: 72, textAlign: "center", color: palette.ink }}>
        <div style={{ letterSpacing: "1.2em", opacity: .8, fontSize: 30 }}>R O S A L Í A</div>
        <div style={{ marginTop: 8, letterSpacing: "0.32em", lineHeight: .9, fontSize: 120 }}>
          <span style={{ fontWeight: 700 }}>L</span><span> U X</span>
        </div>
        <div style={{ marginTop: 6, letterSpacing: "0.16em", opacity: .8, fontSize: 28 }}>M I &nbsp; T O P · 2 0 2 5</div>
      </div>

      {/* Lista (SVG por línea, nunca se pisa) */}
      <div
        style={{
          position: "absolute",
          top: 520, bottom: 190, left: 72, right: 72,
          display: "flex", flexDirection: "column", gap: 16, color: palette.ink,
        }}
      >
        {top.map((nameSong, i) => (
          <div key={nameSong} style={{ display: "grid", gridTemplateColumns: "70px 1fr", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: 9999,
                background: palette.gold, color: "#fff",
                display: "grid", placeItems: "center",
                fontWeight: 700, fontSize: 24,
                boxShadow: "0 10px 28px rgba(185,146,81,.35)",
              }}
            >
              {i + 1}
            </div>
            <JustifiedLine text={toUpperPretty(nameSong)} max={base} color={palette.ink} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", left: 72, right: 72, bottom: 86,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: palette.ink, fontSize: 20,
      }}>
        <div style={{ letterSpacing: ".35em", textTransform: "uppercase", opacity: .75 }}>Fan ranking</div>
        <div style={{ color: palette.gold, fontWeight: 700 }}>{name ? name : "#LUXTop"}</div>
      </div>
    </div>
  );
}

// ================= APP (UX SIMPLE) =================
export default function LuxViral() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  const remaining = useMemo(() => TRACKS.filter(t => !selected.includes(t)), [selected]);
  const limit = 8;

  const add = (t: string) => { if (selected.length < limit) setSelected(p => [...p, t]); };
  const undo = () => setSelected(p => p.slice(0, -1));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;
    try { /* @ts-ignore */ await document.fonts?.ready; } catch {}
    // dos frames: garantizamos que los SVG terminaron de medir
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 3,
      foreignObjectRendering: true, // mejora rasterización de SVG embebidos
    });

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `LUX-story-${Date.now()}.png`;
    a.click();
  };

  // preview centrado y con tamaño reservado
  const scale = 0.36;

  return (
    <div style={{
      minHeight: "100vh",
      background: `url(${BG_URL}) center/cover fixed no-repeat`,
      fontFamily: "'Times New Roman', Times, serif",
    }}>
      <div style={{ background: "rgba(255,255,255,.86)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "22px 14px 36px" }}>
          {/* Cabecera */}
          <div style={{ textAlign: "center", color: palette.ink, marginBottom: 10 }}>
            <div style={{ letterSpacing: "1.2em", opacity: .75, fontSize: 14 }}>R O S A L Í A</div>
            <div style={{ marginTop: 8, letterSpacing: ".35em", fontSize: 30 }}>
              <span style={{ fontWeight: 700 }}>L</span><span> U X</span>
            </div>
            <div style={{ marginTop: 6, opacity: .75, fontSize: 13 }}>
              Tocá para elegir tus favoritas <b>en orden</b> y generá la historia.
            </div>
          </div>

          {/* Selector: chips dorados */}
          <div style={{
            border: "1px solid rgba(0,0,0,.12)",
            background: "rgba(255,255,255,.8)",
            borderRadius: 18, padding: 12, color: palette.ink,
          }}>
            <div style={{ marginBottom: 8, fontSize: 16 }}>
              Canciones (tap para agregar · {selected.length}/{limit})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {remaining.map((t) => (
                <button
                  key={t}
                  onClick={() => add(t)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: `1px solid ${palette.gold}`,
                    background: "#fff",
                    color: palette.gold,
                    fontSize: 14,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Selección actual */}
            {selected.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 6 }}>Tu orden:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selected.map((t, i) => (
                    <span key={t} style={{
                      padding: "10px 14px",
                      borderRadius: 999,
                      border: `1px solid ${palette.gold}`,
                      background: "#fff",
                      color: palette.gold,
                      fontSize: 14,
                    }}>
                      {i + 1}. {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nombre + acciones */}
            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label style={{ minWidth: 92, fontSize: 14, opacity: .85 }}>Tu nombre:</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej.: La Rosalía"
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10,
                    border: "1px solid rgba(0,0,0,.2)", background: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={undo}
                  disabled={selected.length === 0}
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: 14,
                    border: "1px solid rgba(0,0,0,.2)", background: "#fff",
                    color: palette.ink, fontWeight: 600,
                    opacity: selected.length === 0 ? 0.5 : 1,
                  }}
                  title="Deshacer último"
                >
                  <Undo2 size={18} style={{ marginTop: -3, marginRight: 6 }} />
                  Deshacer
                </button>
                <button
                  onClick={exportPNG}
                  disabled={selected.length === 0}
                  style={{
                    flex: 2, padding: "12px 14px", borderRadius: 14,
                    border: `1px solid ${palette.gold}`, background: palette.gold,
                    color: "#fff", fontWeight: 700, letterSpacing: ".04em",
                    boxShadow: "0 14px 40px rgba(185,146,81,.35)",
                    opacity: selected.length === 0 ? 0.6 : 1,
                  }}
                  title="Generar Ranking"
                >
                  <Download size={18} style={{ marginTop: -3, marginRight: 6 }} />
                  Generar Ranking
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW centrado */}
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            <div style={{ width: W * scale, height: H * scale, position: "relative" }}>
              <div style={{ transformOrigin: "top left", transform: `scale(${scale})` }}>
                <PosterStory top={selected.slice(0, limit)} name={name || undefined} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
