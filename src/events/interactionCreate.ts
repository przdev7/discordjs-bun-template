import { AppError, type BotClient } from "@core";
import type { IEvent } from "@types";
import { ChatInputCommandInteraction, MessageFlags, type ClientEvents, type Interaction } from "discord.js";

export default class InteractionCreate implements IEvent {
  name: keyof ClientEvents = "interactionCreate";
  once = false;

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
    const command = client.commands.get(interaction.commandName);
    if (!command) return await interaction.reply({ content: "Command does not exist", flags: MessageFlags.Ephemeral });

    return await command.execute(interaction);
  }

  private async handleError(interaction: Interaction, e: unknown): Promise<void> {
    if (interaction instanceof ChatInputCommandInteraction) {
      await interaction.reply({ content: `Failed to execute this interaction`, flags: MessageFlags.Ephemeral });
    }
    throw new AppError("DiscordError", `Interaction failed, error: ${e} `, true);
  }
}
