import type { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommandJSON =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

type CooldownTypes = "global" | "guild" | "user";

export type Cooldown = Partial<Record<CooldownTypes, number>>;

export interface ISlashCommandOptions {
  cooldown?: Cooldown;
  isDev: boolean;
}

export interface ICommand {
  slashCommandBuilder: SlashCommandJSON;
  slashCommandOptions: ISlashCommandOptions;
  execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
