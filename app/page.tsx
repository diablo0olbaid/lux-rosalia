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
  "Focu ‘ranni [physical exclusive]",
  "Sauvignon Blanc",
  "Jeanne [physical exclusive]",
  "Novia Robot [physical exclusive]",
  "La Rumba Del Perdón",
  "Memória",
  "Magnolias",
];

const W = 1080, H = 1920;
const palette = { ink: "#111", gold: "#b99251" };

// ========= Texto distribuido por carácter (centrado y justificado) =========
function JustifiedLine({ text, max = 88 }: { text: string; max?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);
  const [w, setW] = useState(0);
  const [h, setH] = useState(Math.ceil(max * 1.1));
  const letters = [...text.replace(/\s+/g, " ")];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      setW(Math.max(0, Math.floor(box.width)));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Promise.resolve().then(() => requestAnimationFrame(measure));
    return () => ro.disconnect();
  }, [text]);

  const xs = useMemo(() => {
    const slots = letters.length;
    if (!w || slots === 0) return [] as number[];
    const left = 0, right = w;
    const step = slots > 1 ? (right - left) / (slots - 1) : 0;
    return Array.from({ length: slots }, (_, i) => left + i * step);
  }, [w, letters.length]);

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <g
          fontFamily="'Times New Roman', Times, serif"
          fontSize={fs}
          fill={palette.ink}
          style={{ fontKerning: "none" as any, fontFeatureSettings: '"liga" 0, "clig" 0' }}
        >
          {letters.map((ch, i) => (
            <text key={i} x={xs[i] ?? 0} y={Math.floor(h * 0.8)} textAnchor="middle">
              {ch}
            </text>
          ))}
        </g>
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
          top: 620,
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
            Elegí tus canciones y generá tu historia viral.
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
