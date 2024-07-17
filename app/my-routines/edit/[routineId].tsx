import { useLocalSearchParams } from "expo-router";

import EditRoutineLayout from "../editRoutineLayout";

export default function Page() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  return <EditRoutineLayout isNewRoutine={false} routineId={routineId} />;
}
