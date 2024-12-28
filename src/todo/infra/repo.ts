import type { TodoRepository, Todo, NewTodo, TodoId } from "../domain";
export const todoRepository: TodoRepository = {
  selectAll: async () => {
    //TODO: Implement
    return [];
  },
  selectById: async (id: TodoId) => {
    //TODO: Implement
    return {} as Todo;
  },
  insert: async (todo: NewTodo) => {
    //TODO: Implement
    return {} as Todo;
  },
  setCompleted: async (id: TodoId) => {
    //TODO: Implement
    return {} as Todo;
  },
};
