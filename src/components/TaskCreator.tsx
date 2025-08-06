import { memo, useRef, useState } from 'react';

interface TaskCreatorProps {
	handleAddTask: (taskTitle: string) => void;
}

const TaskCreator = ({ handleAddTask }: TaskCreatorProps) => {
	const [taskTitle, setTaskTitle] = useState('');
	const taskTitleInputRef = useRef<HTMLInputElement | null>(null);
	const [visibleTaskCreator, setVisibleTaskCreator] = useState(false);

	return (
		<div className='flex flex-col gap-2'>
			{!visibleTaskCreator ? (
				<button
					type='button'
					onClick={() => {
						setVisibleTaskCreator(true);
						setTimeout(() => {
							taskTitleInputRef.current?.focus();
						}, 0);
					}}
					className='
						w-full px-4 py-3
						bg-gray-800/30 hover:bg-gray-800/50
						border border-gray-600/50 border-dashed
						rounded-xl text-gray-400 hover:text-gray-300
						transition-all duration-200
						flex items-center justify-center gap-2
						cursor-pointer
					'
				>
					<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
					</svg>
					Añadir subtarea
				</button>
			) : (
				<div className='flex gap-2'>
					<input
						ref={taskTitleInputRef}
						type='text'
						value={taskTitle}
						onChange={(e) => setTaskTitle(e.target.value)}
						placeholder='Título de la subtarea...'
						className='
							w-full px-4 py-3 
							bg-gray-800/50 border border-gray-600/50
							rounded-lg text-white placeholder-gray-400
							focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
							transition-all duration-200
						'
					/>
					<button
						type='button'
						disabled={!taskTitle.trim()}
						className='
							min-w-12 h-12
							bg-blue-500 hover:bg-blue-600
							rounded-lg text-white font-medium
							transition-all duration-200
							hover:brightness-110 active:brightness-90
							disabled:opacity-50 disabled:cursor-not-allowed
							cursor-pointer
						'
						onClick={(e) => {
							e.preventDefault();
							handleAddTask(taskTitle.trim());
							setTaskTitle('');
							setTimeout(() => {
								taskTitleInputRef.current?.focus();
							}, 0);
						}}
					>
						<svg className='w-4 h-4 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
						</svg>
					</button>
					<button
						type='button'
						onClick={() => {
							setVisibleTaskCreator(false);
							setTaskTitle('');
						}}
						className='
							min-w-12 h-12
							bg-gray-700/50 hover:bg-gray-700/70
							border border-gray-600/50
							rounded-lg text-gray-400 hover:text-gray-300
							transition-all duration-200
							hover:brightness-110
							cursor-pointer
						'
					>
						<svg className='w-4 h-4 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};

export default memo(TaskCreator);
