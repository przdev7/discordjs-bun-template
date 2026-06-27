import type { BotClient } from "@core/client";
import type { IEvent } from "@types";
import { type ClientEvents } from "discord.js";

export default class ClientReady implements IEvent {
  name: keyof ClientEvents = "clientReady";
  once = true;
  async execute(client: BotClient, ..._args: unknown[]): Promise<void> {
    console.log(`[Client] Logged in ${client.user?.displayName}`);
  }
}
