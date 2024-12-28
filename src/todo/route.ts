import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { parseTodoId, TodoSchema } from "./domain";
import { readTodos, createTodo, completeTodo } from "./usecase";
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
  const { page, limit } = c.req.valid("query");

  const todos = await readTodos(todoRepository, page, limit);
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
  operationId: "completeTodo",
  tags: ["todos"],
  path: "/todos/{id}/complete",
  method: "patch",
  description: "Mark a todo item as complete",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "a completed todo todo item",
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
  try {
    const todoId = parseTodoId(Number(id));
    const todo = await completeTodo(todoRepository, todoId);
    return c.json(todo);
  } catch (e: unknown) {
    throw new HTTPException(400, { message: (e as Error).message });
  }
});
