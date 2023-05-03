import { writable, derived } from "svelte/store";

type Todo = import ('@prisma/client').Todo;
const noTodos: Todo[] = [];

// store of todos
export const todosStore = writable(noTodos);

// derived store that finds current highest order value
export const orderCount = derived(todosStore, ($todosStore) => {
    if ($todosStore.length == 0) return 0;
    else return Math.max(...$todosStore.map((todo: Todo) => todo.order));
});

// export const highestOrder = todosStore.map((todos: Todo[]) => {
//     if (todos.length == 0) return 0;
//     else return Math.max(...todos.map((todo: Todo) => todo.order));
// }