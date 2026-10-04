import fs from "node:fs";
import path from "node:path";

describe("Android AAB release configuration", () => {
  it("uses an Android App Bundle for the production EAS profile", () => {
    const easPath = path.resolve(process.cwd(), "eas.json");
    const eas = JSON.parse(fs.readFileSync(easPath, "utf8")) as {
      build: { production: { android: { buildType: string } } };
    };

    expect(eas.build.production.android.buildType).toBe("app-bundle");
  });

  it("keeps the EAS token out of the workflow file", () => {
    const workflowPath = path.resolve(process.cwd(), ".github/workflows/android-aab.yml");
    const workflow = fs.readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("secrets.EXPO_TOKEN");
    expect(workflow).not.toContain("EXPO_TOKEN=");
  });
});
