import { useState, useRef, useEffect, useCallback } from "react";
import bee from "../assets/binice.png";
import toneFactual from "../assets/tone-factual.png";
import toneFriendly from "../assets/tone-friendly.png";
import toneInformative from "../assets/tone-informative.png";
import toneQuestion from "../assets/tone-question.png";
import "./BiniceDemo.css";

/* ---------------------------------------------------------------------------
   Interaktiv Binice-demo.

   Återskapar reflektionsflödet från Chrome-pluginet (content.js) men utan
   API-anrop, en publik webbsida kan inte använda en hemlig API-nyckel.
   Därför används en lokal heuristik för att upptäcka tonläge och färdiga
   (canned) formuleringar istället för Claude. Stegen och beteendet är annars
   identiska med det riktiga pluginet.
--------------------------------------------------------------------------- */

type Screen =
  | "idle"
  | "step2"
  | "sendConfirm"
  | "step3loading"
  | "step3"
  | "step4"
  | "step5"
  | "writeSelf"
  | "unchanged"
  | "binice"
  | "sugLoading"
  | "suggestion"
  | "tone"
  | "publish"
  | "done";

type Tone = "saklig" | "vanlig" | "informativ" | "fraga";

interface PostedComment {
  name: string;
  text: string;
  avatar: "orange" | "peach" | "ink";
}

const TONE_LABELS: Record<Tone, string> = {
  saklig: "Saklig",
  vanlig: "Vänlig",
  informativ: "Informativ",
  fraga: "Frågande",
};

const TONE_IMAGES: Record<Tone, string> = {
  saklig: toneFactual,
  vanlig: toneFriendly,
  informativ: toneInformative,
  fraga: toneQuestion,
};

// Ord som triggar reflektionsflödet (motsvarar API-checken i pluginet)
const AGGRESSIVE_WORDS = [
  "idiot", "idioter", "dum", "dumma", "korkad", "korkade", "skäms", "skam",
  "hatar", "hata", "äckel", "äcklig", "töntig", "tönt", "pucko", "efterbliven",
  "värdelös", "jävla", "jävlar", "helvete", "skitstövel", "knäppgök", "fjant",
  "klantig", "vakna", "patetisk", "pinsam", "håll käften", "fattar du inte",
];

function isAggressive(text: string): boolean {
  const t = text.toLowerCase();
  if (AGGRESSIVE_WORDS.some((w) => t.includes(w))) return true;
  // ALL CAPS-skrik i en längre kommentar
  const letters = text.replace(/[^A-Za-zÅÄÖåäö]/g, "");
  if (letters.length > 12 && letters === letters.toUpperCase()) return true;
  return false;
}

function highlightComment(text: string): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  let html = esc(text);
  AGGRESSIVE_WORDS.forEach((w) => {
    const re = new RegExp(`(${w})`, "gi");
    html = html.replace(
      re,
      '<span class="reflekt-underline-high">$1</span>'
    );
  });
  return html;
}

/*
  I det riktiga pluginet skickas din intention till Claude som skriver om
  kommentaren konstruktivt. Demon kan inte anropa API:t, så istället visas
  färdiga konstruktiva exempel som håller sig till ämnet i inlägget
  (vindkraft / elpriser / klimat), oavsett vad du skrev. På så sätt blir
  förslaget aldrig ett personangrepp, utan ett sakligt svar i ämnet.
*/
function makeSuggestion(_intention: string, tone: Tone): string {
  switch (tone) {
    case "saklig":
      return "Jag ser det annorlunda. Den mesta forskningen visar att mer vindkraft över tid både sänker elpriserna och minskar utsläppen. Energimyndigheten har en bra sammanställning om du vill läsa mer.";
    case "vanlig":
      return "Jag förstår att höga elpriser känns tungt, det gör de för många. Samtidigt pekar det mesta på att utbyggd vindkraft faktiskt pressar priserna nedåt på sikt. Vill du att jag delar några källor?";
    case "informativ":
      return "Det här är ett ämne med en del missförstånd. Vindkraft påverkar visserligen landskapet lokalt, men bidrar samtidigt till lägre utsläpp och stabilare elpriser. Det finns bra genomgångar hos Energimyndigheten och IVA om du vill fördjupa dig.";
    case "fraga":
      return "Får jag fråga vad du baserar det på? Jag har läst en del som tyder på motsatsen, att vindkraften sänker elpriserna över tid. Kanske kan vi jämföra våra källor?";
  }
}

const STEP_INDEX: Partial<Record<Screen, number>> = {
  step2: 0,
  sendConfirm: 0,
  step3loading: 1,
  step3: 1,
  step4: 2,
  step5: 2,
  writeSelf: 2,
  unchanged: 2,
  binice: 2,
  sugLoading: 3,
  suggestion: 3,
  tone: 3,
  publish: 3,
};

function Steps({ active }: { active: number }) {
  return (
    <div className="reflekt-steps">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="contents">
          {i > 0 && <span className="reflekt-step-line" />}
          <span
            className={
              "reflekt-step-dot " +
              (i < active ? "done" : i === active ? "active" : "")
            }
          />
        </span>
      ))}
    </div>
  );
}

function BiniceHeader() {
  return (
    <div className="reflekt-binice-header">
      <div className="reflekt-bee-avatar" style={{ overflow: "hidden" }}>
        <img
          src={bee}
          alt="Binice"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
      <div>
        <div className="reflekt-binice-name">Binice</div>
        <div className="reflekt-binice-role">Din reflektionsguide</div>
      </div>
    </div>
  );
}

const INITIAL_THREAD: PostedComment[] = [
  {
    name: "Kristian Stadquist",
    text: "Jag håller med dig Nora, det är tufft ekonomiskt",
    avatar: "peach",
  },
];

export default function BiniceDemo() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [, setHistory] = useState<Screen[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [comment, setComment] = useState("");
  const [intention, setIntention] = useState("");
  const [tone, setTone] = useState<Tone>("saklig");
  const [suggestion, setSuggestion] = useState("");
  const [thread, setThread] = useState<PostedComment[]>(INITIAL_THREAD);

  // Redigerbara fält
  const editRef = useRef<HTMLTextAreaElement>(null);
  const intentionRef = useRef<HTMLTextAreaElement>(null);
  const sugRef = useRef<HTMLTextAreaElement>(null);

  const go = useCallback((next: Screen) => {
    setHistory((h) => [...h, next]);
    setScreen(next);
  }, []);

  const close = useCallback(() => {
    setScreen("idle");
    setHistory([]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      const copy = [...h];
      copy.pop();
      const prev = copy[copy.length - 1];
      if (!prev) {
        setScreen("idle");
        return [];
      }
      setScreen(prev);
      return copy;
    });
  }, []);

  const postComment = useCallback(
    (text: string) => {
      setThread((t) => [
        ...t,
        { name: "Du", text, avatar: "ink" },
      ]);
      setInputValue("");
      close();
    },
    [close]
  );

  // Enter i kommentarsfältet → samma logik som pluginets keydown-lyssnare
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = inputValue.trim();
      if (text.length <= 3) return;
      setComment(text);
      setHistory([]);
      setIntention("");
      if (isAggressive(text)) {
        go("step2");
      } else {
        // Inte aggressiv → skickas direkt, precis som pluginet
        postComment(text);
      }
    }
  }

  // Laddningssteg → nästa skärm efter en kort paus
  useEffect(() => {
    if (screen === "step3loading") {
      const id = setTimeout(() => go("step3"), 1300);
      return () => clearTimeout(id);
    }
    if (screen === "sugLoading") {
      const id = setTimeout(() => {
        setSuggestion(makeSuggestion(intention, tone));
        go("suggestion");
      }, 1300);
      return () => clearTimeout(id);
    }
    if (screen === "done") {
      const id = setTimeout(() => postComment(comment), 2600);
      return () => clearTimeout(id);
    }
  }, [screen, intention, tone, comment, go, postComment]);

  const overlayActive = screen !== "idle";
  const stepIdx = STEP_INDEX[screen] ?? 0;

  // Lås sidans scroll medan panelen är öppen (som i pluginet)
  useEffect(() => {
    if (!overlayActive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [overlayActive]);

  return (
    <div className="bd-root">
      {/* ── Facebook-mockup ───────────────────────────────────────────── */}
      <div className="bd-fb-bar">facebook.com/demo</div>
      <div className="bd-fb-body">
        <div className="bd-post-head">
          <div className="bd-avatar orange" />
          <div className="bd-post-name">Nora Häggström</div>
        </div>
        <p className="bd-post-text">
          Jag förstår verkligen inte varför vi ska betala mer i skatt för
          klimatets skull. Vindkraftverken förstör naturen mer än vad de
          hjälper, och elpriserna slår mot vanliga familjer. Det verkar som
          att ingen bryr sig om oss vanliga människor längre.
        </p>
        <hr className="bd-divider" />

        {thread.map((c, idx) => (
          <div className="bd-comment" key={idx}>
            <div className={`bd-avatar ${c.avatar}`} />
            <div className="bd-bubble">
              <div className="bd-bubble-name">{c.name}</div>
              <div className="bd-bubble-text">{c.text}</div>
            </div>
          </div>
        ))}

        <div className="bd-input-row">
          <div className="bd-avatar ink" />
          <input
            className="bd-input"
            type="text"
            placeholder="Skriv en kommentar. Tryck enter för att testa Binice"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onInputKeyDown}
            disabled={overlayActive}
          />
        </div>
      </div>

      {/* ── Reflektionspanel ──────────────────────────────────────────── */}
      {overlayActive && (
        <div className="bd-overlay">
          <div className="bd-panel">
            {screen !== "done" && <Steps active={stepIdx} />}

            {/* STEG 2 */}
            {screen === "step2" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <div className="reflekt-title">
                  Din kommentar har ett starkt tonläge.
                </div>
                <div className="reflekt-comment-box">{comment}</div>
                <div className="reflekt-body">
                  Vill du ta en stund och se hur kommentaren kan uppfattas?
                </div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => go("sendConfirm")}
                  >
                    Nej, skicka nu
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => go("step3loading")}
                  >
                    Ja, visa mig <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* SKICKA-BEKRÄFTELSE */}
            {screen === "sendConfirm" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button
                  className="reflekt-btn-back"
                  onClick={goBack}
                >
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Skicka utan att reflektera?
                </div>
                <div className="reflekt-comment-box">{comment}</div>
                <div className="reflekt-confirm-box">
                  Kom ihåg att kommentaren skickas till någon du känner. Är du
                  säker?
                </div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={goBack}
                  >
                    Tillbaka
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => postComment(comment)}
                  >
                    Ja, skicka ändå
                  </button>
                </div>
              </div>
            )}

            {/* LADDNING → analys */}
            {screen === "step3loading" && (
              <div className="reflekt-content">
                <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
                  <div className="reflekt-bee-loading">
                    <img src={bee} alt="Binice" />
                  </div>
                  <div className="reflekt-loading-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#4A5C68",
                      marginTop: 12,
                    }}
                  >
                    Binice analyserar...
                  </div>
                </div>
              </div>
            )}

            {/* STEG 3 */}
            {screen === "step3" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Tänk på hur din kommentar kan mottas.
                </div>
                <div
                  className="reflekt-comment-box"
                  dangerouslySetInnerHTML={{
                    __html: highlightComment(comment),
                  }}
                />
                <div className="reflekt-nudge">
                  Hur tror du att personen du svarar känner sig när hen läser
                  det här?
                </div>
                <div className="reflekt-body">
                  Vill du skriva om din kommentar?
                </div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => go("step4")}
                  >
                    Nej, fortsätt ändå
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => go("step5")}
                  >
                    Ja, skriv om <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEG 4 */}
            {screen === "step4" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Du skickar kommentaren som den är.
                </div>
                <div className="reflekt-comment-box">{comment}</div>
                <div className="reflekt-confirm-box">
                  Kom ihåg att kommentaren skickas till någon du känner. Är du
                  säker?
                </div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => go("step5")}
                  >
                    Nej, skriv om <span className="reflekt-arrow">→</span>
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => postComment(comment)}
                  >
                    Ja, skicka ändå
                  </button>
                </div>
              </div>
            )}

            {/* STEG 5 */}
            {screen === "step5" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Vill du ha hjälp att skriva om?
                </div>
                <div className="reflekt-comment-box">{comment}</div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => {
                      setComment(comment);
                      go("writeSelf");
                    }}
                  >
                    Nej, jag skriver själv
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => go("binice")}
                  >
                    Ja, hjälp mig <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* SKRIV SJÄLV */}
            {screen === "writeSelf" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">Skriv om din kommentar</div>
                <textarea
                  ref={editRef}
                  className="reflekt-textarea"
                  defaultValue={comment}
                  rows={4}
                />
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => {
                      const t = (editRef.current?.value || "").trim();
                      if (!t) return;
                      if (t === comment) {
                        go("unchanged");
                      } else {
                        setComment(t);
                        go("publish");
                      }
                    }}
                  >
                    Nästa <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* OFÖRÄNDRAT */}
            {screen === "unchanged" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Du har inte ändrat något
                </div>
                <div className="reflekt-comment-box">{comment}</div>
                <div className="reflekt-nudge">
                  Kom ihåg att personen du svarar är någon du känner. Vill du
                  skicka som den är?
                </div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => go("writeSelf")}
                  >
                    ← Försök igen
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-send"
                    onClick={() => postComment(comment)}
                  >
                    Ja, skicka <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* BINICE-HJÄLP */}
            {screen === "binice" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Vad vill du egentligen säga?
                </div>
                <div className="reflekt-body">
                  Berätta vad du vill förmedla med dina egna ord.
                </div>
                <textarea
                  ref={intentionRef}
                  className="reflekt-textarea"
                  defaultValue={intention}
                  placeholder="Jag vill säga att..."
                  rows={3}
                />
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => {
                      const t = (intentionRef.current?.value || "").trim();
                      if (t.length < 3) return;
                      setIntention(t);
                      go("sugLoading");
                    }}
                  >
                    Visa förslag <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* LADDNING → förslag */}
            {screen === "sugLoading" && (
              <div className="reflekt-content">
                <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
                  <div className="reflekt-bee-loading">
                    <img src={bee} alt="Binice" />
                  </div>
                  <div className="reflekt-loading-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#4A5C68",
                      marginTop: 12,
                    }}
                  >
                    Binice skriver ett förslag...
                  </div>
                </div>
              </div>
            )}

            {/* FÖRSLAG */}
            {screen === "suggestion" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">
                  Mitt förslag är att du skriver:
                </div>
                <div className="reflekt-suggestion-label">
                  Binice föreslår, ton: {TONE_LABELS[tone]}. Du kan ändra
                  direkt i texten
                </div>
                <textarea
                  ref={sugRef}
                  className="reflekt-suggestion-editable"
                  defaultValue={suggestion}
                  key={suggestion}
                  rows={4}
                />
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-no"
                    onClick={() => go("tone")}
                  >
                    Ändra ton <span className="reflekt-arrow">→</span>
                  </button>
                  <button
                    className="reflekt-btn reflekt-btn-yes"
                    onClick={() => {
                      const t = (sugRef.current?.value || "").trim();
                      if (t) setComment(t);
                      go("publish");
                    }}
                  >
                    Använd detta <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* TON */}
            {screen === "tone" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">Vilken ton vill du ha?</div>
                <div className="reflekt-tone-grid">
                  {(Object.keys(TONE_LABELS) as Tone[]).map((id) => (
                    <button
                      key={id}
                      className={
                        "reflekt-tone-btn " +
                        (tone === id ? "selected" : "")
                      }
                      onClick={() => {
                        setTone(id);
                        go("sugLoading");
                      }}
                    >
                      <span className="reflekt-tone-label">
                        {TONE_LABELS[id]}
                      </span>
                      <img
                        src={TONE_IMAGES[id]}
                        className="reflekt-tone-img"
                        alt={TONE_LABELS[id]}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PUBLICERA */}
            {screen === "publish" && (
              <div className="reflekt-content">
                <BiniceHeader />
                <button className="reflekt-btn-back" onClick={goBack}>
                  <span className="reflekt-back-arrow">←</span> Tillbaka
                </button>
                <div className="reflekt-title">Din kommentar är klar</div>
                <div className="reflekt-comment-box">{comment}</div>
                <div className="reflekt-btn-row">
                  <button
                    className="reflekt-btn reflekt-btn-send"
                    onClick={() => go("done")}
                  >
                    Skicka <span className="reflekt-arrow">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* KLAR */}
            {screen === "done" && (
              <div className="bd-done">
                <div className="reflekt-check">✓</div>
                <div className="bd-done-title">Bra jobbat!</div>
                <div className="bd-done-body">
                  Din kommentar skickas nu.
                  <br />
                  Tack för att du tog en stund att reflektera.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
