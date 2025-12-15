export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface LessonBlock {
  type: 'keyIdea' | 'theory' | 'example' | 'activity' | 'quiz';
  title: string;
  content: string; // Markdown supported
  quizData?: QuizQuestion[]; // Only if type is quiz
}

export interface Lesson {
  title: string;
  duration: string;
  blocks: LessonBlock[];
}

export interface Unit {
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface FinalProject {
  title: string;
  description: string;
}

export interface CourseStructure {
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  targetProfile: string;
  objectives: string[];
  units: Unit[];
  finalAssessment: QuizQuestion[];
  finalProjects: FinalProject[];
  sources: string[];
}

export interface UserPreferences {
  topic: string;
  level: string;
  profile: string;
  objective: string;
  timeAvailable: string;
  format: string;
}