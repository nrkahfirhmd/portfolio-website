import type { Metadata } from "next";
import { Nanum_Pen_Script } from "next/font/google";
import Link from "next/link";
import { FOOTER, PERSON, STORY } from "@/content/site";
import { PageTransition } from "../page-transition";
import { SeaFooter } from "../site-footer";
import { SOCIALS } from "../socials";
import { Film } from "./film/film";
import { Overlay, Scenes } from "./film/scenes";
import "./film/film.css";
import "./film/live.css";
import "./film/opening.css";
import "./film/told.css";

const hand = Nanum_Pen_Script({ variable: "--font-hand", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: STORY.title,
  description: STORY.description,
};

export default function StoryPage() {
  return (
    <PageTransition>
      <div className={`fm ${hand.variable}`}>
        <header className="fm-chrome">
          <Link href="/" className="fm-home" transitionTypes={["nav-back"]}>
            {PERSON.name.toLowerCase()}
          </Link>
          <a href="#end" className="fm-skip">
            Skip to the end
          </a>
        </header>
        <main>
          <Film notes={<Overlay />}>
            <Scenes />
          </Film>
        </main>
        <footer id="end" tabIndex={-1}>
          <SeaFooter
            hello={PERSON.openToWork ? STORY.end.hello : FOOTER.hello}
            note={PERSON.openToWork ? STORY.end.note : FOOTER.note}
            socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
          />
        </footer>
      </div>
    </PageTransition>
  );
}
