import { BotClient, ConfigService } from "@core";
import { ProcessErrorHandler } from "./handlers/processError";

try {
  await ConfigService.init();

  const config = ConfigService.instance;
  const client = BotClient.instance;
  const errorHandler = new ProcessErrorHandler(client, config);
  errorHandler.registerListeners();

  await client.run();
} catch (e) {
  console.error(e);
  await Bun.file("logs/startup-debug.log").write(String(e) + "\n");
  process.exit(1);
}
