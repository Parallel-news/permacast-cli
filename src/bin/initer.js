import CLI from "clui";
const { Spinner } = CLI;
import { yellow, cyan } from "../utils/colors.js";
import figlet from "figlet";

export const spinnerStyle = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];

export function spinner(message) {
  const spinner = new Spinner(message, spinnerStyle);

  return spinner;
}

export async function initer() {
  figlet("PERMACAST", "Standard", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(yellow(data));
    console.log(`${cyan("[*]")} developed by: PermawebDAO`);
    console.log(
      `${cyan("[*]")} github: https://github.com/parallel-news/permacast-cli`
    );
    console.log(`${cyan("[*]")} Twitter: @permacastapp \n\n`);
  });
}
