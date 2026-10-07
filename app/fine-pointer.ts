import { useSyncExternalStore } from "react";

const fine = () => matchMedia("(pointer: fine)");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)");

function subscribe(callback: () => void) {
  const queries = [fine(), reduced()];
  for (const q of queries) q.addEventListener("change", callback);
  return () => queries.forEach((q) => q.removeEventListener("change", callback));
}

/** Gate for pointer effects: a mouse-like pointer and no reduced-motion wish. Live, so changing either applies at once; false on the server. */
export function useFinePointer() {
  return useSyncExternalStore(subscribe, () => fine().matches && !reduced().matches, () => false);
}
