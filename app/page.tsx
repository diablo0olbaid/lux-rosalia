"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Undo2, Download } from "lucide-react";

// ====================== DATA ======================
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

// ====================== LOOK ======================
const BG_URL = "https://www.rosalia.com/images/rl-wide.jpg"; // foto oficial
const palette = {
  ink: "#111",
  gold: "#b99251",
  goldLine: "#b99251",
};

const W = 1080;
const H = 1920;

function toUpperPretty(s: string) {
  return s.toLocaleUpperCase();
}

// ====================== JUSTIFIED LINE W/ AUTOFIT ======================
// Texto justificado por letra con auto–fit estable (sin saltos, sin ligaduras)
function JustifiedWord({
  text,
  max = 88,
  min = 26,
}: {
  text: string;
  max?: number;
  min?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);
  const letters = [...text.replace(/\s+/g, " ")];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      let lo = min,
        hi = max,
        best = min;
      const prev = el.style.fontSize;

      for (let i = 0; i < 12; i++) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;
        const over = el.scrollWidth > el.clientWidth + 1; // tolerancia 1px
        if (over) hi = mid - 1;
        else {
          best = mid;
          lo = mid + 1;
        }
      }

      el.style.fontSize = prev;
      setFs(best);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // asegurar layout + fuentes listas
    Promise.resolve().then(() => requestAnimationFrame(fit));
    return () => ro.disconnect();
  }, [text, max, min]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        width: "100%",
        fontSize: fs,
        lineHeight: 1.04,
        whiteSpace: "nowrap",
        fontVariantLigatures: "none",
        fontKerning: "none",
      }}
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          style={{
            flex: ch === " " ? "0 0 0.55em" : "1 1 0",
            textAlign: "center",
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

// ====================== POSTER ======================
function PosterStory({ top, name }: { top: string[]; name?: string }) {
  // tamaños base seguros por cantidad de líneas
  const base = top.length <= 5 ? 100 : top.length <= 6 ? 92 : top.length <= 7 ? 88 : 82;

  return (
    <div
      id="lux-story"
      style={{
        width: W,
        height: H,
        position: "relative",
        overflow: "hidden",
        borderRadius: 36,
        boxShadow: "0 40px 120px rgba(0,0,0,.55)",
        fontFamily: "'Times New Roman', Times, serif",
        background: `url(${BG_URL}) center/cover no-repeat`,
      }}
    >
      {/* Velo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,.86) 0%, rgba(255,255,255,.90) 40%, rgba(255,255,255,.95) 100%)",
        }}
      />
      {/* Marco dorado */}
      <div
        style={{
          position: "absolute",
          inset: 16,
          border: `2px solid ${palette.goldLine}`,
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />

      {/* Header compacto */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 72,
          right: 72,
          textAlign: "center",
          color: palette.ink,
        }}
      >
        <div style={{ letterSpacing: "1.2em", opacity: 0.8, fontSize: 30 }}>R O S A L Í A</div>
        <div style={{ marginTop: 8, letterSpacing: "0.32em", lineHeight: 0.9, fontSize: 120 }}>
          <span style={{ fontWeight: 700 }}>L</span>
          <span> U X</span>
        </div>
        <div style={{ marginTop: 6, letterSpacing: "0.16em", opacity: 0.8, fontSize: 28 }}>
          M I &nbsp; T O P · 2 0 2 5
        </div>
      </div>

      {/* Lista – columna con gap (no filas fijas) */}
      <div
        style={{
          position: "absolute",
          top: 520, // aire para que no invada el header
          bottom: 190,
          left: 72,
          right: 72,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          color: palette.ink,
        }}
      >
        {top.map((nameSong, i) => (
          <div
            key={nameSong}
            style={{
              display: "grid",
              gridTemplateColumns: "70px 1fr",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 9999,
                background: palette.gold,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: 24,
                boxShadow: "0 10px 28px rgba(185,146,81,.35)",
              }}
            >
              {i + 1}
            </div>
            <JustifiedWord text={toUpperPretty(nameSong)} max={base} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 86,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: palette.ink,
          fontSize: 20,
        }}
      >
        <div style={{ letterSpacing: ".35em", textTransform: "uppercase", opacity: 0.75 }}>
          Fan ranking
        </div>
        <div style={{ color: palette.gold, fontWeight: 700 }}>{name ? name : "#LUXTop"}</div>
      </div>
    </div>
  );
}

// ====================== APP (UX ULTRA SIMPLE) ======================
export default function LuxViral() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const remaining = useMemo(
    () => TRACKS.filter((t) => !selected.includes(t)),
    [selected]
  );
  const limit = 8;

  const add = (t: string) => {
    if (selected.length < limit) setSelected((p) => [...p, t]);
  };
  const undo = () => setSelected((p) => p.slice(0, -1));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;

    // Esperar fuentes + 2 frames para que el auto-fit termine
    try {
      // @ts-ignore
      await document.fonts?.ready;
    } catch {}
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 3,
    });

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `LUX-story-${Date.now()}.png`;
    a.click();
  };

  // preview centrado con tamaño reservado (no “se corta” a la izquierda)
  const scale = 0.36;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `url(${BG_URL}) center/cover fixed no-repeat`,
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <div style={{ background: "rgba(255,255,255,.86)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "22px 14px 36px" }}>
          {/* Cabecera */}
          <div style={{ textAlign: "center", color: palette.ink, marginBottom: 10 }}>
            <div style={{ letterSpacing: "1.2em", opacity: 0.75, fontSize: 14 }}>
              R O S A L Í A
            </div>
            <div style={{ marginTop: 8, letterSpacing: ".35em", fontSize: 30 }}>
              <span style={{ fontWeight: 700 }}>L</span>
              <span> U X</span>
            </div>
            <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
              Tocá para elegir tus favoritas <b>en orden</b> y generá la historia.
            </div>
          </div>

          {/* Chips dorados (envuelven; sin scroll raro) */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,.12)",
              background: "rgba(255,255,255,.8)",
              borderRadius: 18,
              padding: 12,
              color: palette.ink,
            }}
          >
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
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 6 }}>
                  Tu orden:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selected.map((t, i) => (
                    <span
                      key={t}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 999,
                        border: `1px solid ${palette.gold}`,
                        background: "#fff",
                        color: palette.gold,
                        fontSize: 14,
                      }}
                    >
                      {i + 1}. {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nombre + acciones */}
            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label style={{ minWidth: 92, fontSize: 14, opacity: 0.85 }}>
                  Tu nombre:
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej.: Gastón Ruiz"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,.2)",
                    background: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={undo}
                  disabled={selected.length === 0}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,.2)",
                    background: "#fff",
                    color: palette.ink,
                    fontWeight: 600,
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
                    flex: 2,
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: `1px solid ${palette.gold}`,
                    background: palette.gold,
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: ".04em",
                    boxShadow: "0 14px 40px rgba(185,146,81,.35)",
                    opacity: selected.length === 0 ? 0.6 : 1,
                  }}
                  title="Generar historia 1080×1920"
                >
                  <Download size={18} style={{ marginTop: -3, marginRight: 6 }} />
                  Generar historia 1080×1920
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW centrado y con tamaño reservado */}
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
