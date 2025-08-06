'use client';

import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

type UIState = {
	isLoading: boolean;
	isTodoCreate: boolean;
	isTodoView: boolean;
	isVisibleFilters: boolean;
	editingTodoId: string | null;
};

type UIAction =
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'TODO_CREATOR'; payload: boolean }
	| { type: 'TODO_VIEW'; payload: boolean }
	| { type: 'VISIBLE_FILTERS'; payload: boolean }
	| { type: 'SET_EDITING_TODO'; payload: string | null };

type UIContextType = {
	state: UIState;
	dispatch: Dispatch<UIAction>;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

const initialUIState: UIState = {
	isLoading: true,
	isTodoCreate: false,
	isTodoView: false,
	isVisibleFilters: false,
	editingTodoId: null,
};

const uiReducer = (state: UIState, action: UIAction): UIState => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };
		case 'TODO_CREATOR':
			return { ...state, isTodoCreate: action.payload };
		case 'TODO_VIEW':
			return { ...state, isTodoView: action.payload };
		case 'VISIBLE_FILTERS':
			return { ...state, isVisibleFilters: action.payload };
		case 'SET_EDITING_TODO':
			return { ...state, editingTodoId: action.payload };
		default:
			return state;
	}
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(uiReducer, initialUIState);

	return <UIContext.Provider value={{ state, dispatch }}>{children}</UIContext.Provider>;
};

export const useUIContext = () => {
	const context = useContext(UIContext);
	if (!context) {
		throw new Error('useUIContext debe usarse dentro de UIProvider');
	}
	return context;
};
