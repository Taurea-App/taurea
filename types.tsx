export type Exercise = {
  id: string;
  name: string;
  description: string;
  measurementType: string;
};

export type ExerciseInRoutine = Exercise & {
  quantity: number;
} & {
  unit: string;
} & {
  exerciseId: string;
};

export type Subroutine = {
  id: string;
  quantity: number;
  unit: string;
  exercises: ExerciseInRoutine[];
};

export type RoutineItem = ExerciseInRoutine | Subroutine;

export type Routine = {
  id: string;
  name: string;
  description: string;
  routineItems: RoutineItem[];
};
