import { parseNewTodo, isComplete, TodoRepository, TodoId } from "./domain";

export const readTodos = async (
  { selectAll }: TodoRepository,
  page = 1,
  limit = 10
) => {
  if (page < 1) {
    throw Error("page should be a positive number");
  }
  return await selectAll(page - 1, limit);
};

export const createTodo = async ({ insert }: TodoRepository, title: string) => {
  const todo = parseNewTodo({ title });
  return await insert(todo);
};

export const completeTodo = async (
  { selectById, setCompleted }: TodoRepository,
  id: TodoId
) => {
  const todo = await selectById(id);
  if (!todo) {
    throw new Error("Todo not found");
  }
  if (isComplete(todo)) {
    return todo;
  }
  return await setCompleted(id);
};
