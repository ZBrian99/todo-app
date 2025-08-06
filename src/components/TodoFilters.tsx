'use client';

import { memo, useCallback } from 'react';
import { FiltersType, SortTodoType, StatusType, TodoPriority, TodoTag } from '@/types/todoTypes';
import TodoTagsSelector from '@/components/TodoTagsSelector';
import { useFormContext } from '@/contexts/FormContext';

interface TodoFiltersProps {
	filters: FiltersType;
	visibleFilters: boolean;
	handleFiltersChange: (newFilters: FiltersType) => void;
	handleVisibleFilters: () => void;
}

const TodoFilters = ({ filters, visibleFilters, handleFiltersChange, handleVisibleFilters }: TodoFiltersProps) => {
	const { state } = useFormContext();

	const handleSelectTag = useCallback(
		(tag: TodoTag) => {
			if (filters?.tags?.some((f) => f.id === tag.id)) return;
			handleFiltersChange({ ...filters, tags: filters?.tags ? [tag, ...filters?.tags] : [tag] });
		},
		[filters]
	);
	return (
		<div className='max-w-4xl mx-auto w-full z-10'>
			<div className='flex gap-4 mb-4'>
				<div className='relative flex-1'>
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
						<svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
					</div>
					<input
						type='text'
						placeholder='Buscar tareas...'
						className='
							w-full pl-10 pr-4 py-3
							bg-gray-800/50 border border-gray-600/50
							rounded-xl text-white placeholder-gray-400
							focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
							transition-all duration-200
						'
						value={filters.title || ''}
						onChange={(e) => handleFiltersChange({ ...filters, title: e.target.value })}
					/>
				</div>
				<button
					onClick={() => handleVisibleFilters()}
					className='
						px-4 py-3 
						bg-gray-800/50 hover:bg-gray-700/50
						border border-gray-600/50
						rounded-xl text-gray-300 hover:text-white
						transition-all duration-200
						flex items-center gap-2
						cursor-pointer
					'
					title={visibleFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
				>
					<svg
						className={`w-4 h-4 transition-transform duration-200 ${visibleFilters ? 'rotate-180' : ''}`}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
					</svg>
					<span className='hidden sm:inline'>Filtros</span>
				</button>
			</div>
			<div
				className={`
				${!visibleFilters ? 'hidden' : ''}
        mb-4
			`}
			>
				<div
					className='
        flex gap-4 flex-col
					bg-gray-900
					border border-gray-700/50 rounded-xl p-4
				'
				>
					<div className='flex items-center justify-between'>
						<h3 className='text-lg font-semibold text-white'>Filtros Avanzados</h3>
						<button
							onClick={() => {
								handleFiltersChange({});
							}}
							className='
								px-3 py-1.5 text-sm
								bg-red-500/20 hover:bg-red-500/30
								border border-red-500/30
								rounded-lg text-red-300 hover:text-red-200
								transition-all duration-200
								flex items-center gap-1
								cursor-pointer
							'
							title='Limpiar todos los filtros'
						>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
								/>
							</svg>
							Limpiar
						</button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-300'>Etiquetas</label>
							<TodoTagsSelector
								tagsState={state.tags}
								handleSelectTag={handleSelectTag}
								placeholder='Seleccionar etiquetas'
								label={false}
							/>
						</div>

						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-300'>Prioridad</label>
							<select
								className='
									w-full px-3 py-3
									bg-gray-800/50 border border-gray-600/50
									rounded-lg text-white
									focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
									transition-all duration-200 appearance-none cursor-pointer
								'
								value={filters.priority || ''}
								onChange={(e) => handleFiltersChange({ ...filters, priority: e.target.value as TodoPriority })}
							>
								<option className='bg-gray-800 text-gray-400' value=''>
									Todas
								</option>
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
							<label className='block text-sm font-medium text-gray-300'>Estado</label>
							<select
								value={filters.status || ''}
								onChange={(e) => handleFiltersChange({ ...filters, status: e.target.value as StatusType })}
								className='
									w-full px-3 py-3
									bg-gray-800/50 border border-gray-600/50
									rounded-lg text-white
									focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
									transition-all duration-200 appearance-none cursor-pointer
								'
							>
								<option value='' className='bg-gray-800 text-gray-400'>
									Todos
								</option>
								<option value='incompleted' className='bg-gray-800'>
									Pendientes
								</option>
								<option value='completed' className='bg-gray-800'>
									Completadas
								</option>
							</select>
						</div>

						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-300'>Ordenar por</label>
							<select
								className='
									w-full px-3 py-3
									bg-gray-800/50 border border-gray-600/50
									rounded-lg text-white
									focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
									transition-all duration-200 appearance-none cursor-pointer
								'
								value={filters.sort || ''}
								onChange={(e) => handleFiltersChange({ ...filters, sort: e.target.value as SortTodoType })}
							>
								<option value='' className='bg-gray-800 text-gray-400'>
									Sin orden
								</option>
								<option value='title-asc' className='bg-gray-800'>
									Título A-Z
								</option>
								<option value='title-desc' className='bg-gray-800'>
									Título Z-A
								</option>
								<option value='startDate-desc' className='bg-gray-800'>
									Más Recientes
								</option>
								<option value='startDate-asc' className='bg-gray-800'>
									Más Antiguas
								</option>
								<option value='priority-desc' className='bg-gray-800'>
									Prioridad Alta
								</option>
								<option value='priority-asc' className='bg-gray-800'>
									Prioridad Baja
								</option>
								<option value='status-pending' className='bg-gray-800'>
									Pendientes
								</option>
								<option value='status-completed' className='bg-gray-800'>
									Completadas
								</option>
								<option value='endDate-asc' className='bg-gray-800'>
									Vencen Primero
								</option>
								<option value='endDate-desc' className='bg-gray-800'>
									Vencen Último
								</option>
							</select>
						</div>
					</div>
				</div>

				{filters.tags && filters.tags.length > 0 && (
					<div className='space-y-2 mt-4'>
						<div className='flex items-center gap-2'>
							<svg className='w-4 h-4 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
								/>
							</svg>
							<span className='text-sm font-medium text-gray-300'>Etiquetas seleccionadas:</span>
						</div>
						<div className='flex flex-wrap gap-2'>
							{filters.tags.map((t) => (
								<span
									key={t.id}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white ${t.color}`}
								>
									{t.name}
									<button
										type='button'
										onClick={(e) => {
											e.stopPropagation();
											const tags = filters?.tags?.filter((f) => f.id !== t.id);
											handleFiltersChange({ ...filters, tags });
										}}
										className='
												w-4 h-4 flex items-center justify-center
												bg-black/20 hover:bg-black/40 rounded-full
												transition-colors duration-200 text-xs
												cursor-pointer
											'
										title={`Quitar filtro: ${t.name}`}
									>
										<svg className='w-2.5 h-2.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(TodoFilters);
