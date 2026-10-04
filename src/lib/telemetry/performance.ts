import { trackEvent } from "./index";

export function measurePerformance(
  name: string,
  operation: () => void,
): void {
  const start = globalThis.performance?.now?.() ?? Date.now();

  try {
    operation();
  } finally {
    const end = globalThis.performance?.now?.() ?? Date.now();
    trackEvent("screen_viewed", {
      performance_metric: name,
      duration_ms: Math.round(end - start),
    });
  }
}
