import { memo } from 'react';
import { Todo } from '@/types/todoTypes';
import { priorityColors } from '@/constants/constants';
import { formatDate } from '@/utils/formatDate';
import { useTodoContext } from '@/contexts/TodoContext';

interface TodoDetailProps {
	todo: Todo | null;
	isOpen: boolean;
	onClose?: () => void;
}

const TodoDetail = ({ todo, isOpen, onClose }: TodoDetailProps) => {
	const { dispatch: todoDispatch } = useTodoContext();

	const handleToggleComplete = () => {
		if (todo) {
			todoDispatch({ type: 'TOGGLE_TODO', payload: todo.id });
		}
	};

	const handleToggleSubtask = (subtaskId: string) => {
		if (todo) {
			const updatedTasks = todo.task?.map(task => 
				task.id === subtaskId ? { ...task, completed: !task.completed } : task
			) || [];
			
			todoDispatch({ 
				type: 'UPDATE_TODO', 
				payload: { id: todo.id, task: updatedTasks } 
			});
		}
	};
	if (!todo) {
		return (
			<section
				className={`fixed top-20 right-0 bg-gray-900 sm:border-l  border-gray-700/50 w-full sm:w-xl 2xl:w-4xl h-[calc(100svh-5rem)] transition-all duration-300 ease-in-out overflow-y-auto flex flex-col z-50 ${
					isOpen ? '' : 'translate-x-full'
				}`}
			>
				<div className='flex flex-col px-4 py-[22px] lg:hidden'>
					{onClose && (
						<>
							<button
								onClick={onClose}
								className=' ml-auto rounded-lg text-gray-400 hover:text-gray-200 transition-all duration-200 active:scale-95 cursor-pointer lg:hidden'
							>
								<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
								</svg>
							</button>
							<div className='h-px bg-gray-700/30 mt-5'></div>
						</>
					)}
				</div>

				<div className='flex flex-col items-center justify-center h-full text-gray-400'>
					<div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center'>
						<svg className='w-8 h-8 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
							/>
						</svg>
					</div>
					<p className='text-lg font-medium'>Seleccioná una tarea</p>
					<p className='text-sm text-gray-500 mt-1'>para ver los detalles</p>
				</div>
			</section>
		);
	}

	return (
		<section
			className={`fixed top-20 right-0 bg-gray-900 sm:border-l  border-gray-700/50 w-full sm:w-xl 2xl:w-4xl h-[calc(100svh-5rem)] transition-all duration-300 ease-in-out overflow-y-auto flex flex-col z-50 ${
				isOpen ? '' : 'translate-x-full'
			}`}
		>
			<div className='p-4 pb-0'>
				<div className='flex items-center gap-4 mb-4'>
					<button onClick={handleToggleComplete} className='group my-1.5 cursor-pointer'>
						<div
							className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:brightness-110 group-active:scale-95 ${
								todo.completed
									? 'bg-gray-600 border-gray-600 text-white'
									: 'border-gray-500 bg-gray-700/50 text-gray-400 hover:border-gray-400 hover:bg-gray-600/30'
							}`}
						>
							{todo.completed && (
								<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							)}
						</div>
					</button>

					<div className='w-px h-6 bg-gray-700/50'></div>

					{todo.dueDate && (
						<div className='flex items-center gap-2'>
							<svg className='hidden sm:w-4 sm:h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
							<span
								className={`text-xs sm:text-sm font-medium ${
									todo.dueDate && new Date(todo.dueDate) < new Date() ? 'text-red-400' : 'text-gray-300'
								}`}
							>
								{new Date(todo.dueDate).toLocaleDateString('es-AR', {
									day: 'numeric',
									month: 'short',
									year: 'numeric',
								})}
							</span>
						</div>
					)}

					<div className='flex items-center gap-3 ml-auto'>
						{todo.priority !== 'ninguna' && (
							<div
								className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
									priorityColors[todo.priority].border
								} bg-gray-800/30`}
							>
								<div className={`w-2 h-2 rounded-full ${priorityColors[todo.priority].bg}`} />
								<span className='text-xs sm:text-sm font-medium text-white capitalize'>Prioridad {todo.priority}</span>
							</div>
						)}

						{onClose && (
							<>
								<div className='w-px h-6 bg-gray-700/50 lg:hidden'></div>
								<button
									onClick={onClose}
									className='rounded-lg text-gray-400 hover:text-gray-200 transition-all duration-200 active:scale-95 cursor-pointer lg:hidden'
								>
									<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
									</svg>
								</button>
							</>
						)}
					</div>
				</div>

				<div className='h-px bg-gray-700/50 mb-4'></div>

				<h1
					className={`text-2xl sm:text-3xl font-bold leading-tight transition-colors ${
						todo.completed ? 'text-gray-400' : 'text-white'
					}`}
				>
					{todo.title}
				</h1>
			</div>

			<div className='flex-1 p-6 space-y-6'>
				{todo.tags && todo.tags.length > 0 && (
					<div>
						<h3 className='text-lg font-medium text-gray-300 mb-3'>Etiquetas</h3>
						<div className='flex flex-wrap gap-1.5'>
							{todo.tags.map((tag) => (
								<span key={tag.id} className={`px-3 py-1.5 rounded-full text-xs font-medium text-white ${tag.color}`}>
									{tag.name}
								</span>
							))}
						</div>
					</div>
				)}

				{todo.description && (
					<div>
						<h3 className='text-lg font-medium text-gray-300 mb-3'>Descripción</h3>
						<div className='bg-gray-800/30 border border-gray-700/50 rounded-lg p-4'>
							<p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>{todo.description}</p>
						</div>
					</div>
				)}

				{todo.task && todo.task.length > 0 && (
					<div>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-m text-gray-300'>Subtareas</h3>
							<span className='text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700'>
								{todo.task.filter((t) => t.completed).length} de {todo.task.length} completadas
							</span>
						</div>

						<div className='space-y-3'>
							{todo.task.map((task, index) => (
								<div
									key={task.id}
									className='group flex items-center gap-3 p-3 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 cursor-pointer'
									style={{ animationDelay: `${index * 50}ms` }}
									onClick={() => handleToggleSubtask(task.id)}
								>
									<button
										className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 group-hover:brightness-110 cursor-pointer ${
											task.completed
												? 'bg-gray-600 border-gray-600 text-white'
												: 'border-gray-500 bg-gray-700/50 text-gray-400 hover:border-gray-400 hover:bg-gray-600/30'
										}`}
									>
										{task.completed && (
											<svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
												<path
													fillRule='evenodd'
													d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
													clipRule='evenodd'
												/>
											</svg>
										)}
									</button>
									<span
										className={`flex-1 transition-all duration-200 ${
											task.completed ? 'text-gray-400 line-through' : 'text-gray-200 group-hover:text-white'
										}`}
									>
										{task.title}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className='p-4 border-t border-gray-700/30'>
				<div className='text-xs text-gray-500 space-y-1'>
					<div>ID: {todo.id}</div>
					<div>Creada: {formatDate(todo.createdAt)}</div>
				</div>
			</div>
		</section>
	);
};

export default memo(TodoDetail);
