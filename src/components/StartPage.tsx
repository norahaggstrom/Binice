import flowerGirl from "../assets/flowergirl.png";
import arrow from "../assets/arrow.png";
import heroBg from "../assets/hero-bg.png";
import { Link } from "react-router-dom";
import BiniceDemo from "./BiniceDemo";
import Footer from "./Footer";

export default function StartPage() {
  return (
    <div className="min-h-screen w-full bg-white text-ink overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* Full hero image, defines the section height, so the whole
            image (including the wave at the bottom) is always visible */}
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="pointer-events-none block w-full h-auto select-none"
        />

        {/* Hero content overlaid on top of the image (header kommer från Layout) */}
        <div className="absolute inset-0 z-10 flex flex-col">
        {/* Hero content */}
        <div className="relative mx-auto w-full max-w-5xl 2xl:max-w-6xl min-[1800px]:max-w-6xl min-[2200px]:max-w-7xl px-6 md:px-12 flex-1 grid grid-cols-1 lg:grid-cols-2 min-[1800px]:grid-cols-[3fr_1fr] gap-8 2xl:gap-16 min-[1800px]:gap-24 min-[2200px]:gap-32 items-start pt-24 md:pt-28 pb-[12vw]">
          {/* Copy */}
          <div className="min-w-0 max-w-sm 2xl:max-w-md min-[1800px]:max-w-2xl min-[2200px]:max-w-4xl lg:justify-self-end lg:-translate-x-6 min-[1800px]:-translate-x-[140px] min-[2200px]:-translate-x-[180px]">
            <h1 className="font-display text-5xl md:text-6xl 2xl:text-7xl min-[1800px]:text-8xl min-[2200px]:text-9xl leading-tight">
              <span className="block text-ink">Tänk</span>
              <span className="block">
                <span className="text-ink">efter </span>
                <span className="text-ink-soft">innan</span>
              </span>
              <span className="block text-ink">du skickar.</span>
            </h1>
            <p className="mt-8 text-lg 2xl:text-xl min-[1800px]:text-2xl min-[2200px]:text-3xl leading-relaxed text-ink/90">
              Binice är ett webbläsar-plugin som skapar en paus i emotionellt
              laddade kommentarsfält. Binice hjälper dig formulera vad du
              egentligen vill säga på ett sätt som respekterar relationen.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#demo"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("demo-card")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-clay text-white text-lg shadow transition-colors duration-300 ease-out hover:bg-[#AA5620]"
              >
                Testa demo
              </a>
              <Link
                to="/ladda-ned"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-ink text-lg shadow transition-colors duration-300 ease-out hover:bg-ink hover:text-white"
              >
                Ladda ned plugin
              </Link>
            </div>
          </div>

          {/* Hero-bild */}
          <div className="relative min-w-0 justify-self-center lg:justify-self-end lg:-translate-y-[152px] lg:translate-x-[168px] 2xl:translate-x-[220px] min-[1800px]:translate-x-[280px] min-[2200px]:translate-x-[340px]">
            <img
              src={flowerGirl}
              alt="Illustration av en person som sitter lugnt med sin telefon, omgiven av blommor"
              className="w-[624px] md:w-[720px] 2xl:w-[820px] min-[1800px]:w-[920px] min-[2200px]:w-[1020px] max-w-none"
            />
          </div>
        </div>

        </div>
      </section>

      {/* ========== TESTA BINICE LIVE ========== */}
      <section
        id="demo"
        className="relative z-20 -mt-8 md:-mt-20 pt-0 pb-32 md:pb-48 px-6 md:px-12 bg-white"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Interaktiv demo */}
          <div id="demo-card">
            <BiniceDemo />
          </div>

          {/* Copy + arrow */}
          <div className="relative pt-4">
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Testa Binice
              <br />
              Live
            </h2>
            <p className="mt-6 text-lg leading-relaxed max-w-sm">
              Skriv en kommentar med skarp ton, t.ex. innehållande dum, idiot,
              värdelös eller skäms, och tryck Enter. Binice aktiveras och
              guidar dig genom reflektionsflödet.
            </p>
            {/* Pilen startar efter "Binice" i rubriken, böjer runt texten
                och pekar mot demon */}
            <img
              src={arrow}
              alt=""
              aria-hidden
              className="pointer-events-none absolute top-0 -left-20 hidden lg:block w-[680px] max-w-none opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}
