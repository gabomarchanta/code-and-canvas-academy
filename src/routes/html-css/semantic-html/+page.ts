// src/routes/html-css/semantic-html/+page.ts

import { semanticHtmlLesson } from '$lib/content/semantic-html';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	// Esta función prepara los datos para el componente +page.svelte.
	// Ahora, el componente recibirá una prop `data.lesson`.
	return {
		lesson: {
			id: 'semantic-html',
			moduleId: 'html-css',
			title: 'HTML Semántico',
			stages: semanticHtmlLesson
		}
	};
}; 