import { Todo, TodoTag } from "../types/todoTypes";

export const todoTags: TodoTag[] = [
	{ id: 'thanks-<3', name: 'Trabajo', color: 'bg-blue-800' },
	{ id: '2', name: 'Personal', color: 'bg-teal-800' },
	{ id: '3', name: 'Importante', color: 'bg-orange-800' },
	{ id: '4', name: 'Estudio', color: 'bg-sky-800' },
	{ id: '5', name: 'Salud', color: 'bg-pink-800' },
];

export const initialTodos: Todo[] = [
	{
		id: 'detective-mode',
		title: 'Revisar mi portfolio',
		description:
			'Sí, ese que probablemente ya viste antes de llegar acá. Pero dale una segunda mirada, capaz te perdiste algo interesante.',
		completed: false,
		priority: 'alta',
		dueDate: '2025-12-31T23:59:00.000Z',
		createdAt: '2024-12-01T09:00:00.000Z',
		tags: [todoTags[0], todoTags[2]],
		task: [
			{ id: 'easter-egg-1', title: 'Ver la sección "Sobre mí"', completed: false },
			{ id: 'easter-egg-2', title: 'Revisar los proyectos destacados', completed: false },
			{ id: 'easter-egg-3', title: 'Descubrir todos los secretos ocultos del portfolio', completed: false },
		],
	},
	{
		id: 'social-butterfly',
		title: 'Stalkear mi LinkedIn',
		description:
			'Porque sabemos que ya lo hiciste, pero ahora podemos hacerlo oficial. Mi perfil está abierto a nuevas conexiones auténticas.',
		completed: true,
		priority: 'media',
		createdAt: '2024-12-01T10:00:00.000Z',
		tags: [todoTags[1], todoTags[0]],
	},
	{
		id: 'lets-talk',
		title: 'Contactarme y agendar una charla',
		description: 'No tengas miedo de escribir. Podemos empezar con un email y después coordinar una entrevista. Te aseguro que será una conversación interesante.',
		completed: false,
		priority: 'urgente',
		dueDate: '2023-06-01T12:00:00.000Z',
		createdAt: '2024-12-01T11:00:00.000Z',
		tags: [todoTags[2], todoTags[0]],
	},
	{
		id: 'maybe-hire-me',
		title: 'Considerar mi contratación',
		description:
			'Soy un poco diferente, pero no muerdo. Me gusta ayudar al equipo y hacer reír a las personas. Mi autenticidad viene incluida.',
		completed: false,
		priority: 'alta',
		createdAt: '2024-12-01T13:00:00.000Z',
		tags: [todoTags[2], todoTags[0], todoTags[1]],
	},
	{
		id: 'app-explorer',
		title: 'Explorar todas las funcionalidades',
		description:
			'Ya que estás acá, aprovechá para ver todo lo que puede hacer. Es más completa de lo que parece a primera vista.',
		completed: false,
		priority: 'baja',
		createdAt: '2024-12-01T14:00:00.000Z',
		tags: [todoTags[3], todoTags[1]],
		task: [
			{ id: 'filter-test', title: 'Probar los filtros', completed: false },
			{ id: 'tag-wizard', title: 'Jugar con las etiquetas personalizadas', completed: false },
			{ id: 'mobile-check', title: 'Verificar que sea responsive', completed: false },
			{ id: 'todo-creator', title: 'Crear y editar algunos tareas de prueba', completed: false },
			{ id: 'ux-details', title: 'Notar los pequeños detalles de UX y las indirectas', completed: true },

		],
	},
	{
		id: 'self-care-reminder',
		title: 'Cuidarte mientras trabajas',
		description:
			'Recordá que también sos una persona que merece cuidado y momentos de alegría.',
		completed: false,
		priority: 'media',
		createdAt: '2024-12-01T15:00:00.000Z',
		tags: [todoTags[4], todoTags[1]],
		task: [
			{ id: 'hydrate-please', title: 'Tomar suficiente agua (en serio, hacelo)', completed: false },
			{ id: 'stretch-time', title: 'Hacer una pausa y estirar un poco', completed: false },
			{ id: 'happiness-goal', title: 'Intentar ser más feliz cada día', completed: false }
		],
	},
];
