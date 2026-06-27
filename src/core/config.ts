import type { Config } from "@types";
import Joi, { type ValidationError } from "joi";
import { AppError } from "@core";

export class ConfigService {
  private static instance: ConfigService;
  private env: Config;

  private constructor(env: Config) {
    this.env = env;
  }

  static async init(): Promise<void> {
    if (this.instance)
      throw new AppError("AppError", "already initialized, to get instance use getInstance() method", true);

    const parsedEnv = Bun.env;
    const schema = Joi.object<Config>({
      TOKEN: Joi.string().required(),
      APP_ID: Joi.string().required(),
      PUBLIC_KEY: Joi.string().required(),
      NODE_ENV: Joi.allow("development", "production", "test").required(),
      LOG_CHANNEL_ID: Joi.string().required(),
      DEV_GUILD_ID: Joi.string().required(),
    }).unknown(true);

    const env = await schema
      .validateAsync(parsedEnv, {
        abortEarly: true,
      })
      .catch((e: ValidationError) => {
        throw new AppError("ValidationError", e.message, false, String(e.cause));
      });
    this.instance = new ConfigService(env);
  }

  static getInstance(): ConfigService {
    if (!this.instance) throw new AppError("AppError", "config not initialized, use init() method", false);
    return this.instance;
  }

  public get(key: keyof Config) {
    return this.env[key];
  }
}
