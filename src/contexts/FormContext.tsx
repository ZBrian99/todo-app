'use client';

import { TodoForm, TodoTag } from '@/types/todoTypes';
import { todoTags } from '@/data/data';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

type FormState = {
	values: TodoForm;
	errors: Partial<Record<keyof TodoForm, string>>;
	touched: Partial<Record<keyof TodoForm, boolean>>;
	tags: TodoTag[];
};

type FormAction =
	| { [K in keyof TodoForm]: { type: 'SET_FIELD'; field: K; value: TodoForm[K] } }[keyof TodoForm]
	| { type: 'SET_ERROR'; field: keyof TodoForm; error: string }
	| { type: 'TOUCHED'; field: keyof TodoForm; value: boolean }
	| { type: 'SET_ALL_ERRORS'; errors: Partial<Record<keyof TodoForm, string>> }
	| { type: 'RESET' }
	| { type: 'LOAD_TODO_DATA'; payload: TodoForm }
	| { type: 'SET_TAGS'; payload: TodoTag[] }
	| { type: 'ADD_TAG'; payload: TodoTag }
	| { type: 'DELETE_TAG'; payload: string };

type FormContextType = {
	state: FormState;
	dispatch: Dispatch<FormAction>;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormValues: TodoForm = {
	title: '',
	description: '',
  priority: 'ninguna',
	dueDate: '',
	tags: [],
	task: [],
	completed: false,
};

const initialFormState: FormState = {
	values: initialFormValues,
	errors: {},
	touched: {},
	tags: [],
};

const formReducer = (state: FormState, action: FormAction): FormState => {
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
			return { ...state, values: initialFormValues, errors: {}, touched: {} };
		case 'LOAD_TODO_DATA':
			return { ...state, values: action.payload, errors: {}, touched: {} };
		case 'SET_TAGS':
			return { ...state, tags: [...action.payload] };
		case 'ADD_TAG':
			return { ...state, tags: [...state.tags, action.payload] };
		case 'DELETE_TAG':
			return { ...state, tags: state.tags.filter((t) => t.id !== action.payload) };
		default:
			return state;
	}
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(formReducer, initialFormState);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		const tags = localStorage.getItem('tags');
		const todos = localStorage.getItem('todos');
		if (tags === null && todos === null) {
			dispatch({ type: 'SET_TAGS', payload: todoTags });
		} else if (tags) {
			dispatch({ type: 'SET_TAGS', payload: JSON.parse(tags) });
		}
		else if (todos !== null && tags === null) {
			dispatch({ type: 'SET_TAGS', payload: todoTags });
		}
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		if (isHydrated) {
			localStorage.setItem('tags', JSON.stringify(state.tags));
		}
	}, [state.tags, isHydrated]);

	return <FormContext.Provider value={{ state, dispatch }}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error('useFormContext must be used within a FormProvider');
	}
	return context;
};
