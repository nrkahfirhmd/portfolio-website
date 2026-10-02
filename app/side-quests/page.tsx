import type { Metadata } from "next";
import Link from "next/link";
import {
  SIDE_QUEST_ALBUM,
  SIDE_QUEST_ENTRIES,
  SIDE_QUEST_KEEPSAKES,
  SIDE_QUEST_STICKERS,
  SIDE_QUESTS,
} from "@/content/site";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { PageTransition } from "../page-transition";
import { BackArrow } from "../software/parts";
import { SideQuestBento } from "./bento";
import "../home.css";
import "./side-quests.css";

export const metadata: Metadata = {
  title: SIDE_QUESTS.title,
  description: SIDE_QUESTS.description,
};

/** The stories beyond work, behind the door at the bottom left of the index. */
export default function SideQuestsPage() {
  return (
    <PageTransition>
      <main className="sq">
        <CursorDot />
        <MagneticGrid />

        <header className="sq-bar">
          <Link href="/" className="sq-home" aria-label="Back to the index" transitionTypes={["nav-back"]}>
            kv<span aria-hidden="true">/</span>side-quests
          </Link>
        </header>

        <section className="sq-intro rise" aria-labelledby="sq-heading">
          <h1 id="sq-heading" className="sq-heading">
            {SIDE_QUESTS.heading}
          </h1>
          <p className="sq-tagline">{SIDE_QUESTS.tagline}</p>
        </section>

        <SideQuestBento
          entries={SIDE_QUEST_ENTRIES}
          album={SIDE_QUEST_ALBUM}
          keepsakes={SIDE_QUEST_KEEPSAKES}
          stickers={SIDE_QUEST_STICKERS}
          funFact={SIDE_QUESTS.funFact}
        />

        <Link className="back sq-back" href="/" transitionTypes={["nav-back"]}>
          <BackArrow />
          Back to index
        </Link>
      </main>
    </PageTransition>
  );
}
