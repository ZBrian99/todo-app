import { MouseEvent } from 'react';

export interface TodoItemProps {
	todo: Todo;
	handleCompleted: (id: string) => void;
	handleTodoClick: (id: Todo, e: MouseEvent<HTMLDivElement>) => void;
	handleEditTodo: (todo: Todo) => void;
	handleDeleteTodo: (id: string) => void;
}

export interface TodoTag {
	id: string;
	name: string;
	color: string;
}

export type TodoPriority = 'ninguna' | 'baja' | 'media' | 'alta' | 'urgente';

export type TodoTask = {
	id: string;
	title: string;
	completed: boolean;
};

export interface Todo {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	priority: TodoPriority;
	dueDate?: string;
	createdAt: string;
	tags?: TodoTag[];
	task?: TodoTask[];
}

export type TodoForm = {
	title: string;
	description: string;
	priority: TodoPriority;
	dueDate: string;
	tags: TodoTag[];
	task: TodoTask[];
	completed: boolean;
};

export type SortTodoType =
	| 'title-asc'
	| 'title-desc'
	| 'priority-desc'
	| 'priority-asc'
	| 'status-pending'
	| 'status-completed'
	| 'startDate-desc'
	| 'startDate-asc'
	| 'endDate-asc'
	| 'endDate-desc';

export type StatusType = 'all' | 'completed' | 'incompleted';

export type FiltersType = {
	title?: string;
	status?: StatusType;
	priority?: TodoPriority;
	sort?: SortTodoType;
	tags?: TodoTag[];
};
