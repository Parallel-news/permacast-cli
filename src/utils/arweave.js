import Arweave from "arweave";
import { logCyan } from "./colors.js";
import { getCurrentGateway } from "../bin/handlers/gateways.js";
import { TPWT_CONTRACT_ADDRESS } from "./constants.js";


const arweaveFallback = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000,
  logging: false,
});

export async function arweaveConfig() {
  try {
    const gateway = await getCurrentGateway();
    return Arweave.init({
      host: gateway,
      protocol: "https",
      port: 443,
      timeout: 60000,
      logging: false,
    });
  } catch (error) {
    return arweaveFallback;
  }
}


export async function getAddrFromKeyfile(jwk) {
  try {
    const arweave = await arweaveConfig();
    const address = await arweave.wallets.ownerToAddress(jwk?.n);
    if (address) {
      return address;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function checkArAddr(address) {
  const isAddress = /[a-z0-9_-]{43}/i.test(address);
  return isAddress;
}

export async function sleepBlockCount(count) {
  // default value incase count was not passed
  const blocks = count ? count : 3;
  // 1 block ~ 2min --> converted to millisecs
  logCyan(
    `\n\nsleeping for ${blocks} Arweave network blocks (~${
      blocks * 2
    } minutes)\n\n`
  );
  return new Promise((resolve) => setTimeout(resolve, blocks * 2 * 60 * 1000));
}

export async function getArBalance(address) {
  try {
    const arweave = await arweaveConfig();
    const balance = await arweave.wallets.getBalance(address);
    const arBalance = await arweave.ar.winstonToAr(balance);
    return parseFloat(arBalance).toFixed(2);
  } catch(error) {
    return 0;
  }
}
