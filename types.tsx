export type Exercise = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
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

export type FlatRoutineItem = ExerciseInRoutine & {
  inSubroutine: boolean;
};

export type DBUser = {
  id: string;
  uid: string;
  username: string | null;
};
