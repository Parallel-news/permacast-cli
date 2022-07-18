import * as fs from "fs";
import inquirer from "inquirer";
import { getAddrFromKeyfile } from "../../utils/arweave.js";
import { initer, spinner, spinnerStyle } from "../initer.js";
import { green, red, logGreen, logRed } from "../../utils/colors.js";
import { checkFileExtension, isParsable } from "../../utils/types-checking.js";
import {
  hasSavedKeyfile,
  setConfig,
  delConfig,
  getConfig,
} from "../../utils/config.js";

export async function saveKeyFile(argv) {
  try {
    const keyFile = argv.keyFile;

    if (await hasSavedKeyfile()) {
      logRed(
        "ERROR: there is already a key-file saved, delete your current keyfile from the CLI and add a new one."
      );
      process.exit(1);
    }

    if (!checkFileExtension(keyFile, "json")) {
      logRed(
        "ERROR: a non-JSON file path has been provided, please check again"
      );
      process.exit(1);
    }

    const keyfile = fs.readFileSync(keyFile, "utf8");

    if (!isParsable(keyfile)) {
      logRed(`ERROR: unable to parse ${keyFile}`);
      process.exit(1);
    }

    const pk = JSON.parse(keyfile);
    const address = await getAddrFromKeyfile(pk);

    if (!address) {
      logRed(`ERROR: cannot load the public address of your JWK, try again.`);
      process.exit(1);
    }

    await setConfig("keyfile", { pk });
    await setConfig("address", { address });
    logGreen(
      `SUCCESSFUL: saved your keyfile successfully. Now you can interact with your podcast(s) via the CLI !`
    );
    logGreen(`ADDRESS: ${address}`);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

export async function deleteKeyfile() {
  try {
    if (!(await hasSavedKeyfile())) {
      logRed(`ERROR: there is no keyfile linked to delete it`);
      process.exit(1);
    }

    const address = await getConfig("address");

    await delConfig("keyfile");
    await delConfig("address");

    logGreen(`SUCCESS: deleted the keyfile of ${address.address}`);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}
