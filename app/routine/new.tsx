import { Exercise } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Box, CheckIcon, Select } from "native-base";
import { getDocs, collection, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";


export default function Page() {
    const [routineName, setRoutineName] = useState('');
    const [routineDescription, setRoutineDescription] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [quantities, setQuantities] = useState<number[]>([1]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const fetchExercises = async () => {
        const q = query(collection(FIRESTORE_DB, 'Exercises'));
        const querySnapshot = await getDocs(q);
        const exercisesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Exercise[];
        setFilteredExercises(exercisesList);
        console.log(filteredExercises);
    }

    useEffect(() => {
        fetchExercises();
    }, []);


    return <View>
        <TextInput
            style={style.title}
            onChangeText={setRoutineName}
            value={routineName}
            placeholder="Routine Name"
        />
        <TextInput 
            style={style.description} 
            onChangeText={setRoutineDescription}
            value={routineDescription}
            placeholder="Routine Description" multiline={true}
        />

        <Text style={style.title}>Exercises</Text>
        {exercises.map((exercise, index) => (
            <View key={exercise.id}>
                <Text>{exercise.name}</Text>
                <TextInput 
                    value={quantities[index].toString()}
                    onChangeText={(text) => {
                        const newQuantities = [...quantities];
                        newQuantities[index] = parseInt(text);
                        setQuantities(newQuantities);
                    }}
                />
            </View>
        ))}

        <TextInput 
            style={style.searchBar}
            placeholder="Search Exercises..."
            value={searchTerm}
            onChangeText={setSearchTerm}
        />

        {/* {filteredExercises.length === 0 && <Text>No exercises found</Text>} */}
        {/* {filteredExercises.length > 0 && */}
        <Box>
            <Select
            // onValueChange={(itemValue) => {
            //     const exercise = filteredExercises.find((e) => e.id === itemValue);
            //     setSelectedExercise(exercise);
            // }}
            >
                {/* {filteredExercises.map((exercise) => (
                    <Select.Item label={exercise.name} value={exercise.id} />
                ))} */}
                {/* <Select.Item label="Test" value="test" /> */}
                {/* <Select.Item label="Test2" value="test2" /> */}
            </Select>
        </Box>
        {/* } */}


   </View>
    }

const style = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      description: {
        fontSize: 18,
        marginBottom: 10,
        color: '#666666',
      },
        searchBar: {
            padding: 10,
            marginBottom: 10,
        },
})

