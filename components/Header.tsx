import { SUBTITLE } from "@/lib/data";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="relative bg-gradient-to-b from-header-red to-white px-4 pb-7 pt-[max(env(safe-area-inset-top),16px)] text-center fx:h-[360px] fx:shrink-0 fx:bg-none fx:p-0">
      <Logo className="mx-auto mb-2 mt-[18px] fx:absolute fx:left-[912px] fx:top-6 fx:m-0" />
      <h1 className="text-[clamp(30px,8vw,56px)] font-bold uppercase leading-[1.1] fx:absolute fx:inset-x-0 fx:top-32 fx:text-[56px]">
        Surat Suara
      </h1>
      <p className="mt-2.5 text-[clamp(12px,3vw,22px)] font-bold leading-[1.35] fx:absolute fx:inset-x-0 fx:top-[204px] fx:m-0 fx:text-[22px]">
        {SUBTITLE.map((l) => (<span key={l}>{l}<br /></span>))}
      </p>
    </header>
  );
}
