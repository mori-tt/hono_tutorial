import { z } from "@hono/zod-openapi";

export const TodoSchema = z
  .object({
    id: z.number().brand("TodoId").openapi("TodoId"),
    title: z
      .string({
        // パース時にタイトルの有無をチェック
        required_error: "Title is required",
      })
      .trim()
      // パース時にタイトルが一文字以上あるかどうかチェック
      .min(1, { message: "Title must be at least 1 character long" }),
    done: z.coerce.boolean().default(false),
    doneAt: z.coerce.date().nullish(),
  })
  .openapi("Todo");

export type Todo = z.infer<typeof TodoSchema>;
export type TodoId = Todo["id"];

export const parseTodo = (data: unknown): Todo => TodoSchema.parse(data);
export const parseTodoId = (id: number): TodoId =>
  TodoSchema.shape.id.parse(id);

export type NewTodo = Omit<Todo, "id">;
export const parseNewTodo = (data: unknown): NewTodo =>
  TodoSchema.omit({ id: true }).parse(data);

export const isComplete = (todo: Todo) => todo.done;

export type TodoRepository = {
  selectAll: (offset: number, limit: number) => Promise<Todo[]>;
  selectById: (id: TodoId) => Promise<Todo | null>;
  insert: (todo: NewTodo) => Promise<Todo | null>;
  setCompleted: (id: TodoId) => Promise<Todo | null>;
};
