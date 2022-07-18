import chalk from "chalk";

chalk.enabled = true;
chalk.level = 3;

export function green(text) {
  return chalk.green(text);
}

export function red(text) {
  return chalk.red(text);
}

export function yellow(text) {
  return chalk.yellow(text);
}

export function cyan(text) {
  return chalk.cyan(text);
}

export function logGreen(text) {
  console.log(green(text));
}

export function logCyan(text) {
  console.log(cyan(text));
}

export function logRed(text) {
  console.log(red(text));
}
