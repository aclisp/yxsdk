import * as log from "https://deno.land/std@0.154.0/log/mod.ts";
import { format } from "https://deno.land/std@0.154.0/datetime/mod.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (r) =>
        `${
          format(r.datetime, "yyyy-MM-dd HH:mm:ss.SSS")
        } ${r.levelName} ${r.msg}`,
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});
