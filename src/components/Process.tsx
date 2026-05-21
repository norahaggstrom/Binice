import { useEffect, useRef, useState } from "react";
import smallWave from "../assets/small-herowave.png";
import Footer from "./Footer";
import web1 from "../assets/web1.png";
import web2 from "../assets/web2.png";
import web3 from "../assets/web3.png";
import web4 from "../assets/web4.png";
import compare1Skiss from "../assets/compare1-skiss.png";
import compare1Idag from "../assets/compare1-idag.png";
import compare2Skiss from "../assets/compare2-skiss.png";
import compare2Idag from "../assets/compare2-idag.png";

const COMPARISONS: {
  title: string;
  before: string;
  after: string;
  caption: string;
}[] = [
  {
    title: "Tvingad paus",
    before: compare2Skiss,
    after: compare2Idag,
    caption:
      "En tvingad paus i ett tidigt prototypstadium utvecklades till ett mindre kontrollerande alternativ efter användartest. Användarna upplevde den tvingade pausen som bestraffande, vilket visade att friktionsnivån var för hög och skapade en känsla av förlorad kontroll. Interventionen omarbetades därför mot ett mindre styrande alternativ, ett beslut som ligger i linje med Binices grundtanke om icke-kontrollerande design.",
  },
  {
    title: "Från överstrykning till understrykning",
    before: compare1Skiss,
    after: compare1Idag,
    caption:
      "Användartesterna visade att den ursprungliga skissens överstrykningar upplevdes som aggressiva och anklagande. Istället valdes understrykningar, som upplevs mjukare. Designgreppet passar bättre eftersom Binice inte ska upplevas som skuldbeläggande.",
  },
];
import flower from "../assets/flower.png";
import flowerBee from "../assets/flowerbee.png";

type Note = {
  type: "Problem" | "Förbättring" | "Kvarstående problem";
  text: string;
};

type PromptStep = {
  label: string;
  prompt: string;
  notes: Note[];
};

const PROMPTS: PromptStep[] = [
  {
    label: "Version 1: Första versionen",
    prompt:
      "Är följande kommentar från en Facebook-diskussion om klimat genuint aggressiv, nedvärderande, hotfull eller starkt polariserande MOT en annan person?\nSvara ENDAST med ett enda ord: JA eller NEJ.",
    notes: [
      {
        type: "Problem",
        text: "Inga kriterier. \"Starkt polariserande\" för vagt, träffade vanliga klimatpåståenden och faktakommentarer.",
      },
    ],
  },
  {
    label: "Version 2: NEJ-lista tillkommer",
    prompt:
      "Är kommentaren genuint aggressiv, nedvärderande eller hotfull MOT en specifik person?\nNEJ om: neutral, positiv, kortfattad, faktapåstående, fråga, oenig men respektfull.",
    notes: [
      {
        type: "Problem",
        text: "NEJ-listan täckte uppenbara fall men JA-tröskeln var oklar. Missade sarkasm och indirekta angrepp.",
      },
    ],
  },
  {
    label: "Version 3: Dubbla kriterielistor",
    prompt:
      "Är kommentaren genuint aggressiv, nedvärderande eller hotfull MOT en specifik person?\nNEJ för: neutral, positiv, kortfattad, faktapåstående, fråga, oenig men respektfull.\nJA för: direkta personangrepp, hot, starkt nedsättande språk, sarkasm som syftar till att såra.",
    notes: [
      {
        type: "Problem",
        text: "\"Starkt nedsättande språk\" tolkades brett och positiva kommentarer flaggades ibland fel.",
      },
    ],
  },
  {
    label: "Version 4: Striktare kriterier",
    prompt:
      "Är kommentaren ett direkt personangrepp, innehåller hot, grovt nedsättande språk eller sarkasm som syftar till att aktivt förödmjuka en person?\nNEJ för: positiv, neutral, oenig men artig, fakta, fråga, kort svar, beröm, uppmuntran.\nJA BARA för: direkta skällsord, hot, uttalad fientlighet mot personen.",
    notes: [
      {
        type: "Problem",
        text: "Pendlade för långt åt andra hållet. Blandade kommentarer som \"du är vacker och snäll och dum i huvudet\" triggade inte trots det direkta personangreppet.",
      },
    ],
  },
  {
    label: "Version 5: Hanterar blandade kommentarer explicit",
    prompt:
      "Är kommentaren genuint aggressiv, nedvärderande eller hotfull MOT en specifik person?\nNEJ för: neutral, positiv, kortfattad, faktapåstående, fråga, oenig men respektfull, beröm, uppmuntran. Blandade kommentarer som innehåller både beröm OCH mild kritik ger NEJ.\nJA för: direkta personangrepp eller skällsord (t.ex. idiot, dum i huvudet, skäms), hot, uttalad fientlighet. Även om kommentaren innehåller något positivt, om den även innehåller ett direkt personangrepp ger det JA.",
    notes: [
      {
        type: "Problem",
        text: "För snävt scopad mot personangrepp, missade nedvärdering av åsikt/bidrag.",
      },
    ],
  },
  {
    label: "Version 6: Nuvarande",
    prompt:
      "Är kommentaren aggressiv, nedvärderande, hånfull eller hotfull mot en person eller mot det personen säger, tycker eller bidrar med?\nNEJ för: neutral, positiv, kortfattad, faktapåstående, fråga, oenig men respektfull, beröm, uppmuntran. Saklig kritik av ett argument utan nedlåtande ton ger NEJ. Blandade kommentarer med beröm OCH mild kritik ger NEJ.\nJA för: direkta personangrepp eller skällsord (t.ex. idiot, dum i huvudet, skäms), hot, uttalad fientlighet, samt nedlåtande eller föraktfulla omdömen om personens åsikt, intelligens eller bidrag (t.ex. idiotisk åsikt, dumt sagt, fattar du ingenting). Även om kommentaren innehåller något positivt: om den även innehåller ett angrepp ger det JA.",
    notes: [
      {
        type: "Förbättring",
        text: "Utvidgar scopet från att inte bara riktas mot en specifik person till att även triggas av nedvärdering av åsikt eller bidrag, samtidigt som saklig kritik utan nedlåtande ton uttryckligen ger NEJ.",
      },
      {
        type: "Kvarstående problem",
        text: "Det bredare JA-kriteriet ger fler falska positiva, ibland flaggas skarp men saklig kritik. Tonanalys av text utan kontext förblir grundläggande svår: citat, ironi och sarkasm är fortfarande svåra att skilja från genuina angrepp, eftersom samma ord kan vara både ett skämt och en förolämpning beroende på sammanhang och relation.",
      },
    ],
  },
];

const SLIDES: {
  src: string;
  alt: string;
  title: string;
  caption: string;
}[] = [
  {
    src: web1,
    alt: "Webbdesign, slutlig design",
    title: "Slutlig design",
    caption:
      "Till en början fanns en idé om att ta fram en mobil-prototyp i Figma. Kvaliteten på befintliga delar sågs dock som viktigare vilket ledde till att detta inte genomfördes. Därför kändes den tidigare iterationen med en telefon missvisande och designen kompletterades med en illustration som bättre passar Binice som varumärke.",
  },
  {
    src: web2,
    alt: "Webbdesign, utveckling av slutligt färgschema",
    title: "Utveckling av slutligt färgschema",
    caption:
      "Det lila färgschemat från den tidigare iterationen valdes bort, dels eftersom lila ofta förknippas med AI-genererad design, dels för att färgen upplevdes som något skarp. Istället valdes ett grönt och blått färgschema som uppfattas som lugnare.",
  },
  {
    src: web3,
    alt: "Webbdesign, look-and-feel-prototyp",
    title: "Look-and-feel-prototyp",
    caption:
      "En prototyp som utforskade olika färgscheman och designelement i syfte att etablera en grafisk identitet.",
  },
  {
    src: web4,
    alt: "Webbdesign, low-fidelity-prototyp",
    title: "Low-fidelity-prototyp",
    caption:
      "En tidig prototyp i Figma som visualiserade sidans olika delar och element samt testade interaktionsflödet.",
  },
];

export default function Process() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  // Hitta vilken bild som är närmast centrerad i den horisontella listan
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    function update() {
      const s = scrollerRef.current;
      if (!s) return;
      const center = s.scrollLeft + s.clientWidth / 2;
      let bestIndex = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const elCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(elCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });
      setActive(bestIndex);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    // Centrera web1 från start
    function centerFirst() {
      const s = scrollerRef.current;
      const first = itemRefs.current[0];
      if (!s || !first) return;
      s.scrollLeft = Math.max(
        0,
        first.offsetLeft + first.offsetWidth / 2 - s.clientWidth / 2
      );
    }
    requestAnimationFrame(() => {
      centerFirst();
      update();
    });

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Klick på en bild centrerar den
  function scrollToIndex(i: number) {
    const s = scrollerRef.current;
    const el = itemRefs.current[i];
    if (!s || !el) return;
    s.scrollTo({
      left: el.offsetLeft + el.offsetWidth / 2 - s.clientWidth / 2,
      behavior: "smooth",
    });
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-ink">
      {/* ========== HEADER + RUBRIK ========== */}
      <section className="relative min-h-[min(26vw,480px)] overflow-hidden">
        <img
          src={smallWave}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full max-h-[480px] select-none object-cover object-bottom"
        />

        <div className="relative z-10">
          <div className="px-6 pb-12 pt-24 text-center md:pt-28">
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              Designprocess
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
              Ett urval av processen, från tidiga skisser och designval till
              hur prompten itererades fram.
            </p>
          </div>
        </div>
      </section>

      {/* ========== UTVECKLING AV HEMSIDAN ========== */}
      <section className="pb-24">
        <div className="px-6 text-center">
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Utveckling av hemsidan
          </h2>
          <p className="mt-3 text-base text-ink/70">
            Svep åt sidan för att se processen
          </p>
        </div>

        {/* Horisontellt bildbibliotek */}
        <div
          ref={scrollerRef}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[calc(50%_-_min(21vw,190px))] pb-4"
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => scrollToIndex(i)}
              className="snap-center shrink-0 cursor-pointer"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className={[
                  "h-[53vw] max-h-[481px] w-auto rounded-2xl shadow-xl ring-1 ring-ink/10 transition-all duration-300",
                  i === active ? "opacity-100" : "opacity-50",
                ].join(" ")}
              />
            </div>
          ))}
        </div>

        {/* Bildtext som byts ut när respektive bild är centrerad */}
        <div className="mx-auto mt-8 max-w-xl px-6 text-center">
          <h3 className="font-display text-xl text-ink md:text-2xl">
            {SLIDES[active].title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-ink/85">
            {SLIDES[active].caption}
          </p>
        </div>
      </section>

      {/* ========== FRÅN SKISS TILL FÄRDIG DESIGN ========== */}
      <section className="relative bg-[#EDF4EF] px-6 pb-24 pt-20">
        {/* Vågig övre kant: S-våg (humpar uppåt och nedåt) */}
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full -translate-y-1/2 md:h-24"
        >
          {/* Grön del som buktar upp över sektionens kant */}
          <path
            d="M0,40 C45,10 135,10 180,40 C225,70 315,70 360,40 C405,10 495,10 540,40 C585,70 675,70 720,40 C765,10 855,10 900,40 C945,70 1035,70 1080,40 C1125,10 1215,10 1260,40 C1305,70 1395,70 1440,40 L1440,80 L0,80 Z"
            fill="#EDF4EF"
          />
          {/* Vit del som biter in i sektionens kant */}
          <path
            d="M0,40 C45,10 135,10 180,40 C225,70 315,70 360,40 C405,10 495,10 540,40 C585,70 675,70 720,40 C765,10 855,10 900,40 C945,70 1035,70 1080,40 C1125,10 1215,10 1260,40 C1305,70 1395,70 1440,40 L1440,0 L0,0 Z"
            fill="#FFFFFF"
          />
        </svg>
        {/* Vågig undre kant: S-våg (humpar uppåt och nedåt) */}
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full translate-y-1/2 md:h-24"
        >
          {/* Grön del som buktar ner under sektionens kant */}
          <path
            d="M0,40 C45,10 135,10 180,40 C225,70 315,70 360,40 C405,10 495,10 540,40 C585,70 675,70 720,40 C765,10 855,10 900,40 C945,70 1035,70 1080,40 C1125,10 1215,10 1260,40 C1305,70 1395,70 1440,40 L1440,0 L0,0 Z"
            fill="#EDF4EF"
          />
          {/* Vit del som biter in i sektionens kant */}
          <path
            d="M0,40 C45,10 135,10 180,40 C225,70 315,70 360,40 C405,10 495,10 540,40 C585,70 675,70 720,40 C765,10 855,10 900,40 C945,70 1035,70 1080,40 C1125,10 1215,10 1260,40 C1305,70 1395,70 1440,40 L1440,80 L0,80 Z"
            fill="#FFFFFF"
          />
        </svg>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Från skiss till färdig design
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/70">
            Två exempel på hur tidiga skisser och designinterventioner
            utvecklades till dagens lösning.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl space-y-32">
          {COMPARISONS.map((c, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={c.title}
                className={[
                  "grid grid-cols-1 items-center gap-10 md:gap-12",
                  reverse
                    ? "md:grid-cols-[3fr_2fr]"
                    : "md:grid-cols-[2fr_3fr]",
                ].join(" ")}
              >
                {/* Text */}
                <div className={reverse ? "md:order-2" : ""}>
                  <h3 className="font-display text-xl text-ink md:text-2xl">
                    {c.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    <li className="flex gap-3 text-base leading-relaxed text-ink/85">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                      />
                      <span>{c.caption}</span>
                    </li>
                  </ul>
                </div>

                {/* Bilder stackade, lätt asymmetriskt; speglas på varannan */}
                <div
                  className={[
                    "flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center md:gap-8",
                    reverse ? "md:order-1" : "",
                  ].join(" ")}
                >
                  <figure
                    className={[
                      "bg-white p-3 pb-4 shadow-xl ring-1 ring-ink/10",
                      reverse ? "rotate-[3deg]" : "-rotate-[3deg]",
                    ].join(" ")}
                  >
                    <img
                      src={c.before}
                      alt={`${c.title}: Tidig skiss`}
                      className="block h-[260px] w-auto object-contain md:h-[320px]"
                    />
                    <figcaption className="mt-3 text-center font-display text-sm text-ink">
                      Tidig skiss
                    </figcaption>
                  </figure>
                  <figure
                    className={[
                      "bg-white p-3 pb-4 shadow-xl ring-1 ring-ink/10 md:-translate-y-6",
                      reverse ? "-rotate-[2deg]" : "rotate-[2deg]",
                    ].join(" ")}
                  >
                    <img
                      src={c.after}
                      alt={`${c.title}: Idag`}
                      className="block h-[260px] w-auto object-contain md:h-[320px]"
                    />
                    <figcaption className="mt-3 text-center font-display text-sm text-ink">
                      Idag
                    </figcaption>
                  </figure>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== TIDSLINJE: PROMPT-PROGRESSION ========== */}
      <section className="px-6 pb-24 pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Utveckling av toxicitetsskanningen
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/70">
            Prompten som avgör när Binice aktiveras itererades i sex steg,
            från vag formulering till tydliga kriterier.
          </p>
        </div>

        <ol className="relative mx-auto mt-20 max-w-3xl">
          {PROMPTS.map((step, i) => (
            <li key={step.label} className="relative pb-12 pl-20">
              {/* Linje till nästa nod (ej efter sista blomman) */}
              {i < PROMPTS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-7 top-0 w-px -translate-x-1/2 bg-ink/15"
                />
              )}
              {/* Blom-nod (sista steget får ett större flowerbee = "du är här") */}
              <span
                className={
                  "absolute left-7 top-0 flex -translate-x-1/2 items-center justify-center rounded-full bg-white " +
                  (i === PROMPTS.length - 1 ? "h-20 w-20" : "h-14 w-14")
                }
              >
                <img
                  src={i === PROMPTS.length - 1 ? flowerBee : flower}
                  alt=""
                  aria-hidden
                  className={
                    "object-contain " +
                    (i === PROMPTS.length - 1 ? "h-16 w-16" : "h-12 w-12")
                  }
                />
              </span>

              <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/10">
                <h3 className="font-display text-xl text-ink">
                  {step.label}
                </h3>
                <p className="mt-3 whitespace-pre-line border-l-4 border-ink/15 bg-ink/[0.03] px-4 py-3 text-sm leading-relaxed text-ink/80">
                  {step.prompt}
                </p>
                <div className="mt-4 space-y-4">
                  {step.notes.map((n, ni) => (
                    <div key={ni}>
                      <span
                        className={
                          "inline-block rounded-full px-3 py-0.5 text-xs font-semibold ring-1 " +
                          (n.type === "Förbättring"
                            ? "bg-[#dbe9dc] text-ink ring-ink/15"
                            : "bg-clay/15 text-[#AA5620] ring-clay/30")
                        }
                      >
                        {n.type}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-ink/80">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}

          {/* Padlet-länk */}
          <li className="relative pl-20">
            <a
              href="https://padlet.com/hkr5/adaptiva-granssnitt-i-digitala-konflikter-nz3b47lox0583lni"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-sage p-6 text-center ring-1 ring-ink/10 transition-colors duration-300 ease-out hover:bg-[#c7dbc9]"
            >
              <h3 className="font-display text-2xl text-ink">
                Se hela processen på Padlet
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-ink/75">
                Allt bakgrundsmaterial, skisser och beslut finns samlat på
                projektets Padlet.
              </p>
            </a>
          </li>
        </ol>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}
