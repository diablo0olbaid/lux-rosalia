"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
const BG_URL = "/lux-final-bg.jpg"; // poné el JPG en /public con este nombre

const INK = "#292929";
const GOLD = "#b99251";

const LIST_TOP = 1100;   // mové esto si querés subir/bajar el bloque
const LEFT = 84;
const RIGHT = 84;
const NUM_COL = 120;
const GAP_COL = 18;
const GAP_ROWS = 28;

// TODAS las tipografías a 45px
const FS = 40;
const TRACKING_EM = 0.12; // tracking sutil

const roman = (n: number) => {
  const map: [number, string][] = [
    [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],
    [100,"C"],[90,"XC"],[50,"L"],[40,"XL"],
    [10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
  ];
  let res = "", v = n;
  for (const [val, sym] of map) while (v >= val) { res += sym; v -= val; }
  return res;
};

/* ============== CANVAS POSTER (preview = export) ============== */
function CanvasPoster({ lines, name }: { lines: string[]; name?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // tamaño exacto de historia
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cargar fondo y dibujar todo
    const bg = new Image();
    bg.crossOrigin = "anonymous"; // por las dudas
    bg.src = BG_URL;

    bg.onload = () => {
      // Fondo
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(bg, 0, 0, W, H);

      // Estilo base
      ctx.fillStyle = INK;
      ctx.textBaseline = "alphabetic";

      // Métricas comunes
      const textX = LEFT + NUM_COL + GAP_COL;
      const textW = W - LEFT - RIGHT - NUM_COL - GAP_COL;

      // Dibujo filas
      let y = LIST_TOP;
      lines.forEach((raw, i) => {
        const U = raw.toUpperCase();

        // Número romano (45px)
        ctx.font = `${FS}px "Times New Roman", Times, serif`;
        const rn = roman(i + 1) + ".";
        const rnW = ctx.measureText(rn).width;
        ctx.fillText(rn, LEFT + NUM_COL - 10 - rnW, y);

        // Título (45px) con tracking a mano; si no entra, recorto
        const trackPx = TRACKING_EM * FS;
        ctx.font = `${FS}px "Times New Roman", Times, serif`;

        let x = textX;
        for (let idx = 0; idx < U.length; idx++) {
          const ch = U[idx];
          const cw = ctx.measureText(ch).width;
          if (x + cw > textX + textW) break; // recorte limpio
          ctx.fillText(ch, x, y);
          x += cw + (idx < U.length - 1 ? trackPx : 0);
        }

        // siguiente fila (lineHeight 1.1 aprox + gap)
        y += Math.ceil(FS * 1.1) + GAP_ROWS;
      });

      // Firma (opcional) también a 45px
      if (name) {
        ctx.font = `${FS}px "Times New Roman", Times, serif`;
        const label = name.toUpperCase();
        const wName = ctx.measureText(label).width;
        ctx.fillText(label, W - RIGHT - wName, H - 120);
      }
    };
  }, [lines, name]);

  return (
    <canvas
      ref={canvasRef}
      id="lux-canvas"
      style={{
        width: W,        // importante: dejamos tamaño CSS = tamaño real
        height: H,
        display: "block",
      }}
    />
  );
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

  const add = (t: string) =>
    selected.length < limit && setSelected((p) => [...p, t]);
  const undo = () => setSelected((p) => p.slice(0, -1));

  const download = () => {
    const canvas = document.getElementById("lux-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "lux-ranking.png";
    a.click();
  };

  const scale = 0.36; // mostramos el canvas real escalado para preview

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Times New Roman', Times, serif" }}>
      {/* HEADER: R O S A L Í A / L U X */}
      <div style={{ textAlign: "center", paddingTop: 18, paddingBottom: 6 }}>
        <div style={{ fontSize: 18, letterSpacing: ".5em", color: INK, marginBottom: 4 }}>
          R O S A L Í A
        </div>
        <div style={{ fontSize: 36, letterSpacing: ".5em", color: INK }}>
          <b>L U X</b>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
        {/* Controles en dorado */}
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
              onClick={download}
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

        {/* PREVIEW: el MISMO canvas, solo escalado */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: W * scale, height: H * scale }}>
            <div style={{ transformOrigin: "top left", transform: `scale(${scale})` }}>
              <CanvasPoster lines={selected.slice(0, limit)} name={name || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
