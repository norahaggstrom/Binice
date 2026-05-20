import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-ink py-20 text-white">
      <div className="flex flex-col items-center justify-center">
        <Link
          to="/"
          aria-label="Till startsidan"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex -translate-x-[6px] items-center justify-center transition-opacity duration-200 hover:opacity-80"
        >
          <img
            src={logo}
            alt="Binice"
            className="h-20 w-20 rotate-90 object-contain opacity-95 brightness-0 invert"
          />
          <span className="-ml-2 font-brand text-5xl">inice</span>
        </Link>
        <p className="mt-4 text-sm uppercase tracking-wide text-white/70">
          Designprojekt 2026
        </p>
      </div>
    </footer>
  );
}
