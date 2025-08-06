import { useTodoContext } from '@/contexts/TodoContext';
import { useFormContext } from '@/contexts/FormContext';
import { useUIContext } from '@/contexts/UIContext';
import { FormEvent, memo, useCallback, useEffect, useRef } from 'react';
import { Todo, TodoPriority, TodoTag, TodoTask } from '@/types/todoTypes';
import TodoTagsSelector from '@/components/TodoTagsSelector';
import TaskCreator from '@/components/TaskCreator';
import { tagColors } from '@/constants/constants';

const TodoCreator = () => {
	const creatorTodoRef = useRef<HTMLFormElement | null>(null);
	const titleInputRef = useRef<HTMLInputElement | null>(null);

	const { state: todoState, dispatch: todoDispatch } = useTodoContext();
	const { state: formState, dispatch: formDispatch } = useFormContext();
	const { state: uiState, dispatch: uiDispatch } = useUIContext();

	const isEditing = uiState.editingTodoId !== null;
	const editingTodo = isEditing ? todoState.todos.find((t) => t.id === uiState.editingTodoId) : null;

	useEffect(() => {
		if (isEditing && editingTodo) {
			formDispatch({
				type: 'LOAD_TODO_DATA',
				payload: {
					title: editingTodo.title,
					description: editingTodo.description || '',
					priority: editingTodo.priority || 'ninguna',
					dueDate: editingTodo.dueDate || '',
					tags: editingTodo.tags || [],
					task: editingTodo.task || [],
					completed: editingTodo.completed,
				},
			});
		}
	}, [isEditing, editingTodo]);

	useEffect(() => {
		if (uiState.isTodoCreate && titleInputRef.current) {
			const timer = setTimeout(() => {
				titleInputRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [uiState.isTodoCreate]);

	useEffect(() => {
		const handleClickOutsideCreator = (e: Event) => {
			const target = e.target as Node;
			if (!document.contains(target)) return;

			if (creatorTodoRef.current && !creatorTodoRef.current.contains(target)) {
				uiDispatch({ type: 'TODO_CREATOR', payload: false });
				uiDispatch({ type: 'SET_EDITING_TODO', payload: null });
				if (isEditing) {
					formDispatch({ type: 'RESET' });
				}
			}
		};

		if (uiState.isTodoCreate) {
			document.addEventListener('click', handleClickOutsideCreator);
		}

		return () => {
			document.removeEventListener('click', handleClickOutsideCreator);
		};
	}, [uiState.isTodoCreate, isEditing]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEditing && editingTodo) {
			const updatedTodo = {
				id: editingTodo.id,
				...formState.values,
				createdAt: editingTodo.createdAt,
			};
			todoDispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
		} else {
			const newTodo: Todo = {
				id: Date.now().toString(),
				...formState.values,
				createdAt: new Date().toISOString(),
			};
			todoDispatch({ type: 'ADD_TODO', payload: newTodo });
		}

		uiDispatch({ type: 'TODO_CREATOR', payload: false });
		uiDispatch({ type: 'SET_EDITING_TODO', payload: null });
		formDispatch({ type: 'RESET' });
	};

	const handleCreateTag = useCallback(
		(tagName: string) => {
			const newTag = {
				id: Date.now().toString(),
				color: tagColors[Math.floor(Math.random() * tagColors.length)],
				name: tagName,
			};
			formDispatch({
				type: 'ADD_TAG',
				payload: newTag,
			});
			formDispatch({ type: 'SET_FIELD', field: 'tags', value: [newTag, ...formState.values.tags] });
		},
		[formState.values.tags]
	);

	const handleSelectTag = useCallback(
		(t: TodoTag) => {
			if (formState.values.tags.some((f) => f.id === t.id)) return;
			formDispatch({ type: 'SET_FIELD', field: 'tags', value: [t, ...formState.values.tags] });
		},
		[formState.values.tags]
	);

	const handleDeleteTag = useCallback((id: string) => {
		formDispatch({ type: 'DELETE_TAG', payload: id });
	}, []);

	const handleAddTask = useCallback(
		(taskTitle: string) => {
			if (!taskTitle) return;

			const newTask: TodoTask = {
				id: Date.now().toString(),
				title: taskTitle,
				completed: false,
			};
			formDispatch({ type: 'SET_FIELD', field: 'task', value: [...formState.values.task, newTask] });
		},
		[formState.values.task]
	);

	const handleDeleteTask = (id: string) => {
		const newTask = formState.values.task.filter((t) => t.id !== id);
		formDispatch({ type: 'SET_FIELD', field: 'task', value: newTask });
	};

	return (
		<div
			className={`
				fixed inset-0 z-50 flex items-center justify-center p-4
				transition-all duration-300 ease-out
				${uiState.isTodoCreate ? 'visible bg-black/60 backdrop-blur-sm' : 'invisible bg-black/0'}
			`}
		>
			<form
				ref={creatorTodoRef}
				className={`
					w-full max-w-2xl max-h-[90vh] overflow-y-auto
					bg-gray-900
					border border-gray-700/50
					rounded-2xl shadow-2xl
					p-6 md:p-8
					flex flex-col gap-6
					transition-all duration-300 ease-out
					${uiState.isTodoCreate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
				`}
				onSubmit={handleSubmit}
			>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold text-white'>{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
					<button
						type='button'
						onClick={() => {
							uiDispatch({ type: 'TODO_CREATOR', payload: false });
							uiDispatch({ type: 'SET_EDITING_TODO', payload: null });
							if (isEditing) {
								formDispatch({ type: 'RESET' });
							}
						}}
						className='p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer'
					>
						<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>
				</div>

				<div className='space-y-2'>
					<label htmlFor='newTodoTitle' className='block text-sm font-medium text-gray-300'>
						Título *
					</label>
					<input
						required
						ref={titleInputRef}
						autoComplete='off'
						className='
							w-full px-4 py-3 
							bg-gray-800/50 border border-gray-600/50
							rounded-xl text-white placeholder-gray-400
							focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
							transition-all duration-200
						'
						type='text'
						id='newTodoTitle'
						placeholder='¿Qué necesitas hacer?'
						value={formState.values.title}
						onChange={(e) => {
							formDispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value });
						}}
					/>
				</div>

				<div className='space-y-2'>
					<label htmlFor='newTodoDescription' className='block text-sm font-medium text-gray-300'>
						Descripción
					</label>
					<textarea
						className='
							w-full px-4 py-3 
							bg-gray-800/50 border border-gray-600/50
							rounded-xl text-white placeholder-gray-400
							focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
							transition-all duration-200 resize-none
						'
						rows={4}
						id='newTodoDescription'
						placeholder='Añade más detalles sobre tu tarea...'
						value={formState.values.description}
						onChange={(e) => {
							formDispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value });
						}}
					/>
				</div>

				<div className='space-y-3'>
					<label className='block text-sm font-medium text-gray-300'>Etiquetas</label>
					<TodoTagsSelector
						tagsState={formState.tags}
						handleSelectTag={handleSelectTag}
						handleCreateTag={handleCreateTag}
						handleDeleteTag={handleDeleteTag}
						position='top'
					/>

					{formState.values.tags.length > 0 && (
						<div className='flex flex-wrap gap-2'>
							{formState.values.tags.map((t) => (
								<span
									key={t.id}
									className={`
								relative flex items-center gap-2
								px-3 py-1.5 rounded-full text-sm font-medium
								group/tag
								${t.color} text-white
							`}
								>
									{t.name}
									<button
										type='button'
										onClick={(e) => {
											e.stopPropagation();
											const tags = formState.values.tags.filter((f) => f.id !== t.id);
											formDispatch({ type: 'SET_FIELD', field: 'tags', value: tags });
										}}
										className='
											w-4 h-4 flex items-center justify-center
											bg-black/20 hover:bg-black/40 rounded-full
											transition-colors duration-200 text-xs cursor-pointer
										'
									>
										<svg className='w-2.5 h-2.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
								</span>
							))}
						</div>
					)}
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<label htmlFor='newTodoPriority' className='block text-sm font-medium text-gray-300'>
							Prioridad
						</label>
						<select
							id='newTodoPriority'
							className='
								w-full px-4 py-3 
								bg-gray-800/50 border border-gray-600/50
								rounded-xl text-white
								focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
								transition-all duration-200 appearance-none cursor-pointer
							'
							value={formState.values.priority}
							onChange={(e) => {
								formDispatch({ type: 'SET_FIELD', field: 'priority', value: e.target.value as TodoPriority });
							}}
						>
							<option className='bg-gray-800' value='ninguna'>
								Ninguna
							</option>
							<option className='bg-gray-800' value='baja'>
								Baja
							</option>
							<option className='bg-gray-800' value='media'>
								Media
							</option>
							<option className='bg-gray-800' value='alta'>
								Alta
							</option>
							<option className='bg-gray-800' value='urgente'>
								Urgente
							</option>
						</select>
					</div>

					<div className='space-y-2'>
						<label htmlFor='newTodoDateEnd' className='block text-sm font-medium text-gray-300'>
							Fecha Límite
						</label>
						<input
							type='date'
							id='newTodoDateEnd'
							className='
								w-full px-4 py-3 scheme-dark
								bg-gray-800/50 border border-gray-600/50
								rounded-xl text-white
								focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
								transition-all duration-200
							'
							value={formState.values.dueDate}
							onChange={(e) => {
								formDispatch({ type: 'SET_FIELD', field: 'dueDate', value: e.target.value });
							}}
						/>
					</div>
				</div>

				<div className='space-y-2'>
					<label className='block text-sm font-medium text-gray-300'>Subtareas</label>
					<TaskCreator handleAddTask={handleAddTask} />
					{formState.values.task.length > 0 && (
						<div className='space-y-2'>
							<div className='bg-gray-800/30 rounded-xl p-4 space-y-2'>
								{formState.values.task.map((task) => (
									<div
										key={task.id}
										className='
											flex items-center gap-3 p-2 
											bg-gray-700/30 rounded-lg
											hover:bg-gray-700/50 transition-colors duration-200
										'
									>
										<div className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0' />
										<span className='text-gray-200 flex-1'>{task.title}</span>
										<button
											type='button'
											className='
												w-6 h-6 flex items-center justify-center
												text-gray-400 hover:text-red-400 hover:bg-red-400/10
												rounded-md transition-colors duration-200 cursor-pointer
											'
											onClick={() => handleDeleteTask(task.id)}
										>
											<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
												<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
											</svg>
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className='flex gap-3 pt-4 border-t border-gray-700/50'>
					<button
						type='button'
						onClick={() => {
							uiDispatch({ type: 'TODO_CREATOR', payload: false });
							uiDispatch({ type: 'SET_EDITING_TODO', payload: null });
							if (isEditing) {
								formDispatch({ type: 'RESET' });
							}
						}}
						className='
							flex-1 px-6 py-3
							bg-gray-700/50 hover:bg-gray-700/70
							border border-gray-600/50
							rounded-xl text-gray-300 font-medium
							transition-all duration-200
							hover:brightness-110 cursor-pointer
						'
					>
						Cancelar
					</button>
					<button
						type='submit'
						className='
							flex-1 px-6 py-3
							bg-gradient-to-r from-blue-500 to-purple-600
							hover:from-blue-600 hover:to-purple-700
							rounded-xl text-white font-medium
							shadow-lg shadow-blue-500/25
							transition-all duration-200
							hover:brightness-110 active:brightness-90
							disabled:opacity-50 disabled:cursor-not-allowed
							cursor-pointer
						'
						disabled={!formState.values.title.trim()}
					>
						{isEditing ? 'Actualizar Tarea' : 'Crear Tarea'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default memo(TodoCreator);
