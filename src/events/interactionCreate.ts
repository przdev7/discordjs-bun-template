import { AppError, type BotClient } from "@core";
import NodeCache from "node-cache";
import type { CooldownTypes, ICommand, IEvent } from "@types";
import { ChatInputCommandInteraction, MessageFlags, type ClientEvents, type Interaction } from "discord.js";

export default class InteractionCreate implements IEvent {
  name: keyof ClientEvents = "interactionCreate";
  once = false;

  private cache = new NodeCache();

  async execute(client: BotClient, interaction: Interaction): Promise<void> {
    try {
      switch (true) {
        case interaction instanceof ChatInputCommandInteraction: {
          await this.handleChatInput(client, interaction);
          break;
        }
        default: {
          throw new AppError("DiscordError", "Unknown interaction", true);
        }
      }
    } catch (error) {
      await this.handleError(interaction, error);
    }
  }

  private async handleChatInput(client: BotClient, interaction: ChatInputCommandInteraction) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return await interaction.reply({ content: "Command does not exist", flags: MessageFlags.Ephemeral });
    if (await this.isLimitedByCooldown(cmd, interaction)) return;

    return await cmd.execute(interaction);
  }

  private async isLimitedByCooldown(cmd: ICommand, interaction: ChatInputCommandInteraction): Promise<boolean> {
    if (!cmd.slashCommandOptions.cooldown) return false;

    const { global, guild, user } = cmd.slashCommandOptions.cooldown;
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const name = cmd.slashCommandBuilder.name;
    const cooldowns = [
      { type: "global", time: global },
      { type: "guild", time: guild },
      { type: "user", time: user },
    ].filter((cooldown) => cooldown.time !== undefined) as { type: CooldownTypes; time: number }[];

    if (cooldowns.length === 0) return false;

    let key = ``;
    let type: CooldownTypes;
    for (const cooldown of cooldowns) {
      switch (cooldown.type) {
        case "global": {
          key = name;
          type = "global";
          break;
        }
        case "guild": {
          key = `${guildId}-${name}`;
          type = "global";
          break;
        }
        case "user": {
          key = `${userId}-${name}`;
          type = "user";
          break;
        }
      }
      if (await this.isCooldown(interaction, key, cooldown.time, type)) {
        return true;
      }
    }
    return false;
  }

  private async isCooldown(
    interaction: ChatInputCommandInteraction,
    key: string,
    time: number,
    type: CooldownTypes,
  ): Promise<boolean> {
    const onCooldown = this.cache.get(key) as number | undefined;

    if (onCooldown) {
      const nextUseTime = Math.ceil(onCooldown / 1000);
      await interaction.reply({
        content: `You can use this command again in <t:${nextUseTime}:R> (${type} cooldown)`,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }
    this.cache.set(key, Date.now() + time, time / 1000);
    return false;
  }

  private async handleError(interaction: Interaction, e: unknown): Promise<void> {
    if (interaction instanceof ChatInputCommandInteraction) {
      await interaction.reply({ content: `Failed to execute this interaction`, flags: MessageFlags.Ephemeral });
    }
    throw new AppError("DiscordError", `Interaction failed, error: ${e} `, true);
  }
}
