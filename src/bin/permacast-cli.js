#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initer } from "./initer.js";
import { saveKeyFile, deleteKeyfile } from "./handlers/keyfile.js";
import { importRss } from "./handlers/rss-import.js";
import { account } from "./handlers/account.js";
import { switchGateway } from "./handlers/gateways.js";

const argvs = yargs(hideBin(process.argv))
  .command({
    command: "account",
    aliases: ["acc"],
    handler: async (argv) => {
      await initer();
      await account();
    },
  })
  .command({
    command: "save-keyfile [key-file]",
    builder: (yargs) => {
      yargs.options({
        "key-file": {
          describe: "path to the keyfile JSON",
          demandOption: true,
        },
      });
    },
    handler: async (argv) => {
      await initer();
      await saveKeyFile(argv);
    },
  })
  .command({
    command: "delete-keyfile",
    handler: async (argv) => {
      await initer();
      await deleteKeyfile();
    },
  })
  .command({
    command: "import-rss [pid] [rss-url] [onchain-eval]",
    builder: (yargs) => {
      yargs.options({
        pid: {
          describe: "the podcast ID of your podcast",
          demandOption: true,
        },
        "rss-url": {
          describe:
            "the URL address of the RSS of the podcast that you want to import its content to Permacast",
          demandOption: true,
        },
        "onchain-eval": {
          describe:
            "optional argument that if set to true, evaluates the podcast's factory from Arweave directly (slow to very slow)",
          demandOption: false,
        },
      });
    },
    handler: async (argv) => {
      await initer();
      await importRss(argv);
    },
  })
  .command({
    command: "change-gateway",
    builder: (yargs) => {
      yargs.options({
        gateway: {
          describe:
            "gateway key ['arweave.net' or 'arweave.dev' or 'arweave.live']",
          demandOption: true,
        },
      });
    },
    handler: async (argv) => {
      await initer();
      await switchGateway(argv);
    },
  })
  .command({
    command: "*",
    handler: async (argv) => {
      await initer();
    },
  })
  .help().argv;
