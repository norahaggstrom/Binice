import logo from "../assets/logo.png";
import smallWave from "../assets/small-herowave.png";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-ink">
      {/* ========== HEADER + RUBRIK ========== */}
      <section className="relative overflow-hidden">
        {/* Samma mindre våg som Om-sidan */}
        <img
          src={smallWave}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
        />

        <div className="relative z-10">
          {/* Rubrik centrerad under nav (header kommer från Layout) */}
          <div className="px-6 pb-24 pt-24 text-center md:pb-32 md:pt-28">
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
              Den här sidan är på gång.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-ink py-20 text-white">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Binice"
            className="h-20 w-20 rotate-90 object-contain opacity-95 brightness-0 invert"
          />
          <span className="-ml-2 font-brand text-5xl">inice</span>
        </div>
      </footer>
    </div>
  );
}
