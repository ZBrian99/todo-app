import { TodoPriority } from "@/types/todoTypes";

export const TodoPriorityOrder: Record<TodoPriority, number> = {
	urgente: 1,
	alta: 2,
	media: 3,
	baja: 4,
	ninguna: 5,
};

export const priorityColors: Record<TodoPriority, { text: string; bg: string; border: string }> = {
	ninguna: {
		text: 'text-gray-300',
		bg: 'bg-gray-600',
		border: 'border-gray-500',
	},
	baja: {
		text: 'text-white',
		bg: 'bg-emerald-600',
		border: 'border-emerald-500',
	},
	media: {
		text: 'text-white',
		bg: 'bg-amber-700',
		border: 'border-amber-600',
	},
	alta: {
		text: 'text-white',
		bg: 'bg-red-700',
		border: 'border-red-600',
	},
	urgente: {
		text: 'text-white',
		bg: 'bg-violet-600',
		border: 'border-violet-500',
	},
};

export const tagColors = [
	'bg-red-800',
	'bg-blue-800',
	'bg-green-800',
	'bg-purple-800',
	'bg-pink-800',
	'bg-indigo-800',
	'bg-teal-800',
	'bg-orange-800',
	'bg-cyan-800',
	'bg-emerald-800',
	'bg-violet-800',
	'bg-fuchsia-800',
	'bg-rose-800',
	'bg-sky-800',
	'bg-slate-600',
	'bg-amber-800',
];