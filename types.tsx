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
  isPublic: boolean;
  publicRoutineId?: string;
  originalPublicRoutineId?: string;
  originalCreator?: {
    email: string;
    username: string;
    displayName: string;
  };
};

export type PublicRoutine = Routine & {
  ownerRef: string;
  user: {
    email: string;
    username: string;
    displayName: string;
  };
  routineRef: string;
};

export type FlatRoutineItem = ExerciseInRoutine & {
  inSubroutine: boolean;
};

export type DBUser = {
  id: string;
  uid: string;
  username: string | null;
  displayName: string | null;
  email: string | null;
  bio: string | null;
};

export interface SearchResult {
  id: string;
  data: DBUser | PublicRoutine;
  title: string;
  subtitle: string;
  type: "user" | "routine";
  score: number;
  href: string;
}
