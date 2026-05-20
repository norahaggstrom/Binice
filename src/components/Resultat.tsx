import smallWave from "../assets/small-herowave.png";
import pluginVideo from "../assets/pluginvideo.mp4";
import demoVideo from "../assets/demovideo.mp4";
import Footer from "./Footer";

export default function Resultat() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-ink">
      {/* ========== HEADER + RUBRIK ========== */}
      <section className="relative min-h-[26vw] overflow-hidden">
        {/* Mindre våg överst (samma som övriga sidor) */}
        <img
          src={smallWave}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
        />

        <div className="relative z-10">
          {/* "Resultat" centrerat under nav (header kommer från Layout) */}
          <div className="px-6 pb-12 pt-24 text-center md:pt-28">
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              Resultat
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
              En sammanfattning av vad projektet ledde fram till.
            </p>
          </div>
        </div>
      </section>

      {/* ========== DEMOVIDEO ========== */}
      <section className="px-6 pb-24 pt-4 md:pt-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 font-display text-2xl text-ink md:text-3xl">
            Demo av reflektionsflödet
          </h2>
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10">
            <video
              src={demoVideo}
              controls
              playsInline
              preload="metadata"
              className="block w-full"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-[#dbe9dc] px-3 py-0.5 text-xs font-semibold text-ink ring-1 ring-ink/15">
                Vad blev bra
              </span>
              <p className="mt-3 text-base leading-relaxed text-ink/85">
                Låg tröskel. Vem som helst kan testa flödet direkt i
                webbläsaren utan installation eller egen API-nyckel.
              </p>
            </div>
            <div>
              <span className="inline-block rounded-full bg-clay/15 px-3 py-0.5 text-xs font-semibold text-[#AA5620] ring-1 ring-clay/30">
                Vad kan förbättras
              </span>
              <p className="mt-3 text-base leading-relaxed text-ink/85">
                Demon använder inte den riktiga AI:n, eftersom API-anrop hade
                medfört en kostnad per test. Den simulerar därför flödet
                snarare än att köra det skarpt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PLUGINVIDEO + TEXT ========== */}
      <section className="px-6 pb-24 pt-8 md:pt-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 md:grid-cols-2 lg:gap-16">
          {/* Video till vänster */}
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10">
            <video
              src={pluginVideo}
              controls
              playsInline
              preload="metadata"
              className="block w-full"
            />
          </div>

          {/* Bra / förbättras till höger */}
          <div>
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Binice som Facebook-plugin
            </h2>

            <div className="mt-5">
              <span className="inline-block rounded-full bg-[#dbe9dc] px-3 py-0.5 text-xs font-semibold text-ink ring-1 ring-ink/15">
                Vad blev bra
              </span>
              <p className="mt-3 text-base leading-relaxed text-ink/85">
                Möjligheten att testa skarpt gav en tydligare upplevelse av
                ett fungerande verktyg.
              </p>
            </div>

            <div className="mt-6">
              <span className="inline-block rounded-full bg-clay/15 px-3 py-0.5 text-xs font-semibold text-[#AA5620] ring-1 ring-clay/30">
                Vad kan förbättras
              </span>
              <p className="mt-3 text-base leading-relaxed text-ink/85">
                Hög tröskel för verklig användning. Att varje användare
                behöver en egen API-nyckel och installera tillägget manuellt
                gör lösningen svårare att testa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GENERELLT ========== */}
      <section className="px-6 pb-24 pt-8 md:pt-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            Generellt
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-[#dbe9dc] px-3 py-0.5 text-xs font-semibold text-ink ring-1 ring-ink/15">
                Vad blev bra
              </span>
              <ul className="mt-4 space-y-3">
                {[
                  "Friktion som designgrepp fungerade. Användartesterna ledde fram till en nivå som skapar en paus utan att kännas bestraffande, i linje med tanken om icke-kontrollerande design.",
                  "Designbesluten är förankrade. Färgval och interaktionstekniker motiveras av både teori och användares upplevelser.",
                  "Tonanalysen utvecklades systematiskt. Prompten itererades från vag formulering till tydliga kriterier som hanterar både blandade kommentarer och nedvärdering av åsikt, inte bara direkta personangrepp.",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex gap-3 text-base leading-relaxed text-ink/85"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="inline-block rounded-full bg-clay/15 px-3 py-0.5 text-xs font-semibold text-[#AA5620] ring-1 ring-clay/30">
                Vad kan förbättras
              </span>
              <ul className="mt-4 space-y-3">
                {[
                  "Tonanalys utan kontext är fortfarande svår. Sarkasm, ironi och citat skiljs inte säkert från genuina angrepp, och det bredare kriteriet ger fler falska positiva. Det är en grundläggande begränsning.",
                  "Endast desktop. En medveten avvägning för att prioritera kvalitet på befintliga delar, men en begränsning.",
                  "Långsiktig effekt är inte mätt. Användare kan vänja sig och klicka förbi reflektionen över tid.",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex gap-3 text-base leading-relaxed text-ink/85"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}
