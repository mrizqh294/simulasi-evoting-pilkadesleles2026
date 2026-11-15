"use client";
import { useState } from "react";
import { LOGO_URL } from "@/lib/data";

const SIZE = "block size-[clamp(56px,14vw,96px)] fx:size-24";

/* Logo kustom dari LOGO_URL; jika gagal dimuat, tampil lambang placeholder. */
export default function Logo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <svg viewBox="0 0 96 96" className={`${SIZE} ${className}`} aria-hidden>
        <use href="#crest" />
      </svg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LOGO_URL} alt="Lambang daerah" draggable={false} onError={() => setFailed(true)} className={`${SIZE} object-contain ${className}`} />
  );
}
