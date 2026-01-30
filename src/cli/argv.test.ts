import { describe, expect, it } from "vitest";

import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "brainyx", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "brainyx", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "brainyx", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "brainyx", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "brainyx", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "brainyx", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "brainyx", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "brainyx"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "brainyx", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "brainyx", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "brainyx", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "brainyx", "status", "--timeout=2500"], "--timeout")).toBe(
      "2500",
    );
    expect(getFlagValue(["node", "brainyx", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "brainyx", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "brainyx", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "brainyx", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "brainyx", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "brainyx", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "brainyx", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "brainyx", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "brainyx", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "brainyx", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["node", "brainyx", "status"],
    });
    expect(nodeArgv).toEqual(["node", "brainyx", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["node-22", "brainyx", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "brainyx", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["node-22.2.0.exe", "brainyx", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "brainyx", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["node-22.2", "brainyx", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "brainyx", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["node-22.2.exe", "brainyx", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "brainyx", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["/usr/bin/node-22.2.0", "brainyx", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "brainyx", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["nodejs", "brainyx", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "brainyx", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["node-dev", "brainyx", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "brainyx", "node-dev", "brainyx", "status"]);

    const directArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["brainyx", "status"],
    });
    expect(directArgv).toEqual(["node", "brainyx", "status"]);

    const bunArgv = buildParseArgv({
      programName: "brainyx",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "brainyx",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "brainyx", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "brainyx", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "brainyx", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "brainyx", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "brainyx", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "brainyx", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "brainyx", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "brainyx", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
