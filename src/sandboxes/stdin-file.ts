import { randomUUID } from "node:crypto";

export const createStdinFilePath = (): string =>
  `/tmp/sandcastle-stdin-${randomUUID()}`;

const shellEscape = (value: string): string =>
  `'${value.replace(/'/g, `'\\''`)}'`;

export const redirectCommandStdinFromFile = (
  command: string,
  stdinPath: string,
): string =>
  `chmod 600 ${shellEscape(stdinPath)} && exec sh -c ${shellEscape(command)} < ${shellEscape(stdinPath)}`;

export const removeStdinFileCommand = (stdinPath: string): string =>
  `rm -f -- ${shellEscape(stdinPath)}`;
