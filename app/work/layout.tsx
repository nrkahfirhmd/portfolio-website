import { StoryNav } from "../story-nav";

/**
 * The two-column story shell: a sticky section rail on the left, the reading
 * column on the right. The rail collapses below lg, where the article gets the
 * full width.
 */
export default function WorkLayout({ children }: LayoutProps<"/work">) {
  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-gutter py-gutter-lg">
      <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-gutter-lg">
        <StoryNav />
        <article className="prose">{children}</article>
      </div>
    </main>
  );
}
