"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Undo2, Download } from "lucide-react";

/* =========================================================
   DATA
========================================================= */
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

/* =========================================================
   LOOK & LAYOUT (compartido por preview y export)
========================================================= */
const W = 1080;
const H = 1920;
const BG_URL = "/lux-final-bg.jpg";

const INK = "#292929";
const GOLD = "#b99251";

// bloque del ranking (una sola fuente de verdad)
const LIST_TOP = 980;      // mové este valor para subir/bajar el bloque
const LIST_BOTTOM = 220;
const LEFT = 84;
const RIGHT = 84;
const NUM_COL = 120;
const GAP_COL = 18;
const TRACKING_EM = 0.18;  // tracking (en em) – mismo en canvas y preview
const GAP_ROWS = 22;       // separación entre filas

// tamaños base según cantidad de líneas
const baseForCount = (n: number) =>
  n <= 5 ? 104 : n <= 6 ? 96 : n <= 7 ? 90 : 84;

// romanos
const roman = (n: number) => {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let res = "", v = n;
  for (const [val, sym] of map) while (v >= val) { res += sym; v -= val; }
  return res;
};

/* =========================================================
   FITLINE (preview) — Mide con la MISMA fórmula que export
========================================================= */
function FitLine({
  text,
  max,
  min = 40,
  color = INK,
}: {
  text: string;
  max: number;
  min?: number;
  color?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(max);
  const U = useMemo(() => text.toUpperCase(), [text]);

  const widthWithTracking = (t: string, size: number) => {
    // igual que en canvas: ancho de texto + tracking entre letras
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    ctx.font = `${size}px "Times New Roman", Times, serif`;
    const base = ctx.measureText(t).width;
    const trackPx = TRACKING_EM * size;
    const extra = Math.max(0, t.length - 1) * trackPx;
    return base + extra;
  };

  useEffect(() => {
    const fit = () => {
      if (!wrap.current) return;
      const bw = Math.max(1, wrap.current.clientWidth);
      let lo = min, hi = max, best = min;
      for (let i = 0; i < 14; i++) {
        const mid = Math.floor((lo + hi) / 2);
        if (widthWithTracking(U, mid) <= bw * 0.985) { best = mid; lo = mid + 1; }
        else hi = mid - 1;
      }
      setFs(best);
    };
    const ro = new ResizeObserver(fit);
    if (wrap.current) ro.observe(wrap.current);
    Promise.resolve().then(() => requestAnimationFrame(() => requestAnimationFrame(fit)));
    return () => ro.disconnect();
  }, [U, max, min]);

  return (
    <div ref={wrap} style={{ width: "100%", overflow: "hidden" }}>
      <span
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: fs,
          color,
          letterSpacing: `${TRACKING_EM}em`,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "clip",
          lineHeight: 1.05,
          textAlign: "left",
          fontKerning: "none" as any,
          fontFeatureSettings: '"liga" 0, "clig" 0',
        }}
      >
        {U}
      </span>
    </div>
  );
}

/* =========================================================
   POSTER (preview) — usa el mismo layout que el export
========================================================= */
function Poster({ top, name }: { top: string[]; name?: string }) {
  const base = baseForCount(top.length);

  return (
    <div
      id="lux-story"
      style={{
        width: W, height: H, position: "relative", overflow: "hidden",
        background: `url(${BG_URL}) center/cover no-repeat`,
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: LIST_TOP, bottom: LIST_BOTTOM,
          left: LEFT, right: RIGHT,
          display: "flex", flexDirection: "column",
          gap: GAP_ROWS, margin: "0 auto",
        }}
      >
        {top.map((t, i) => (
          <div
            key={`${i}-${t}`}
            style={{
              display: "grid",
              gridTemplateColumns: `${NUM_COL}px 1fr`,
              alignItems: "center",
              gap: GAP_COL,
            }}
          >
            <div style={{ textAlign: "right", paddingRight: 10, fontSize: 40, letterSpacing: ".08em", color: INK }}>
              {roman(i + 1)}.
            </div>
            <FitLine text={t} max={base} />
          </div>
        ))}
      </div>

      {name ? (
        <div style={{ position: "absolute", right: 88, bottom: 120, fontSize: 28, color: INK }}>
          {name}
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   EXPORT en canvas — idéntico al preview
========================================================= */
async function exportCanvasPNG({
  bgUrl,
  lines,
  name,
}: {
  bgUrl: string;
  lines: string[];
  name?: string;
}) {
  // carga fondo (mismo origen: /public)
  const bg = await new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = bgUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bg, 0, 0, W, H);

  const textX = LEFT + NUM_COL + GAP_COL;
  const textW = W - LEFT - RIGHT - NUM_COL - GAP_COL;

  const measureWithTracking = (t: string, fs: number) => {
    ctx.font = `${fs}px "Times New Roman", Times, serif`;
    const base = ctx.measureText(t).width;
    const trackPx = TRACKING_EM * fs;
    return base + Math.max(0, t.length - 1) * trackPx;
  };

  let y = LIST_TOP;
  const base = baseForCount(lines.length);

  lines.forEach((raw, i) => {
    const U = raw.toUpperCase();

    // número romano
    ctx.fillStyle = INK;
    ctx.textBaseline = "alphabetic";
    ctx.font = `40px "Times New Roman", Times, serif`;
    const rn = roman(i + 1) + ".";
    const rnW = ctx.measureText(rn).width;
    ctx.fillText(rn, LEFT + NUM_COL - 10 - rnW, y);

    // auto-fit con misma fórmula que el preview
    const min = 40;
    let lo = min, hi = base, best = min;
    for (let k = 0; k < 14; k++) {
      const mid = Math.floor((lo + hi) / 2);
      if (measureWithTracking(U, mid) <= textW * 0.985) { best = mid; lo = mid + 1; }
      else hi = mid - 1;
    }

    // dibujo por caracteres sumando tracking ENTRE letras
    const fs = best;
    ctx.font = `${fs}px "Times New Roman", Times, serif`;
    let x = textX;
    const trackPx = TRACKING_EM * fs;
    for (let idx = 0; idx < U.length; idx++) {
      const ch = U[idx];
      const cw = ctx.measureText(ch).width;
      if (x + cw > textX + textW) break; // recorta
      ctx.fillText(ch, x, y);
      x += cw + (idx < U.length - 1 ? trackPx : 0);
    }

    // siguiente fila — misma cuenta que preview
    y += Math.ceil(fs * 1.05) + GAP_ROWS;
  });

  if (name) {
    const fs = 28;
    ctx.font = `${fs}px "Times New Roman", Times, serif`;
    const wName = ctx.measureText(name).width;
    ctx.fillStyle = INK;
    ctx.fillText(name, W - RIGHT - wName, H - 120);
  }

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "lux-ranking.png";
  a.click();
}

/* =========================================================
   APP
========================================================= */
export default function LuxRanking() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const limit = 8;

  const remaining = useMemo(
    () => TRACKS.filter((t) => !selected.includes(t)),
    [selected]
  );

  const add = (t: string) => selected.length < limit && setSelected((p) => [...p, t]);
  const undo = () => setSelected((p) => p.slice(0, -1));

  const doExport = async () => {
    await exportCanvasPNG({
      bgUrl: BG_URL,
      lines: selected.slice(0, limit),
      name: name || undefined,
    });
  };

  const scale = 0.36;

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Times New Roman', Times, serif" }}>
      {/* HEADER estilo LUX */}
      <div style={{ textAlign: "center", paddingTop: 18, paddingBottom: 6 }}>
        <div style={{ fontSize: 18, letterSpacing: ".5em", color: INK, marginBottom: 4 }}>
          R O S A L Í A
        </div>
        <div style={{ fontSize: 36, letterSpacing: ".5em", color: INK }}>
          <b>L U X</b>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
        {/* Controles: chips dorados + botón dorado */}
        <div style={{ background: "#fff", border: "1px solid #dedede", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontSize: 15, color: INK }}>
            Canciones ({selected.length}/{limit})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {remaining.map((t) => (
              <button
                key={t}
                onClick={() => add(t)}
                style={{
                  border: `1px solid ${GOLD}`,
                  background: "#fff",
                  color: GOLD,
                  borderRadius: 9999,
                  padding: "10px 14px",
                  fontSize: 14,
                  cursor: "pointer",
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
                border: `1px solid ${GOLD}`, background: "#fff", color: GOLD, fontWeight: 700,
                opacity: selected.length === 0 ? 0.5 : 1, cursor: "pointer",
              }}
            >
              <Undo2 size={16} style={{ marginRight: 4 }} /> Deshacer
            </button>
            <button
              onClick={doExport}
              disabled={selected.length === 0}
              style={{
                flex: 2, padding: "10px 14px", borderRadius: 10,
                border: `1px solid ${GOLD}`, background: GOLD, color: "#fff", fontWeight: 800,
                opacity: selected.length === 0 ? 0.6 : 1, cursor: "pointer",
              }}
            >
              <Download size={16} style={{ marginRight: 6 }} />
              Descargar historia (1080×1920)
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

        {/* PREVIEW — idéntico al export */}
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
