import smallWave from "../assets/small-herowave.png";
import Footer from "./Footer";

const CARDS: {
  title: string;
  body: string;
  bg: string;
  title2: string;
  text: string;
}[] = [
  {
    title: "Problemet",
    body: "Klimatdebatter på Facebook mellan bekanta kan snabbt eskalera. Emotionella reaktioner får konsekvenser för relationer, men plattformens design uppmuntrar impulsiva svar.",
    bg: "bg-clay",
    title2: "text-white",
    text: "text-white/90",
  },
  {
    title: "Lösningen",
    body: "Binice skapar friktion och reflektion genom slow interaction-design. Hon guidar användaren genom ett flöde som ger dem chansen att tänka efter, utan att censurera.",
    bg: "bg-sage",
    title2: "text-ink",
    text: "text-ink/80",
  },
  {
    title: "Teorin bakom",
    body: "Projektet bygger på forskning om slow interaction-design, affekt-adaptiva gränssnitt och reflective design. Friktion som designgrepp för att främja reflektion.",
    bg: "bg-[#7d94a4]",
    title2: "text-white",
    text: "text-white/90",
  },
  {
    title: "Målgruppen",
    body: "Personer på Facebook som diskuterar klimat med bekanta, alltså människor med en befintlig relation, där emotionella reaktioner kan skada relationen.",
    bg: "bg-[#fce3d2]",
    title2: "text-ink",
    text: "text-ink/80",
  },
  {
    title: "Binice",
    body: 'Karaktären som guidar användaren. Namnet bygger på "be nice" plus ett bi. Designad för att vara varm och icke-dömande.',
    bg: "bg-ink",
    title2: "text-white",
    text: "text-white/90",
  },
];

export default function OmBinice() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-ink">
      {/* ========== HEADER + RUBRIK ========== */}
      <section className="relative min-h-[26vw] overflow-hidden">
        {/* Mindre våg överst (egen för Om-sidan) */}
        <img
          src={smallWave}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
        />

        <div className="relative z-10">
          {/* "Om Binice" centrerat under nav (header kommer från Layout) */}
          <div className="px-6 pb-12 pt-24 text-center md:pt-28">
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              Om Binice
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
              Ett designprojekt om hur design kan stödja reflektion i
              emotionellt laddade digitala miljöer.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FÄLT (Problem, Lösning, Teori, Målgrupp, Binice) ===== */}
      <section className="px-6 pb-24 pt-4 md:pt-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-12">
          {CARDS.map((card) => {
            const place: Record<string, string> = {
              Problemet: "md:col-start-1 md:col-span-6 md:row-start-1",
              "Teorin bakom": "md:col-start-1 md:col-span-6 md:row-start-2",
              Målgruppen: "md:col-start-1 md:col-span-7 md:row-start-3",
              Lösningen:
                "md:col-start-7 md:col-span-6 md:row-start-1 md:row-span-2",
              Binice: "md:col-start-8 md:col-span-5 md:row-start-3",
            };
            return (
              <div
                key={card.title}
                className={`rounded-3xl p-8 ${card.bg} ${place[card.title] ?? ""}`}
              >
                <h2
                  className={`font-display text-2xl md:text-3xl ${card.title2}`}
                >
                  {card.title}
                </h2>
                <p className={`mt-3 text-base leading-relaxed ${card.text}`}>
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}
