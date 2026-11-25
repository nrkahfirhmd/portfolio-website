import Image from "next/image";
import { CURRENT, STORY } from "@/content/site";
import { Say, slot, Spot, vars, Words } from "./parts";
import { SCENES } from "./timeline";

const PORTRAIT = "/portrait-noir.webp";
const PORTRAIT_SIZES = "(max-aspect-ratio: 1/1) 190vw, 104vh";

/* ------------------------------------------------------------ the note itself */

/** Drawn once, in the overlay; narrator.ts moves it and picks the face. */
export function Note() {
  return (
    <div data-narrator="" className="nr-note" data-away="">
      <div className="nr-paper fm-paper" />
      <div className="nr-face nr-face--lens">
        <span>{STORY.hello.lines[1].match(/\[(.+?)\]/)?.[1]}</span>
      </div>
      {STORY.small.texts.map((text, i) => (
        <div key={text} className={`nr-face nr-face--${i + 1}`}>
          {i + 1}
        </div>
      ))}
      <div className="nr-face nr-face--pad">
        {STORY.small.pad.map((line, i) => (
          <p key={line} className="fm-hand" style={vars({ "--at": PAD_AT + i * 1.05 })}>
            <Words text={line} />
          </p>
        ))}
      </div>
      <div className="nr-face nr-face--quote">
        <p className="fm-hand" lang="id">
          &ldquo;{STORY.whitejack.quote}&rdquo;
        </p>
      </div>
      <div className="nr-face nr-face--ask">
        <p className="fm-hand">{STORY.prabu.note}</p>
      </div>
    </div>
  );
}

// Overlay animations run on film time.
const PAD_AT = SCENES.small.start + 8.45;

/* ------------------------------------------------------------ hello */

export function Hello() {
  const [first, second] = STORY.hello.lines;
  return (
    <section className="fm-scene fm-hello" data-scene="hello" data-tone="ink" style={slot("hello")}>
      <div className="fm-figure">
        <Image
          src={PORTRAIT}
          alt="Kahfi, in round glasses and a graduation stole"
          width={1800}
          height={1800}
          sizes={PORTRAIT_SIZES}
          loading="eager"
          fetchPriority="high"
        />
        <canvas data-bloom="/portrait-colour.webp" aria-hidden="true" />
      </div>
      <div className="fm-copy">
        <div className="fm-hello-block">
          <h1 className="fm-hello-head">
            <span className="fm-hello-1">{STORY.hello.heading[0]}</span>{" "}
            <span className="fm-hello-2">
              {STORY.hello.heading[1]}
              <i className="fm-hello-stop fm-paper" aria-hidden="true" data-note="spot" data-at="-1" data-until="0.12" />
            </span>
          </h1>
          <div className="fm-hello-lines">
            {CURRENT ? (
              <p>
                <b>{CURRENT.role}</b> at{" "}
                <a href={CURRENT.companyUrl} target="_blank" rel="noopener noreferrer">
                  {CURRENT.company}
                </a>
              </p>
            ) : null}
          </div>
        </div>
        <div className="nr-stack nr-stack--hello">
          <Say text={first} at={0.95} step={0.13} out={2.2} travel={0.6} />
          <Say
            text={second}
            at={2.53}
            step={0.11}
            keyed={(words) => (
              <span className="nr-key nr-tiny">
                {words}
                <Spot name="lens" at={4} until={4.45} face="lens" round={0.5} travel={0.4} />
              </span>
            )}
          />
        </div>
      </div>
      <Spot name="grow" at={5.2} until={5.2} face="hole" round={0.5} travel={0.75} />
      <p className="fm-cue" aria-hidden="true">
        Scroll
      </p>
    </section>
  );
}

/* ------------------------------------------------------------ small problems, and the pad */

export function Small() {
  const { chat, texts, journal, table, pad } = STORY.small;
  return (
    <section className="fm-scene fm-small" data-scene="small" data-tone="light" style={slot("small")}>
      <div className="fm-art" aria-hidden="true">
        <div className="nr-chat">
          {texts.map((text, i) => (
            <span
              key={text}
              className={i % 2 ? "fm-bubble" : "fm-bubble fm-bubble--1"}
              style={vars({ "--t": `${1.85 + i * 0.34}s` })}
            >
              {text}
              <Spot name="badge" at={1.97 + i * 0.34} until={i === 2 ? 3 : undefined} face={String(i + 1)} round={0.5} travel={0.2} />
            </span>
          ))}
        </div>
        <div className="nr-pile">
          {Array.from({ length: 6 }, (_, page) => (
            <div key={page} className="fm-sheet" style={vars({ "--i": page })}>
              {Array.from({ length: 24 }, (_, c) => (
                <i key={c} />
              ))}
            </div>
          ))}
          <Spot name="pile" at={7.75} until={8} turn={-8} />
        </div>
      </div>
      <div className="fm-copy">
        <div className="nr-stack">
          <Say
            text={chat}
            at={0.95}
            step={0.11}
            out={2.92}
            keyed={(words) => <span className="nr-key nr-bubble">{words}</span>}
          />
          <div className="fm-texts">
            {texts.map((text, i) => (
              <p key={text}>
                Person {(i % 2) + 1}: {text}
              </p>
            ))}
          </div>
          <Say
            text={journal}
            at={3.25}
            step={0.11}
            wait={[6, 1.2]}
            out={5.72}
            keyed={(_, text) => (
              <span className="nr-key nr-long">
                <span className="nr-w" data-note="word" data-at="3.92" style={vars({ "--t": "3.92s" })}>
                  <span className="nr-i">
                    {text.slice(0, 2)}
                    <span className="nr-os" aria-hidden="true">
                      {"o".repeat(90)}
                      <Spot name="ride" at={4.1} until={4.95} live travel={0.06} />
                    </span>
                    {text.slice(2)}
                  </span>
                </span>
              </span>
            )}
          />
          <Say text={table} at={6.05} step={0.11} out={7.95} />
          <div className="fm-texts nr-pad-text">
            {pad.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <Spot name="pad" at={8.4} until={10.4} face="pad" turn={-2} travel={0.4} />
      <Spot name="cover" at={10.98} until={11} face="pad" travel={0.58} />
    </section>
  );
}

/* ------------------------------------------------------------ Prabu */

const TEN = /^([\d.]+)$/;

export function Prabu() {
  const f = "/featured/prabu_2025";
  const { name, site, form, ask, end } = STORY.prabu;
  return (
    <section className="fm-scene fm-prabu" data-scene="prabu" data-tone="day" style={slot("prabu")}>
      <div className="fm-art" aria-hidden="true">
        <Image className="pr-hall" src={`${f}/REKTORAT.png`} alt="" width={1920} height={672} sizes="100vw" />
        <div className="pr-ground" />
        <div className="pr-crowd">
          {Array.from({ length: 22 }, (_, i) => (
            <Image
              key={i}
              src={`${f}/MAN_${(i % 2) + 1}.png`}
              alt=""
              width={i % 2 ? 195 : 284}
              height={i % 2 ? 613 : 598}
              sizes="60px"
              style={vars({ "--i": i, "--d": (i * 7) % 11, "--row": i % 2 })}
            />
          ))}
        </div>
        <div className="pr-sorter">
          <div className="pr-trays">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="pr-form">
          <span className="pr-form-head" />
          {[0, 1, 2].map((i) => (
            <span key={i} className="pr-form-row">
              <i />
              <i />
              <i />
            </span>
          ))}
        </div>
        <div className="pr-bus">
          <Image src={`${f}/ODONG.png`} alt="" width={1980} height={1229} sizes="34vw" />
          <Spot name="bus" at={2.35} until={3} live turn={4} />
        </div>
        <Image className="pr-man pr-man--1" src={`${f}/MAN_1.png`} alt="" width={284} height={598} sizes="20vw" />
        <Image className="pr-man pr-man--2" src={`${f}/MAN_2.png`} alt="" width={195} height={613} sizes="14vw" />
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say
            text={site}
            at={0.75}
            travel={0.72}
            out={2.93}
            keyed={(words, text) =>
              TEN.test(text) ? (
                <span className="nr-key nr-ten">
                  <span className="nr-w" data-note="word" data-at="1.63" style={vars({ "--t": "1.63s" })}>
                    <span className="nr-i">
                      {text.split("").map((c, i) =>
                        c === "0" ? (
                          <span key={i} className="nr-zero">
                            0
                            <Image
                              src={`${f}/MAN_${(i % 2) + 1}.png`}
                              alt=""
                              width={i % 2 ? 195 : 284}
                              height={i % 2 ? 613 : 598}
                              sizes="90px"
                              style={vars({ "--t": `${1.75 + i * 0.07}s` })}
                            />
                          </span>
                        ) : (
                          c
                        ),
                      )}
                    </span>
                  </span>
                </span>
              ) : (
                <span className="nr-key">{words}</span>
              )
            }
          />
          <Say text={form} at={3.25} step={0.095} className="nr-sorts" />
          <Say text={ask} at={5.95} step={0.11} out={7.97} />
          <Say text={end} at={8.3} step={0.095} />
        </div>
      </div>
      <Spot name="trays" at={5.15} until={5.75} turn={-10} />
      <Spot name="ask" at={7.2} until={8} face="ask" turn={-5} travel={0.32} />
      <Spot name="corner" at={10.3} until={10.9} turn={-12} travel={0.4} />
    </section>
  );
}
