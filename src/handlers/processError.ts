import { AppError, type ConfigService, type BotClient } from "@core";
import { EmbedBuilder, type TextChannel } from "discord.js";

export class ProcessErrorHandler {
  private client: BotClient;
  private config: ConfigService;

  constructor(client: BotClient, config: ConfigService) {
    this.client = client;
    this.config = config;
  }

  public registerListeners(): void {
    this.client.on("error", async (e: Error) => await this.sendLog(e));
    process.on("uncaughtException", async (e) => await this.sendLog(e));
    process.on("unhandledRejection", async (reason) => {
      if (reason instanceof Error) {
        await this.sendLog(reason);
      } else {
        await this.sendLog(new AppError("UnknownError", String(reason), false));
      }
    });
  }

  private async sendLog(e: Error): Promise<void> {
    console.error(e);
    if (!this.client.isReady()) {
      await this.logStartup(`Error while startup, client not ready, error: ${e}`);
      process.exit(1);
    }

    const channel = (await this.client.channels.fetch(this.config.get("LOG_CHANNEL_ID"))) as TextChannel;
    const errorEmbed = new EmbedBuilder()
      .setTitle(e.name)
      .setColor([136, 8, 8])
      .setDescription(`\`\`\`${e}\`\`\``)
      .addFields({
        name: "stack trace",
        value: e.stack?.split("\n")?.[1] ?? "no stack trace",
      })
      .setTimestamp();

    if (!channel?.isTextBased()) {
      await this.logStartup(`Channel: ${channel} can't recive any messages (is not textBased), error: ${e}`);
      process.exit(1);
    }

    await channel.send({ content: `@everyone`, embeds: [errorEmbed] });

    if (e instanceof AppError && e.isOperational) return;

    process.exit(1);
  }

  private async logStartup(msg: string) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    try {
      await Bun.file("logs/startup-debug.log")
        .writer()
        .write(line + "\n");
    } catch (_) {}
  }
}
