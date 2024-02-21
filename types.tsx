export type Exercise = {
  id: string;
  name: string;
  description: string;
  measurementType: 'Reps' | 'Time' | 'Distance';
};

export type ExerciseInRoutine = {
  exercise_id: string;
  quantity: string; // Assuming quantity could be reps, time duration, etc.
};

export type Routine = {
  id: string;
  name: string;
  description: string;
  exercises: ExerciseInRoutine[];
};