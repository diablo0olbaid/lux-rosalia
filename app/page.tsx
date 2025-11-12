"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Undo2, Download } from "lucide-react";

// ---------------- DATA ----------------
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

// ---------------- LOOK ----------------
const W = 1080;
const H = 1920;
const BG_URL = "/lux-final-bg.jpg"; // poné tu jpg en /public con este nombre
const palette = { ink: "#111" };

// ------------- utils -------------
const roman = (n: number) => {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let res = "", v = n;
  for (const [val, sym] of map) {
    while (v >= val) { res += sym; v -= val; }
  }
  return res;
};

// ========= Línea centrada con auto-fit y corte si no entra =========
function FitLine({
  text,
  max = 96,        // tamaño máximo
  min = 36,        // tamaño mínimo
  trackingEm = 0.18, // tracking (look LUX)
  color = palette.ink,
}: {
  text: string;
  max?: number;
  min?: number;
  trackingEm?: number;
  color?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);

  const U = useMemo(() => text.toUpperCase(), [text]);

  // mide el ancho real del contenido
  const contentWidth = () => (txt.current?.scrollWidth ?? 0);
  const boxWidth = () => (wrap.current?.clientWidth ?? 0);

  useEffect(() => {
    const doFit = () => {
      const bw = boxWidth();
      if (!bw) return;
      let lo = min, hi = max, best = min;
      for (let i = 0; i < 12; i++) {
        const mid = Math.floor((lo + hi) / 2);
        if (txt.current) txt.current.style.fontSize = `${mid}px`;
        // colchón 1.5% para evitar saltitos
        if (contentWidth() <= bw * 0.985) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      setFs(best);
      if (txt.current) txt.current.style.fontSize = `${best}px`;
    };

    const ro = new ResizeObserver(doFit);
    if (wrap.current) ro.observe(wrap.current);
    // esperar fonts y un par de frames
    Promise.resolve().then(
      () => requestAnimationFrame(() => requestAnimationFrame(doFit))
    );
    return () => ro.disconnect();
  }, [U, max, min]);

  return (
    <div ref={wrap} style={{ width: "100%", overflow: "hidden" }}>
      <div
        ref={txt}
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400,
          letterSpacing: `${trackingEm}em`,
          color,
          fontSize: fs,
          whiteSpace: "nowrap",
          textAlign: "center",
          // corte limpio si no entra aún en min
          overflow: "hidden",
          textOverflow: "clip",
          lineHeight: 1.05,
          // hace que se vea consistente al exportar
          fontKerning: "none" as any,
          // quita ligaduras para que html2canvas no cambie el ancho
          fontFeatureSettings: '"liga" 0, "clig" 0',
        }}
      >
        {U}
      </div>
    </div>
  );
}

// ========= Poster: SOLO ranking sobre el fondo =========
function Poster({
  top,
  name,
  listTop = 620,     // ajustá si tu arte lo necesita
  listBottom = 220,  // espacio inferior
}: {
  top: string[];
  name?: string;
  listTop?: number;
  listBottom?: number;
}) {
  // base por cantidad de líneas (más líneas → fuente base menor)
  const base = top.length <= 5 ? 104 : top.length <= 6 ? 96 : top.length <= 7 ? 90 : 84;

  return (
    <div
      id="lux-story"
      style={{
        width: W, height: H, position: "relative", overflow: "hidden",
        background: `url(${BG_URL}) center/cover no-repeat`,
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* BLOQUE DE LISTA */}
      <div
        style={{
          position: "absolute",
          top: listTop,
          bottom: listBottom,
          left: 84,
          right: 84,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {top.map((t, i) => (
          <div
            key={t}
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Número romano (sin círculo) */}
            <div
              style={{
                textAlign: "right",
                paddingRight: 8,
                fontSize: 40,
                letterSpacing: ".1em",
                color: palette.ink,
              }}
            >
              {roman(i + 1)}.
            </div>

            {/* Título con auto-fit y corte si hace falta */}
            <FitLine text={t} max={base} min={40} trackingEm={0.22} />
          </div>
        ))}
      </div>

      {/* Firma / nombre (opcional) */}
      <div
        style={{
          position: "absolute",
          right: 88,
          bottom: 120,
          fontSize: 28,
          color: palette.ink,
        }}
      >
        {name ? name : ""}
      </div>
    </div>
  );
}

// ========= App mínima =========
export default function LuxRanking() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const limit = 8;

  const remaining = TRACKS.filter((t) => !selected.includes(t));
  const add = (t: string) =>
    selected.length < limit && setSelected((p) => [...p, t]);
  const undo = () => setSelected((p) => p.slice(0, -1));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;

    try { /* @ts-ignore */ await document.fonts?.ready; } catch {}
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,       // ok con /public
      allowTaint: false,   // no taint
      scale: 3,
      foreignObjectRendering: true,
    });

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "lux-ranking.png";
    a.click();
  };

  // preview scale
  const scale = 0.36;

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20, fontFamily: "'Times New Roman', Times, serif" }}>
        {/* Controles simples */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #dedede",
            borderRadius: 14,
            padding: 14,
            marginBottom: 16,
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
                  border: "1px solid #bbb",
                  background: "#fff",
                  color: palette.ink,
                  borderRadius: 9999,
                  padding: "10px 14px",
                  fontSize: 14,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
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
                opacity: selected.length === 0 ? 0.5 : 1,
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
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              <Download size={16} style={{ marginRight: 6 }} />
              Generar historia
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
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

        {/* PREVIEW */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: W * scale, height: H * scale }}>
            <div style={{ transformOrigin: "top left", transform: `scale(${scale})` }}>
              <Poster top={selected.slice(0, limit)} name={name || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
