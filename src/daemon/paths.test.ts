import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".brainyx"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", BRAINYX_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".brainyx-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", BRAINYX_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".brainyx"));
  });

  it("uses BRAINYX_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", BRAINYX_STATE_DIR: "/var/lib/brainyx" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/brainyx"));
  });

  it("expands ~ in BRAINYX_STATE_DIR", () => {
    const env = { HOME: "/Users/test", BRAINYX_STATE_DIR: "~/brainyx-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/brainyx-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { BRAINYX_STATE_DIR: "C:\\State\\brainyx" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\brainyx");
  });
});
