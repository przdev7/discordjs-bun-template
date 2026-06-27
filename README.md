# 🚀 DiscordJS Bun Template - A TypeScript Template for Discord Bots

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-FFC080?style=flat-square&logo=bun&logoColor=black)

> A Discord bot template using Discord.js and Bun, providing a solid foundation for building high-performance and scalable Discord bots.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Tutorial](#tutorial)
- [Docker](#docker)
- [License](#license)

## Description

This Discord bot template is designed to provide a robust and efficient foundation for building Discord bots using Discord.js and Bun. It includes a set of pre-configured scripts, a well-organized project structure, and a comprehensive set of dependencies to get you started quickly.

## Features

- 🚀 **TypeScript Support**: Leverage the power of TypeScript to build robust and maintainable code.
- 📈 **Performance Optimization**: Utilize Bun's high-performance capabilities to ensure your bot runs smoothly and efficiently.
- 🛠️ **Pre-Configured Scripts**: Get started quickly with pre-configured scripts for building, running, and deploying your bot.
- 🔒 **Security**: Ensure the security of your bot with ESLint and Prettier integration.

## Tech Stack

- **Discord.js**: A powerful library for interacting with the Discord API.
- **Bun**: A high-performance JavaScript runtime.
- **TypeScript**: A superset of JavaScript that adds optional static typing and other features.
- **Prettier**: A code formatter that helps maintain consistent code style.
- **ESLint**: A static code analysis tool that helps catch errors and improve code quality.

## Project Structure

```markdown
discordjs_bun_template/
├── src/ # Source code
│ ├── main.ts # Entry point
│ ├── commands/ # Command handlers
│ │ ├── ping.ts # Ping command handler
│ ├── events/ # Event handlers
│ │ ├── ready.ts # Ready event handler
│ ├── handlers/ # All of required handlers
│ └── ... # Other source files
├── package.json # Dependencies
├── tsconfig.json # TypeScript configuration
├── Dockerfile # Docker configuration
└── README.md # This file
```

## Prerequisites

- **Bun**: A high-performance JavaScript runtime.
- **npm**: A package manager for Node.js.
- **Docker**: A containerization platform.

## Installation

### 1. Clone the repository:

```bash
git clone <repository-url>
cd discordjs_bun_template
```

### 2. Install dependencies:

```bash
bun install
```

## Usage

- **Start the bot in development mode**:

```bash
bun run start:dev
```

- **Start the bot in production mode**:

```bash
bun run start:prod
```

- **Build the bot**:

```bash
bun build
```

## Tutorial

### Defining Events

To define an event, create a new file in the `events` directory. For example, to create a `clientReady` event, create a new file called `ready.ts` with the following content:

```typescript
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
```

### Defining Commands

To define a command, create a new file in the `commands` directory. For example, to create a `ping` command, create a new file called `ping.ts` with the following content:

```typescript
import type { ICommand, ISlashCommandOptions } from "@types";
import { ChatInputCommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js";
import { SlashCommandOptionsBuilder } from "../builders/slashCommandOptionsBuilder";

export default class Ping implements ICommand {
  slashCommandBuilder = new SlashCommandBuilder().setName("ping").setDescription("returns bot latency");
  slashCommandOptions = new SlashCommandOptionsBuilder().setDevOnly(false);
  async execute(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
    return await interaction.reply({ content: ` \`ping: ${interaction.client.ws.ping}\` ` });
  }
}
```

To register new commands run prepared script:

only to dev server

```bash
bun run deploy:dev
```

and you should also set `setDevOnly` in `slashCommandOptions` to "true".

if you want to register commands globally use:

```bash
bun run deploy:prod
```

## Docker

The project includes a production-ready `Dockerfile` and `compose.yml`, allowing you to build and run the bot without installing Bun on your host machine.

### Build and start

Build the image and start the container:

```bash
docker compose up --build
```

### Run in detached mode

Run the bot in the background:

```bash
docker compose up -d
```

### Stop the container

Stop and remove the running container:

```bash
docker compose down
```

### Rebuild after changes

If you make changes to the source code or dependencies, rebuild the image:

```bash
docker compose up --build
```

or

```bash
docker compose build
docker compose up
```

Before starting the container, make sure the `.env` file exists and contains all required variables.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
