import axios from "axios";
import { PERMACAST_API_ENDPOINT } from "./constants.js";
import { logRed } from "./colors.js";
import { checkArAddr, evaluateFactory } from "./arweave.js";

export async function getPermacastState() {
  try {
    const state = await axios.get(`${PERMACAST_API_ENDPOINT}/feeds/podcasts`);
    return state?.data;
  } catch (error) {
    return false;
  }
}

export async function getPodcastFactory(pid, address, onchainEval) {
  const isValidPid = await checkArAddr(pid);
  if (!isValidPid) {
    logRed(`ERROR: the given PID (${pid}) has an invalid syntax`);
    process.exit(1);
  }

  const permacast = await getPermacastState();
  const podcastFactory = permacast.res.find(
    (factory) => factory["pid"] === pid
  );

  if (!podcastFactory) {
    logRed(`ERROR: cannot find a factory with the given PID (${pid})`);
    process.exit(1);
  }

  // newChildOf is specific to the factories that have been migrated from Permacast V2 to V3
  const factoryAddress = podcastFactory?.newChildOf
    ? podcastFactory.newChildOf
    : podcastFactory.childOf;
  const admins = [].concat([podcastFactory.owner, podcastFactory.superAdmins]);

  if (!admins.includes(address)) {
    logRed(
      `ERROR: your address does not have the permission to interact with the podcast (superAdmin or Owner)`
    );
    process.exit(1);
  }

  const factoryState = onchainEval
    ? await evaluateFactory(factoryAddress, pid)
    : podcastFactory;

  return {
    address: factoryAddress,
    object: factoryState,
  };
}
