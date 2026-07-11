import type { ICommand } from "@types";
import { ChatInputCommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js";
import { SlashCommandOptionsBuilder } from "../builders/slashCommandOptionsBuilder";

export default class Ping implements ICommand {
  slashCommandBuilder = new SlashCommandBuilder().setName("ping").setDescription("returns bot latency");
  slashCommandOptions = new SlashCommandOptionsBuilder().setDevOnly(false);
  async execute(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
    return await interaction.reply({ content: ` \`ping: ${interaction.client.ws.ping}\` ` });
  }
}
