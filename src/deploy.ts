import { CommandHandler } from "./handlers/command";
import { AppError, ConfigService } from "@core";
import type { ICommand } from "@types";
import { readdir } from "node:fs/promises";
import { parseArgs } from "node:util";
import path from "node:path";

await ConfigService.init();

const handler = CommandHandler.instance;
const config = ConfigService.instance;
const commandsData: ICommand[] = [];

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    production: {
      type: "boolean",
      default: false,
    },
  },
  strict: true,
  allowPositionals: true,
});

const eventsLocation = (
  await readdir(path.join(__dirname, "./commands"), { recursive: true }).catch((e: Error) => {
    throw new AppError("AppError", e.message, false, String(e.cause));
  })
).filter((v) => v.endsWith(".ts"));

for (const filename of eventsLocation) {
  const fullPath = path.join(__dirname, "./commands", filename);
  const module = await import(fullPath);
  const cmd = new module.default();

  if (!handler.isCommand(cmd)) throw new AppError("AppError", `class ${module} is not a command`, true);

  commandsData.push(cmd);
}

await handler.deploy(config, commandsData, values.production);
