import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig'; // Adjust the import path as necessary
import { Exercise, Routine } from '@/types'; // Adjust the import path as necessary
import { useRouter, Stack  } from 'expo-router';

export default function Page() {
  const { routineId } = useLocalSearchParams();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const router = useRouter();

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  const addExerciseToRoutine = async (exerciseId: string) => {
    if (!routineId) return;

    // Add the exercise to the routine
    const routineRef = doc(FIRESTORE_DB, 'Routines', routineId);
    await routineRef.update({
      exercises: [
        ...routine.exercises,
        { exercise_id: exerciseId, quantity: 1 }, // Assuming the default quantity is 1
      ],
    });

    // Fetch the updated routine details
    const updatedRoutineSnap = await getDoc(routineRef);
    if (updatedRoutineSnap.exists()) {
      setRoutine({
        id: updatedRoutineSnap.id,
        ...updatedRoutineSnap.data(),
      });
    }

    // Hide the add exercise section
    setShowAddExercise(false);
  }

  useEffect(() => {
    const fetchAllExercises = async () => {
      const exercisesSnapshot = await getDocs(collection(FIRESTORE_DB, 'Exercises'));
      const exercisesList = exercisesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Exercise[];
      setAllExercises(exercisesList);
      setFilteredExercises(exercisesList); // Initially display all exercises
    };
  
    fetchAllExercises();
  }, []);
  
  useEffect(() => {
    const filtered = allExercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchTerm, allExercises]);
  

  useEffect(() => {
    const fetchRoutineDetails = async () => {
      if (!routineId) return;

      // Fetch the routine details
      const routineRef = doc(FIRESTORE_DB, 'Routines', routineId);
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        setRoutine({
          id: routineSnap.id,
          ...routineSnap.data(),
        } as Routine);


        // Assuming `exercises` in a routine are stored as an array of { exercise_id, quantity }
        const exercisePromises = routineSnap.data().exercises.map(async ({ exercise_id }: { exercise_id: string }) => {
          const exerciseRef = doc(FIRESTORE_DB, 'Exercises', exercise_id);
          const exerciseSnap = await getDoc(exerciseRef);

          return exerciseSnap.exists() ? {
            id: exerciseSnap.id,
            ...exerciseSnap.data(),
          } : null;
        });

        const fetchedExercises = await Promise.all(exercisePromises);
        setExercises(fetchedExercises.filter(Boolean) as Exercise[]);
      }
    };

    fetchRoutineDetails();
  }, [routineId]);

  const handleDelete = async () => {
    if (!routineId) return;

    await deleteDoc(doc(FIRESTORE_DB, 'Routines', routineId));
    // After deletion, navigate back or to another screen as needed
  };

  // Consider adding a function for editing that navigates to an edit screen or opens an edit mode

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{routine?.name}</Text>
      <Text style={styles.description}>{routine?.description}</Text>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text>{exercise.description}</Text>
          <Text>Quantity: {routine.exercises.find(e => e.exercise_id === exercise.id)?.quantity}</Text>
          <Text>Measurement Type: {exercise.measurementType}</Text>
        </View>
      ))}
      <Button title="Delete Routine" onPress={handleDelete} color="#ff4444" />
      {/* Implement navigation or state change for editing here */}
      <Button title="Edit Routine" onPress={() => {/* Edit logic */}} color="#0099ff" />
      <Button title="Add Exercise" onPress={() => setShowAddExercise(!showAddExercise)} style={styles.addExerciseButton} />
      {showAddExercise && (
        <View style={styles.addExerciseContainer}>
          {/* Add exercise logic here */}
          <ScrollView style={styles.container}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search Exercises..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {filteredExercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text>{exercise.description}</Text>
                <Button title="Add to Routine" onPress={() => addExerciseToRoutine(exercise.id)} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0099ff',
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666666',
  },
  exerciseContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addExerciseButton: {
    color: '#0099ff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  addExerciseContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  searchBar: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  addExerciseButton: {
    color: '#0099ff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  // Add more styles as needed
});
