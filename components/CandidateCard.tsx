import Photo from "./Photo";

type Props = { number: number; name: string; photoUrl?: string; selected: boolean; onPress: () => void };

export default function CandidateCard({ number, name, photoUrl, selected, onPress }: Props) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={selected}
      className={`flex flex-col rounded-[4px] border-2 bg-surface px-3 pb-3 pt-2 text-center fx:h-[580px] fx:w-[320px] fx:shrink-0 fx:px-5 ${
        selected ? "border-sel shadow-[inset_0_0_0_2px_var(--color-sel)]" : "border-card-border"
      }`}
    >
      <span className="h-11 text-[26px] font-medium leading-[38px] fx:h-12 fx:text-[28px] fx:leading-10">{number}</span>
      <Photo url={photoUrl} punched={selected} className="w-full" />
      <span className="flex min-h-16 items-center justify-center pt-1.5 text-[clamp(14px,3.4vw,22px)] font-bold uppercase leading-tight fx:h-[88px] fx:min-h-0 fx:text-[22px]">
        {name}
      </span>
    </button>
  );
}
