"use client";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

/* Membaca QR Code dari kamera (jsQR). Butuh HTTPS atau localhost. */
export default function ScanCamera({ onResult, paused }: { onResult: (text: string) => void; paused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onResult);
  const pausedRef = useRef(paused);
  const last = useRef({ t: "", at: 0 });
  const [error, setError] = useState<string | null>(null);
  cb.current = onResult;
  pausedRef.current = paused;

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let stop = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (stop) { stream.getTracks().forEach((t) => t.stop()); return; }
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play();
        const c = canvasRef.current!;
        const ctx = c.getContext("2d", { willReadFrequently: true })!;
        const tick = () => {
          if (stop) return;
          if (!pausedRef.current && v.readyState === v.HAVE_ENOUGH_DATA && v.videoWidth) {
            const s = Math.min(1, 640 / v.videoWidth);
            c.width = v.videoWidth * s;
            c.height = v.videoHeight * s;
            ctx.drawImage(v, 0, 0, c.width, c.height);
            const img = ctx.getImageData(0, 0, c.width, c.height);
            const r = jsQR(img.data, img.width, img.height);
            if (r && r.data) {
              const now = Date.now();
              // Kode yang sama dan masih terlihat tidak dikirim ulang.
              if (r.data !== last.current.t || now - last.current.at > 3000) cb.current(r.data);
              last.current = { t: r.data, at: now };
            }
          }
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setError("Kamera tidak dapat diakses. Izinkan akses kamera, atau gunakan pemindai QR eksternal.");
      }
    })();
    return () => { stop = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  return (
    <>
      <video ref={videoRef} muted playsInline className="absolute inset-0 size-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      {error && <p className="absolute inset-0 flex items-center justify-center bg-surface p-6 text-center text-lg font-medium text-danger">{error}</p>}
    </>
  );
}
