import { z } from "zod";
import { parseOrThrow } from "@/utils/validation";

describe("parseOrThrow", () => {
  it("returns validated data", () => {
    const schema = z.object({ name: z.string() });
    expect(parseOrThrow(schema, { name: "Shishir" })).toEqual({ name: "Shishir" });
  });

  it("throws for invalid data", () => {
    const schema = z.object({ name: z.string() });
    expect(() => parseOrThrow(schema, { name: 42 })).toThrow();
  });
});