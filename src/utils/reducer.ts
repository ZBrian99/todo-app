import { Todo, TodoForm, TodoTag } from '@/types/todoTypes';
import {
	FeatureAction,
	FeatureState,
	FormAction,
	FormState,
	SelectedTodoAction,
	TagAction,
	TodoAction,
	UIAction,
	UIState,
} from '@/types/reducersTypes';

export const initialFormState: TodoForm = {
	title: '',
	description: '',
	priority: 'ninguna',
	dueDate: '',
	tags: [],
	task: [],
	completed: false,
};

export const formReducer = (state: FormState, action: FormAction<TodoForm>): FormState => {
	switch (action.type) {
		case 'SET_FIELD':
			return { ...state, values: { ...state.values, [action.field]: action.value } };
		case 'SET_ERROR':
			return { ...state, errors: { ...state.errors, [action.field]: action.error } };
		case 'TOUCHED':
			return { ...state, touched: { ...state.touched, [action.field]: action.value } };
		case 'SET_ALL_ERRORS':
			return { ...state, errors: action.errors };
		case 'RESET':
			return { ...state, values: initialFormState, errors: {}, touched: {} };
		default:
			return state;
	}
};

export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
	switch (action.type) {
		case 'SET_TODOS':
			return [...action.payload];
		case 'ADD_TODO':
			return [action.payload, ...state];
		case 'UPDATE_TODO':
			return state.map((t) => {
				return t.id !== action.payload.id ? t : { ...t, ...action.payload };
			});
		case 'TOGGLE_TODO':
			return state.map((t) => (t.id !== action.payload ? t : { ...t, completed: !t.completed }));
		case 'DELETE_TODO':
			return state.filter((t) => t.id !== action.payload);
		default:
			return state;
	}
};

export const selectedTodoReducer = (state: Todo | null, action: SelectedTodoAction) => {
	switch (action.type) {
		case 'SELECTED_TODO':
			return action.payload;
		case 'CLEAR_SELECTED_TODO':
			return null;
		default:
			return state;
	}
};

export const tagReducer = (state: TodoTag[], action: TagAction): TodoTag[] => {
	switch (action.type) {
		case 'SET_TAGS':
			return [...action.payload];
		case 'ADD_TAG':
			return [...state, action.payload];
		case 'DELETE_TAG':
			return state.filter((t) => t.id !== action.payload);
		default:
			return state;
	}
};

export const uiReducer = (state: UIState, action: UIAction): UIState => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };
		case 'TODO_CREATOR':
			return { ...state, isTodoCreate: action.payload };
		case 'TODO_VIEW':
			return { ...state, isTodoView: action.payload };
		default:
			return state;
	}
};

export const featureReducer = (state: FeatureState, action: FeatureAction): FeatureState => {
	return {
		todos: todoReducer(state.todos, action as TodoAction),
		selectedTodo: selectedTodoReducer(state.selectedTodo, action as SelectedTodoAction),
		tags: tagReducer(state.tags, action as TagAction),
		form: formReducer(state.form, action as FormAction<TodoForm>),
		ui: uiReducer(state.ui, action as UIAction),
	};
};
