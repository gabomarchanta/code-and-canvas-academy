import { BookOpen, Palette, Code, CheckCircle, Zap, Construction, AlignHorizontalJustifyStart } from 'lucide-svelte'; // Importa iconos

export interface Challenge {
  id: string;
  description: string;
  completed: boolean;
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
    id: 'design-foundations',
    title: 'Fundamentos del Diseño',
    icon: Palette,
    status: 'current', // O 'unlocked' o 'active'
    lessons: [
      { id: 'color-contrast', title: 'Contraste de Color', path: '/design-foundations/color-contrast', icon: CheckCircle, status: 'completed' }, // Antes 'done'
      { id: 'alignment', title: 'Alineación', path: '/design-foundations/alignment', icon: AlignHorizontalJustifyStart, status: 'current' }, // Asegúrate que el icono sea el correcto
      { id: 'proximity', title: 'Proximidad', path: '/design-foundations/proximity', icon: Zap, status: 'todo' },
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    icon: Code,
    status: 'todo', // O 'locked' si depende del anterior
    lessons: [
      { id: 'semantic-html', title: 'HTML Semántico', path: '/html-css/semantic-html', icon: Construction, status: 'todo'},
    ]
  },
];  