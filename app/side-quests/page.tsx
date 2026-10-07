import type { Metadata } from "next";
import {
  SIDE_QUEST_ALBUM,
  SIDE_QUEST_ENTRIES,
  SIDE_QUEST_KEEPSAKES,
  SIDE_QUEST_STICKERS,
  SIDE_QUESTS,
} from "@/content/site";
import { BackLink, PageShell } from "../page-shell";
import { SideQuestBento } from "./bento";
import "./side-quests.css";

export const metadata: Metadata = {
  title: SIDE_QUESTS.title,
  description: SIDE_QUESTS.description,
};

/** The stories beyond work, behind the index's bottom-left door. */
export default function SideQuestsPage() {
  return (
    <PageShell section="side-quests">
      <section className="page-intro rise" aria-labelledby="sq-heading">
        <h1 id="sq-heading" className="page-title">
          {SIDE_QUESTS.heading}
        </h1>
        <p className="page-lede">{SIDE_QUESTS.tagline}</p>
      </section>

      <SideQuestBento
        entries={SIDE_QUEST_ENTRIES}
        album={SIDE_QUEST_ALBUM}
        keepsakes={SIDE_QUEST_KEEPSAKES}
        stickers={SIDE_QUEST_STICKERS}
        funFact={SIDE_QUESTS.funFact}
      />

      <BackLink className="page-back" />
    </PageShell>
  );
}
