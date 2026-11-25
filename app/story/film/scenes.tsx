import { Coretax, IslandMap, Next, Notes } from "./closing";
import { Hello, Note, Prabu, Small } from "./opening";
import { BodyCount, Omawe, WhiteJack, YourSpace } from "./projects";

/** In the order of timeline.ts. */
export function Scenes() {
  return (
    <>
      <Hello />
      <Small />
      <Prabu />
      <Omawe />
      <BodyCount />
      <YourSpace />
      <WhiteJack />
      <Coretax />
      <IslandMap />
      <Next />
      <Notes />
    </>
  );
}

export function Overlay() {
  return <Note />;
}
