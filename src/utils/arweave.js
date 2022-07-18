import Arweave from "arweave";
import { logCyan } from "./colors.js";
export const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000,
  logging: false,
});

export async function getAddrFromKeyfile(jwk) {
  try {
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
