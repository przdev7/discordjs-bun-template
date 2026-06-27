import type { BotClient } from "@core/client";
import type { ClientEvents } from "discord.js";

export interface IEvent {
  name: keyof ClientEvents;
  once: boolean;
  execute(client: BotClient, ...args: unknown[]): Promise<unknown>;
}
