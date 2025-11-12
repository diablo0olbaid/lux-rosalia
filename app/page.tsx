"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Undo2, Download } from "lucide-react";

/* ================== DATA ================== */
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

/* ================== LOOK / LAYOUT ================== */
const W = 1080;
const H = 1920;
const BG_URL = "/lux-final-bg.jpg"; // en /public
const INK = "#292929";
const GOLD = "#b99251";

const LIST_TOP = 980;   // mové esto si necesitás
const LIST_BOTTOM = 220;
const LEFT = 84;
const RIGHT = 84;
const NUM_COL = 120;
const GAP_COL = 18;
const GAP_ROWS = 28;    // separación entre filas

// todo a 60px
const FS = 60;
const TRACKING_EM = 0.12; // tracking sutil

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

/* ============== LÍNEA FIJA (preview) ============== */
function FixedLine({ text }: { text: string }) {
  const U = useMemo(() => text.toUpperCase(), [text]);
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "clip",
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: FS,
        letterSpacing: `${TRACKING_EM}em`,
        color: INK,
        lineHeight: 1.1,
        textAlign: "left",
        fontKerning: "none" as any,
        fontFeatureSettings: '"liga" 0, "clig" 0',
      }}
      title={U}
    >
      {U}
    </div>
  );
}

/* ============== POSTER (preview = export) ============== */
function Poster({ top, name }: { top: string[]; name?: string }) {
  return (
    <div
      id="lux-story"
      style={{
        width: W,
        height: H,
        position: "relative",
        overflow: "hidden",
        background: `url(${BG_URL}) center/cover no-repeat`,
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* bloque centrado, texto a la izquierda */}
      <div
        style={{
          position: "absolute",
          top: LIST_TOP,
          bottom: LIST_BOTTOM,
          left: LEFT,
          right: RIGHT,
          display: "flex",
          flexDirection: "column",
          gap: GAP_ROWS,
          margin: "0 auto",
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
            {/* romanos a 60px */}
            <div
              style={{
                textAlign: "right",
                paddingRight: 10,
                fontSize: FS,
                letterSpacing: `${TRACKING_EM}em`,
                color: INK,
                lineHeight: 1.1,
              }}
            >
              {roman(i + 1)}.
            </div>
            <FixedLine text={t} />
          </div>
        ))}
      </div>

      {/* firma opcional */}
      {name ? (
        <div
          style={{
            position: "absolute",
            right: 88,
            bottom: 120,
            fontSize: FS,
            color: INK,
            letterSpacing: `${TRACKING_EM}em`,
            lineHeight: 1.1,
          }}
        >
          {name.toUpperCase()}
        </div>
      ) : null}
    </div>
  );
}

/* ============== EXPORTA EXACTO EL PREVIEW ============== */
async function exportPreviewPNG() {
  const node = document.getElementById("lux-story");
  if (!node) return;

  try { /* @ts-ignore */ await document.fonts?.ready; } catch {}
  // 2 frames para asegurarnos que todo está pintado
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas = await html2canvas(node as HTMLElement, {
    backgroundColor: null,
    useCORS: true,      // funciona con /public
    allowTaint: false,  // evita canvas tainted
    scale: 3,           // nitidez
    foreignObjectRendering: true,
    width: W,
    height: H,
  });

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "lux-ranking.png";
  a.click();
}

/* ================== APP ================== */
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

  const scale = 0.36; // solo para mostrar pequeño el poster real (W x H)

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Times New Roman', Times, serif" }}>
      {/* HEADER simple R O S A L Í A / L U X */}
      <div style={{ textAlign: "center", paddingTop: 18, paddingBottom: 6 }}>
        <div style={{ fontSize: 18, letterSpacing: ".5em", color: INK, marginBottom: 4 }}>
          R O S A L Í A
        </div>
        <div style={{ fontSize: 36, letterSpacing: ".5em", color: INK }}>
          <b>L U X</b>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
        {/* Controles dorados */}
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
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${GOLD}`,
                background: "#fff",
                color: GOLD,
                fontWeight: 700,
                opacity: selected.length === 0 ? 0.5 : 1,
                cursor: "pointer",
              }}
            >
              <Undo2 size={16} style={{ marginRight: 4 }} /> Deshacer
            </button>
            <button
              onClick={exportPreviewPNG}
              disabled={selected.length === 0}
              style={{
                flex: 2,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${GOLD}`,
                background: GOLD,
                color: "#fff",
                fontWeight: 800,
                opacity: selected.length === 0 ? 0.6 : 1,
                cursor: "pointer",
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

        {/* PREVIEW: el nodo real 1080x1920 escalado (lo que se exporta) */}
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
