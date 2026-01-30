import type { BrainyxPluginApi } from "brainyx/plugin-sdk";
import { emptyPluginConfigSchema } from "brainyx/plugin-sdk";

import { createDiagnosticsOtelService } from "./src/service.js";

const plugin = {
  id: "diagnostics-otel",
  name: "Diagnostics OpenTelemetry",
  description: "Export diagnostics events to OpenTelemetry",
  configSchema: emptyPluginConfigSchema(),
  register(api: BrainyxPluginApi) {
    api.registerService(createDiagnosticsOtelService());
  },
};

export default plugin;
