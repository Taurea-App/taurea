import { Stack } from "expo-router";
import EditRoutineLayout from "./edit_routine_layout";
import { View } from "native-base";

export default function Page() {
  return (
      <EditRoutineLayout isNewRoutine />
  );
}