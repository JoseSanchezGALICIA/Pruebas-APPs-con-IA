import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { CourseStructure, LessonBlock } from '../types';
import { 
  ChevronRight, ChevronLeft, CheckCircle2, Circle, 
  Lightbulb, Beaker, PenTool, BrainCircuit, GraduationCap, 
  BookOpen, Clock, BarChart, FileText, ExternalLink, 
  PlayCircle, Award, Sun, Moon, Layout, ArrowRight, Menu, X,
  Library
} from 'lucide-react';
import QuizCard from './QuizCard';

interface Props {
  course: CourseStructure;
  onReset: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const CourseView: React.FC<Props> = ({ course, onReset, isDarkMode, toggleTheme }) => {
  const [currentUnitIdx, setCurrentUnitIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'lesson' | 'finalAssessment' | 'finalProject'>('lesson');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // Helpers
  const getLessonId = (uIdx: number, lIdx: number) => `${uIdx}-${lIdx}`;
  const totalUnits = course.units.length;
  const totalLessons = useMemo(() => course.units.reduce((acc, u) => acc + u.lessons.length, 0), [course]);
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const currentUnit = course.units[currentUnitIdx];
  const currentLesson = currentUnit?.lessons[currentLessonIdx];

  const markCompleted = (uIdx: number, lIdx: number) => {
    setCompletedLessons(prev => new Set(prev).add(getLessonId(uIdx, lIdx)));
  };

  const handleNext = () => {
    markCompleted(currentUnitIdx, currentLessonIdx);

    if (currentLessonIdx < currentUnit.lessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
      setViewMode('lesson');
    } else if (currentUnitIdx < course.units.length - 1) {
      setCurrentUnitIdx(prev => prev + 1);
      setCurrentLessonIdx(0);
      setViewMode('lesson');
    } else {
      setViewMode('finalAssessment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (viewMode === 'finalAssessment') {
      const lastUnitIdx = course.units.length - 1;
      setCurrentUnitIdx(lastUnitIdx);
      setCurrentLessonIdx(course.units[lastUnitIdx].lessons.length - 1);
      setViewMode('lesson');
    } else if (viewMode === 'finalProject') {
      setViewMode('finalAssessment');
    } else {
      if (currentLessonIdx > 0) {
        setCurrentLessonIdx(prev => prev - 1);
      } else if (currentUnitIdx > 0) {
        const prevUnitIdx = currentUnitIdx - 1;
        setCurrentUnitIdx(prevUnitIdx);
        setCurrentLessonIdx(course.units[prevUnitIdx].lessons.length - 1);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToNextIncomplete = () => {
    for (let u = 0; u < course.units.length; u++) {
      for (let l = 0; l < course.units[u].lessons.length; l++) {
        if (!completedLessons.has(getLessonId(u, l))) {
          setCurrentUnitIdx(u);
          setCurrentLessonIdx(l);
          setViewMode('lesson');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    }
    setViewMode('finalAssessment');
  };

  // --- Renderers ---

  const renderBlock = (block: LessonBlock, idx: number) => {
    let icon, bgClass, borderClass, textClass, ringClass;
    let isTheory = false;
    
    // Distinct styles for block types
    switch (block.type) {
      case 'keyIdea':
        icon = <Lightbulb className="w-5 h-5" />;
        bgClass = 'bg-amber-50 dark:bg-amber-900/20';
        borderClass = 'border-amber-200 dark:border-amber-700';
        textClass = 'text-amber-800 dark:text-amber-300';
        ringClass = 'ring-amber-500/20';
        break;
      case 'theory':
        isTheory = true;
        icon = <Library className="w-5 h-5" />;
        // Academic style
        bgClass = 'bg-slate-50 dark:bg-slate-800/80';
        borderClass = 'border-slate-300 dark:border-slate-600';
        textClass = 'text-slate-800 dark:text-slate-200';
        ringClass = 'ring-slate-500/20';
        break;
      case 'example':
        icon = <Beaker className="w-5 h-5" />;
        bgClass = 'bg-blue-50 dark:bg-blue-900/20';
        borderClass = 'border-blue-200 dark:border-blue-700';
        textClass = 'text-blue-800 dark:text-blue-300';
        ringClass = 'ring-blue-500/20';
        break;
      case 'activity':
        icon = <PenTool className="w-5 h-5" />;
        bgClass = 'bg-emerald-50 dark:bg-emerald-900/20';
        borderClass = 'border-emerald-200 dark:border-emerald-700';
        textClass = 'text-emerald-800 dark:text-emerald-300';
        ringClass = 'ring-emerald-500/20';
        break;
      case 'quiz':
        icon = <BrainCircuit className="w-5 h-5" />;
        bgClass = 'bg-pink-50 dark:bg-pink-900/20';
        borderClass = 'border-pink-200 dark:border-pink-700';
        textClass = 'text-pink-800 dark:text-pink-300';
        ringClass = 'ring-pink-500/20';
        break;
      default:
        icon = <Circle className="w-5 h-5" />;
        bgClass = 'bg-slate-50';
        borderClass = 'border-slate-200';
        textClass = 'text-slate-800';
        ringClass = 'ring-slate-200';
    }

    return (
      <div key={idx} className={`mb-8 group rounded-2xl border ${borderClass} ${isTheory ? 'bg-white dark:bg-slate-900' : 'bg-white dark:bg-slate-900'} overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}>
        <div className={`px-6 py-4 flex items-center gap-3 border-b ${borderClass} ${bgClass}`}>
          <div className={`p-2 rounded-lg bg-white/60 dark:bg-black/20 ${textClass} ring-1 ${ringClass} shadow-sm`}>
            {icon}
          </div>
          <h3 className={`font-bold text-lg ${textClass} tracking-wide`}>{block.title}</h3>
        </div>
        <div className={`p-6 md:p-8 ${isTheory ? 'bg-slate-50/30 dark:bg-slate-900/30' : ''}`}>
           {block.type === 'quiz' && block.quizData ? (
             <QuizCard questions={block.quizData} />
           ) : (
             <div className={`
                prose max-w-none 
                prose-slate dark:prose-invert
                prose-p:leading-relaxed 
                prose-a:text-violet-600 dark:prose-a:text-violet-400
                prose-img:rounded-xl prose-img:shadow-lg
                ${isTheory 
                  ? 'prose-lg text-slate-800 dark:text-slate-200 prose-headings:text-slate-900 dark:prose-headings:text-slate-100' 
                  : 'text-slate-600 dark:text-slate-300'
                }
             `}>
                <ReactMarkdown>{block.content}</ReactMarkdown>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* 1. Header Zone */}
      <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between z-30 relative shadow-sm">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
             <div className="bg-violet-600 p-1.5 rounded-lg text-white shadow-lg shadow-violet-500/20">
               <GraduationCap className="w-5 h-5" />
             </div>
             <div>
                <h1 className="font-bold text-sm md:text-base leading-tight truncate max-w-[150px] md:max-w-xs">{course.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                   <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> {course.level}</span>
                   <span className="hidden md:flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
           {/* Progress Widget */}
           <div className="hidden md:flex flex-col items-end min-w-[140px]">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                 {completedCount} de {totalLessons} lecciones
              </div>
              <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-violet-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
              </div>
           </div>

           <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

           <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>

           <button onClick={onReset} className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors">
             Salir
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 2. Sidebar Zone (Curriculum) */}
        <aside 
          className={`
            fixed md:relative z-20 top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
            flex flex-col transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Plan de Estudios</h2>
            <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{totalUnits} Unidades • {totalLessons} Lecciones</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {course.units.map((unit, uIdx) => (
              <div key={uIdx}>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 pl-2">Unidad {uIdx + 1}</h3>
                <div className="space-y-1">
                  {unit.lessons.map((lesson, lIdx) => {
                    const isCompleted = completedLessons.has(getLessonId(uIdx, lIdx));
                    const isActive = viewMode === 'lesson' && currentUnitIdx === uIdx && currentLessonIdx === lIdx;
                    
                    return (
                      <button
                        key={lIdx}
                        onClick={() => {
                          setCurrentUnitIdx(uIdx);
                          setCurrentLessonIdx(lIdx);
                          setViewMode('lesson');
                          setIsSidebarOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`
                          w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-all duration-200 group
                          ${isActive 
                            ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}
                        `}
                      >
                        <div className={`mt-0.5 flex-shrink-0 transition-colors ${
                          isCompleted ? 'text-green-500' : isActive ? 'text-violet-600' : 'text-slate-300 dark:text-slate-600'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-medium block leading-tight ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                            {lesson.title}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            
            {/* Final Modules Links */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                 onClick={() => { setViewMode('finalAssessment'); setIsSidebarOpen(false); }}
                 className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-semibold mb-1
                 ${viewMode === 'finalAssessment' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <FileText className="w-4 h-4" /> Evaluación Final
               </button>
               <button
                 onClick={() => { setViewMode('finalProject'); setIsSidebarOpen(false); }}
                 className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-semibold
                 ${viewMode === 'finalProject' 
                    ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <Award className="w-4 h-4" /> Proyecto Final
               </button>
            </div>
          </div>
        </aside>

        {/* 3. Main Content Zone */}
        <main className="flex-1 overflow-y-auto bg-white/50 dark:bg-black/20 relative scroll-smooth">
          <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
            
            {/* Gamification "Continue" Banner */}
            {progressPercent > 0 && progressPercent < 100 && viewMode === 'lesson' && !completedLessons.has(getLessonId(currentUnitIdx, currentLessonIdx)) && (
               <div className="mb-8 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 dark:from-violet-900 dark:to-indigo-900 text-white p-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full"><PlayCircle className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs opacity-80 uppercase tracking-wider font-bold">Progreso</div>
                      <div className="font-semibold text-sm">Llevas un {progressPercent}% del curso.</div>
                    </div>
                  </div>
                  <button 
                    onClick={jumpToNextIncomplete}
                    className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    Continuar <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            )}

            {viewMode === 'lesson' && currentLesson && (
              <div className="animate-in fade-in duration-500">
                {/* Lesson Header */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-violet-200 dark:border-violet-700/50">
                      Unidad {currentUnitIdx + 1}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {currentLesson.duration}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                    {currentLesson.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {currentUnit.summary}
                  </p>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800 w-full mb-10"></div>

                {/* Blocks */}
                <div className="space-y-8">
                  {currentLesson.blocks.map((block, idx) => renderBlock(block, idx))}
                </div>
              </div>
            )}

            {viewMode === 'finalAssessment' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <FileText className="w-16 h-16 mx-auto mb-6 opacity-90 drop-shadow-md" />
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Evaluación Final</h2>
                    <p className="opacity-90 max-w-lg mx-auto text-lg">Demuestra tu maestría. Responde correctamente para obtener tu certificación virtual.</p>
                </div>
                <div className="p-8 md:p-12 bg-slate-50 dark:bg-slate-900/50">
                    <QuizCard questions={course.finalAssessment} />
                </div>
                <div className="p-8 bg-slate-100 dark:bg-black/20 text-center border-t border-slate-200 dark:border-slate-800">
                    <button onClick={() => setViewMode('finalProject')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                      Ir a Proyectos Finales <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
              </div>
            )}

            {viewMode === 'finalProject' && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                 <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                    <div className="flex items-start gap-5 mb-8">
                      <div className="p-4 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl shadow-inner">
                        <Award className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Proyectos Finales</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Elige uno de los siguientes retos para aplicar tus conocimientos en el mundo real.</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {course.finalProjects.map((project, idx) => (
                        <div key={idx} className="group relative border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-700 transition-all bg-slate-50 dark:bg-slate-800/50">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-5 h-5 text-pink-500" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 pr-6">{project.title}</h3>
                          <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            <ReactMarkdown>{project.description}</ReactMarkdown>
                          </div>
                          <span className="inline-block px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Reto Práctico
                          </span>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Sources */}
                 {course.sources && course.sources.length > 0 && (
                   <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 opacity-80 hover:opacity-100 transition-opacity">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-400" /> Fuentes y Referencias
                      </h3>
                      <ul className="space-y-3">
                        {course.sources.map((source, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 group">
                            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-300 group-hover:text-violet-500 transition-colors" />
                            <a href={source} target="_blank" rel="noopener noreferrer" className="group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:underline break-all transition-colors">
                              {source}
                            </a>
                          </li>
                        ))}
                      </ul>
                   </div>
                 )}
              </div>
            )}
            
            {/* Bottom Nav Area */}
            <div className="fixed bottom-0 left-0 w-full md:left-80 md:w-[calc(100%-320px)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-40 flex justify-between items-center shadow-lg transform translate-y-0 transition-transform">
               <button
                 onClick={handlePrev}
                 disabled={currentUnitIdx === 0 && currentLessonIdx === 0 && viewMode === 'lesson'}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                   ${(currentUnitIdx === 0 && currentLessonIdx === 0 && viewMode === 'lesson')
                     ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                     : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <ChevronLeft className="w-4 h-4" /> Anterior
               </button>

               {viewMode !== 'finalProject' && (
                 <button
                   onClick={handleNext}
                   className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/30 transition-all"
                 >
                   {viewMode === 'finalAssessment' ? 'Ver Proyectos' : 'Siguiente Lección'} <ChevronRight className="w-4 h-4" />
                 </button>
               )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseView;