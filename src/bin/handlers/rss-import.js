import axios from "axios";
import parseString from "xml2js";
import bufferToArrayBuffer from "buffer-to-arraybuffer";
import * as fs from "fs";
import { stripHtml } from "string-strip-html";
import { CliUx } from "@oclif/core";
import { getPodcastFactory } from "../../utils/permacast-api.js";
import { arweaveConfig, sleepBlockCount } from "../../utils/arweave.js";
import { NFT_ADDRESS, PERMACAST_API_ENDPOINT } from "../../utils/constants.js";
import { logGreen, logRed, logCyan } from "../../utils/colors.js";
import { getConfig, hasSavedKeyfile } from "../../utils/config.js";
import { spinner } from "../initer.js";

async function uploadEpisode(e, factory, userWallet) {
  // episode metadata from the RSS
  const link = e.enclosure[0]["$"].url;
  const fileType = e.enclosure[0]["$"].type;
  const title = e.title[0];
  const pubDate = e.pubDate[0];
  const duration = e["itunes:duration"][0];
  const description = stripHtml(e.description[0]).result;
  const address = userWallet.address;
  const jwk = userWallet.pk;
  const cover = factory.object.cover;
  
  logCyan(`--> title: ${title}`);
  logCyan(`--> publication date: ${pubDate}`);
  logCyan(`--> length: ${duration} h/min/sec\n`);
  CliUx.ux.action.start('downloading a new episode');
  console.log(`\n\n`)
  const arweave = await arweaveConfig();
  const data = await downloadEpisode(link);

  const tx = await arweave.createTransaction({ data: data }, jwk);
  const initState = `{"issuer": "${address}","owner": "${address}","name": "${title}","ticker": "PANFT","description": 'episode from ${title}',"thumbnail": "${cover}","balances": {"${address}": 1}}`;

  tx.addTag("Content-Type", fileType);
  tx.addTag("App-Name", "SmartWeaveContract");
  tx.addTag("App-Version", "0.3.0");
  tx.addTag("Contract-Src", NFT_ADDRESS);
  tx.addTag("Init-State", initState);
  // Verto aNFT listing
  tx.addTag("Exchange", "Verto");
  tx.addTag("Action", "marketplace/create");
  tx.addTag("Thumbnail", factory.object.cover);

  tx.reward = (+tx.reward * 3).toString();

  const audioTxId = await arweave.transactions.sign(tx, jwk);
  const uploader = await arweave.transactions.getUploader(tx);

  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    // console.log(
    //   `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    // );
  }
  CliUx.ux.action.stop()
  logGreen(`--SUCCESS - EPISODE AUDIO TXID: ${tx.id}`);

  await addShowtoState(title, description, tx.id, factory, jwk);
}

async function addShowtoState(name, desc, audio, factory, jwk) {
  let input = {
    function: "addEpisode",
    pid: factory.object.pid,
    name: name,
    desc: desc,
    content: audio,
  };

  let tags = {
    Contract: factory.address,
    "App-Name": "SmartWeaveAction",
    "App-Version": "0.3.0",
    "Permacast-Version": "amber",
    "Content-Type": "text/plain",
    Input: JSON.stringify(input),
  };
  
  const arweave = await arweaveConfig();
  const interaction = await arweave.createTransaction({ data: desc });
  for (const key in tags) {
    interaction.addTag(key, tags[key]);
  }

  await arweave.transactions.sign(interaction, jwk);
  await arweave.transactions.post(interaction);

  logGreen(`--SUCCESS - EPISODE CONTRACT INTERACTION: ${interaction.id}`);
}

async function parseTitles(uploadedEpisodes) {
  return uploadedEpisodes.map((episode) => episode.episodeName);
}

export async function importRss(argv) {
  let rssJson;
  const RSS_URL = argv.rssUrl;
  const pid = argv.pid;

  await isValidUrl(RSS_URL);
  const userWallet = await getJwk();
  const factory = await getPodcastFactory(pid, userWallet.address);

  const rssXml = (await axios.get(RSS_URL)).data;
  const json = parseString.parseString(
    rssXml,
    (err, result) => (rssJson = result.rss)
  );

  const cover = rssJson.channel[0]["itunes:image"];
  const rssEpisodes = rssJson.channel[0].item;

  const existingTitles = await parseTitles(factory.object.episodes);

  for (const e of rssEpisodes.reverse()) {
    if (!existingTitles.includes(e.title[0])) {
      await uploadEpisode(e, factory, userWallet);
      await sleepBlockCount(3);
    }
  }
}

async function isValidUrl(url) {
  const isValid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  return isValid;
}

async function downloadEpisode(url) {
  const res = (
    await axios.get(url, {
      responseType: "arraybuffer",
    })
  ).data;

  return bufferToArrayBuffer(res);
}

async function getJwk() {
  if (!(await hasSavedKeyfile())) {
    logRed(`ERROR: please save a keyfile first to execute this command.`);
    process.exit(1);
  }

  const jwk = await getConfig("keyfile");
  const pk = JSON.parse(JSON.stringify(jwk.pk));
  const address = (await getConfig("address"))["address"];
  return {
    pk,
    address,
  };
}
