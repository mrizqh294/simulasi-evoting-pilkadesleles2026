"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Defs from "./Defs";
import Header from "./Header";
import CandidateCard from "./CandidateCard";
import Photo from "./Photo";
import ScanCamera from "./ScanCamera";
import { CANDIDATES, VALID_NIKS } from "@/lib/data";

type Screen = "scan" | "vote";

export default function Ballot() {
  const [currentScreen, setScreen] = useState<Screen>("scan");
  const [selectedCandidateId, setSelected] = useState<number | null>(null);
  const [isModalOpen, setModal] = useState(false);
  const [rejection, setRejection] = useState<string | null>(null);
  const nikRef = useRef<string | null>(null);
  const usedNiks = useRef<Set<string>>(new Set()); // NIK yang sudah memilih (hanya di memori sesi)
  const [view, setView] = useState({ ready: false, fixed: false, scale: 1, x: 0, y: 0 });

  // Landscape tablet/desktop: kanvas 1920x1200 diskalakan muat layar. Lainnya: layout cair.
  useEffect(() => {
    const calc = () => {
      const w = innerWidth, h = innerHeight;
      const fixed = w >= 900 && w / h >= 1.25;
      const scale = Math.min(w / 1920, h / 1200);
      setView({ ready: true, fixed, scale, x: (w - 1920 * scale) / 2, y: (h - 1200 * scale) / 2 });
    };
    calc();
    addEventListener("resize", calc);
    return () => removeEventListener("resize", calc);
  }, []);

  // Dipanggil dari kamera maupun pemindai hardware dengan isi QR (NIK).
  const handleScan = useCallback((raw: string) => {
    if (currentScreen !== "scan" || rejection) return;
    const nik = raw.trim();
    if (!VALID_NIKS.includes(nik)) return setRejection("QR Code tidak terdaftar sebagai pemilih.");
    if (usedNiks.current.has(nik)) return setRejection("NIK ini sudah menggunakan hak pilihnya.");
    nikRef.current = nik;
    setScreen("vote");
  }, [currentScreen, rejection]);

  // Pemindai QR hardware (keyboard wedge): mengetik isi QR lalu Enter.
  useEffect(() => {
    if (currentScreen !== "scan") return;
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") { if (buf) handleScan(buf); buf = ""; }
      else if (e.key.length === 1) buf += e.key;
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [currentScreen, handleScan]);

  const chosen = CANDIDATES.find((c) => c.id === selectedCandidateId) ?? null;
  const reset = () => { setSelected(null); setModal(false); };

  const corners = [
    "-left-0.5 -top-0.5 border-l-[6px] border-t-[6px]",
    "-right-0.5 -top-0.5 border-r-[6px] border-t-[6px]",
    "-bottom-0.5 -left-0.5 border-b-[6px] border-l-[6px]",
    "-bottom-0.5 -right-0.5 border-b-[6px] border-r-[6px]",
  ];

  const content = (
    <>
      <Header />
      {currentScreen === "scan" ? (
        <section className="flex flex-col items-center px-4 py-8 fx:flex-1 fx:p-0 fx:pt-[60px]">
          <div className="relative aspect-square w-[min(520px,80vw)] border-2 border-card-border bg-surface fx:w-[520px]">
            <div className="absolute inset-0 overflow-hidden">
              <ScanCamera onResult={handleScan} paused={!!rejection} />
            </div>
            {corners.map((c) => (<i key={c} className={`absolute size-[14%] border-brand ${c}`} />))}
            <b className="absolute inset-x-[8%] top-[8%] h-[3px] bg-brand/70 animate-scan" />
          </div>
          <p className="mt-7 text-center text-[clamp(20px,5vw,30px)] font-bold fx:mt-10 fx:text-[30px]">Pindai QR Code Anda</p>
          <p className="mt-2.5 text-center text-sm text-[#7a7f8c] fx:mt-3">Arahkan QR Code pada kartu pemilih ke kamera</p>
        </section>
      ) : (
        <>
          <section className="mx-auto grid max-w-[900px] grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3.5 p-4 fx:mx-0 fx:flex fx:max-w-none fx:gap-7 fx:px-[104px] fx:pb-0 fx:pt-2.5">
            {CANDIDATES.map((c) => (
              <CandidateCard key={c.id} number={c.id} name={c.name} photoUrl={c.photoUrl}
                selected={selectedCandidateId === c.id} onPress={() => setSelected(c.id)} />
            ))}
          </section>
          <div className="sticky bottom-0 mx-auto flex w-full max-w-[900px] flex-col items-center bg-gradient-to-b from-paper/0 to-paper to-35% px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-2 fx:static fx:mx-0 fx:mt-auto fx:max-w-none fx:bg-none fx:px-[104px] fx:pb-16 fx:pt-0">
            <svg viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" aria-hidden
              className={`size-11 transition-opacity fx:mb-4 fx:size-16 ${chosen ? "opacity-100" : "opacity-0"}`}>
              <path d="M26 6h12v28l8-2c4-1 6 3 3 6L40 58H26L16 44c-2-3 1-6 4-5l6 4z" />
            </svg>
            <button disabled={!chosen} onClick={() => setModal(true)}
              className={`min-h-[72px] w-full rounded-xl text-[clamp(18px,4.5vw,26px)] font-bold uppercase tracking-[.5px] text-white fx:h-[88px] fx:min-h-0 fx:text-[26px] ${
                chosen ? "bg-brand active:bg-brand-dark" : "bg-dis"
              }`}>
              Pilih Kandidat
            </button>
          </div>
        </>
      )}
    </>
  );

  // Modal dirender di luar kanvas berskala agar overlay hitam menutupi seluruh layar.
  const modal = (
    <>
      {isModalOpen && chosen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 fx:p-0">
          <div style={view.fixed ? { transform: `scale(${view.scale})` } : undefined} className="max-h-full w-[min(720px,100%)] overflow-auto rounded-2xl bg-white p-[clamp(16px,4vw,40px)] text-center shadow-[0_8px_32px_rgba(0,0,0,.3)] fx:relative fx:h-[920px] fx:w-[720px] fx:overflow-hidden fx:p-10">
            <Photo url={chosen.photoUrl} punched className="mx-auto w-[min(280px,30vh,60%)]" />
            <div className="mt-2.5 text-[clamp(26px,6vw,36px)] font-bold fx:text-4xl">{chosen.id}</div>
            <div className="mt-1 text-[clamp(20px,4.6vw,30px)] font-bold uppercase leading-tight fx:text-[30px]">{chosen.name}</div>
            <div className="mt-6 text-[clamp(22px,5vw,36px)] font-bold leading-tight fx:mt-8 fx:text-4xl">Apakah Anda yakin akan memilih calon ini?</div>
            <div className="mt-6 flex gap-4 fx:absolute fx:inset-x-10 fx:bottom-10 fx:mt-0 fx:justify-center fx:gap-6">
              <button onClick={reset} className="min-h-[72px] flex-1 rounded-xl bg-danger text-[clamp(20px,4.5vw,28px)] font-bold text-white fx:h-[88px] fx:min-h-0 fx:w-[296px] fx:flex-none fx:text-[28px]">Ulangi</button>
              <button onClick={() => { if (nikRef.current) usedNiks.current.add(nikRef.current); nikRef.current = null; reset(); setScreen("scan"); }} className="min-h-[72px] flex-1 rounded-xl bg-brand text-[clamp(20px,4.5vw,28px)] font-bold text-white fx:h-[88px] fx:min-h-0 fx:w-[296px] fx:flex-none fx:text-[28px]">Pilih</button>
            </div>
          </div>
        </div>
      )}
      {rejection && (
        <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 fx:p-0">
          <div style={view.fixed ? { transform: `scale(${view.scale})` } : undefined} className="w-[min(720px,100%)] rounded-2xl bg-white p-[clamp(20px,4vw,40px)] text-center shadow-[0_8px_32px_rgba(0,0,0,.3)] fx:w-[720px] fx:p-10">
            <svg viewBox="0 0 64 64" aria-hidden className="mx-auto size-24 fx:size-32">
              <circle cx="32" cy="32" r="30" fill="#E53935" />
              <path d="M21 21l22 22M43 21L21 43" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <div className="mt-6 text-[clamp(26px,6vw,40px)] font-bold uppercase leading-tight">Akses Ditolak</div>
            <div className="mt-3 text-[clamp(18px,4.2vw,30px)] font-medium leading-snug">{rejection}</div>
            <button onClick={() => setRejection(null)} className="mt-8 min-h-[72px] w-full rounded-xl bg-brand text-[clamp(20px,4.5vw,28px)] font-bold text-white active:bg-brand-dark fx:h-[88px] fx:text-[28px]">Tutup</button>
          </div>
        </div>
      )}
    </>
  );

  const stageCls = "relative min-h-dvh bg-paper pb-[env(safe-area-inset-bottom)] fx:absolute fx:flex fx:h-[1200px] fx:min-h-0 fx:w-[1920px] fx:origin-top-left fx:flex-col fx:overflow-hidden fx:bg-transparent fx:pb-0";

  return (
    <div
      className={view.fixed ? "fx-root fixed inset-0 overflow-hidden" : ""}
      style={{
        visibility: view.ready ? "visible" : "hidden",
        // Gradasi header diperluas ke seluruh lebar layar agar tidak ada pita di kiri-kanan.
        ...(view.fixed && {
          background: `linear-gradient(180deg,#F5391C ${view.y}px,#FFFFFF ${view.y + 360 * view.scale}px,#ECEEF8 ${view.y + 360 * view.scale}px)`,
        }),
      }}
    >
      <Defs />
      {view.fixed ? (
        <div className={stageCls} style={{ transform: `scale(${view.scale})`, left: view.x, top: view.y }}>{content}</div>
      ) : (
        <div className={stageCls}>{content}</div>
      )}
      {modal}
    </div>
  );
}
