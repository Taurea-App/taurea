export type Exercise = {
  id: string;
  name: string;
  description: string;
  measurementType: string;
};

export type ExerciseInRoutine = Exercise & { quantity: number } & { unit: string } & { exerciseId: string };

export type Routine = {
  id: string;
  name: string;
  description: string;
  exercises: ExerciseInRoutine[];
};

