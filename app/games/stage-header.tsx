import Image from "next/image";
import { stageBySlug } from "./games";
import { LockIcon, StageActions, StageStats } from "./stage-parts";

/**
 * A devlog's title block, drawn as the stage's intro screen: cover art as a
 * wide banner, then the stage chip, title, facts, and the play button.
 * `slug` is looked up in the stage registry and **throws** on an unknown
 * value — in the preview that lands as an error message, not a crash.
 */
export function StageHeader({ slug }: { slug: string }) {
  const stage = stageBySlug(slug);
  return (
    <header className="stage-head">
      <div className="stage-banner">
        {stage.cover ? (
          <Image
            src={stage.cover}
            alt={`${stage.name} cover art`}
            width={1260}
            height={1000}
            sizes="(max-width: 960px) 100vw, 60rem"
            priority
          />
        ) : (
          <span className="stage-art-empty" aria-hidden="true">
            {stage.locked ? <LockIcon /> : stage.id}
          </span>
        )}
      </div>
      <div className="stage-head-body">
        <h1 className="stage-title stage-title-lg">
          <span className="stage-num">{stage.id}</span>
          {stage.name}
        </h1>
        <p className="stage-blurb">{stage.blurb}</p>
        <StageStats stage={stage} />
        <StageActions stage={stage} />
      </div>
    </header>
  );
}
