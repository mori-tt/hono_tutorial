import { db } from "./db";
import { toCamel } from "snake-camel";
import type { TodoRepository } from "../domain";
import { parseTodo } from "../domain";

export const todoRepository: TodoRepository = {
  selectAll: async (offset, limit) => {
    const data = await db
      .selectFrom("todo")
      .selectAll()
      .offset(offset * limit)
      .limit(limit)
      .orderBy("id desc")
      .execute();
    return data.map((x) => parseTodo(toCamel(x)));
  },
  selectById: async (id) => {
    const data = await db
      .selectFrom("todo")
      .selectAll()
      .where("todo.id", "=", id)
      .executeTakeFirst();
    return data ? parseTodo(toCamel(data)) : null;
  },
  insert: async (input) => {
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
  setCompleted: async (id) => {
    const data = await db
      .updateTable("todo")
      .set({ done: 1, done_at: Date.now() })
      .where("todo.id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return data ? parseTodo(toCamel(data)) : null;
  },
};
