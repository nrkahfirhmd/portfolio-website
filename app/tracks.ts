/**
 * Music the island plays. Single source of truth, same shape rule as
 * `gateways.ts` — the component never hardcodes a filename.
 *
 * `src` is served from `public/`, so `/music/foo.mp3` lives at
 * `public/music/foo.mp3`. A missing or unplayable file degrades to a disabled
 * transport rather than a button that silently does nothing.
 */
export type Track = {
  title: string;
  artist: string;
  game: string;
  src: string;
};

export const TRACKS: Track[] = [
  {
    title: "Dearly Beloved",
    artist: "Yoko Shimomura",
    game: "Kingdom Hearts II",
    src: "/music/Dearly Beloved.mp3",
  },
  {
    title: "No More What Ifs",
    artist: "Shoji Meguro",
    game: "Persona 5",
    src: "/music/No More What Ifs.mp3",
  },
  {
    title: "Secret of the Forest",
    artist: "Yasunori Mitsuda",
    game: "Chrono Trigger",
    src: "/music/Secret of the Forest.mp3",
  },
];
