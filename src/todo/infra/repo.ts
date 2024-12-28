import { db } from "./db";
import { toCamel } from "snake-camel";
import type { TodoRepository, NewTodo, TodoId } from "../domain";
import { parseTodo } from "../domain";

export const todoRepository: TodoRepository = {
  selectAll: async () => {
    const data = await db
      .selectFrom("todo")
      .selectAll()
      .orderBy("id desc")
      .execute();
    return data.map((x) => parseTodo(toCamel(x)));
  },
  selectById: async (id: TodoId) => {
    const data = await db
      .selectFrom("todo")
      .selectAll()
      .where("todo.id", "=", id)
      .executeTakeFirst();
    return data ? parseTodo(toCamel(data)) : null;
  },
  insert: async (input: NewTodo) => {
    const data = await db
      .insertInto("todo")
      .values({
        ...input,
        done: 0,
      })
      .returningAll()
      .executeTakeFirst();
    return data ? parseTodo(toCamel(data)) : null;
  },
  setCompleted: async (id: TodoId) => {
    const data = await db
      .updateTable("todo")
      .set({ done: 1, done_at: Date.now() })
      .where("todo.id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return data ? parseTodo(toCamel(data)) : null;
  },
};
