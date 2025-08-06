'use client';

import { memo } from 'react';
import { TodoItemProps } from '@/types/todoTypes';
import { priorityColors } from '@/constants/constants';

const TodoItem = ({ todo, handleCompleted, handleTodoClick, handleEditTodo, handleDeleteTodo }: TodoItemProps) => {
	const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date();
	const hasSubtasks = todo.task && todo.task.length > 0;
	const completedSubtasks = hasSubtasks ? todo?.task?.filter((task) => task.completed).length : 0;

	return (
		<div
			onClick={(e) => {
				handleTodoClick(todo, e);
			}}
			className={`
				todo-item group relative overflow-hidden
				bg-gray-800/50
				border border-gray-700/50
				rounded-xl p-4 w-full
				cursor-pointer
				transition-all duration-300 ease-out
				hover:bg-gray-800/70 hover:border-gray-600
				hover:shadow-lg hover:shadow-black/20
				${todo.completed ? 'opacity-60' : 'opacity-100'}
			`}
		>
			<div className={`absolute top-0 left-0 w-1 h-full ${priorityColors[todo.priority].bg} `} />

			<div className='flex items-start justify-between gap-3 mb-3'>
				<div className='flex items-start gap-3 flex-1 min-w-0'>
					<label className='todo-item-check flex-shrink-0 mt-0.5 cursor-pointer group/check'>
						<input
							type='checkbox'
							checked={todo.completed}
							onChange={() => handleCompleted(todo.id)}
							className='sr-only'
						/>
						<div
							className={`
							w-6 h-6 rounded-lg border-2 
							flex items-center justify-center
							transition-all duration-200
							group-hover/check:brightness-110
							${
								todo.completed
									? 'bg-gray-600 border-gray-600 text-white'
									: 'border-gray-500 hover:border-gray-400 hover:bg-gray-600/30'
							}
						`}
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
					</label>

					<div className='flex-1 min-w-0'>
						<h3
							className={`
							font-medium text-lg leading-tight
							transition-colors duration-200
							${todo.completed ? 'line-through text-gray-500' : 'text-gray-100'}
						`}
						>
							{todo.title}
						</h3>

						{todo.description && (
							<p
								className={`
								mt-1 text-sm leading-relaxed
								${todo.completed ? 'text-gray-600' : 'text-gray-400'}
								line-clamp-2
							`}
							>
								{todo.description}
							</p>
						)}
					</div>
				</div>

				<div className='flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
					<button
						onClick={(e) => {
							e.stopPropagation();

							handleEditTodo(todo);
						}}
						className='p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 active:scale-95  cursor-pointer'
						title='Editar tarea'
					>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
							/>
						</svg>
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation();
							handleDeleteTodo(todo.id);
						}}
						className='p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 active:scale-95 cursor-pointer'
						title='Eliminar tarea'
					>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
					</button>
				</div>
			</div>

			{todo.tags && todo.tags.length > 0 && (
				<div className='flex flex-wrap gap-1.5 mb-3'>
					{todo.tags.map((tag) => (
						<span
							key={tag.id}
							className={`
								${tag.color} 
								rounded-full px-2.5 py-1 
								text-xs font-medium 
								text-white
						
							`}
						>
							{tag.name}
						</span>
					))}
				</div>
			)}

			<div className='flex items-center justify-between text-xs'>
				{hasSubtasks && (
					<div className='flex items-center gap-1.5 text-gray-400'>
						<svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
							/>
						</svg>
						<span className={completedSubtasks === todo?.task?.length ? 'line-through text-gray-500' : 'text-gray-400'}>
							{completedSubtasks}/{todo?.task?.length}
						</span>
					</div>
				)}

				{todo.dueDate && (
					<div
						className={`
						flex items-center gap-1.5 ml-auto
						${isOverdue ? 'text-red-400' : 'text-gray-400'}
					`}
					>
						<svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
							/>
						</svg>
						<span className={isOverdue ? 'font-medium' : ''}>
							{new Date(todo.dueDate).toLocaleDateString('es-AR', {
								day: 'numeric',
								month: 'short',
							})}
						</span>
						{isOverdue && <span className='text-red-400 font-medium'>¡Vencida!</span>}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(TodoItem);
