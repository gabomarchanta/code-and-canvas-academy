// src/lib/stores/progressStore.ts
import { writable, get } from 'svelte/store';
import type { Module, Lesson } from '$lib/course-structure'; // Asegúrate que la ruta sea correcta
import { modules as initialCourseStructure } from '$lib/course-structure'; // Tus datos iniciales

const LOCAL_STORAGE_KEY = 'cca-progress-v1'; // 'v1' para facilitar futuras migraciones

function createProgressStore() {
    // Función para crear una copia profunda para evitar mutaciones del objeto original importado
    const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

    let initialData: Module[] = deepCopy(initialCourseStructure);

    if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEY)) {
        try {
            const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
            // Aquí podrías añadir lógica para migrar/validar 'storedData' si la estructura cambia mucho
            initialData = storedData;
        } catch (e) {
            console.error("Error parsing progress from localStorage", e);
            // Si hay error, se usa initialCourseStructure
        }
    }

    const { subscribe, set, update } = writable<Module[]>(initialData);

    const saveToLocalStorage = (data: Module[]) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
    };

    return {
        subscribe,
        // Método para completar un desafío específico y actualizar estados
        completeChallenge: (moduleId: string, lessonId: string, challengeId: string) => {
            update(currentModules => {
                const module = currentModules.find(m => m.id === moduleId);
                if (!module) return currentModules;

                const lesson = module.lessons.find(l => l.id === lessonId);
                if (!lesson || !lesson.challenges) return currentModules;

                const challenge = lesson.challenges.find(c => c.id === challengeId);
                if (!challenge || challenge.completed) return currentModules; // No hacer nada si no existe o ya está completo

                challenge.completed = true;

                // Comprobar si todos los desafíos de la lección están completados
                const allChallengesDone = lesson.challenges.every(c => c.completed);
                if (allChallengesDone && lesson.status !== 'completed') {
                    lesson.status = 'completed';
                    console.log(`Lesson ${lessonId} completed!`);

                    // Comprobar si todas las lecciones del módulo están completadas
                    const allLessonsDone = module.lessons.every(l => l.status === 'completed');
                    if (allLessonsDone && module.status !== 'completed') {
                        module.status = 'completed';
                        console.log(`Module ${moduleId} completed!`);

                        // Desbloquear el siguiente módulo si existe y depende de este
                        const nextModule = currentModules.find(m => m.dependsOn === moduleId && m.status === 'locked');
                        if (nextModule) {
                            nextModule.status = 'unlocked'; // O 'current'
                            console.log(`Module ${nextModule.id} unlocked!`);
                        }
                    } else if (module.status !== 'completed') {
                        // Si no todas las lecciones del módulo están hechas, pero alguna sí, el módulo está 'current'
                        module.status = 'current';
                    }
                }
                // Desbloquear la siguiente lección dentro del mismo módulo si existe
                if (lesson.status === 'completed') {
                    const currentLessonIndex = module.lessons.findIndex(l => l.id === lessonId);
                    if (currentLessonIndex !== -1 && currentLessonIndex + 1 < module.lessons.length) {
                        const nextLesson = module.lessons[currentLessonIndex + 1];
                        if (nextLesson.status === 'locked' || nextLesson.status === 'todo') { // Solo desbloquear si estaba bloqueada o por hacer
                            nextLesson.status = 'unlocked'; // O 'current' si quieres que sea la siguiente activa
                        }
                    }
                }


                saveToLocalStorage(currentModules);
                return [...currentModules]; // Forzar reactividad
            });
        },

        // Para marcar una lección completa directamente (si no tiene desafíos granulares)
        completeLesson: (moduleId: string, lessonId: string) => {
            update(currentModules => {
                const module = currentModules.find(m => m.id === moduleId);
                if (!module) return currentModules;
                const lesson = module.lessons.find(l => l.id === lessonId);
                if (!lesson || lesson.status === 'completed') return currentModules;

                lesson.status = 'completed';
                if (lesson.challenges) { // Marcar todos sus desafíos como completos
                    lesson.challenges.forEach(c => c.completed = true);
                }
                console.log(`Lesson ${lessonId} completed!`);

                // Reutilizar lógica de checkModuleCompletion y desbloqueo de siguiente lección
                const allLessonsDone = module.lessons.every(l => l.status === 'completed');
                if (allLessonsDone && module.status !== 'completed') {
                    module.status = 'completed';
                    console.log(`Module ${moduleId} completed!`);
                    const nextModule = currentModules.find(m => m.dependsOn === moduleId && m.status === 'locked');
                    if (nextModule) {
                        nextModule.status = 'unlocked';
                        console.log(`Module ${nextModule.id} unlocked!`);
                    }
                } else if (module.status !== 'completed') {
                     module.status = 'current';
                }

                const currentLessonIndex = module.lessons.findIndex(l => l.id === lessonId);
                if (currentLessonIndex !== -1 && currentLessonIndex + 1 < module.lessons.length) {
                    const nextLesson = module.lessons[currentLessonIndex + 1];
                    if (nextLesson.status === 'locked' || nextLesson.status === 'todo') {
                        nextLesson.status = 'unlocked';
                    }
                }

                saveToLocalStorage(currentModules);
                return [...currentModules];
            });
        },

        getLessonStatus: (moduleId: string, lessonId: string): Lesson['status'] | undefined => {
            const modules = get(progressStore); // Obtener el valor actual del store
            const module = modules.find(m => m.id === moduleId);
            const lesson = module?.lessons.find(l => l.id === lessonId);
            return lesson?.status;
        },

        resetProgress: () => {
            const resetData = deepCopy(initialCourseStructure);
            set(resetData);
            saveToLocalStorage(resetData);
            console.log("Progress reset!");
        }
    };
}

export const progressStore = createProgressStore();

// Opcional: Para debuggear en la consola del navegador
if (typeof window !== 'undefined') {
    (window as any).progressStore = progressStore;
    (window as any).getprogressStoreState = () => get(progressStore);
}