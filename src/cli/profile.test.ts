import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "brainyx",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "brainyx", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "brainyx", "--dev", "gateway"]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "brainyx", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "brainyx", "--profile", "work", "status"]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "brainyx", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "brainyx", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "brainyx", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "brainyx", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".brainyx-dev");
    expect(env.BRAINYX_PROFILE).toBe("dev");
    expect(env.BRAINYX_STATE_DIR).toBe(expectedStateDir);
    expect(env.BRAINYX_CONFIG_PATH).toBe(path.join(expectedStateDir, "brainyx.json"));
    expect(env.BRAINYX_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      BRAINYX_STATE_DIR: "/custom",
      BRAINYX_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.BRAINYX_STATE_DIR).toBe("/custom");
    expect(env.BRAINYX_GATEWAY_PORT).toBe("19099");
    expect(env.BRAINYX_CONFIG_PATH).toBe(path.join("/custom", "brainyx.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("brainyx doctor --fix", {})).toBe("brainyx doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("brainyx doctor --fix", { BRAINYX_PROFILE: "default" })).toBe(
      "brainyx doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("brainyx doctor --fix", { BRAINYX_PROFILE: "Default" })).toBe(
      "brainyx doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("brainyx doctor --fix", { BRAINYX_PROFILE: "bad profile" })).toBe(
      "brainyx doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("brainyx --profile work doctor --fix", { BRAINYX_PROFILE: "work" }),
    ).toBe("brainyx --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("brainyx --dev doctor", { BRAINYX_PROFILE: "dev" })).toBe(
      "brainyx --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("brainyx doctor --fix", { BRAINYX_PROFILE: "work" })).toBe(
      "brainyx --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("brainyx doctor --fix", { BRAINYX_PROFILE: "  jbbrainyx  " })).toBe(
      "brainyx --profile jbbrainyx doctor --fix",
    );
  });

  it("handles command with no args after brainyx", () => {
    expect(formatCliCommand("brainyx", { BRAINYX_PROFILE: "test" })).toBe(
      "brainyx --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm brainyx doctor", { BRAINYX_PROFILE: "work" })).toBe(
      "pnpm brainyx --profile work doctor",
    );
  });
});
