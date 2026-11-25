import Image from "next/image";
import { STORY } from "@/content/site";
import { Letters, Say, slot, Spot, vars } from "./parts";
import { TARGET, type Walker, WALKERS } from "./walkers";

/* ------------------------------------------------------------ Omawe */

function RouteMap({ tall }: { tall?: boolean }) {
  const f = "/featured/omawe";
  const route = tall
    ? "M70 1110 C210 1060 130 970 280 940 S490 900 430 830 S250 790 340 750 S520 760 520 700"
    : "M90 660 C240 660 250 520 400 530 S560 680 710 630 S850 480 960 520 S1060 500 1110 440";
  const [px, py] = tall ? [520, 700] : [1110, 440];
  const streets = tall
    ? ["M-20 980 L620 760", "M-20 720 L620 620", "M120 300 L260 1300", "M430 300 L520 1300", "M-20 480 L620 420", "M-20 1180 L620 1040"]
    : ["M-20 420 L1220 300", "M-20 600 L1220 480", "M180 200 L320 820", "M560 200 L640 820", "M860 200 L980 820", "M-20 740 L1220 690"];
  const s = tall ? 0.8 : 1;
  return (
    <svg
      className={`fm-map-svg ${tall ? "fm-map-svg--tall" : "fm-map-svg--wide"}`}
      viewBox={tall ? "0 0 600 1200" : "0 0 1200 760"}
      preserveAspectRatio="xMidYMax slice"
    >
      <g className="om-streets">
        {streets.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path data-route="" className="om-route" d={route} />
      <path data-done="" className="om-done" d={route} />
      <path data-gap="" className="om-gap" d={route} />
      <image href={`${f}/MAPS.png`} x={px - 62 * s} y={py - 96 * s} width={124 * s} height={93 * s} />
      <g data-marker="" className="om-marker">
        <circle className="om-marker-halo" r={30 * s} data-note="spot" data-live="" data-at="2.95" data-until="10.6" data-size="0.042" data-turn="45" data-round="0.5" />
      </g>
      <g data-scooter="">
        <image href={`${f}/MOTORCYCLE.png`} x={-78 * s} y={-104 * s} width={156 * s} height={117 * s} />
        <text className="om-label" y={-118 * s} fontSize={tall ? 30 : 26}>
          on their way
        </text>
      </g>
    </svg>
  );
}

export function Omawe() {
  const { name, again, show, wrong, move, end } = STORY.omawe;
  return (
    <section className="fm-scene fm-told fm-omawe" data-scene="omawe" data-tone="dark" style={slot("omawe")}>
      <div className="fm-art" aria-hidden="true">
        <RouteMap />
        <RouteMap tall />
        <span className="fm-bubble om-again">{STORY.small.texts[1]}</span>
        <Image
          className="om-card"
          src="/featured/omawe/LIVE_ACTIVITY.png"
          alt=""
          width={1499}
          height={658}
          sizes="(max-aspect-ratio: 1/1) 84vw, 38vw"
        />
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say text={again} at={0} travel={0.6} out={1.35} />
          <Say text={show} at={1.65} out={3.3} />
          <Say text={wrong} at={3.6} quiet out={5.15} />
          <Say
            text={move}
            at={5.45}
            step={0.09}
            quiet
            out={7.75}
            keyed={(words) => <span className="nr-key nr-cut">{words}</span>}
          />
          <Say text={end} at={8.1} quiet />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Body Count */

function Person({ hair, shirt, pants, bag }: Walker) {
  return (
    <svg viewBox="0 0 40 92" width="40" height="92">
      <ellipse cx="24" cy="88" rx="15" ry="4" fill="#0b0b22" opacity="0.35" />
      <path d="M13 52h7l-1 34h-6zM21 52h7l-1 34h-5z" fill={pants} />
      <path d="M12 85h8v4h-9zM21 85h7v4h-7z" fill="#efeae4" />
      <path d="M9 27q11-6 22 0l3 22-4 1-2-11v16H12V39l-2 11-4-1z" fill={shirt} />
      <path d="M6 48h4v5H6zM30 48h4v5h-4z" fill="#c98f6b" />
      {bag ? <path d="M10 27l19 22v10H19l1-8z" fill={bag} opacity="0.96" /> : null}
      <path d="M16 18h8v9q-4 3-8 0z" fill="#b87f5d" />
      <circle cx="20" cy="14" r="8" fill="#c98f6b" />
      <path d="M11 14q-1-12 9-12t9 12q-3-6-9-6t-9 6z" fill={hair} />
    </svg>
  );
}

export function BodyCount() {
  const f = "/featured/body_count";
  const { name, find, game, told, prompt, missed, cut, end } = STORY.bodyCount;
  return (
    <section className="fm-scene fm-told fm-bodyCount" data-scene="bodyCount" data-tone="dark" style={slot("bodyCount")}>
      <div className="fm-art" aria-hidden="true">
        <div className="bc-street">
          <div className="bc-stripes">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={vars({ "--i": i })} />
            ))}
          </div>
          <div className="bc-light">
            <Image src={`${f}/TRAFFIC_LIGHT.png`} alt="" width={379} height={822} sizes="14vw" />
            <Spot name="light" at={12.2} until={13.2} turn={3} />
          </div>
          <div className="bc-crowd">
            {WALKERS.map((w, i) => (
              <div key={i} className={w.target ? "fm-walker fm-walker--target" : "fm-walker"}>
                <Person {...w} />
                {w.target ? <Spot name="found" at={9.1} until={10} live turn={-6} /> : null}
              </div>
            ))}
          </div>
          <div className="bc-hud">
            <p className="bc-prompt">{prompt}</p>
            <div className="bc-slots">
              {[
                ["Hair", TARGET.hair],
                ["Shirt", TARGET.shirt],
                ["Pants", null],
                ["Bag", TARGET.bag],
              ].map(([label, color], i) => (
                <span key={label} className="bc-slot" style={vars({ "--i": i })}>
                  <small>{label}</small>
                  {color ? <i style={{ background: color }} /> : <b>Any</b>}
                </span>
              ))}
            </div>
            {/* Up to the prompt, down to the crowd, and back. */}
            <Spot name="read" at={6.55} travel={0.2} />
            <Spot name="read" at={6.95} travel={0.2} />
          </div>
          <Spot name="look" at={6.75} travel={0.2} />
          <Spot name="look" at={7.15} until={7.25} travel={0.2} />
        </div>
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say text={find} at={0.15} travel={0.4} out={2} />
          <Say text={game} at={2.3} out={3.6} />
          <Say text={told} at={3.9} out={5.4} />
          <p className="nr-sr">{prompt}</p>
          <Say text={missed} at={5.7} out={7.25} />
          <Say text={cut} at={7.55} out={10} />
          <Say text={end} at={10.3} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Your Space */

const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 61.8 + 7) % 100,
  y: (i * 29.7 + 13) % 100,
  r: 1 + ((i * 7) % 5) * 0.4,
  o: 0.25 + ((i * 11) % 7) * 0.09,
}));

export function YourSpace() {
  const f = "/featured/your_space";
  const { name, feelings, journal, one, testers, end } = STORY.yourSpace;
  return (
    <section className="fm-scene fm-told fm-yourSpace" data-scene="yourSpace" data-tone="dark" style={slot("yourSpace")}>
      <div className="fm-art" aria-hidden="true">
        <div className="ys-sky">
          {STARS.map((s, i) => (
            <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, opacity: s.o }} />
          ))}
        </div>
        <div className="ys-slots">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} style={vars({ "--i": i })} />
          ))}
        </div>
        <div className="ys-desk">
          <Image className="ys-book" src={`${f}/BOOK.png`} alt="" width={2400} height={1792} sizes="(max-aspect-ratio: 1/1) 92vw, 46vw" />
          <Image className="ys-phone" src={`${f}/MOCKUP_2.png`} alt="" width={1543} height={2410} sizes="(max-aspect-ratio: 1/1) 60vw, 30vw" />
          <Spot name="mark" at={2.75} until={3.1} turn={-32} />
        </div>
        <svg className="ys-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M14 62 L50 22 L86 58" />
        </svg>
        <Image className="ys-star ys-star--1" src={`${f}/UNPLEASANT.png`} alt="" width={313} height={313} sizes="18vw" />
        <Image className="ys-star ys-star--2" src={`${f}/COMBINED_EMOTION.png`} alt="" width={407} height={407} sizes="22vw" />
        <Image className="ys-star ys-star--3" src={`${f}/PLEASANT.png`} alt="" width={353} height={353} sizes="18vw" />
        <div className="ys-slider">
          <Spot name="knob ys-knob--from" at={4.9} until={4.95} round={0.5} />
          <Spot name="knob ys-knob--to" at={5.4} until={5.55} round={0.5} travel={0.45} />
        </div>
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say text={feelings} at={0.15} travel={0.4} out={1.3} />
          <Say text={journal} at={1.6} out={3.05} />
          <Say text={one} at={3.35} out={5.5} />
          <Say
            text={testers}
            at={5.85}
            out={7.75}
            keyed={(_, text, at) => (
              <span className="nr-key nr-stiff">
                <span className="nr-w" data-note="word" data-at={at} data-until="7.3" style={vars({ "--t": `${at}s` })}>
                  <span className="nr-i">{text}</span>
                </span>
              </span>
            )}
          />
          <Say
            text={end}
            at={8.1}
            step={0.1}
            keyed={(words) => <span className="nr-key nr-hand">{words}</span>}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ WhiteJack */

function Pixel({ name, w = 71, h = 95, className }: { name: string; w?: number; h?: number; className?: string }) {
  return <Image className={className} src={`/featured/whitejack/${name}.png`} alt="" width={w} height={h} unoptimized />;
}

export function WhiteJack() {
  const { name, alone, stuck, deck, boss, end, quote, gloss } = STORY.whitejack;
  return (
    <section className="fm-scene fm-told fm-whitejack" data-scene="whitejack" data-tone="dark" style={slot("whitejack")}>
      <div className="fm-art" aria-hidden="true">
        <div className="wj-table" />
        {["HEARTS", "DIAMONDS", "HEARTS", "DIAMONDS"].map((s, i) => (
          <Pixel key={i} className={`wj-suit wj-suit--${i}`} name={`SUIT_${s}`} w={52} h={52} />
        ))}
        <div className="wj-hand">
          <div className="wj-card wj-card--jack">
            <Pixel name="JACK_OF_SPADES" />
          </div>
          <div className="wj-card wj-card--king">
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} className="wj-shred" style={vars({ "--i": i })} />
            ))}
          </div>
          <div className="wj-card wj-card--ace">
            <Pixel name="ACE_OF_DIAMONDS" />
          </div>
        </div>
        <p className="wj-total">
          <b data-total="">21</b>
          <span>/ 21</span>
        </p>
        <div className="wj-chips">
          {[0, 1, 2].map((i) => (
            <i key={i} style={vars({ "--i": i })} />
          ))}
        </div>
        <Spot name="down" at={3.2} until={3.75} turn={184} />
        <Spot name="quote" at={9.3} until={11.4} face="quote" turn={-4} travel={0.4} />
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say text={alone} at={0.15} travel={0.4} out={1.75} />
          <Say text={stuck} at={2.05} out={3.65} />
          <Say
            text={deck}
            at={4}
            out={5.85}
            keyed={(_, text, at) => <Letters text={text} at={at} className="nr-burst" />}
          />
          <Say
            text={boss}
            at={6.15}
            out={7.55}
            keyed={(words) => <span className="nr-key nr-gone">{words}</span>}
          />
          <Say text={end} at={7.85} />
        </div>
        <blockquote className="nr-sr">
          <p lang="id">{quote}</p>
        </blockquote>
        <p className="wj-gloss">{gloss}</p>
      </div>
    </section>
  );
}
