// src/lib/stores/progressStore.ts
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { Module, Lesson } from '$lib/course-structure';
import { modules as initialCourseStructure } from '$lib/course-structure';
import { userStore } from './userStore';

const getLocalStorageKey = (userId: string) => `cca-progress-${userId}`;

function createProgressStore() {
	const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

	// El estado inicial se determinará dinámicamente
	const { subscribe, set, update } = writable<Module[]>([]);

	function initializeForUser(userId: string) {
		let initialData: Module[] = deepCopy(initialCourseStructure);
		if (browser) {
			const storageKey = getLocalStorageKey(userId);
			const storedData = localStorage.getItem(storageKey);
			if (storedData) {
				try {
					initialData = JSON.parse(storedData);
				} catch (e) {
					console.error('Error parsing progress from localStorage', e);
					localStorage.removeItem(storageKey); // Limpiar datos corruptos
				}
			}
		}
		set(initialData);
	}

	const saveToLocalStorage = (data: Module[]) => {
		if (browser) {
			const userId = get(userStore).id;
			const storageKey = getLocalStorageKey(userId);
			localStorage.setItem(storageKey, JSON.stringify(data));
		}
	};

	// Suscribirse a cambios en el usuario
	if (browser) {
		userStore.subscribe(($user) => {
			console.log(`User changed to: ${$user.name}. Initializing progress store.`);
			initializeForUser($user.id);
		});
	}

	return {
		subscribe,
		// ... (el resto de métodos: completeChallenge, completeLesson, etc. permanecen igual pero usarán la nueva `saveToLocalStorage`)
		completeChallenge: (moduleId: string, lessonId: string, challengeId: string) => {
			update((currentModules) => {
				const module = currentModules.find((m) => m.id === moduleId);
				if (!module) return currentModules;

				const lesson = module.lessons.find((l) => l.id === lessonId);
				if (!lesson || !lesson.challenges) return currentModules;

				const challenge = lesson.challenges.find((c) => c.id === challengeId);
				if (!challenge || challenge.completed) return currentModules; // No hacer nada si no existe o ya está completo

				challenge.completed = true;

				// Comprobar si todos los desafíos de la lección están completados
				const allChallengesDone = lesson.challenges.every((c) => c.completed);
				if (allChallengesDone && lesson.status !== 'completed') {
					lesson.status = 'completed';
					console.log(`Lesson ${lessonId} completed!`);

					// Comprobar si todas las lecciones del módulo están completadas
					const allLessonsDone = module.lessons.every((l) => l.status === 'completed');
					if (allLessonsDone && module.status !== 'completed') {
						module.status = 'completed';
						console.log(`Module ${moduleId} completed!`);

						// Desbloquear el siguiente módulo si existe y depende de este
						const nextModule = currentModules.find(
							(m) => m.dependsOn === moduleId && m.status === 'locked'
						);
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
					const currentLessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
					if (currentLessonIndex !== -1 && currentLessonIndex + 1 < module.lessons.length) {
						const nextLesson = module.lessons[currentLessonIndex + 1];
						if (nextLesson.status === 'locked' || nextLesson.status === 'todo') {
							// Solo desbloquear si estaba bloqueada o por hacer
							nextLesson.status = 'unlocked'; // O 'current' si quieres que sea la siguiente activa
						}
					}
				}

				saveToLocalStorage(currentModules);
				return [...currentModules]; // Forzar reactividad
			});
		},

		// Marcar una etapa (stage) específica como completada
		completeStage: (moduleId: string, lessonId: string, stageId: string) => {
			update((currentModules) => {
				const newModules = currentModules.map((module) => {
					if (module.id !== moduleId) return module;

					return {
						...module,
						lessons: module.lessons.map((lesson) => {
							if (lesson.id !== lessonId) return lesson;

							const originalChallenges = lesson.challenges ?? [];
							const challengeExists = originalChallenges.some((c) => c.id === stageId);

							let newChallenges;

							if (challengeExists) {
								newChallenges = originalChallenges.map((challenge) => {
									if (challenge.id === stageId) {
										return { ...challenge, completed: true };
									}
									return challenge;
								});
							} else {
								// Si el desafío no existe, lo creamos.
								// El tipo Challenge requiere una descripción, la dejamos vacía.
								newChallenges = [...originalChallenges, { id: stageId, completed: true, description: '' }];
							}

							return {
								...lesson,
								challenges: newChallenges
							};
						})
					};
				});

				saveToLocalStorage(newModules);
				return newModules;
			});
		},

		completeLesson: (moduleId: string, lessonId: string) => {
			update((currentModules) => {
				const module = currentModules.find((m) => m.id === moduleId);
				if (!module) return currentModules;
				const lesson = module.lessons.find((l) => l.id === lessonId);
				if (!lesson || lesson.status === 'completed') return currentModules;

				lesson.status = 'completed';
				if (lesson.challenges) {
					// Marcar todos sus desafíos como completos
					lesson.challenges.forEach((c) => (c.completed = true));
				}
				console.log(`Lesson ${lessonId} completed!`);

				// Reutilizar lógica de checkModuleCompletion y desbloqueo de siguiente lección
				const allLessonsDone = module.lessons.every((l) => l.status === 'completed');
				if (allLessonsDone && module.status !== 'completed') {
					module.status = 'completed';
					console.log(`Module ${moduleId} completed!`);
					const nextModule = currentModules.find(
						(m) => m.dependsOn === moduleId && m.status === 'locked'
					);
					if (nextModule) {
						nextModule.status = 'unlocked';
						console.log(`Module ${nextModule.id} unlocked!`);
					}
				} else if (module.status !== 'completed') {
					module.status = 'current';
				}

				const currentLessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
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
			const module = modules.find((m) => m.id === moduleId);
			const lesson = module?.lessons.find((l) => l.id === lessonId);
			return lesson?.status;
		},
		resetProgress: () => {
			const userId = get(userStore).id;
			const resetData = deepCopy(initialCourseStructure);
			set(resetData);
			if (browser) {
				const storageKey = getLocalStorageKey(userId);
				localStorage.setItem(storageKey, JSON.stringify(resetData));
			}
			console.log(`Progress for user ${userId} reset!`);
		}
	};
}

export const progressStore = createProgressStore();

// Opcional: Para debuggear en la consola del navegador
if (browser) {
	(window as any).progressStore = progressStore;
	(window as any).getprogressStoreState = () => get(progressStore);
}