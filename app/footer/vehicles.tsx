import type { SceneId } from "./scenes";

/** Whatever crosses each scene, drawn to match the plates: ink lines on paper, or the reverse at night (--v-ink, --v-paper). */
export function Vehicle({ scene }: { scene: SceneId }) {
  void scene;
  return <Phinisi />;
}

const ink = "var(--v-ink)";
const paper = "var(--v-paper)";

/* ---------------------------------------------------------------- phinisi */

function Phinisi() {
  const sail = (d: string, seams: string) => (
    <g key={d}>
      <path d={d} fill={paper} stroke={ink} strokeWidth="2.4" />
      <path d={seams} stroke={ink} strokeWidth="1.3" fill="none" />
    </g>
  );
  return (
    <>
      {/* Masts and rigging */}
      <path d="M118 232V28M202 232V52" stroke={ink} strokeWidth="4.4" />
      <path d="M118 30 30 220M118 40l52 180M202 56l96 128M202 80l70 130M202 60l-56 160" stroke={ink} strokeWidth="1.1" fill="none" />
      <path d="M232 222l92-44" stroke={ink} strokeWidth="4" />
      {/* Jibs */}
      {sail("M206 60c22 46 60 90 112 120-40-2-78 2-108 14Z", "M212 96c14 34 34 62 66 84M210 132c10 22 24 40 46 54M208 160c8 14 18 24 30 32")}
      {sail("M206 112c14 34 36 62 70 84-26 0-48 4-68 12Z", "M208 142c9 22 22 40 40 54M208 170c6 12 14 22 24 30")}
      {/* Foresail and topsail */}
      {sail("M198 96c-22 2-44-2-62-10-4 44-4 88 4 126 20 4 40 4 58-2Z", "M184 97c-4 38-4 78 0 116M168 95c-5 40-5 80 0 119M152 91c-6 42-5 84 1 122")}
      {sail("M198 60c-14 10-32 18-54 22 18 8 36 10 54 8Z", "M190 66c-2 8-2 16-1 24M176 73c-2 6-2 11-1 16")}
      {/* Mainsail and topsail */}
      {sail("M114 72c-24 2-46-2-64-12-12 50-18 104-14 152 26 6 54 6 78 0Z", "M100 73c-6 46-8 94-5 142M84 72c-8 46-11 96-9 143M68 67c-10 48-15 100-13 148")}
      {sail("M114 32c-14 12-34 22-58 26 18 9 38 12 58 9Z", "M105 39c-2 10-2 19-1 28M90 47c-2 7-2 13-1 18")}
      <path d="M46 58l68 16M134 84l64 14M30 216l88-4M138 214l64-4" stroke={ink} strokeWidth="3" fill="none" />
      {/* Pennant */}
      <path d="M118 28c-12-6-20 4-34-2 10-4 8-12 20-10 6 1 10-2 14-4Z" fill={ink} />
      {/* Hull */}
      <path d="M14 214c8 14 8 30 24 52h196c28-12 52-34 66-58-20 12-44 18-70 20H60c-18-2-34-6-46-14Z" fill={ink} stroke={paper} strokeWidth="2" />
      <path d="M20 224c14 8 30 11 46 12h166c22-2 40-6 56-14M30 244h220M38 256h206" stroke={paper} strokeWidth="1.8" fill="none" />
      <path d="M72 236v-18h58v18" fill={paper} stroke={ink} strokeWidth="2" />
      <path d="M78 224h9v7h-9ZM96 224h9v7h-9ZM114 224h9v7h-9Z" fill={ink} />
      {/* Bow wave */}
      <path d="M-8 268c30-10 60 6 92-2s58 8 92 0 60 6 96-6c16-4 30-2 44 4" stroke={paper} strokeWidth="6" fill="none" />
      <path d="M-8 268c30-10 60 6 92-2s58 8 92 0 60 6 96-6c16-4 30-2 44 4M6 278c26-8 50 4 78-2s60 8 96 0 56 2 84-4" stroke={ink} strokeWidth="1.8" fill="none" />
    </>
  );
}
