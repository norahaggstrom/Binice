import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-ink py-20 text-white">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Binice"
            className="h-20 w-20 rotate-90 object-contain opacity-95 brightness-0 invert"
          />
          <span className="-ml-2 font-brand text-5xl">inice</span>
        </div>
        <p className="mt-4 text-sm uppercase tracking-wide text-white/70">
          Designprojekt 2026
        </p>
      </div>
    </footer>
  );
}
