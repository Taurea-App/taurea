import EditRoutineLayout from "../edit_routine_layout";
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
    const { routineId } = useLocalSearchParams<{ routineId: string }>();
  return (
    <EditRoutineLayout isNewRoutine={false} routineId={routineId} />
    );
}