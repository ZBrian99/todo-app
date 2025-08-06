import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TodoProvider } from '@/contexts/TodoContext';
import { FormProvider } from '@/contexts/FormContext';
import { UIProvider } from '@/contexts/UIContext';
import { Navbar } from '@/components/Navbar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Todo App - Gestión de Tareas',
	description: 'Aplicación para gestionar tareas.',
	keywords: ['todo', 'tareas', 'productividad', 'organización'],
  authors: [{ name: 'EvyCast' }],
	openGraph: {
		title: 'Todo App',
		description: 'Gestión de tareas',
		type: 'website',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='es'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<TodoProvider>
					<FormProvider>
						<UIProvider>
							<Navbar />
							{children}
						</UIProvider>
					</FormProvider>
				</TodoProvider>
			</body>
		</html>
	);
}
