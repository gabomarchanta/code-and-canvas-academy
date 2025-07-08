import { BookOpen, Palette, Code, CheckCircle, Zap, Construction, AlignHorizontalJustifyStart } from 'lucide-svelte'; // Importa iconos

export interface Challenge {
  id: string;
  description: string;
  completed: boolean;
  targetAlignment?: 'left' | 'h-center' | 'right' | 'top' | 'v-center' | 'bottom' | string;
  challengeStatus?: 'idle' | 'playing' | 'submittedCorrect' | 'submittedIncorrect';
  extraInfo?: string;
  // extraInfo?: string; // O un componente Svelte para info más rica
}

export interface Lesson {
  id: string;
  title: string;
  path: string;
  icon?: any;
  status: 'locked' | 'unlocked' | 'current' | 'completed' | 'todo';
  challenges?: Challenge[];
  // completedChallenges?: number; // Contador
}

export interface Module {
  id: string;
  title: string;
  icon?: any;
  status: 'locked' | 'unlocked' | 'current' | 'completed' | 'todo';
  lessons: Lesson[];
  dependsOn?: string; // ID del módulo que debe completarse antes
}

export const modules: Module[] = [
  {
    id: 'html-css',
    title: 'HTML & CSS',
    icon: Code,
    status: 'current',
    lessons: [
      { id: 'semantic-html', title: 'HTML Semántico', path: '/html-css/semantic-html', icon: Construction, status: 'current'},
    ]
  },
  {
    id: 'design-foundations',
    title: 'Fundamentos del Diseño',
    icon: Palette,
    status: 'todo',
    dependsOn: 'html-css',
    lessons: [
        {
            id: 'color-contrast',
            title: 'Contraste de Color',
            path: '/design-foundations/color-contrast',
            icon: CheckCircle,
            status: 'todo',
            challenges: [
                { id: 'challenge-1-text-for-given-bg', description: 'Elige un color de texto...', completed: false }
            ]
        },
        {
            id: 'alignment',
            title: 'Alineación',
            path: '/design-foundations/alignment',
            icon: AlignHorizontalJustifyStart,
            status: 'locked',
            challenges: [
                { id: 'align-c1-left', description: 'Haz clic en el botón "Izquierda" para alinear todos los bloques a su borde izquierdo común.', completed: false, targetAlignment: 'left' },
                { id: 'align-c2-h-center', description: 'Ahora, centra todos los bloques horizontalmente usando el botón "Centro H".', completed: false, targetAlignment: 'h-center' },
                { id: 'align-c3-top', description: 'Finalmente, alinea todos los bloques a su borde superior común usando "Arriba".', completed: false, targetAlignment: 'top' },
            ]
        },        
    ]
  },
];  