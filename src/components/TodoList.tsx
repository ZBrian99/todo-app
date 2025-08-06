'use client';

import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTodoContext } from '@/contexts/TodoContext';
import { useUIContext } from '@/contexts/UIContext';
import TodoItem from '@/components/TodoItem';
import { FiltersType, Todo } from '@/types/todoTypes';
import TodoCreator from '@/components/TodoCreator';
import TodoDetail from '@/components/TodoDetails';
import TodoFilters from '@/components/TodoFilters';
import { TodoPriorityOrder } from '@/constants/constants';
import { useFormContext } from '@/contexts/FormContext';

export const TodoList = () => {
	const { state: todoState, dispatch: todoDispatch } = useTodoContext();
	const { state: uiState, dispatch: uiDispatch } = useUIContext();
	const { dispatch: formDispatch } = useFormContext();

	const [filters, setFilters] = useState<FiltersType>({});
	const detailsOutsideRef = useRef<HTMLDivElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		const localFilters = localStorage.getItem('filters');
		const visibleFilters = localStorage.getItem('visibleFilters');
		if (localFilters) {
			setFilters(JSON.parse(localFilters) as FiltersType);
		}
		if (visibleFilters) {
			uiDispatch({ type: 'VISIBLE_FILTERS', payload: JSON.parse(visibleFilters) });
		}
		uiDispatch({ type: 'SET_LOADING', payload: false });
	}, []);

	useEffect(() => {
		if (uiState.isLoading) return;
		const { title, ...toSaveFilters } = filters;
		localStorage.setItem('filters', JSON.stringify(toSaveFilters));
	}, [filters]);

	useEffect(() => {
		if (uiState.isLoading) return;
		localStorage.setItem('visibleFilters', JSON.stringify(uiState.isVisibleFilters));
	}, [uiState.isVisibleFilters]);

	useEffect(() => {
		const handleClickOutside = (e: Event) => {
			const target = e.target as HTMLElement;
			const container = detailsOutsideRef.current;
			const list = listRef.current;
			if ((container && target === container) || (list && target === list)) {
				uiDispatch({ type: 'TODO_VIEW', payload: false });
			}
		};
		if (uiState.isTodoView) {
			document.addEventListener('click', handleClickOutside);
		}

		return () => document.removeEventListener('click', handleClickOutside);
	}, [uiState.isTodoView]);

	const filteredTodos = useMemo(() => {
		const filtered = todoState.todos.filter((t) => {
			if (
				filters.title &&
				!t.title.toLowerCase().includes(filters.title.toLowerCase()) &&
				!t.description?.toLowerCase().includes(filters.title.toLowerCase())
			) {
				return false;
			}

			if (filters.status && (filters.status === 'completed') !== t.completed) {
				// const isComplete = filters.status === 'completed';
				// if (t.completed !== isComplete) {
				return false;
				// }
			}

			if (filters.priority && filters.priority !== t.priority) {
				return false;
			}

			if (
				filters.tags &&
				filters.tags.length > 0 &&
				!filters.tags?.every((filterTag) => t.tags?.some((todoTag) => todoTag.id === filterTag.id))
			) {
				return false;
			}
			return true;
		});

		if (filters.sort) {
			filtered.sort((a, b) => {
				switch (filters.sort) {
					case 'title-asc':
						return a.title.localeCompare(b.title);
					case 'title-desc':
						return b.title.localeCompare(a.title);
					case 'status-pending':
						return a.completed ? 1 : -1;
					case 'status-completed':
						return a.completed ? -1 : 1;
					case 'priority-asc':
						return TodoPriorityOrder[b.priority] - TodoPriorityOrder[a.priority];
					case 'priority-desc':
						return TodoPriorityOrder[a.priority] - TodoPriorityOrder[b.priority];
					case 'startDate-desc':
						return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
					case 'startDate-asc':
						return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					case 'endDate-asc':
						if (!a.dueDate && !b.dueDate) return 0;
						if (!a.dueDate) return 1;
						if (!b.dueDate) return -1;
						return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
					case 'endDate-desc':
						if (!a.dueDate && !b.dueDate) return 0;
						if (!a.dueDate) return 1;
						if (!b.dueDate) return -1;
						return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
					default:
						return 0;
				}
			});
		}
		return filtered;
	}, [filters, todoState.todos]);

	const handleToggleTodo = useCallback((id: string) => {
		todoDispatch({ type: 'TOGGLE_TODO', payload: id });
		// uiDispatch({ type: 'TODO_VIEW', payload: false });
	}, []);

	const handleEditTodo = useCallback((todo: Todo) => {
		const todoFormData = {
			title: todo.title,
			description: todo.description || '',
			priority: todo.priority,
			dueDate: todo.dueDate || '',
			tags: todo.tags || [],
			task: todo.task || [],
			completed: todo.completed,
		};
		formDispatch({ type: 'LOAD_TODO_DATA', payload: todoFormData });
		uiDispatch({ type: 'SET_EDITING_TODO', payload: todo.id });
		uiDispatch({ type: 'TODO_CREATOR', payload: true });
	}, []);

	const handleDeleteTodo = useCallback((todoId: string) => {
		todoDispatch({ type: 'DELETE_TODO', payload: todoId });
		uiDispatch({ type: 'TODO_VIEW', payload: false });
	}, []);

	const handleFiltersChange = useCallback((newFilters: FiltersType) => {
		setFilters(newFilters);
	}, []);

	const handleVisibleFilters = useCallback(() => {
		uiDispatch({ type: 'VISIBLE_FILTERS', payload: !uiState.isVisibleFilters });
	}, [uiState.isVisibleFilters]);

	// ---------------------------
	// ---------------------------
	// ---------------------------

	// Si alguien ve esto raro, si, lo es, no encontre otra forma de actualizar tanto la view sin perder el todo seleccionado y al mismo tiempo animar todo y que no se vuelva a renderizar toda la lista al añadir las dependencias en el handleTodoClick. Podria unir los reducers, seria lo mas facil, pero mezclaria la ui con la parte de todo, no creo sea la mejor idea, podria dejar que se re renderice todo, pero no lo considero buena practica, podria hacer que todo dependa de si hay o no todo seleccionado, pero eso haria que la animacion quede fea y sobre todo el problema es lograr el comportamiento de abrir cerrar la vista de detalles con el stado inverso, si tienes una mejor solucion con gusto la escuchare :)

	const selectedIdRef = useRef(todoState.selectedTodo?.id);
	const viewOpenRef = useRef(uiState.isTodoView);

	selectedIdRef.current = todoState.selectedTodo?.id;
	viewOpenRef.current = uiState.isTodoView;

	const handleTodoClick = useCallback((todo: Todo, e: MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest('.todo-item-check')) return;

		const isSameTodo = selectedIdRef.current === todo.id;
		const isOpen = viewOpenRef.current;

		if (!isSameTodo) {
			todoDispatch({ type: 'SELECTED_TODO', payload: todo });
			if (!isOpen) {
				uiDispatch({ type: 'TODO_VIEW', payload: true });
			}
		} else {
			uiDispatch({ type: 'TODO_VIEW', payload: !isOpen });
		}
	}, []);

	if (uiState.isLoading)
		return (
			<div className='fixed inset-0 flex items-center justify-center'>
				<div className='flex flex-col items-center gap-4'>
					<div className='w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin' />
					<p className='text-lg font-medium animate-pulse'>Cargando...</p>
				</div>
			</div>
		);
	return (
		<div className='flex flex-col gap-4 h-full'>
			<section
				ref={detailsOutsideRef}
				className={`flex flex-col overflow-y-auto h-[calc(100vh-5rem)] p-4 transition-all duration-300 ${
					uiState.isTodoView
						? 'sm:w-lg lg:w-[calc(100%-var(--container-xl))] 2xl:w-[calc(100%-var(--container-4xl))] w-full'
						: 'w-full'
				}`}
			>
				<TodoFilters
					filters={filters}
					visibleFilters={uiState.isVisibleFilters}
					handleFiltersChange={handleFiltersChange}
					handleVisibleFilters={handleVisibleFilters}
				/>
				<ul ref={listRef} className='flex flex-col gap-4 max-w-lg mx-auto w-full transition-all duration-300'>
					{filteredTodos &&
						filteredTodos.map((t) => (
							<TodoItem
								key={t.id}
								todo={t}
								handleCompleted={handleToggleTodo}
								handleTodoClick={handleTodoClick}
								handleEditTodo={handleEditTodo}
								handleDeleteTodo={handleDeleteTodo}
							/>
						))}
				</ul>
			</section>
			<TodoDetail
				todo={todoState.selectedTodo}
				isOpen={uiState.isTodoView}
				onClose={() => uiDispatch({ type: 'TODO_VIEW', payload: false })}
			/>
			<TodoCreator />
			<button
				className={`
					fixed 
					w-16 h-16 
					bg-gradient-to-r from-blue-500 to-purple-600
					hover:from-blue-600 hover:to-purple-700
					rounded-full
					shadow-lg 
					transition-transform duration-200 ease-out
					 active:scale-95
          active:translate-y-1
					flex items-center justify-center
					text-white font-bold text-xl
					cursor-pointer
					group
          bottom-6
          right-6
          md:z-[60]
				`}
				onClick={() => {
					uiDispatch({ type: 'TODO_CREATOR', payload: !uiState.isTodoCreate });
					if (uiState.isTodoCreate) {
						uiDispatch({ type: 'SET_EDITING_TODO', payload: null });
					}
				}}
				title={uiState.isTodoCreate ? 'Cerrar' : 'Crear nueva tarea'}
			>
				<svg
					className={`w-7 h-7 transition-transform duration-200 ease-out
					${uiState.isTodoCreate && 'rotate-[135deg]'}
          `}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
				</svg>
			</button>
		</div>
	);
};
