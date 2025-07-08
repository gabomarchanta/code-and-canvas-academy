export type Stage = ExplanationStage | ExerciseStage;

export interface BaseStage {
	id: string;
	title: string;
	type: 'explanation' | 'exercise';
}

export interface ExplanationStage extends BaseStage {
	type: 'explanation';
	content: string; // Markdown/HTML content
}

export interface ExerciseStage extends BaseStage {
	type: 'exercise';
	instructions: string; // Markdown/HTML content
	initialCode: string;
	solution: string; // Could be a regex or a string to match
}

export const semanticHtmlLesson: Stage[] = [
	{
		id: 'intro',
		type: 'explanation',
		title: '¿Qué es HTML?',
		content: `
			<p>HTML son las siglas de <strong>HyperText Markup Language</strong> (Lenguaje de Marcado de Hipertexto). Es el esqueleto de todas las páginas web.</p>
			<p>Piensa en ello como los cimientos y las paredes de una casa. Usamos diferentes "etiquetas" de HTML para definir la estructura y el tipo de contenido, como títulos, párrafos, imágenes y enlaces.</p>
			<p>En esta lección, nos centraremos en el <strong>HTML Semántico</strong>, que consiste en usar la etiqueta correcta para el trabajo correcto. Esto hace que tu sitio sea más fácil de entender para los navegadores, los motores de búsqueda y los lectores de pantalla.</p>
		`
	},
	{
		id: 'headings',
		type: 'exercise',
		title: 'Encabezados',
		instructions: `
			<p>En HTML, la mayoría de los elementos se escriben con una <strong>etiqueta de apertura</strong> y una <strong>etiqueta de cierre</strong>.</p>
			<p>Una etiqueta de apertura es <code>&lt;p&gt;</code> y su correspondiente etiqueta de cierre es <code>&lt;/p&gt;</code>. La barra inclinada <code>/</code> marca la diferencia. El contenido va en medio de ellas.</p>
			<hr class="my-4">
			<p>Los encabezados se utilizan para titular las secciones de una página. Van desde <code>&lt;h1&gt;</code> (el más importante) hasta <code>&lt;h6&gt;</code> (el menos importante).</p>
			<p><strong>Tu tarea:</strong> Cambia la etiqueta <code>&lt;p&gt;</code> por una etiqueta <code>&lt;h1&gt;</code> para darle a la página un título principal.</p>
		`,
		initialCode: `<p>Mi Primer Sitio Web</p>`,
		solution: `<h1>Mi Primer Sitio Web</h1>`
	},
	{
		id: 'paragraphs',
		type: 'exercise',
		title: 'Párrafos',
		instructions: `
			<p>¡Buen trabajo! Ahora que tenemos un título, añadamos algo de texto.</p>
			<p>La etiqueta <code>&lt;p&gt;</code> se utiliza para los párrafos. Es una de las etiquetas más comunes que usarás.</p>
			<p><strong>Tu tarea:</strong> Añade un párrafo debajo del encabezado <code>&lt;h1&gt;</code> que diga "¡Bienvenido a mi sitio!".</p>
		`,
		initialCode: `<h1>Mi Primer Sitio Web</h1>`,
		solution: `<h1>Mi Primer Sitio Web</h1>\n<p>¡Bienvenido a mi sitio!</p>`
	}
]; 