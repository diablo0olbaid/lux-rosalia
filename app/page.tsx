"use client";

import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { GripVertical, Plus, Trash2, Download, Star, Image as ImgIcon } from "lucide-react";

// Tracklist oficial de LUX
const TRACKS = [
  "Sexo, Violencia y Llantas",
  "Reliquia",
  "Divinize",
  "Porcelana",
  "Mio Cristo",
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

const palette = {
  bgDeep: "#0a1240",
  bgSoft: "#12206b",
  ink: "#f7f8ff",
  gold: "#d7b467",
  goldDark: "#b39243",
  mist: "#b9c7ff",
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function useDragSort(items, setItems) {
  const dragIndex = useRef<number>(-1);
  const onDragStart = (idx) => (e) => {
    dragIndex.current = idx;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  };
  const onDrop = (idx) => (e) => {
    e.preventDefault();
    const from = dragIndex.current;
    const to = idx;
    if (from === -1 || to === -1 || from === to) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setItems(next);
  };
  return { onDragStart, onDrop };
}

function LuxPoster({ title, selection, accent, bgImage }) {
  return (
    <div
      id="lux-poster"
      className="relative w-[1080px] h-[1350px] rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: `linear-gradient(180deg, ${palette.bgDeep}, ${palette.bgSoft})` }}
    >
      {bgImage && <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.35)" }} />
      <div className="absolute top-20 left-0 right-0 text-center">
        <h1 className="text-[110px] font-light tracking-widest" style={{ color: palette.ink }}>LUX</h1>
        <p className="text-xl" style={{ color: palette.mist }}>Rosalía · 2025</p>
      </div>
      <div className="absolute bottom-14 left-16 right-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selection.map((name, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full grid place-items-center text-xl font-semibold" style={{ background: palette.gold, color: "#151515" }}>{i + 1}</div>
              <div className="flex-1 p-4 rounded-2xl border backdrop-blur-sm" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: palette.ink }}>{name}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between">
          <div className="uppercase tracking-[0.35em] text-sm" style={{ color: palette.mist }}>Fan ranking</div>
          <div className="flex items-center gap-2" style={{ color: palette.gold }}>
            <Star size={18} />
            <span className="text-sm">{accent}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LuxRankingApp() {
  const [tracks, setTracks] = useState(TRACKS);
  const [topN, setTopN] = useState(10);
  const [accent, setAccent] = useState("Tu Top del Álbum");
  const [bgImage, setBgImage] = useState("");
  const { onDragStart, onDrop } = useDragSort(tracks, setTracks);

  const exportPNG = async () => {
    const node = document.getElementById("lux-poster");
    const canvas = await html2canvas(node, { backgroundColor: null, useCORS: true, scale: 2 });
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `LUX-ranking-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen w-full" style={{ background: `radial-gradient(1200px 800px at 20% -5%, #1b2f8a 0%, ${palette.bgDeep} 40%, #050816 100%)` }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <h1 className="text-3xl font-semibold mb-4" style={{ color: palette.ink }}>LUX – Fan Ranking</h1>
        <div className="flex items-center gap-3 mb-6">
          <label className="px-3 py-2 rounded-xl border cursor-pointer flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.2)", color: palette.ink }}>
            <ImgIcon size={18}/> Subir fondo
            <input type="file" accept="image/*" className="hidden" onChange={(e)=>setBgImage(URL.createObjectURL(e.target.files[0]))}/>
          </label>
          <button onClick={exportPNG} className="px-4 py-2 rounded-xl font-medium flex items-center gap-2 border" style={{ color: palette.ink, borderColor: "rgba(255,255,255,0.2)" }}>
            <Download size={18}/> Exportar PNG
          </button>
        </div>
        <ul className="space-y-2 mb-8">
          {tracks.map((t, i) => (
            <li key={i} draggable onDragStart={onDragStart(i)} onDrop={onDrop(i)} className="group flex items-center gap-3 px-3 py-2 rounded-xl border bg-white/5" style={{ borderColor: "rgba(255,255,255,0.15)", color: palette.ink }}>
              <GripVertical className="opacity-60" size={16} />
              <span className="w-6 opacity-60">{i + 1}</span>
              <span className="flex-1">{t}</span>
              <Trash2 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={()=>setTracks(tracks.filter((_, idx)=>idx!==i))} />
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 mb-8">
          <label className="text-sm" style={{ color: palette.mist }}>Top N:</label>
          <input type="number" min={1} max={tracks.length} value={topN} onChange={(e)=>setTopN(clamp(parseInt(e.target.value||"1",10),1,tracks.length))} className="w-20 px-2 py-1 rounded bg-transparent border" style={{ borderColor: "rgba(255,255,255,0.2)", color: palette.ink }} />
        </div>
        <div className="flex items-center justify-center">
          <LuxPoster title="LUX" selection={tracks.slice(0, topN)} accent={accent} bgImage={bgImage} />
        </div>
      </div>
    </div>
  );
}
