"use client";

import React, { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import { ArrowUp, ArrowDown, Plus, X, Download } from "lucide-react";

// ---------- DATA ----------
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

// ---------- LOOK ----------
const BG_URL = "https://www.rosalia.com/images/rl-wide.jpg"; // foto oficial
const palette = {
  ink: "#111", // texto
  gold: "#b99251",
};

// ---------- HELPERS ----------
function move<T>(arr: T[], from: number, to: number): T[] {
  const n = [...arr];
  const [m] = n.splice(from, 1);
  n.splice(to, 0, m);
  return n;
}

// ---------- POSTER (1080x1920) ----------
function PosterStory({
  top,
  name,
}: {
  top: string[];
  name?: string;
}) {
  const W = 1080, H = 1920;

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
      {/* Velo blanco para legibilidad */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,.86) 0%, rgba(255,255,255,.90) 40%, rgba(255,255,255,.95) 100%)"
        }}
      />

      {/* Marco dorado */}
      <div
        style={{
          position: "absolute", inset: 16,
          border: `2px solid ${palette.gold}`,
          borderRadius: 28
        }}
      />

      {/* Header */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", padding: "0 48px", color: palette.ink }}>
        <div style={{ letterSpacing: "1.2em", opacity: .8, fontSize: 34 }}>
          R O S A L Í A
        </div>
        <div style={{ marginTop: 18, letterSpacing: "0.35em", lineHeight: .9, fontSize: 160 }}>
          <span style={{ fontWeight: 700 }}>L</span>
          <span> U X</span>
        </div>
        <div style={{ marginTop: 10, letterSpacing: "0.18em", opacity: .8, fontSize: 32 }}>
          M I  T O P · 2 0 2 5
        </div>
      </div>

      {/* Lista */}
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 120, color: palette.ink }}>
        <div style={{ display: "grid", gap: 22 }}>
          {top.map((nameSong, i) => (
            <div key={nameSong} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 84, height: 84, borderRadius: "9999px",
                  background: palette.gold, color: "#fff",
                  display: "grid", placeItems: "center",
                  fontWeight: 700, fontSize: 30,
                  boxShadow: "0 10px 28px rgba(185,146,81,.45)"
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  flex: 1, padding: "22px 26px",
                  borderRadius: 26,
                  border: "1px solid rgba(0,0,0,.15)",
                  background: "linear-gradient(90deg, rgba(255,255,255,.65), rgba(255,255,255,.45))",
                  fontSize: 32, lineHeight: 1.15
                }}
              >
                {nameSong}
              </div>
            </div>
          ))}
        </div>

        {/* Footer simple */}
        <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20 }}>
          <div style={{ letterSpacing: ".35em", textTransform: "uppercase", opacity: .75 }}>Fan ranking</div>
          <div style={{ color: palette.gold, fontWeight: 700 }}>{name ? name : "#LUXTop"}</div>
        </div>
      </div>
    </div>
  );
}

// ---------- APP (UI SÚPER SIMPLE) ----------
export default function LuxMinimal() {
  const [available] = useState<string[]>(TRACKS);
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  const top = useMemo(() => selected.slice(0, 10), [selected]); // máx. 10

  const add = (t: string) => {
    if (selected.includes(t)) return;
    setSelected((p) => [...p, t]);
  };
  const up = (i: number) => i > 0 && setSelected((p) => move(p, i, i - 1));
  const down = (i: number) => i < selected.length - 1 && setSelected((p) => move(p, i, i + 1));
  const remove = (t: string) => setSelected((p) => p.filter((x) => x !== t));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;
    const canvas = await html2canvas(node as HTMLElement, { backgroundColor: null, useCORS: true, scale: 2 });
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `LUX-story-${Date.now()}.png`;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `url(${BG_URL}) center/cover fixed no-repeat`,
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Velo de página para que se parezca a rosalia.com */}
      <div style={{ background: "rgba(255,255,255,.85)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 40px" }}>
          {/* Encabezado small */}
          <div style={{ textAlign: "center", marginBottom: 18, color: palette.ink }}>
            <div style={{ letterSpacing: "1.2em", opacity: .75, fontSize: 14 }}>R O S A L Í A</div>
            <div style={{ marginTop: 8, letterSpacing: ".35em", fontSize: 32 }}>
              <span style={{ fontWeight: 700 }}>L</span><span> U X</span>
            </div>
            <div style={{ marginTop: 6, opacity: .75, fontSize: 13 }}>Elegí tus temas, ordená y generá la historia.</div>
          </div>

          {/* Dos columnas: disponibles + selección */}
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr", alignItems: "start" }}>
            {/* Disponibles */}
            <div style={{ border: "1px solid rgba(0,0,0,.12)", background: "rgba(255,255,255,.75)", borderRadius: 18, padding: 12 }}>
              <div style={{ marginBottom: 6, fontSize: 16, color: palette.ink }}>Canciones disponibles</div>
              <ul style={{ maxHeight: "46vh", overflow: "auto", paddingRight: 6, display: "grid", gap: 8 }}>
                {available.map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(0,0,0,.12)", borderRadius: 12, padding: "10px 12px", color: palette.ink }}>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</span>
                    <button onClick={() => add(t)} style={{ border: "1px solid rgba(0,0,0,.2)", borderRadius: 10, padding: "6px 10px", background: "#fff" }}>
                      <Plus size={16} style={{ marginTop: -2, marginRight: 4 }} /> Agregar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selección + acciones */}
            <div style={{ border: "1px solid rgba(0,0,0,.12)", background: "rgba(255,255,255,.75)", borderRadius: 18, padding: 12 }}>
              <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 16, color: palette.ink }}>Tu selección</div>
                <div style={{ fontSize: 13, opacity: .7, color: palette.ink }}>{top.length}/10</div>
              </div>
              <ol style={{ maxHeight: "46vh", overflow: "auto", paddingRight: 6, display: "grid", gap: 8 }}>
                {selected.map((t, i) => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(0,0,0,.12)", borderRadius: 12, padding: "10px 12px", color: palette.ink }}>
                    <span style={{ width: 22, opacity: .6 }}>{i + 1}</span>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</span>
                    <button onClick={() => up(i)} style={{ border: "1px solid rgba(0,0,0,.2)", borderRadius: 8, padding: 6, background: "#fff" }} aria-label="Subir"><ArrowUp size={16} /></button>
                    <button onClick={() => down(i)} style={{ border: "1px solid rgba(0,0,0,.2)", borderRadius: 8, padding: 6, background: "#fff" }} aria-label="Bajar"><ArrowDown size={16} /></button>
                    <button onClick={() => remove(t)} style={{ border: "1px solid rgba(0,0,0,.2)", borderRadius: 8, padding: 6, background: "#fff" }} aria-label="Quitar"><X size={16} /></button>
                  </li>
                ))}
              </ol>

              {/* Nombre + CTA único */}
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <label style={{ minWidth: 92, fontSize: 14, color: palette.ink, opacity: .8 }}>Tu nombre:</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej.: Gastón Ruiz"
                    style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,.2)", background: "#fff", color: palette.ink }}
                  />
                </div>
                <button
                  onClick={exportPNG}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${palette.gold}`,
                    background: palette.gold,
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: ".05em",
                    boxShadow: "0 14px 40px rgba(185,146,81,.35)"
                  }}
                >
                  <Download size={18} style={{ marginTop: -3, marginRight: 6 }} />
                  Generar historia 1080×1920
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW (escala para celular) */}
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            <div style={{ transformOrigin: "top left", transform: "scale(.36)" }}>
              <PosterStory top={top} name={name || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
