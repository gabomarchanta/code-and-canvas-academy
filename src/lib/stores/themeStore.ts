import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
	if (!browser) return 'light';
	const storedTheme = localStorage.getItem('theme');
	if (storedTheme === 'dark' || storedTheme === 'light') {
		return storedTheme;
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const createThemeStore = () => {
	const { subscribe, set } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.dataset.theme = theme;
			}
			set(theme);
		},
		toggle: () => {
			if (browser) {
				const currentTheme = localStorage.getItem('theme');
				const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
				localStorage.setItem('theme', newTheme);
				document.documentElement.dataset.theme = newTheme;
				set(newTheme);
			}
		}
	};
};

export const theme = createThemeStore(); 