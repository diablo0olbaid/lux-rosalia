"use client";

import React, { useMemo, useRef, useState } from "react";
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
const BG_URL = "/lux-final-bg.jpg"; 
const INK = "#292929";            

// Romanos
const roman = (n: number) => {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let res = "", v = n;
  for (const [val, sym] of map) { while (v >= val) { res += sym; v -= val; } }
  return res;
};

// -------- texto con auto-fit en <div> (preview) ----------
function FitLine({
  text,
  max = 96,
  min = 36,
  trackingEm = 0.14,
  color = INK,
  align = "left",
}: {
  text: string; max?: number; min?: number; trackingEm?: number; color?: string; align?: "left" | "center";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);
  const U = useMemo(() => text.toUpperCase(), [text]);

  const measure = (size: number) => {
    if (!content.current) return 0;
    content.current.style.fontSize = `${size}px`;
    return content.current.scrollWidth;
  };

  React.useEffect(() => {
    const fit = () => {
      if (!wrap.current) return;
      const bw = Math.max(1, wrap.current.clientWidth);
      let lo = min, hi = max, best = min;
      for (let i = 0; i < 12; i++) {
        const mid = Math.floor((lo + hi) / 2);
        if (measure(mid) <= bw * 0.985) { best = mid; lo = mid + 1; }
        else hi = mid - 1;
      }
      setFs(best);
      if (content.current) content.current.style.fontSize = `${best}px`;
    };
    const ro = new ResizeObserver(fit);
    if (wrap.current) ro.observe(wrap.current);
    Promise.resolve().then(() => requestAnimationFrame(() => requestAnimationFrame(fit)));
    return () => ro.disconnect();
  }, [U, max, min]);

  return (
    <div ref={wrap} style={{ width: "100%", overflow: "hidden" }}>
      <div
        ref={content}
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          color,
          letterSpacing: `${trackingEm}em`,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "clip",
          lineHeight: 1.05,
          textAlign: align,
          fontKerning: "none" as any,
          fontFeatureSettings: '"liga" 0, "clig" 0',
        }}
      >
        {U}
      </div>
    </div>
  );
}

// -------- Poster (preview) ----------
function Poster({
  top,
  name,
  listTop = 1100,
  listBottom = 220,
}: {
  top: string[];
  name?: string;
  listTop?: number;
  listBottom?: number;
}) {
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
      {/* bloque centrado, texto a la izquierda */}
      <div
        style={{
          position: "absolute",
          top: listTop,
          bottom: listBottom,
          left: 84, right: 84,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          margin: "0 auto",
        }}
      >
        {top.map((t, i) => (
          <div key={t} style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: 18 }}>
            <div style={{ textAlign: "right", paddingRight: 10, fontSize: 40, letterSpacing: ".08em", color: INK }}>
              {roman(i + 1)}.
            </div>
            <FitLine text={t} max={base} min={40} trackingEm={0.18} color={INK} align="left" />
          </div>
        ))}
      </div>

      {/* firma opcional */}
      {name ? (
        <div style={{ position: "absolute", right: 88, bottom: 120, fontSize: 28, color: INK }}>
          {name}
        </div>
      ) : null}
    </div>
  );
}

// -------- Export CANVAS 100% confiable (sin html2canvas) ----------
async function exportCanvasPNG({
  bgUrl,
  lines,
  listTop,
  listBottom,
  name,
}: {
  bgUrl: string;
  lines: string[];
  listTop: number;
  listBottom: number;
  name?: string;
}) {
  // Carga fondo
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = bgUrl; // /public → mismo origen
  });

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  // Fondo
  ctx.drawImage(img, 0, 0, W, H);

  // Área lista
  const left = 84, right = 84;
  const colNum = 120, gap = 18;
  const textX = left + colNum + gap;
  const textW = W - left - right - colNum - gap;
  const stepY = 22 + 1; // gap base (se suma al alto de línea)

  // Estilo base
  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";
  ctx.font = `40px "Times New Roman", Times, serif`;
  // Numeración romana
  let y = listTop;
  lines.forEach((t, i) => {
    // número
    ctx.font = `40px "Times New Roman", Times, serif`;
    const num = roman(i + 1) + ".";
    const numW = ctx.measureText(num).width;
    ctx.fillText(num, left + colNum - 10 - numW, y);

    // título auto-fit
    const max = lines.length <= 5 ? 104 : lines.length <= 6 ? 96 : lines.length <= 7 ? 90 : 84;
    const min = 40;
    // binary search de font-size
    let lo = min, hi = max, best = min;
    const U = t.toUpperCase();
    const measure = (fs: number) => {
      ctx.font = `${fs}px "Times New Roman", Times, serif`;
      return ctx.measureText(U).width * 1.02; // 2% colchón
    };
    for (let k = 0; k < 12; k++) {
      const mid = Math.floor((lo + hi) / 2);
      if (measure(mid) <= textW) { best = mid; lo = mid + 1; } else hi = mid - 1;
    }
    const fs = best;
    ctx.font = `${fs}px "Times New Roman", Times, serif"`;
    // tracking: dibujar por caracteres con spacing
    const tracking = fs * 0.18; // similar a 0.18em
    let x = textX;
    for (const ch of U) {
      const w = ctx.measureText(ch).width;
      if (x + w > textX + textW) break; // recorta si no entra
      ctx.fillText(ch, x, y);
      x += w + tracking;
    }

    // siguiente fila
    y += Math.ceil(fs * 1.05) + stepY;
  });

  // firma
  if (name) {
    const fs = 28;
    ctx.font = `${fs}px "Times New Roman", Times, serif"`;
    const wName = ctx.measureText(name).width;
    ctx.fillText(name, W - 88 - wName, H - 120);
  }

  // descarga
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "lux-ranking.png";
  a.click();
}

// ========= App mínima =========
export default function LuxRanking() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const limit = 8;

  const remaining = TRACKS.filter((t) => !selected.includes(t));
  const add = (t: string) => selected.length < limit && setSelected((p) => [...p, t]);
  const undo = () => setSelected((p) => p.slice(0, -1));

  const doExport = async () => {
    await exportCanvasPNG({
      bgUrl: BG_URL,
      lines: selected.slice(0, limit),
      listTop: 620,
      listBottom: 220,
      name: name || undefined,
    });
  };

  const scale = 0.36;

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20, fontFamily: "'Times New Roman', Times, serif" }}>
        {/* Controles */}
        <div style={{ background: "#fff", border: "1px solid #dedede", borderRadius: 14, padding: 14, marginBottom: 16 }}>
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
                  color: INK,
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
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1px solid #ccc", background: "#fff", fontWeight: 600,
                opacity: selected.length === 0 ? 0.5 : 1,
              }}
            >
              <Undo2 size={16} style={{ marginRight: 4 }} /> Deshacer
            </button>
            <button
              onClick={doExport}
              disabled={selected.length === 0}
              style={{
                flex: 2, padding: "10px 14px", borderRadius: 10,
                border: "1px solid #111", background: "#111", color: "#fff", fontWeight: 700,
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
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>
        </div>

        {/* PREVIEW (idéntico al export en posiciones/estética) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: W * scale, height: H * scale, position: "relative" }}>
            <div style={{ transformOrigin: "top left", transform: `scale(${scale})` }}>
              <Poster top={selected.slice(0, limit)} name={name || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
