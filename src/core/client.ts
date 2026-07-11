import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { AppError, ConfigService } from "@core";
import { EventHandler } from "../handlers/event";
import { CommandHandler } from "../handlers/command";
import type { Cooldown, ICommand, IEvent } from "@types";

export class BotClient extends Client {
  private static instance: BotClient;
  private config: ConfigService;
  private eventHandler: EventHandler;
  private commandHandler: CommandHandler;
  public events: IEvent[] = [];
  public cooldowns = new Collection<string, Record<string, Cooldown>>();
  public commands = new Collection<string, ICommand>();

  private constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildExpressions,
      ],
      partials: [Partials.User, Partials.Message, Partials.Reaction, Partials.GuildMember],
      presence: {
        status: "online",
        activities: [{ name: "Example description", type: ActivityType.Watching }],
      },
    });

    this.config = ConfigService.getInstance();
    this.eventHandler = EventHandler.getInstance();
    this.commandHandler = CommandHandler.getInstance();
  }

  static getInstance(): BotClient {
    if (!this.instance) this.instance = new BotClient();
    return this.instance;
  }

  public async run(): Promise<void> {
    await this.eventHandler.load(this);
    await this.commandHandler.load(this);

    await this.login(this.config.get("TOKEN")).catch((e: Error) => {
      throw new AppError("AppError", e.message, false);
    });
  }
}
