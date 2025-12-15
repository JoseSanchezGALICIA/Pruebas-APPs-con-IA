import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { BookOpen, Clock, Target, User, Layers, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const CourseForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserPreferences>({
    topic: '',
    level: 'Principiante',
    profile: '',
    objective: '',
    timeAvailable: '',
    format: 'Mixto',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Shared classes for inputs
  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const labelClasses = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2";
  const iconClasses = "w-4 h-4 text-violet-600 dark:text-violet-400";

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-700 backdrop-blur-xl overflow-hidden transition-all duration-300">
      
      {/* Form Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 border-b border-slate-100 dark:border-slate-700">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configura tu Curso</h2>
         </div>
         <p className="text-slate-500 dark:text-slate-400 text-sm">Completa los detalles para que la IA personalice tu experiencia.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Topic */}
        <div>
          <label className={labelClasses}>
            Tema del Curso
          </label>
          <input
            type="text"
            name="topic"
            required
            placeholder="Ej. Introducción a la Astrofísica, Marketing Digital..."
            className={inputClasses}
            value={formData.topic}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level */}
          <div>
            <label className={labelClasses}>
              <Layers className={iconClasses} /> Nivel Actual
            </label>
            <div className="relative">
                <select
                name="level"
                className={`${inputClasses} appearance-none`}
                value={formData.level}
                onChange={handleChange}
                >
                <option value="Principiante">Principiante (Desde cero)</option>
                <option value="Intermedio">Intermedio (Conocimientos previos)</option>
                <option value="Avanzado">Avanzado (Profundización)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className={labelClasses}>
              <Layers className={iconClasses} /> Formato Preferido
            </label>
            <div className="relative">
                <select
                name="format"
                className={`${inputClasses} appearance-none`}
                value={formData.format}
                onChange={handleChange}
                >
                <option value="Lecturas breves">Lecturas breves</option>
                <option value="Lecturas + ejercicios">Lecturas + Ejercicios</option>
                <option value="Esquemas + problemas">Esquemas + Problemas</option>
                <option value="Mixto">Mixto (Recomendado)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div>
          <label className={labelClasses}>
            <User className={iconClasses} /> Tu Perfil
          </label>
          <input
            type="text"
            name="profile"
            required
            placeholder="Ej. Estudiante de 1º de Biología, Emprendedor..."
            className={inputClasses}
            value={formData.profile}
            onChange={handleChange}
          />
        </div>

        {/* Objective */}
        <div>
          <label className={labelClasses}>
            <Target className={iconClasses} /> Objetivo Principal
          </label>
          <input
            type="text"
            name="objective"
            required
            placeholder="Ej. Aprobar el examen final, lanzar mi negocio..."
            className={inputClasses}
            value={formData.objective}
            onChange={handleChange}
          />
        </div>

        {/* Time */}
        <div>
          <label className={labelClasses}>
            <Clock className={iconClasses} /> Tiempo Disponible
          </label>
          <input
            type="text"
            name="timeAvailable"
            required
            placeholder="Ej. 2 semanas (1h al día), Fin de semana intensivo..."
            className={inputClasses}
            value={formData.timeAvailable}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
            <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-violet-500/20 transition-all flex items-center justify-center gap-3
                ${isLoading 
                    ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:-translate-y-1'}`}
            >
            {isLoading ? (
                <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generando Curso...
                </>
            ) : (
                <>
                <Sparkles className="w-5 h-5" /> Diseñar Curso Ahora
                </>
            )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;