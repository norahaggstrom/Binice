import smallWave from "../assets/small-herowave.png";
import facebookGirl from "../assets/facebookgirl.png";
import Footer from "./Footer";

const POINTS: string[] = [
  "För att testa Binice behöver du en egen API-nyckel från Anthropic. Nyckeln sparas bara lokalt i din webbläsare.",
];

export default function LaddaNed() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-ink">
      {/* ========== HEADER + RUBRIK ========== */}
      <section className="relative min-h-[26vw] overflow-hidden">
        <img
          src={smallWave}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
        />

        <div className="relative z-10">
          <div className="px-6 pb-12 pt-24 text-center md:pt-28">
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              Testa Binice
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
              Installera plugin-et i Chrome för att använda Binice skarpt på
              Facebook.
            </p>
          </div>
        </div>
      </section>

      {/* ========== NEDLADDNING + INNAN DU BÖRJAR ========== */}
      <section className="px-6 pb-20 pt-4 md:pt-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Klickbart nedladdningskort */}
          {/* TODO: byt href till riktig nedladdningslänk (ZIP, GitHub
              eller Chrome Web Store) när den finns */}
          <a
            href="#"
            className="group block overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-ink/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Övre grön del med illustration */}
            <div className="bg-sage">
              <img
                src={facebookGirl}
                alt="Illustration av en person som använder Facebook"
                className="block w-full select-none object-cover"
              />
            </div>
            {/* Nedre vit del med text */}
            <div className="px-8 py-8 text-center">
              <h2 className="font-display text-2xl text-ink md:text-3xl">
                Ladda ned pluginet här
              </h2>
              <p className="mt-2 text-base text-ink/70">
                Klicka här för att ladda ned en zip-fil
              </p>
            </div>
          </a>

          {/* Innan du börjar */}
          <div>
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Innan du börjar
            </h2>

            <ul className="mt-6 space-y-3">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-base leading-relaxed text-ink/85"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                  />
                  <span>{point}</span>
                </li>
              ))}
              <li className="flex gap-3 text-base leading-relaxed text-ink/85">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                />
                <span>
                  Fullständiga steg för steg-instruktioner följer med
                  nedladdningen i filen{" "}
                  <span className="font-semibold text-ink">
                    INSTALLATION.txt
                  </span>
                  .
                </span>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl bg-clay/10 p-6 ring-1 ring-clay/30">
              <p className="text-base leading-relaxed text-ink/85">
                Till skillnad från demon på startsidan, som är en simulerad
                förhandsvisning, använder det nedladdade tillägget riktig AI
                och fungerar skarpt i kommentarsfälten på Facebook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VIDEODEMONSTRATION ========== */}
      <section className="px-6 pb-24 pt-6 md:pt-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            Svårt att testa? Se en videodemonstration
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/80">
            Här ser du hela flödet med Binice i ett riktigt kommentarsfält.
          </p>
          <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/JQyqze6ItIU"
              title="Videodemonstration av Binice"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}
