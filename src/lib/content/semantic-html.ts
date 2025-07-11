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
	},
	{
		id: 'lists-intro',
		type: 'explanation',
		title: 'Listas',
		content: `
			<p>A menudo, querrás agrupar elementos en una lista. HTML nos da dos tipos principales: ordenadas (con números) y desordenadas (con viñetas).</p>
			<p>Para una lista desordenada, usamos la etiqueta <code>&lt;ul&gt;</code> (unordered list). Cada elemento dentro de la lista se envuelve en una etiqueta <code>&lt;li&gt;</code> (list item).</p>
			<pre><code>&lt;ul&gt;
  &lt;li&gt;Primer elemento&lt;/li&gt;
  &lt;li&gt;Segundo elemento&lt;/li&gt;
&lt;/ul&gt;</code></pre>
			<p>Es como hacer una lista de la compra. ¡Vamos a intentarlo!</p>
		`
	},
	{
		id: 'lists-exercise',
		type: 'exercise',
		title: 'Ejercicio de Listas',
		instructions: `
			<p>Ahora te toca a ti. Crea una lista de la compra.</p>
			<p><strong>Tu tarea:</strong> Crea una lista desordenada (<code>&lt;ul&gt;</code>) con dos elementos (<code>&lt;li&gt;</code>) dentro: "Leche" y "Pan".</p>
		`,
		initialCode: `<h1>Mi Lista de la Compra</h1>`,
		solution: `<h1>Mi Lista de la Compra</h1>\n<ul>\n  <li>Leche</li>\n  <li>Pan</li>\n</ul>`
	},
	{
		id: 'links-intro',
		type: 'explanation',
		title: 'Enlaces',
		content: `
			<p>¡La web no sería la web sin los enlaces! Para crear un enlace, usamos la etiqueta de ancla <code>&lt;a&gt;</code>.</p>
			<p>La etiqueta de ancla tiene un atributo especial llamado <code>href</code> (hypertext reference), que le dice al navegador a dónde ir cuando se hace clic en el enlace.</p>
			<pre><code>&lt;a href="https://www.google.com"&gt;Ir a Google&lt;/a&gt;</code></pre>
			<p>El texto entre las etiquetas <code>&lt;a&gt;</code> y <code>&lt;/a&gt;</code> es lo que el usuario verá y en lo que podrá hacer clic.</p>
		`
	},
	{
		id: 'links-exercise',
		type: 'exercise',
		title: 'Ejercicio de Enlaces',
		instructions: `
			<p>Vamos a hacer que un elemento de nuestra lista sea un enlace.</p>
			<p><strong>Tu tarea:</strong> Convierte el elemento de lista "Pan" en un enlace que apunte a <code>#panaderia</code>. El texto del enlace debe seguir siendo "Pan".</p>
		`,
		initialCode: `<h1>Mi Lista de la Compra</h1>
<ul>
  <li>Leche</li>
  <li>Pan</li>
</ul>`,
		solution: `<h1>Mi Lista de la Compra</h1>\n<ul>\n  <li>Leche</li>\n  <li><a href="#panaderia">Pan</a></li>\n</ul>`
	},
	{
		id: 'conclusion',
		type: 'explanation',
		title: '¡Felicidades!',
		content: `
			<p>¡Has completado la lección sobre los fundamentos del HTML Semántico!</p>
			<p>Has aprendido a usar encabezados, párrafos, listas y enlaces. Estas son las herramientas básicas que necesitarás para estructurar cualquier página web.</p>
			<p>Recuerda, usar la etiqueta correcta para el contenido correcto no solo es una buena práctica, sino que también hace que la web sea más accesible para todos. ¡Sigue así!</p>
		`
	}
]; 