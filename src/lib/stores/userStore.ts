import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Tipos para nuestros usuarios de prueba
type User = {
	id: string;
	name: string;
};

const defaultUser: User = { id: 'guest', name: 'Invitado' };

// Creamos un store "writable"
const createUserStore = () => {
	const { subscribe, set, update } = writable<User>(defaultUser);

	// Inicializamos el store desde localStorage si estamos en el navegador
	if (browser) {
		const storedUser = localStorage.getItem('currentUser');
		if (storedUser) {
			set(JSON.parse(storedUser));
		}
	}

	return {
		subscribe,
		// Función para "iniciar sesión" como un usuario específico
		login: (user: User) => {
			if (browser) {
				localStorage.setItem('currentUser', JSON.stringify(user));
			}
			set(user);
		},
		// Función para "cerrar sesión" y volver al estado de invitado
		logout: () => {
			if (browser) {
				localStorage.removeItem('currentUser');
			}
			set(defaultUser);
		}
	};
};

export const userStore = createUserStore(); 