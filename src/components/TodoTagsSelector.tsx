import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { TodoTag } from '@/types/todoTypes';

interface TodoTagsSelector {
	tagsState: TodoTag[];
	handleSelectTag: (t: TodoTag) => void;
	handleCreateTag?: (tagName: string) => void;
	handleDeleteTag?: (id: string) => void;
	position?: 'top' | 'bottom';
	placeholder?: string;
	label?: boolean;
	className?: string;
}

const TodoTagsSelector = ({
	tagsState,
	handleSelectTag,
	handleCreateTag,
	handleDeleteTag,
	position = 'bottom',
	placeholder,
	className,
}: TodoTagsSelector) => {
	const tagSelectorRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [searchTag, setSearchTag] = useState('');
	const [isOpenTagSelecctor, setIsOpenTagSelecctor] = useState(false);

	const filteredTags = useMemo(() => {
		const tags = tagsState.filter((t) => t.name.toLowerCase().includes(searchTag.toLowerCase()));
		return tags;
	}, [tagsState, searchTag]);

	useEffect(() => {
		const handleClickOutsideTags = (e: Event) => {
			const target = e.target as Node;
			if (tagSelectorRef.current && !tagSelectorRef.current.contains(target)) {
				setSearchTag('');
				setIsOpenTagSelecctor(false);
			}
		};

		if (isOpenTagSelecctor) {
			document.addEventListener('click', handleClickOutsideTags);
		}

		return () => {
			document.removeEventListener('click', handleClickOutsideTags);
		};
	}, [isOpenTagSelecctor]);

	return (
		<div className={`flex flex-col w-full relative ${className}`} ref={tagSelectorRef}>
			<input
				type='text'
				autoComplete='off'
				id='newTodoTags'
				className='
						w-full px-4 py-3 
						bg-gray-800/50 border border-gray-600/50
						rounded-xl text-white placeholder-gray-400
						focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
						transition-all duration-200 cursor-pointer
					'
				ref={inputRef}
				placeholder={placeholder || 'Buscar o crear etiquetas...'}
				value={searchTag}
				onClick={() => {
					setIsOpenTagSelecctor(true);
				}}
				onChange={(e) => setSearchTag(e.target.value)}
			/>
			{isOpenTagSelecctor && (
				<div
					className={`
							absolute w-full
							${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
							bg-gray-800
							border border-gray-600/50
							rounded-xl shadow-xl shadow-black/20
							max-h-52 overflow-y-auto
						`}
				>
					<ul className='flex flex-col p-1'>
						{filteredTags.length > 0 ? (
							filteredTags.map((t) => (
								<li
									key={t.id}
									className='
											flex items-center gap-2 px-3 py-2
											text-gray-200 hover:bg-gray-700/50
											rounded-lg cursor-pointer
											transition-colors duration-200
											group/sTag
										'
									onClick={() => {
										handleSelectTag(t);
										setSearchTag('');
										setTimeout(() => {
											inputRef.current?.focus();
										}, 0);
									}}
								>
									<span className={`w-3 h-3 rounded-full ${t.color}`} />
									<span className='flex-1'>{t.name}</span>
									{handleDeleteTag && (
										<button
											className='
													w-6 h-6 flex items-center justify-center
													text-gray-400 hover:text-red-400 hover:bg-red-400/10
													rounded-md transition-colors duration-200
													opacity-0 group-hover/sTag:opacity-100
													cursor-pointer
												'
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteTag(t.id);
											}}
										>
											<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
												<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
											</svg>
										</button>
									)}
								</li>
							))
						) : handleCreateTag && searchTag.trim() ? (
							<li
								className='
										flex items-center gap-2 px-3 py-2
										text-blue-400 hover:bg-blue-500/10
										rounded-lg cursor-pointer
										transition-colors duration-200
									'
								onClick={() => {
									handleCreateTag(searchTag);
									setSearchTag('');
									setTimeout(() => {
										setIsOpenTagSelecctor(true);
										inputRef.current?.focus();
									}, 0);
								}}
							>
								<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
								</svg>
								<span>Crear &quot;{searchTag}&quot;</span>
							</li>
						) : (
							<li className='px-3 py-2 text-gray-400 text-sm'>Sin resultados</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

export default memo(TodoTagsSelector);
