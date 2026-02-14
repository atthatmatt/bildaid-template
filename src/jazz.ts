// src/jazz.ts
import { JazzBrowserContextManager } from "jazz-tools/browser";

/**
 * Minimal Jazz boot for a vanilla Vite app.
 * This sets the global Jazz context that `co.*` uses under the hood.
 */
let started = false;

export async function ensureJazzStarted() {
  if (started) return;
  started = true;

  await new JazzBrowserContextManager().createContext({
    sync: {
      // Minimal demo key from Jazz docs. Replace later with your own key.
      peer: "wss://cloud.jazz.tools?key=minimal-vanilla-example",
      when: "always",
    },
  });
}
