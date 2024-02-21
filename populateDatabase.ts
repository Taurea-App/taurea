import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig';

export type ExerciseDetail = {
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

export default function TabOneScreen() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<{ [key: string]: ExerciseDetail }>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIRESTORE_DB, "Routines"), (snapshot) => {
      const loadedRoutines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Routine[];
      setRoutines(loadedRoutines);
    });

    return () => unsubscribe();
  }, []);

  const toggleRoutine = async (routine: Routine) => {
    setExpandedRoutineId(expandedRoutineId === routine.id ? null : routine.id);

    // Fetch exercise details if not already loaded
    for (const { exercise_id } of routine.exercises) {
      if (!exerciseDetails[exercise_id]) {
        const docRef = doc(FIRESTORE_DB, "Exercises", exercise_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExerciseDetails(prev => ({
            ...prev,
            [exercise_id]: { id: docSnap.id, ...docSnap.data() } as ExerciseDetail,
          }));
        }
      }
    }
  };

  const renderExerciseDetail = (exercise: ExerciseInRoutine) => {
    const detail = exerciseDetails[exercise.exercise_id];
    return detail ? (
      <View style={styles.exerciseDetailContainer}>
        <Text style={styles.exerciseName}>{detail.name}</Text>
        <Text style={styles.exerciseMeta}>{`${exercise.quantity} ${detail.measurementType}`}</Text>
      </View>
    ) : null;
  };

  const renderRoutine = ({ item }: { item: Routine }) => {
    const isExpanded = expandedRoutineId === item.id;
    return (
      <View style={styles.routineContainer}>
        <TouchableOpacity onPress={() => toggleRoutine(item)} style={styles.routineHeader}>
          <Text style={styles.routineName}>{item.name}</Text>
          <Ionicons name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="#FFF" />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.exercisesContainer}>
            {item.exercises.map(exercise => (
              <View key={exercise.exercise_id}>
                {renderExerciseDetail(exercise)}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderRoutine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  routineContainer: {
    backgroundColor: '#3a3e47',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4b515d',
  },
  routineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  exercisesContainer: {
    padding: 16,
  },
  exerciseDetailContainer: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: '#FFF',
  },
  exerciseMeta: {
    fontSize: 14,
    color: '#abb2bf',
  },
});
