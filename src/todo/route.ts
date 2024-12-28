import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { parseTodoId, TodoSchema } from "./domain";
import { readTodos, createTodo } from "./usecase";
import { todoRepository } from "./infra/repo";

export const todoRoute = new OpenAPIHono();

const getTodosRoute = createRoute({
  operationId: "getTodos",
  tags: ["todos"],
  path: "/todos",
  method: "get",
  description: "Read all todos",
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: {
      description: "Get a list of todos",
      content: {
        "application/json": {
          schema: z.array(TodoSchema),
        },
      },
    },
  },
});

todoRoute.openapi(getTodosRoute, async (c) => {
  //   const { page, limit } = c.req.valid("query");

  const todos = await readTodos(todoRepository);
  return c.json(todos);
});

const postTodoRoute = createRoute({
  operationId: "createTodo",
  tags: ["todos"],
  path: "/todos",
  method: "post",
  description: "Create a new todo item",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            title: z.string().openapi({
              example: "Buy milk",
              description: "The title of the todo",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "a newly created todo item",
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});

todoRoute.openapi(postTodoRoute, async (c) => {
  const data = await c.req.json();
  try {
    const newTodo = await createTodo(todoRepository, data.title);
    return c.json(newTodo);
  } catch (e: unknown) {
    throw new HTTPException(400, { message: (e as Error).message });
  }
});

const patchTodoRoute = createRoute({
  operationId: "toggleTodo",
  tags: ["todos"],
  path: "/todos/{id}",
  method: "patch",
  description: "Toggle todo completion status",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            done: z.boolean(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated todo item",
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});

todoRoute.openapi(patchTodoRoute, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { done } = body;
  try {
    const todoId = parseTodoId(Number(id));
    const todo = done
      ? await todoRepository.setCompleted(todoId)
      : await todoRepository.setUncompleted(todoId);
    return c.json(todo);
  } catch (e: unknown) {
    throw new HTTPException(400, { message: (e as Error).message });
  }
});
