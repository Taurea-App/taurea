import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, TextInput, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig';
import { Routine, Exercise } from '@/types';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<{ [key: string]: Exercise[] }>({});

  useEffect(() => {
    const routinesRef = collection(FIRESTORE_DB, "Routines");
    const unsubscribe = onSnapshot(routinesRef, (snapshot) => {
      const loadedRoutines: Routine[] = [];
      snapshot.docs.forEach((doc) => {
        loadedRoutines.push({
          id: doc.id,
          ...doc.data(),
        } as Routine);
      });
      setRoutines(loadedRoutines);
    });

    return () => unsubscribe();
  }, []);

  const toggleRoutine = async (routineId: string) => {
    // Expand or collapse routine
    if (expandedRoutineId === routineId) {
      setExpandedRoutineId(null); // Collapse if it's already expanded
    } else {
      setExpandedRoutineId(routineId); // Expand new routine

      // Fetch exercises for this routine if not already loaded
      if (!exercises[routineId]) {
        const routine = routines.find((r) => r.id === routineId);
        if (routine) {
          const exercisesRefs = routine.exercises;
          const exerciseDetails: Exercise[] = [];

          for (const exerciseRef of exercisesRefs) {
            const docRef = doc(FIRESTORE_DB, "Exercises", exerciseRef.exercise_id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              exerciseDetails.push({
                id: docSnap.id,
                ...docSnap.data(),
              } as Exercise);
            }
          }

          setExercises((prevExercises) => ({
            ...prevExercises,
            [routineId]: exerciseDetails,
          }));
        }
      }
    }
  };

  const renderRoutine = ({ item }: { item: Routine }) => {
    const isExpanded = expandedRoutineId === item.id;

    return (
      <View style={styles.todoContainer}>

        {/* <TouchableOpacity onPress={() => toggleRoutine(item.id)} style={styles.routineRow}>
          <Text style={styles.todoText}>{item.name}</Text>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>

        {isExpanded && exercises[item.id] && (
          <View style={styles.exercisesList}>
            {exercises[item.id].map((exercise) => (
              <Text key={exercise.id} style={styles.exerciseText}>
                {exercise.name} - {item.exercises.find((e) => e.exercise_id === exercise.id)?.quantity} {exercise.measurementType}
              </Text>
            ))}

          </View>
        )} */}

        <Link href={{
          pathname: '/routine/[routineId]',
          params: { routineId: item.id}
        }}>
          <Text style={styles.todoText}>{item.name}</Text>
        </Link>


      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routines</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  todoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginVertical: 5,
  },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    width: '100%',
  },
  exercisesList: {
    padding: 10,
    backgroundColor: '#444',
  },
  todoText: {
    color: 'white',
  },
  exerciseText: {
    color: 'lightgrey',
  },
});
