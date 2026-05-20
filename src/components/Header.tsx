import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const NAV = [
  { label: "Hem", to: "/" },
  { label: "Om Binice", to: "/om" },
  { label: "Process", to: "/process" },
  { label: "Resultat", to: "/resultat" },
  { label: "Ladda ned", to: "/ladda-ned" },
];

export default function Header() {
  const { pathname } = useLocation();
  const activeIndex = Math.max(
    0,
    NAV.findIndex((n) => n.to === pathname)
  );

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [pill, setPill] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Mobilmeny
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Mät aktiv flik och låt den orangea indikatorn glida dit
  useLayoutEffect(() => {
    function measure() {
      const el = itemRefs.current[activeIndex];
      const list = listRef.current;
      if (!el || !list) return;
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <header className="relative flex items-center justify-between px-6 md:px-16 pt-6">
      {/* Logga, fäller ut till "Binice" vid hover */}
      <Link to="/" className="group inline-flex">
        <span className="flex h-16 w-16 items-center justify-start overflow-hidden rounded-full bg-ink pl-1 pr-0 transition-all duration-300 ease-out group-hover:w-[8.5rem] group-hover:pr-0">
          <img
            src={logo}
            alt="Binice"
            className="h-[3.5rem] w-[3.5rem] shrink-0 -translate-x-[2px] object-contain transition-transform duration-300 ease-out group-hover:rotate-90"
          />
          <span className="-ml-1 whitespace-nowrap font-brand text-4xl leading-none text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            inice
          </span>
        </span>
      </Link>

      {/* Nav med glidande orange indikator */}
      <nav className="hidden md:block absolute left-1/2 top-14 -translate-x-1/2 -translate-y-1/2">
        <ul
          ref={listRef}
          className="relative flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 shadow-sm backdrop-blur-sm"
        >
          {/* Reglaget */}
          <span
            aria-hidden
            className="absolute top-1 bottom-1 rounded-full bg-clay shadow transition-all duration-300 ease-out"
            style={{ left: pill.left, width: pill.width }}
          />
          {NAV.map((item, i) => {
            const active = i === activeIndex;
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={[
                    "relative z-10 inline-block rounded-full px-5 py-1.5 text-sm transition-colors duration-300",
                    active ? "text-white" : "text-muted hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobil: hamburgerknapp */}
      <button
        type="button"
        aria-label={open ? "Stäng meny" : "Öppna meny"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur-sm md:hidden"
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {/* Mobil: utfällbar meny */}
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default md:hidden"
          />
          <nav className="absolute right-6 top-20 z-50 w-56 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-ink/10 md:hidden">
            <ul className="flex flex-col">
              {NAV.map((item, i) => {
                const active = i === activeIndex;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={[
                        "block rounded-xl px-4 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-clay text-white"
                          : "text-muted hover:bg-sage/50 hover:text-ink",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
