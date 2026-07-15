import { AppError, ConfigService, type BotClient } from "@core";
import type { ICommand } from "@types";
import { REST, Routes } from "discord.js";
import { readdir } from "node:fs/promises";
import path from "node:path";

export class CommandHandler {
  private static _instance: CommandHandler;

  static get instance(): CommandHandler {
    if (!this._instance) this._instance = new CommandHandler();
    return this._instance;
  }

  async load(client: BotClient): Promise<CommandHandler> {
    const eventsLocation = (
      await readdir(path.join(__dirname, "../commands"), { recursive: true }).catch((e: Error) => {
        throw new AppError("AppError", e.message, false, String(e.cause));
      })
    ).filter((v) => v.endsWith(".ts"));

    for (const filename of eventsLocation) {
      const fullPath = path.join(__dirname, "../commands", filename);
      const module = await import(fullPath);
      const cmd = new module.default();

      if (!this.isCommand(cmd)) throw new AppError("AppError", `class ${module} is not a command`, true);
      client.commands.set(cmd.slashCommandBuilder.name, cmd);
    }

    console.log(`[Client] Successfully registered ${client.commands.size} commands`);
    return this;
  }

  public async deploy(config: ConfigService, body: ICommand[], production: boolean): Promise<void> {
    const rest = new REST().setToken(config.get("TOKEN"));

    if (production) {
      await rest.put(Routes.applicationCommands(config.get("APP_ID")), {
        body: body.filter((c) => !c.slashCommandOptions.isDev).map((c) => c.slashCommandBuilder), //TODO: add filter to exclude dev only commands
      });
    }

    await rest.put(Routes.applicationGuildCommands(config.get("APP_ID"), config.get("DEV_GUILD_ID")), {
      body: body.map((c) => c.slashCommandBuilder),
    });

    console.log(
      `[Client] Successfully deployed ${body.length} commands (dev) & ${production ? body.filter((c) => !c.slashCommandOptions.isDev).length : "0"} (prod)`,
    );
  }

  public isCommand(cmd: object): cmd is ICommand {
    return "slashCommandBuilder" in cmd && "execute" in cmd ? true : false;
  }
}
