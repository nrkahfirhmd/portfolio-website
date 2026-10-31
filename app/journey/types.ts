/** One stop on the /journey path. Data lives in content/site.ts. */
export type JourneyStop = {
  /** Human period, e.g. "Feb – Dec 2024". Ending in "now" marks it current. */
  when: string;
  title: string;
  /** Where: the organisation, team, or event. */
  place?: string;
  kind: "work" | "education";
  /** One line on the card, under the title. */
  summary?: string;
  /** Up to three chips on the card. */
  skills?: string[];
  /** The panel's story, one string per paragraph. */
  story?: string[];
  /** Photos in public/: thumbnails on the card, the first one tops the story. */
  images?: string[];
  /** Related pages, linked at the end of the story (e.g. a project's write-up). */
  links?: { href: string; label: string }[];
};
