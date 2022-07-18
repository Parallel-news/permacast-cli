#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initer } from "./initer.js";
import { saveKeyFile, deleteKeyfile } from "./handlers/keyfile.js";
import { importRss } from "./handlers/rss-import.js";
import { account } from "./handlers/account.js";

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
    command: "import-rss [pid] [rss-url]",
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
      });
    },
    handler: async (argv) => {
      await initer();
      await importRss(argv);
    },
  })
  .help().argv;
