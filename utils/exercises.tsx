import { Exercise, Ilanguage } from "@/types";

export function getName(exercise: Exercise, language: Ilanguage) {
  console.log(exercise);
  const translations = exercise.translations;
  const translation = translations ? translations[language] : null;
  return translation ? translation.name : exercise.name;
}

export function getDescription(exercise: Exercise, language: Ilanguage) {
  const translations = exercise.translations;
  const translation = translations ? translations[language] : null;
  return translation ? translation.description : exercise.description;
}
