import { logCyan, logRed, logGreen } from "../../utils/colors.js";
import {
  hasSavedKeyfile,
  hasConfig,
  setConfig,
  getConfig,
} from "../../utils/config.js";

export async function switchGateway(argv) {
  try {
    const gateway = argv.gateway;
    if (!["arweave.net", "arweave.dev", "arweave.live"].includes(gateway)) {
      logRed(
        `ERROR: supported gateways are "arweave.net", "arweave.dev" or "arweave.live"`
      );
      process.exit(1);
    }

    await setConfig("gateway", { gateway });
    logGreen(`SUCCESS: gateway switched to "${gateway}" | port: 443`);
    process.exit(0);
  } catch (error) {
    logRed(`ERROR: something went wrong while trying to switch gateway`);
    process.exit(1);
  }
}

export async function getCurrentGateway() {
  try {
    if (!(await hasConfig("gateway"))) {
      return "arweave.net";
    }

    return (await getConfig("gateway")).gateway;
  } catch (error) {
    return "arweave.net";
  }
}
