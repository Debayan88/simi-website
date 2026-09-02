const ITEMS = [
  "Terracotta & Sand",
  "Paddy Walks",
  "Lantern Nights",
  "Clay-Pot Dining",
  "Open Verandahs",
  "Village Doodle Art",
  "Mangalore Tile Roofs",
];

export const Marquee = () => (
  <div className="overflow-hidden bg-earth border-y border-terra/30 py-5 select-none" data-testid="editorial-marquee">
    <div className="marquee-track flex items-center gap-14 whitespace-nowrap">
      {[...ITEMS, ...ITEMS].map((t, i) => (
        <span key={i} className="flex items-center gap-14">
          <span className="font-serif italic text-2xl sm:text-3xl text-sand">{t}</span>
          <span className="text-terra text-xl">✦</span>
        </span>
      ))}
    </div>
  </div>
);
