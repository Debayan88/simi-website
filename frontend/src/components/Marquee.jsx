import { useLang } from "../i18n";

export const Marquee = () => {
  const { t } = useLang();
  const items = t("marquee");
  return (
    <div className="overflow-hidden bg-earth border-y border-terra/30 py-5 select-none" data-testid="editorial-marquee">
      <div className="marquee-track flex items-center gap-14 whitespace-nowrap">
        {[...items, ...items].map((txt, i) => (
          <span key={i} className="flex items-center gap-14">
            <span className="font-serif italic text-2xl sm:text-3xl text-sand">{txt}</span>
            <span className="text-terra text-xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
