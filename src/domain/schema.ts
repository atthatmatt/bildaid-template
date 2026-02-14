// src/domain/schema.ts
import { co, z } from "jazz-tools";

// A single "Hold" (your DBOS-style unit)
export const Hold = co.map({
  text: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// A list of holds
export const HoldList = co.list(Hold);
