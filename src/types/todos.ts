import { TodoIconTypes } from "../components/Navigation/TodoGridItem/TodoIcon";
export interface Todo {
    text: string;
    completed?: number;
    date: number;
    deadline: number;
}

export interface TodoGroup {
    belongsTo?: string,
    id: number;
    name: string;
    icon: TodoIconTypes;
    todos: Todo[];
    completedTodos: Todo[];
    created: number;
    lastEdit?: number;
}

export interface TodoFolder {
    id: number;
    name: string;
}