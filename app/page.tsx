"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Undo2, Download } from "lucide-react";

const TRACKS = [
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

const W = 1080, H = 1920;
const palette = { ink: "#111", gold: "#b99251" };

// ========= Línea centrada y justificada por ESPACIADO (sin solapes) =========
function JustifiedLine({
  text,
  max = 88,
  min = 26,
  color = "#111",
}: {
  text: string;
  max?: number;
  min?: number;
  color?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);
  const [w, setW] = useState(0);

  // mide ancho real con la fuente en un canvas offscreen
  const measure = (t: string, size: number) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    ctx.font = `${size}px "Times New Roman", Times, serif`;
    // desactivar ligaduras/kerning en el cálculo
    // (no todas las implementaciones lo respetan, por eso usamos spacing luego)
    return ctx.measureText(t).width;
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const doFit = () => {
      const width = Math.max(1, Math.floor(el.getBoundingClientRect().width));
      setW(width);
      // binary search para el font-size más grande que quepa SIN justificar
      let lo = min, hi = max, best = min;
      const T = text.toUpperCase();
      for (let i = 0; i < 12; i++) {
        const mid = Math.floor((lo + hi) / 2);
        if (measure(T, mid) <= width) {
          best = mid; lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      setFs(best);
    };

    const ro = new ResizeObserver(doFit);
    ro.observe(el);
    Promise.resolve().then(() => requestAnimationFrame(doFit));
    return () => ro.disconnect();
  }, [text, max, min]);

  const h = Math.ceil(fs * 1.12);
  const T = text.toUpperCase();

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <svg width="100%" height={h} viewBox={`0 0 ${Math.max(1, w)} ${h}`} preserveAspectRatio="none">
        <text
          x={0}
          y={Math.floor(h * 0.82)}
          textAnchor="start"
          fill={color}
          fontFamily="'Times New Roman', Times, serif"
          fontSize={fs}
          // Importantísimo: justificar solo ESPACIADO, sin deformar glifos
          textLength={Math.max(1, w)}
          lengthAdjust="spacing"
          // y desactivar ligaduras/kerning para que html2canvas renderice igual
          style={{
            fontKerning: "none" as any,
            fontFeatureSettings: '"liga" 0, "clig" 0',
          }}
        >
          {T}
        </text>
      </svg>
    </div>
  );
}

// ========= Poster solo con el ranking encima del fondo =========
function PosterStory({
  top,
  name,
  bgUrl,
}: {
  top: string[];
  name?: string;
  bgUrl: string;
}) {
  const base = top.length <= 5 ? 100 : top.length <= 6 ? 90 : top.length <= 7 ? 84 : 76;

  return (
    <div
      id="lux-story"
      style={{
        width: W,
        height: H,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Times New Roman', Times, serif",
        background: `url(${bgUrl}) center/cover no-repeat`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 72,
          right: 72,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          color: palette.ink,
        }}
      >
        {top.map((t, i) => (
          <div
            key={t}
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
                borderRadius: "50%",
                background: palette.gold,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              {i + 1}
            </div>
            <JustifiedLine text={t.toUpperCase()} max={base} />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 120,
          color: palette.gold,
          fontWeight: 700,
          fontSize: 26,
        }}
      >
        {name ? name : "#LUXTOP"}
      </div>
    </div>
  );
}

// ========= App principal =========
export default function LuxMinimal() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const limit = 8;

  // cambia esta línea por la URL de tu imagen en GitHub
  const bgUrl = "/lux-final-bg.jpg"; // ej: public/lux-final-bg.jpg

  const remaining = TRACKS.filter((t) => !selected.includes(t));
  const add = (t: string) =>
    selected.length < limit && setSelected((p) => [...p, t]);
  const undo = () => setSelected((p) => p.slice(0, -1));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 3,
      foreignObjectRendering: true,
    });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `lux-ranking.png`;
    a.click();
  };

  const scale = 0.36;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 24, letterSpacing: ".3em" }}>
            <b>LUX</b> RANKING
          </div>
          <p style={{ fontSize: 14 }}>
            Elegí tus canciones y generá tu historia.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ marginBottom: 8, fontSize: 15 }}>
            Canciones ({selected.length}/{limit})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {remaining.map((t) => (
              <button
                key={t}
                onClick={() => add(t)}
                style={{
                  border: `1px solid ${palette.gold}`,
                  background: "#fff",
                  color: palette.gold,
                  borderRadius: 9999,
                  padding: "10px 14px",
                  fontSize: 14,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button
              onClick={undo}
              disabled={selected.length === 0}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              <Undo2 size={16} style={{ marginRight: 4 }} /> Deshacer
            </button>
            <button
              onClick={exportPNG}
              disabled={selected.length === 0}
              style={{
                flex: 2,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${palette.gold}`,
                background: palette.gold,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              <Download size={16} style={{ marginRight: 4 }} /> Generar historia
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <input
              placeholder="Tu nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* preview */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: W * scale, height: H * scale }}>
            <div style={{ transformOrigin: "top left", transform: `scale(${scale})` }}>
              <PosterStory
                top={selected.slice(0, limit)}
                name={name || undefined}
                bgUrl={bgUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
