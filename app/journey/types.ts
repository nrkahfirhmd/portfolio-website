/** One stop on the /journey path. Data lives in content/site.ts. */
export type JourneyStop = {
  /** Human period, e.g. "Feb – Dec 2024". Ending in "now" marks it current. */
  when: string;
  title: string;
  /** Where: the organisation, team, or event. */
  place?: string;
  kind: "work" | "education" | "award";
  /** One line on the card, under the title. */
  summary?: string;
  /** Up to three chips on the card. */
  skills?: string[];
  /** The panel's story, one string per paragraph. */
  story?: string[];
  /** Photos in public/: thumbnails on the card, the first one tops the story. */
  images?: string[];
  /** Photos shown as a grid in the story with no cover on top. */
  gallery?: string[];
  /** Big-number cards under the skills, e.g. { value: "10,000+", label: "Applicants" }. */
  stats?: { value: string; label: string; note?: string }[];
  /** Course names, shown as chips under "Relevant coursework". */
  coursework?: string[];
  /** Bullets for the "Core responsibilities" card. */
  highlights?: string[];
  /** Titled sections after the intro; `points` are the small cards under a chapter. */
  chapters?: { title: string; quote?: string; body: string[]; points?: { title: string; text: string }[] }[];
  /** Closing quote card. */
  reflection?: string;
  /** Stack the related-page cards in one column instead of a grid. */
  stackLinks?: boolean;
  /** Related pages, linked at the end of the story (e.g. a project's write-up). Without `href` the card is not clickable (use `note` for "Coming soon"). */
  links?: { href?: string; label: string; note?: string }[];
};
