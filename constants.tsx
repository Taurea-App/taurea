export const EXERCISE_UNITS = [
  "Reps",
  "Seconds",
  "Minutes",
  "Meters",
  "Kilometers",
];

export const SUBROUTINE_UNITS = ["Sets", "Minutes"];

export const NEW_SUBROUTINE_ID = "new_subroutine";
export const REST_ID = "rest";

type ItemColor = "yellow" | "blue";

type ExerciseSelectionItem = {
  id: string;
  name: string;
  description: string;
  color: ItemColor;
  image_url?: string;
  translations: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
};

export const NEW_SUBROUTINE_ITEM: ExerciseSelectionItem = {
  id: NEW_SUBROUTINE_ID,
  name: "New Subroutine",
  description: "",
  color: "yellow",
  translations: {
    en: {
      name: "New Subroutine",
      description: "",
    },
    es: {
      name: "Nueva Subrutina",
      description: "",
    },
  },
};

export const REST_ITEM: ExerciseSelectionItem = {
  id: REST_ID,
  name: "Rest",
  description: "",
  color: "blue",
  translations: {
    en: {
      name: "Rest",
      description: "",
    },
    es: {
      name: "Descanso",
      description: "",
    },
  },
};
