"use client";
import { useEffect, useState } from "react";

/* Foto 2:3, object-fit: cover, tanpa distorsi. Jika gambar gagal dimuat, tampil siluet placeholder. */
export default function Photo({ url, punched, className = "" }: { url?: string; punched?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  const fill = "absolute inset-0 block size-full object-cover";
  return (
    <div className={`relative aspect-[2/3] overflow-hidden bg-photo fx:aspect-auto fx:h-[420px] fx:w-[280px] ${className}`}>
      {url && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" draggable={false} onError={() => setFailed(true)} className={fill} />
      ) : (
        <svg viewBox="0 0 280 420" preserveAspectRatio="xMidYMid slice" className={fill}><use href="#sil" /></svg>
      )}
      {punched && (
        <svg viewBox="0 0 100 100" className="absolute left-1/2 top-[60%] aspect-square w-[32%] -translate-x-1/2 -translate-y-1/2 animate-pop fx:w-[90px]">
          <use href="#hole" />
        </svg>
      )}
    </div>
  );
}
