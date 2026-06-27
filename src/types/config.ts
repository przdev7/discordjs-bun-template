interface RequiredBotFields {
  TOKEN: string;
  APP_ID: string;
  PUBLIC_KEY: string;
  LOG_CHANNEL_ID: string;
  DEV_GUILD_ID: string;
}

interface AppFields {
  NODE_ENV: "development" | "production" | "test";
}

export type Config = RequiredBotFields & AppFields;
