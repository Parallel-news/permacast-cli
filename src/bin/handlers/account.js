import { getArBalance } from "../../utils/arweave.js";
import { logCyan, logRed } from "../../utils/colors.js";
import { hasSavedKeyfile, getConfig } from "../../utils/config.js";
import { getCurrentGateway } from "./gateways.js";
import { canUploadSize } from "arweave-fees.js";

export async function account() {
  try {
    if (!(await hasSavedKeyfile())) {
      logRed(`ERROR: you have to save your keyfile first`);
      process.exit(1);
    }

    const userAddress = (await getConfig("address")).address;
    const arBalance = await getArBalance(userAddress);
    const uploadSize = await canUploadSize(arBalance * 1e12);
    const gateway = await getCurrentGateway();

    logCyan(`--> address: ${userAddress}`);
    logCyan(`--> Arweave balance: ${arBalance} $AR`);
    logCyan(`--. Arweave gateway: "${gateway}" | port: 443`)
    logCyan(`--> Uploading size limit: ~ ${parseFloat(uploadSize).toFixed(2)} MiB`);

    process.exit(0);
  } catch (error) {
    console.log(error);
    logRed(`ERROR: please check your internet connection`);
    process.exit(1);
  }
}
