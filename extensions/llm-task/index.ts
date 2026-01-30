import type { BrainyxPluginApi } from "../../src/plugins/types.js";

import { createLlmTaskTool } from "./src/llm-task-tool.js";

export default function register(api: BrainyxPluginApi) {
  api.registerTool(createLlmTaskTool(api), { optional: true });
}
