/** One stop on the /journey path. Data lives in content/site.ts. */
export type JourneyStop = {
  /** Human period, e.g. "Feb – Dec 2024". Ending in "now" marks it current. */
  when: string;
  title: string;
  /** Where: the organisation, team, or event. */
  place?: string;
  kind: "work" | "education" | "competition";
  /** Competitions: the placement, e.g. "5th overall". The card's headline. */
  result?: string;
  /** The story, first person, one string per paragraph: what happened and
   * what it taught. Shown in the stop's panel. */
  story?: string[];
  /** A photo in public/, shown at the top of the story. */
  image?: string;
};
