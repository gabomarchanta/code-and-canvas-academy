# Manual de Contexto para la IA sobre "Code & Canvas Academy"

Este documento resume la arquitectura, las decisiones de diseño y los puntos críticos del proyecto para acelerar el desarrollo y la depuración con una IA como Gemini.

## 1. Resumen del Proyecto

- **Objetivo**: Plataforma de e-learning para enseñar desarrollo y diseño web.
- **Característica Principal**: Lecciones interactivas con un editor de código, vista previa en tiempo real y validación de ejercicios.
- **Stack Clave**: **Svelte 5 (Runes)**, **Tailwind CSS v4 (alpha)**, SvelteKit, Vite.

## 2. Arquitectura y Ficheros Clave

- `src/routes/html-css/semantic-html/+page.svelte`:
  - **Función**: Es el componente principal de una lección interactiva.
  - **Estructura**: Layout de 3 columnas (Progreso, Contenido, Vista Previa).
  - **Lógica de Svelte 5**: Utiliza **Runes**. La reactividad se basa en `$state` para los estados primarios (ej. `currentStageIndex`, `code`) y `$derived` para estados computados (ej. `currentStage`).
  - **Navegación**: El usuario puede navegar libremente por cualquier challenge completado desde la barra lateral. Solo se fuerza la navegación automática al siguiente challenge cuando el usuario completa uno nuevo.
  - **Comprobación de ejercicios**: Al resolver correctamente un ejercicio, se muestra un mensaje de éxito y el botón "Continuar". Solo al pulsar "Continuar" se avanza.
  - **Editor**: Siempre muestra el `initialCode` del challenge, incluso si ya fue completado.
  - **Vista previa**: El `<iframe>` de la vista previa nunca queda vacío; se actualiza inmediatamente al cambiar de etapa o al comprobar el código.
  - **Redirección**: Solo se redirige automáticamente a la home (`/`) cuando el usuario completa la lección desde la última etapa. Si entra manualmente a una lección ya completada, puede revisarla sin ser expulsado.

- `src/lib/content/semantic-html.ts`:
  - **Función**: Define la estructura de datos para los cursos y sus lecciones/etapas. Es la "fuente de la verdad" para el contenido de la lección.

- `src/lib/stores/themeStore.ts`:
  - **Función**: Gestiona el estado del tema (claro/oscuro) en toda la aplicación.
  - **Punto Crítico**: Es la **única fuente de verdad** para el tema. Es crucial para mantener la consistencia, especialmente para estilizar dinámicamente el `<iframe>` de la vista previa.

- `src/app.css`:
  - **Función**: Punto de entrada global de CSS.
  - **Punto Crítico para Tailwind v4**: **Debe contener** `@import 'tailwindcss';` y `@import 'tailwindcss/theme.css';` para que las utilidades de Tailwind estén disponibles en toda la aplicación.

- `src/routes/+layout.svelte`:
  - **Función**: Layout raíz de la aplicación (dibuja el sidebar y el header).
  - **Punto Crítico de SSR**: Contiene lógica que accede a `localStorage` y `window`. Este código **debe estar protegido** por una comprobación `if (browser)` para evitar errores de renderizado en el servidor.

## 3. Guía de Razonamiento y Depuración

- **Al depurar Tailwind CSS v4...**
  - **Error: "Cannot apply unknown utility class"**:
    1.  Verifica que `src/app.css` contiene los dos imports (`tailwindcss` y `tailwindcss/theme.css`).
    2.  Verifica que `+layout.svelte` importa `../app.css`.
    3.  **Evita `@apply`** en los componentes de Svelte (`<style lang="postcss">`). Ha demostrado ser inestable en esta versión alfa. Es más seguro usar CSS plano y selectores `:is(html.dark)` para el modo oscuro.

- **Al depurar Reactividad en Svelte 5...**
  - **Problema: El editor no se actualiza, los botones no reaccionan.**
    1.  La causa probable es un `$effect` demasiado complejo o una mala gestión del estado.
    2.  **Solución Preferida**: Simplificar. Usar `$state` para lo mínimo indispensable. Derivar todo lo posible con `$derived`. Para acciones que cambian el estado (como pasar a la siguiente etapa), actualiza el `$state` de forma imperativa dentro del manejador de eventos (`onclick`). Por ejemplo, actualiza el `currentStageIndex` y, en la misma función, actualiza el contenido del editor de código (`code = ...`).
    3.  **Navegación**: Solo forzar la navegación automática si el usuario está en una etapa incompleta. Permitir navegación libre por challenges completados.
    4.  **Redirección**: Solo redirigir automáticamente al finalizar la lección desde la última etapa, no al entrar manualmente a una lección ya completada.

- **Al depurar el `<iframe>` de la vista previa...**
  - **Problema: El estilo (ej. modo oscuro) no se aplica dentro del `iframe`.**
    1.  Recuerda que un `<iframe>` es un documento HTML completamente separado.
    2.  La solución es inyectar una etiqueta `<style>` o un `<link>` dentro del `head` del `iframe`.
    3.  La reactividad se consigue haciendo que la función que actualiza el `iframe` se suscriba a los cambios del `themeStore` y del código fuente (`code`).
    4.  **Vista previa nunca vacía**: Asegúrate de actualizar el contenido del `iframe` también al cambiar de etapa, aunque el usuario no edite nada.

- **Al depurar Layouts con Scroll...**
  - **Problema: Un contenedor no se desplaza y en su lugar hace que toda la página se desplace.**
    1.  La causa suele ser un elemento hijo de un contenedor flex o grid que no respeta los límites de su padre.
    2.  **Solución Clave**: En el contenedor que debe tener el scroll (ej. `overflow-y-auto`), asegúrate de que sus hijos directos tengan la clase `min-h-0` (para layouts de columna) o `min-w-0` (para layouts de fila). Esto fuerza al elemento a respetar el espacio asignado por su contenedor. 