import { Todo, TodoForm, TodoTag } from '@/types/todoTypes';

export type UIState = {
	isLoading: boolean;
	isTodoCreate: boolean;
	isTodoView: boolean;
};

export type UIAction =
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'TODO_CREATOR'; payload: boolean }
	| { type: 'TODO_VIEW'; payload: boolean };

export type FormState = {
	values: TodoForm;
	errors: Partial<Record<keyof TodoForm, string>>;
	touched: Partial<Record<keyof TodoForm, boolean>>;
};

export type FormAction<T> =
	| { [K in keyof T]: { type: 'SET_FIELD'; field: K; value: T[K] } }[keyof T]
	| { type: 'SET_ERROR'; field: keyof T; error: string }
	| { type: 'TOUCHED'; field: keyof T; value: boolean }
	| { type: 'SET_ALL_ERRORS'; errors: Partial<Record<keyof T, string>> }
	| { type: 'RESET' };

export type TodoAction =
	| { type: 'SET_TODOS'; payload: Todo[] }
	| { type: 'ADD_TODO'; payload: Todo }
	| { type: 'UPDATE_TODO'; payload: Partial<Todo> & { id: string } }
	| { type: 'TOGGLE_TODO'; payload: string }
	| { type: 'DELETE_TODO'; payload: string };

export type SelectedTodoAction =
	| {
			type: 'SELECTED_TODO';
			payload: Todo;
	  }
	| {
			type: 'CLEAR_SELECTED_TODO';
	  };

export type TagAction =
	| { type: 'SET_TAGS'; payload: TodoTag[] }
	| { type: 'ADD_TAG'; payload: TodoTag }
	| { type: 'DELETE_TAG'; payload: string };

export type FeatureState = {
	todos: Todo[];
	selectedTodo: Todo | null;
	tags: TodoTag[];
	form: FormState;
	ui: UIState;
};

export type FeatureAction = UIAction | FormAction<TodoForm> | TodoAction | SelectedTodoAction | TagAction;
