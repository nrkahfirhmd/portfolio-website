/**
 * Shared gate for pointer-driven decoration: a fine pointer present, and no
 * reduced-motion preference. Both the cursor dot and the magnetic grid mount
 * on exactly this condition, so it lives in one place rather than being
 * copied — and because it's live-subscribed rather than read once, plugging
 * in a mouse or flipping reduced-motion in system settings takes effect
 * immediately instead of only on the next page load.
 *
 * Written as a `useSyncExternalStore` triple, which is the primitive built
 * for reading external mutable browser state during render.
 */
export function subscribeFinePointer(callback: () => void) {
  const fine = matchMedia("(pointer: fine)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  fine.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    fine.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

export function getFinePointerSnapshot() {
  return (
    matchMedia("(pointer: fine)").matches &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// matchMedia doesn't exist during SSR — the client re-checks on hydration and
// mounts then, so starting disabled costs nothing but one extra tick.
export function getFinePointerServerSnapshot() {
  return false;
}
