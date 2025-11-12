"use client";

import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Undo2, Download } from "lucide-react";

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
  ink: "#111",
  gold: "#b99251",
};

// ------- Helpers -------
function toUpperPretty(s: string) {
  // respeta acentos y comillas, solo convierte a MAYÚSCULAS
  return s.toLocaleUpperCase();
}

// Componente que “justifica” las letras para ocupar TODO el ancho disponible
function JustifiedWord({ text, maxFont = 96 }: { text: string; maxFont?: number }) {
  const letters = [...text]; // incluye espacios si los hubiera
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        width: "100%",
        letterSpacing: 0,
        gap: 0,
        lineHeight: 1,
        fontSize: maxFont,
        whiteSpace: "nowrap",
      }}
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <span key={i} style={{ flex: ch === " " ? "0 0 0.6em" : "1 1 0", textAlign: "center" }}>
          {ch}
        </span>
      ))}
    </div>
  );
}

// ---------- POSTER (1080x1920) ----------
function PosterStory({
  top,
  name,
}: {
  top: string[];
  name?: string;
}) {
  const W = 1080,
    H = 1920;

  // tamaño dinámico por cantidad de líneas (más líneas => tipografía más chica)
  const base = top.length <= 5 ? 120 : top.length <= 6 ? 108 : top.length <= 7 ? 98 : 92;

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
      {/* Velo para legibilidad */}
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
          border: `2px solid ${palette.gold}`,
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 72,
          right: 72,
          textAlign: "center",
          color: palette.ink,
        }}
      >
        <div style={{ letterSpacing: "1.2em", opacity: 0.8, fontSize: 34 }}>R O S A L Í A</div>
        <div style={{ marginTop: 10, letterSpacing: "0.35em", lineHeight: 0.9, fontSize: 160 }}>
          <span style={{ fontWeight: 700 }}>L</span>
          <span> U X</span>
        </div>
        <div style={{ marginTop: 12, letterSpacing: "0.18em", opacity: 0.8, fontSize: 32 }}>
          M I  T O P · 2 0 2 5
        </div>
      </div>

      {/* Lista tipográfica JUSTIFICADA */}
      <div
        style={{
          position: "absolute",
          top: 470,
          bottom: 170,
          left: 72,
          right: 72,
          display: "grid",
          gridTemplateRows: `repeat(${top.length}, 1fr)`,
          alignItems: "center",
          gap: 10,
          color: palette.ink,
        }}
      >
        {top.map((nameSong, i) => (
          <div key={nameSong} style={{ display: "grid", gridTemplateColumns: "80px 1fr", alignItems: "center", gap: 24 }}>
            {/* medallón pequeño, sutil */}
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 9999,
                background: palette.gold,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: 28,
                boxShadow: "0 10px 28px rgba(185,146,81,.35)",
              }}
            >
              {i + 1}
            </div>

            {/* título en ancho completo, JUSTIFICADO por letra */}
            <JustifiedWord text={toUpperPretty(nameSong)} maxFont={base} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 90,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: palette.ink,
          fontSize: 22,
        }}
      >
        <div style={{ letterSpacing: ".35em", textTransform: "uppercase", opacity: 0.75 }}>Fan ranking</div>
        <div style={{ color: palette.gold, fontWeight: 700 }}>{name ? name : "#LUXTop"}</div>
      </div>
    </div>
  );
}

// ---------- APP (UX ULTRA SIMPLE) ----------
export default function LuxViral() {
  // Elegís en ORDEN: al tocar un track se agrega como siguiente puesto.
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  const remaining = useMemo(
    () => TRACKS.filter((t) => !selected.includes(t)),
    [selected]
  );
  const limit = 8; // viral & lindo: hasta 8 líneas

  const add = (t: string) => {
    if (selected.length >= limit) return;
    setSelected((p) => [...p, t]);
  };
  const undo = () => setSelected((p) => p.slice(0, -1));

  const exportPNG = async () => {
    const node = document.getElementById("lux-story");
    if (!node) return;
    const canvas = await html2canvas(node as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 3, // más nítido
    });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
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
      <div style={{ background: "rgba(255,255,255,.86)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "22px 14px 36px" }}>
          {/* Cabecera compacta */}
          <div style={{ textAlign: "center", color: palette.ink, marginBottom: 10 }}>
            <div style={{ letterSpacing: "1.2em", opacity: 0.75, fontSize: 14 }}>R O S A L Í A</div>
            <div style={{ marginTop: 8, letterSpacing: ".35em", fontSize: 30 }}>
              <span style={{ fontWeight: 700 }}>L</span>
              <span> U X</span>
            </div>
            <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
              Tocá para elegir tus favoritas <b>en orden</b> y generá la historia.
            </div>
          </div>

          {/* Lista de disponibles: chips grandes, sin scrolles raros (envuelve) */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,.12)",
              background: "rgba(255,255,255,.8)",
              borderRadius: 18,
              padding: 12,
              color: palette.ink,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 16 }}>Canciones (tap para agregar · {selected.length}/{limit})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {remaining.map((t) => (
                <button
                  key={t}
                  onClick={() => add(t)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,.18)",
                    background: "#fff",
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
                    <span
                      key={t}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,.18)",
                        background: "#fff",
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
                <label style={{ minWidth: 92, fontSize: 14, opacity: 0.85 }}>Tu nombre:</label>
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

          {/* PREVIEW escalada (siempre centrada, sin desbordes) */}
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            <div style={{ transformOrigin: "top left", transform: "scale(.36)" }}>
              <PosterStory top={selected.slice(0, limit)} name={name || undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
