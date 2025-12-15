import { GoogleGenAI } from "@google/genai";
import { CourseStructure, UserPreferences } from "../types";

const SYSTEM_INSTRUCTION = `
Actúas como un Diseñador Instruccional Senior y Catedrático experto. 
Tu objetivo es crear un curso online de ALTA CALIDAD ACADÉMICA.
El idioma de salida debe ser SIEMPRE Español de España.

PRINCIPIOS PEDAGÓGICOS:
1. RIGOR: No seas superficial. Si mencionas una teoría, técnica o modelo, DEBES explicarlo en profundidad (origen, principios, funcionamiento y aplicación).
2. CLARIDAD Y FORMATO: El contenido debe ser fácil de leer.
   - Usa **negritas** para conceptos clave.
   - Usa listas con viñetas (-) para enumeraciones.
   - Usa DOBLE SALTO DE LÍNEA para separar párrafos claramente.
3. ESTRUCTURA: Alterna entre teoría profunda, ejemplos concretos y validación de conocimientos.
`;

const cleanJsonString = (str: string): string => {
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateCourse = async (prefs: UserPreferences): Promise<CourseStructure> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Genera un curso completo y RIGUROSO sobre el tema: "${prefs.topic}".
    
    CONTEXTO DEL ALUMNO:
    - Nivel: ${prefs.level}
    - Perfil: ${prefs.profile}
    - Objetivo Principal: ${prefs.objective}
    - Tiempo Disponible: ${prefs.timeAvailable}
    - Formato preferido: ${prefs.format}

    REQUISITOS DE CONTENIDO Y FORMATO:
    - FORMATO: Usa Markdown explícito.
      * Para listas usa guiones (-).
      * Para énfasis usa negritas (**texto**).
      * Para títulos internos dentro de una explicación usa ###.
      * IMPORTANTE: Separa cada párrafo con un salto de línea doble (\\n\\n) para que no se vea como un bloque de texto denso.
    
    - TIPO DE BLOQUES:
      * En el bloque "theory", desarrolla explicaciones extensas pero bien estructuradas con párrafos cortos y viñetas.
      * Si citas una metodología, usa una lista para explicar sus pasos.

    ESTRUCTURA JSON REQUERIDA (Genera solo JSON válido):
    {
      "title": "Título académico y atractivo",
      "subtitle": "Subtítulo descriptivo",
      "level": "${prefs.level}",
      "duration": "Estimación realista",
      "targetProfile": "Perfil del alumno",
      "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3", "Objetivo 4"],
      "units": [
        {
          "title": "Unidad 1: Fundamentos...",
          "summary": "Introducción teórica...",
          "lessons": [
            {
              "title": "1.1 Título de la lección",
              "duration": "ej. 20 min",
              "blocks": [
                {
                  "type": "keyIdea",
                  "title": "Concepto Central",
                  "content": "Resumen ejecutivo de la idea principal. **Usa negritas** para resaltar lo importante."
                },
                {
                  "type": "theory",
                  "title": "Profundización Teórica / Modelo X",
                  "content": "Aquí va la explicación densa.\\n\\nUsa párrafos separados.\\n\\n- Usa listas\\n- Para facilitar\\n- La lectura."
                },
                {
                  "type": "example",
                  "title": "Caso de Estudio",
                  "content": "Aplicación detallada de la teoría anterior en un escenario real."
                },
                {
                  "type": "activity",
                  "title": "Ejercicio Práctico",
                  "content": "Instrucciones paso a paso para realizar una actividad."
                },
                {
                  "type": "quiz",
                  "title": "Comprobación de Lectura",
                  "content": "Preguntas sobre la teoría explicada:",
                  "quizData": [
                    {
                      "question": "¿Pregunta conceptual?",
                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                      "correctAnswerIndex": 0
                    },
                    {
                      "question": "¿Pregunta de aplicación?",
                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                      "correctAnswerIndex": 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "finalAssessment": [
        {
           "question": "¿Pregunta final?",
           "options": ["A", "B", "C", "D"],
           "correctAnswerIndex": 0
        }
      ],
      "finalProjects": [
        { "title": "Proyecto 1", "description": "Descripción..." },
        { "title": "Proyecto 2", "description": "Descripción..." }
      ],
      "sources": [
        "Fuente 1"
      ]
    }

    IMPORTANTE:
    - Asegura que el JSON sea válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");

    const jsonStr = cleanJsonString(text);
    return JSON.parse(jsonStr) as CourseStructure;

  } catch (error) {
    console.error("Error generating course:", error);
    throw new Error("No se pudo generar el curso. Intenta reducir la complejidad o probar de nuevo.");
  }
};