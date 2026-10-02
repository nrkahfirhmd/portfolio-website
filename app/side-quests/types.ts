/** One story card on /side-quests. Data lives in content/site.ts. */
export type SideQuest = {
  period: string;
  title: string;
  org: string;
  kind: "career" | "volunteer" | "project" | "community";
  /** One-line hook on the card and atop the article. */
  summary: string;
  /** Two or three sentences, first person. */
  story: string;
  /** Further paragraphs, shown only in the opened article. */
  body?: string[];
  skills: string[];
  /** A takeaway or a number worth bragging about. */
  highlight?: string;
  /** Cover in public/. Without one the card gets generated art. */
  image?: string;
  /** Grid cell: "lg" 4x2, "tall" 2x2, "wide" 6x1, "sm" 2x1 (the default). */
  size?: "lg" | "tall" | "wide" | "sm";
};

export type SideQuestPhoto = { caption: string; image: string };
