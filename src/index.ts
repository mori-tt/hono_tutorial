import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { todoRoute } from "./todo/route";

const app = new Hono();

app.use(logger());
app.use("/v1/*", cors());

app.route("/v1", todoRoute);
app.onError((e, c) => {
  if (e instanceof HTTPException) {
    return e.getResponse();
  }
  return c.json({ error: e.message }, 500);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
