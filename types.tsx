export type Exercise = {
  id: string;
  name: string;
  description: string;
  measurementType: 'Reps' | 'Time' | 'Distance';
};

export type ExerciseInRoutine = Exercise & { quantity: number };

export type Routine = {
  id: string;
  name: string;
  description: string;
  exercises: ExerciseInRoutine[];
};