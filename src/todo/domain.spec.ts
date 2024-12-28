import { describe, it, expect, expectTypeOf } from "vitest";
import {
  parseTodo,
  parseTodoId,
  isComplete,
  parseNewTodo,
  Todo,
  TodoId,
  NewTodo,
} from "./domain";

describe.concurrent("parseTodo", () => {
  it("parse a valid todo", () => {
    const result = parseTodo({ id: 1, title: "Buy milk" });
    expect(result).toEqual({
      id: 1,
      title: "Buy milk",
      done: false,
    });
    expectTypeOf(result).toEqualTypeOf<Todo>();
    const now = new Date();
    expect(
      parseTodo({ id: 1, title: "Buy milk done", done: true, doneAt: now })
    ).toEqual({
      id: 1,
      title: "Buy milk done",
      done: true,
      doneAt: now,
    });
  });

  it("throws an error when title is missing", () => {
    expect(() => parseTodo({ id: 1 })).toThrowError("Title is required");
  });

  it("throws an error when title is empty", () => {
    expect(() => parseTodo({ id: 1, title: "" })).toThrowError(
      "Title must be at least 1 character long"
    );
  });

  it("throws an error when title is only whitespaces", () => {
    expect(() => parseTodo({ id: 1, title: " " })).toThrowError(
      "Title must be at least 1 character long"
    );
  });
});

describe("parseTodoId", () => {
  it("parse a valid todo id", () => {
    const todoId = parseTodoId(1);
    expectTypeOf(todoId).toEqualTypeOf<TodoId>();
  });
});

describe.concurrent("parseNewTodo", () => {
  it("parse a valid new todo", () => {
    const result = parseNewTodo({ title: "Buy milk" });
    expect(result).toEqual({
      title: "Buy milk",
      done: false,
    });
    expectTypeOf(result).toEqualTypeOf<NewTodo>();
  });

  it("throws an error when title is missing", () => {
    expect(() => parseNewTodo({})).toThrowError("Title is required");
  });

  it("throws an error when title is empty", () => {
    expect(() => parseNewTodo({ title: "" })).toThrowError(
      "Title must be at least 1 character long"
    );
  });

  it("throws an error when title is only whitespaces", () => {
    expect(() => parseTodo({ title: " " })).toThrowError(
      "Title must be at least 1 character long"
    );
  });
});

describe.concurrent("isComplete", () => {
  it("returns true when todo is completed", () => {
    const todo = parseTodo({ id: 1, title: "Buy milk", done: true });
    expect(isComplete(todo)).toBe(true);
  });

  it("returns false when todo is not completed", () => {
    const todo = parseTodo({ id: 1, title: "Buy milk", done: false });
    expect(isComplete(todo)).toBe(false);
  });
});
