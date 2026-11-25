// Run: node --experimental-strip-types --test app/story/film/timeline.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { SCENES, schedule, SLIDE, TOTAL } from "./timeline.ts";

test("a scene scrolls away exactly while the next one scrolls in", () => {
  const entry = { delay: 0, content: 2 };
  const { scenes, total } = schedule({ a: { ...entry, enter: 0 }, b: { ...entry, enter: SLIDE } });
  assert.equal(scenes.b.start, scenes.a.start + scenes.a.length - SLIDE);
  assert.equal(scenes.a.exit, scenes.b.enter);
  assert.equal(total, scenes.b.start + scenes.b.length);
});

test("a scene that opens over the previous one doesn't push it away", () => {
  const { scenes } = schedule({ a: { enter: 0, delay: 0, content: 2 }, b: { enter: 0.5, delay: 0, content: 2 } });
  assert.deepEqual([scenes.a.exit, scenes.a.length, scenes.b.start], [0, 2, 1.5]);
});

test("the last scene ends the film", () => {
  assert.ok(Math.abs(SCENES.notes.start + SCENES.notes.length - TOTAL) < 1e-9);
});
