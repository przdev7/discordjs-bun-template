import { AppError } from "@core/appError";
import type { BotClient } from "@core/client";
import type { IEvent } from "@types";
import { readdir } from "node:fs/promises";
import path from "node:path";

export class EventHandler {
  private static instance: EventHandler;

  static getInstance(): EventHandler {
    if (!this.instance) this.instance = new EventHandler();
    return this.instance;
  }

  async load(client: BotClient): Promise<void> {
    const eventsLocation = (
      await readdir(path.join(__dirname, "../events"), { recursive: true }).catch((e: Error) => {
        throw new AppError("AppError", e.message, false, String(e.cause));
      })
    ).filter((v) => v.endsWith(".ts"));

    for (const filename of eventsLocation) {
      const fullPath = path.join(__dirname, "../events", filename);
      const module = await import(fullPath);
      const event = new module.default();

      if (!this.isEvent(event)) throw new AppError("AppError", `class ${module} is not an event`, true);
      client.events.push(event);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
        continue;
      }
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
    console.log(`[Client] Successfully registered ${client.events.length} global events`);
  }

  private isEvent(obj: object): obj is IEvent {
    return "name" in obj && "once" in obj && "execute" in obj ? true : false;
  }
}
