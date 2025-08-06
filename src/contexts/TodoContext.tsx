'use client';

import { Todo } from '@/types/todoTypes';
import { initialTodos, todoTags } from '@/data/data';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

type TodoState = {
	todos: Todo[];
	selectedTodo: Todo | null;
};

type TodoAction =
	| { type: 'SET_TODOS'; payload: Todo[] }
	| { type: 'ADD_TODO'; payload: Todo }
	| { type: 'UPDATE_TODO'; payload: Partial<Todo> & { id: string } }
	| { type: 'TOGGLE_TODO'; payload: string }
	| { type: 'DELETE_TODO'; payload: string }
	| { type: 'SELECTED_TODO'; payload: Todo }
	| { type: 'CLEAR_SELECTED_TODO' };

type TodoContextType = {
	state: TodoState;
	dispatch: Dispatch<TodoAction>;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const initialTodoState: TodoState = {
	todos: [],
	selectedTodo: null,
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
	switch (action.type) {
		case 'SET_TODOS':
			return { ...state, todos: [...action.payload] };
		case 'ADD_TODO':
			return { ...state, todos: [action.payload, ...state.todos] };
		case 'UPDATE_TODO':
			const updatedTodosForUpdate = state.todos.map((t) => {
				return t.id !== action.payload.id ? t : { ...t, ...action.payload };
			});
			const updatedSelectedTodoForUpdate = state.selectedTodo?.id === action.payload.id 
				? { ...state.selectedTodo, ...action.payload }
				: state.selectedTodo;
			return {
				...state,
				todos: updatedTodosForUpdate,
				selectedTodo: updatedSelectedTodoForUpdate,
			};
		case 'TOGGLE_TODO':
			const updatedTodos = state.todos.map((t) => (t.id !== action.payload ? t : { ...t, completed: !t.completed }));
			const updatedSelectedTodo = state.selectedTodo?.id === action.payload 
				? { ...state.selectedTodo, completed: !state.selectedTodo.completed }
				: state.selectedTodo;
			return {
				...state,
				todos: updatedTodos,
				selectedTodo: updatedSelectedTodo,
			};
		case 'DELETE_TODO':
			return {
				...state,
				todos: state.todos.filter((t) => t.id !== action.payload),
				selectedTodo: state.selectedTodo?.id === action.payload ? null : state.selectedTodo,
			};
		case 'SELECTED_TODO':
			return { ...state, selectedTodo: action.payload };
		case 'CLEAR_SELECTED_TODO':
			return { ...state, selectedTodo: null };
		default:
			return state;
	}
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(todoReducer, initialTodoState);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const todos = localStorage.getItem('todos');
		const tags = localStorage.getItem('tags');
		if (todos === null && tags === null) {
			dispatch({ type: 'SET_TODOS', payload: initialTodos });
			localStorage.setItem('tags', JSON.stringify(todoTags));
		} else if (todos) {
			dispatch({ type: 'SET_TODOS', payload: JSON.parse(todos) });
		}
		setIsLoaded(true);
	}, []);

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('todos', JSON.stringify(state.todos));
		}
	}, [state.todos, isLoaded]);

	return <TodoContext.Provider value={{ state, dispatch }}>{children}</TodoContext.Provider>;
};

export const useTodoContext = () => {
	const context = useContext(TodoContext);
	if (!context) {
		throw new Error('useTodoContext debe usarse dentro de TodoProvider');
	}
	return context;
};