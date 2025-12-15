import React, { useState, useEffect } from 'react';
import { CourseStructure, UserPreferences } from './types';
import CourseForm from './components/CourseForm';
import CourseView from './components/CourseView';
import { generateCourse } from './services/geminiService';
import { Layout, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [courseData, setCourseData] = useState<CourseStructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleGenerateCourse = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateCourse(prefs);
      setCourseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al generar el curso.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres salir? Se perderá el progreso del curso actual.')) {
      setCourseData(null);
      setError(null);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
        
        {/* Render Main Content */}
        {courseData ? (
          <CourseView 
            course={courseData} 
            onReset={handleReset} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        ) : (
          <div className="flex flex-col min-h-screen">
             {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                    <Layout className="w-6 h-6" />
                  </div>
                  <h1 className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">ProfesorIA</h1>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
              {/* Background Decorations */}
              <div className="absolute top-20 left-10 w-96 h-96 bg-violet-400/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
              <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>

              <div className="text-center max-w-3xl mx-auto mb-12 z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                  Crea tu aula virtual en <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">minutos</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Dime qué quieres aprender hoy y diseñaré un plan de estudios completo con lecciones, ejercicios interactivos y evaluaciones personalizadas.
                </p>
              </div>

              <div className="w-full z-10 flex justify-center">
                <CourseForm onSubmit={handleGenerateCourse} isLoading={isLoading} />
              </div>

              {error && (
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl max-w-md text-center z-10 backdrop-blur-sm">
                  {error}
                </div>
              )}
            </main>

            <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <p>© {new Date().getFullYear()} ProfesorIA. Potenciado por Google Gemini.</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;