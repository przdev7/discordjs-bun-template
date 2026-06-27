import { AppError } from "@core";
import type { Cooldown, ISlashCommandOptions } from "@types";

export class SlashCommandOptionsBuilder implements ISlashCommandOptions {
  public isDev = false;
  public cooldown: Cooldown = {
    global: undefined,
    guild: undefined,
    user: undefined,
  };

  public setGlobalCooldown(cooldown: number, name: string): SlashCommandOptionsBuilder {
    this.validateNonNegativeNumber(cooldown, name);
    this.cooldown.global = cooldown;
    return this;
  }
  public setGuildCooldown(cooldown: number, name: string): SlashCommandOptionsBuilder {
    this.validateNonNegativeNumber(cooldown, name);
    this.cooldown.guild = cooldown;
    return this;
  }
  public setUserCooldown(cooldown: number, name: string): SlashCommandOptionsBuilder {
    this.validateNonNegativeNumber(cooldown, name);
    this.cooldown.user = cooldown;
    return this;
  }

  public setDevOnly(isDevOnly: boolean): SlashCommandOptionsBuilder {
    this.isDev = isDevOnly;
    return this;
  }

  private validateNonNegativeNumber(value: number, name: string): void {
    if (typeof value !== "number" || value < 0) {
      throw new AppError(`AppError`, `Invalid value for cooldown in ${name}`, false);
    }
  }
}
