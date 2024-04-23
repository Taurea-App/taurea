import { useLocalSearchParams } from "expo-router";

import EditRoutineLayout from "../edit_routine_layout";

export default function Page() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  return <EditRoutineLayout isNewRoutine={false} routineId={routineId} />;
}
