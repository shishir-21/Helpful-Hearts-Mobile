import { z } from "zod";

export function parseOrThrow<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  return schema.parse(value);
}