import CLI from "clui";
const { Spinner } = CLI;
import art from "ascii-art";
import { yellow } from "../utils/colors.js";

export async function initer() {
  try {
    const rendered = await art.font("PERMACAST", "doom").completed();
    console.log(yellow(rendered));
    console.log(`[*] developed by: PermawebDAO`);
    console.log(`[*] github: https://github.com/parallel-news/permacast-cli`);
    console.log(`[*] Twitter: @permacastapp \n\n`);
  } catch (error) {
    return;
  }
}

export const spinnerStyle = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];

export function spinner(message) {
  const spinner = new Spinner(message, spinnerStyle);

  return spinner;
}
