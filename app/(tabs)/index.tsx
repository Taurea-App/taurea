import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig';
import { Routine, Exercise } from '@/types';
import { Link, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function MyRoutinesScreen() {
  const colorScheme = useColorScheme();

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
            const docRef = doc(FIRESTORE_DB, "Exercises", exerciseRef.id);
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
      <View style={[styles.routineContainer, 
        { backgroundColor: Colors[colorScheme ?? 'light'].tabBackgroundColor 
        }]}>

        <Link href={{
          pathname: '/routine/[routineId]',
          params: { routineId: item.id}
        }} asChild>
          <TouchableOpacity>
            <Text style={[styles.routineText,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}>{item.name}</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routines</Text>
      <FlatList
        style={{ width: '100%' }}
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderRoutine}
      />
      <Link href="/routine/new" asChild>
        <TouchableOpacity style={styles.addRoutineButton}>
          <Text>New Routine</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  routineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginVertical: 5,
    padding: 10,
    width: '100%',
  },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  exercisesList: {
    padding: 10,
    backgroundColor: '#444',
  },
  routineText: {
    // color: 'white',
  },
  exerciseText: {
    color: 'lightgrey',
  },
  addRoutineButton: {
    backgroundColor: 'orange',
    padding: 15,
    margin: 10,
    borderRadius: 20,
  },
});
