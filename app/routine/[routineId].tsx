import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig'; // Adjust the import path as necessary
import { Exercise, Routine } from '@/types'; // Adjust the import path as necessary
import { useRouter, Stack, useNavigation } from 'expo-router';

export default function Page() {
  const { routineId } = useLocalSearchParams();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);


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

        setExercises(routineSnap.data().exercises);
      }
    };

    fetchRoutineDetails();
  }, [routineId]);

  const handleDelete = async () => {
    if (!routineId) return;

    await deleteDoc(doc(FIRESTORE_DB, 'Routines', routineId));
    console.log('Routine deleted successfully');
    // After deletion, navigate back or to another screen as needed
    navigation.navigate('index');
  };

  // Consider adding a function for editing that navigates to an edit screen or opens an edit mode

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{routine?.name}</Text>
      <Text style={styles.description}>{routine?.description}</Text>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {/* <Text>{exercise.description}</Text> */}
          <Text>{exercise.quantity} {exercise.unit}</Text>
        </View>
      ))}
      {/* Implement navigation or state change for editing here */}
      <Button title="Edit Routine" onPress={() => {/* Edit logic */}} color="#0099ff" />
      <Button title="Delete Routine" onPress={handleDelete} color="#ff4444" />
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

});
