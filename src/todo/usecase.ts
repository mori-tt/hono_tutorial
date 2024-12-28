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

export const toggleTodo = async (
  { selectById, setCompleted, setUncompleted }: TodoRepository,
  id: TodoId
) => {
  const todo = await selectById(id);
  if (!todo) {
    throw new Error("Todo not found");
  }
  return isComplete(todo) ? await setUncompleted(id) : await setCompleted(id);
};
