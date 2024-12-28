import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { todoRoute } from "./todo/route";

const app = new OpenAPIHono();

app.use(logger());
app.use(
  "/v1/*",
  cors({
    origin: ["http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.route("/v1", todoRoute);
app.onError((e, c) => {
  if (e instanceof HTTPException) {
    return e.getResponse();
  }
  return c.json({ error: e.message }, 500);
});

app.doc31("/open-api", {
  openapi: "3.1.0",
  info: { title: "API Hands On", version: "1" },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    {
      name: "todos",
      description: "Operations about todos",
    },
  ],
});
app.get("/doc", swaggerUI({ url: "/open-api" }));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
