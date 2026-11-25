import type { Metadata } from "next";
import {
  PERSON,
  SIDE_QUEST_ALBUM,
  SIDE_QUEST_ENTRIES,
  SIDE_QUEST_KEEPSAKES,
  SIDE_QUEST_STICKERS,
  SIDE_QUESTS,
} from "@/content/site";
import { PageTransition } from "../page-transition";
import { SiteFooter } from "../site-footer";
import { SOCIALS } from "../socials";
import { SideQuestBento } from "./bento";
import "../home.css";
import "../work/work.css";
import "./side-quests.css";
import { SiteHeader } from "@/app/site-header";

export const metadata: Metadata = {
  title: `${PERSON.shortName} | Side Quests`,
  description: SIDE_QUESTS.description,
};

export default function SideQuestsPage() {
  return (
    <PageTransition>
      <div className="home-gallery sq-page">
        <SiteHeader active="/side-quests" />

        <SideQuestBento
          hero={
            <section className="sq-hero" aria-labelledby="sq-heading">
              <h1 id="sq-heading" className="sq-hero-title">
                {SIDE_QUESTS.heading}
              </h1>
              <p className="sq-hero-lede">{SIDE_QUESTS.tagline}</p>
            </section>
          }
          entries={SIDE_QUEST_ENTRIES}
          album={SIDE_QUEST_ALBUM}
          keepsakes={SIDE_QUEST_KEEPSAKES}
          stickers={SIDE_QUEST_STICKERS}
          funFact={SIDE_QUESTS.funFact}
        />

        <SiteFooter
          openToWork={PERSON.openToWork}
          socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
        />
      </div>
    </PageTransition>
  );
}
