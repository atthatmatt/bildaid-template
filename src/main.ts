// src/main.ts
import "./style.css";
import { co } from "jazz-tools";
import { ensureJazzStarted } from "./jazz";
import { Hold, HoldList } from "./domain/schema";

async function main() {
  await ensureJazzStarted();

  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) throw new Error("#app not found");

  // Get list id from URL, or create one then redirect (docs pattern)
  const listId = new URLSearchParams(window.location.search).get("id");

  if (!listId) {
    const newList = HoldList.create([
      { text: "First hold", createdAt: Date.now(), updatedAt: Date.now() },
    ]);
    await newList.$jazz.waitForSync();
    window.location.search = `?id=${newList.$jazz.id}`;
    throw new Error("Redirecting...");
  }

  // Basic UI shell
  const header = document.createElement("div");
  const idEl = Object.assign(document.createElement("small"), {
    innerText: `HoldList ID: ${listId}`,
  });

  const listContainer = document.createElement("div");
  listContainer.style.display = "flex";
  listContainer.style.flexDirection = "column";
  listContainer.style.gap = "8px";
  listContainer.style.marginTop = "12px";

  header.append(idEl);
  app.replaceChildren(header, listContainer);

  function holdRowElement(hold: co.loaded<typeof Hold>) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.alignItems = "center";

    const input = Object.assign(document.createElement("input"), {
      value: hold.text,
      placeholder: "Hold text...",
    });

    input.oninput = () => {
      const v = input.value;
      hold.$jazz.set("text", v);
      hold.$jazz.set("updatedAt", Date.now());
    };

    const meta = Object.assign(document.createElement("small"), {
      innerText: `created: ${new Date(hold.createdAt).toLocaleString()}`,
    });

    row.append(input, meta);
    return row;
  }

  function newHoldFormElement(list: co.loaded<typeof HoldList>) {
    const form = Object.assign(document.createElement("form"), {
      onsubmit: (e: Event) => {
        e.preventDefault();
        list.$jazz.push({
          text: input.value || "New hold",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        input.value = "";
      },
    });

    form.style.display = "flex";
    form.style.gap = "8px";
    form.style.marginTop = "12px";

    const input = Object.assign(document.createElement("input"), {
      placeholder: "Add a hold…",
    });

    const btn = Object.assign(document.createElement("button"), {
      innerText: "Add",
      type: "submit",
    });

    form.append(input, btn);
    return form;
  }

  // Subscribe + render (docs pattern)
  HoldList.subscribe(listId, { resolve: { $each: true } }, (holds) => {
    const form = newHoldFormElement(holds);
    listContainer.replaceChildren(
      ...holds.map((h) => holdRowElement(h)),
      form
    );
  });
}

main().catch((e) => {
  console.error(e);
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app) app.innerText = String(e?.message ?? e);
});
