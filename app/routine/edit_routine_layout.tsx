import { Exercise, ExerciseInRoutine } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView } from "react-native";
import { getDocs, collection, query, where, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import Colors from '@/constants/Colors';
import { useColorScheme } from "react-native";
import { Stack, useNavigation } from 'expo-router'
import {
    SafeAreaProvider,
    useSafeAreaInsets,
  } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { Input, Modal } from "native-base";
const meassurementUnits = [
    'Reps.',
    'Secs.',
    'Mins.',
    'Meters',
    'Km',
];
import {editRoutineLayoutStyle as style} from './edit_routine_layout_style';

export default function EditRoutineLayout({isNewRoutine, routineId}: {isNewRoutine: boolean, routineId?: string}) {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [routineName, setRoutineName] = useState('');
    const [routineDescription, setRoutineDescription] = useState('');

    const [exercises, setExercises] = useState<ExerciseInRoutine[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [fetchedExercises, setFetchedExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [selectedUnit, setSelectedUnit] = useState(meassurementUnits[0]);

    const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
    const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);

    const loadRoutine = async () => {
        if (!routineId) return;
        const routineRef = doc(FIRESTORE_DB, 'Routines', routineId);
        const routineSnap = await getDoc(routineRef);
        if (routineSnap.exists()) {
            setRoutineName(routineSnap.data().name);
            setRoutineDescription(routineSnap.data().description);
            setExercises(routineSnap.data().exercises);
            console.log('Routine loaded: ', routineSnap.data());
        }
        else {
            console.log('No such document!');
        }
    }

    const fetchExercises = async () => {
        const q = query(collection(FIRESTORE_DB, 'Exercises'));
        const querySnapshot = await getDocs(q);
        const exercisesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Exercise[];
        setFetchedExercises(exercisesList);
        setFilteredExercises(exercisesList);    
    }

    const saveRoutine = async () => {
        const routine = {
            name: routineName,
            description: routineDescription,
            exercises: exercises,
        }
        if (isNewRoutine) {    
            const docRef = await addDoc(collection(FIRESTORE_DB, 'Routines'), routine);
            console.log('Document written with ID: ', docRef.id);
        }
        else {
            if (!routineId) return;
            const routineRef = doc(FIRESTORE_DB, 'Routines', routineId);
            await setDoc(routineRef, routine);
        }
        navigation.navigate('index');
    }

    useEffect(() => {
        if (!isNewRoutine) {
            loadRoutine();
        }

        console.log('isNewRoutine: ', isNewRoutine);
        if (isNewRoutine) {
            console.log('New Routine');
        } else {
            console.log('Edit Routine');
        }

        fetchExercises();
    }
    , []);

    useEffect(() => {
        setFilteredExercises(fetchedExercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    , [searchTerm]);

    const renderRoutineItem = ({item, drag, isActive}: {item: ExerciseInRoutine, drag: any, isActive: boolean}) => {
        return (
            <ScaleDecorator>     
                <TouchableOpacity 
                    style={[style.exerciseListItem, {
                        backgroundColor: colorScheme ? Colors[colorScheme].tabBackgroundColor : Colors.light.tabBackgroundColor
                    }]}
                    onLongPress={drag}
                    disabled={isActive}    
                >
                    <Text style={[style.exerciseListItemName, {
                        color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
                    }]}>
                        {item.name}
                    </Text>
                    <Text style={[style.exerciseListItemQuantity, {
                            color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
                        }]}>
                        {item.quantity} {item.unit}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setExercises(exercises.filter((exercise) => exercise.id !== item.id))}
                    >
                        <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                </TouchableOpacity>
                </ScaleDecorator>
        );  
    }

    return <ScrollView 
        contentContainerStyle={[style.container, {
            // Paddings to handle safe area
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            // height: '100%',
        }
        ]}
        automaticallyAdjustKeyboardInsets={true}
    >
        <Stack.Screen options={{ title: isNewRoutine ? 'New Routine' : 'Edit Routine' }} />
        {/* Title and description */}
        <View style={{width: '100%', padding: 10}}>
            <TextInput
                style={[
                    style.title,
                    {
                        color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
                    }]
                }
                onChangeText={setRoutineName}
                value={routineName}
                placeholder="Routine Name"
            />
            <TextInput 
                style={style.description} 
                onChangeText={setRoutineDescription}
                value={routineDescription}
                placeholder="Routine Description"
                blurOnSubmit={true}
                multiline={true} 
                // numberOfLines={4}
            />
        </View>

        {/* Exercise List */}
        <DraggableFlatList style={style.exerciseList}
            data={exercises}
            containerStyle={{ flex : 1 }}
            onDragEnd={({ data }) => setExercises(data) }
            renderItem={({item, drag, isActive }) => renderRoutineItem({item, drag, isActive})}
            keyExtractor={(item, index) => index.toString() + item.id}
        />
        {/* New exercise form */}
        <View style={style.newExerciseForm}>
            <View style={[style.exerciseListItem, {
                backgroundColor: colorScheme ? Colors[colorScheme].tabBackgroundColor : Colors.light.tabBackgroundColor,
            }]}>
                <TextInput 
                    style={[style.exerciseListItemName, {
                        color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
                    }]}
                    placeholder="Exercise Name"
                    value={selectedExercise?.name}
                    onPressIn={() => setShowExerciseSelectModal(true)}
                    readOnly
                />
                <TextInput 
                    style={[style.exerciseListItemQuantity, {
                        color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
                    }]}
                    placeholder="Quantity"
                    value={selectedQuantity ? selectedQuantity.toString() : ''}
                    onChangeText={(text) => setSelectedQuantity(isNaN(parseInt(text)) ? null : parseInt(text))}
                    inputMode="decimal"
                />
                <TouchableOpacity
                    onPress={() => {
                        if ( (!selectedExercise) || (!selectedQuantity) ) return;
                        const newExercise = {
                            id: selectedExercise.id,
                            name: selectedExercise.name,
                            quantity: selectedQuantity,
                            unit: selectedUnit,
                        } as ExerciseInRoutine;
                        setExercises([...exercises, newExercise]);
                        setSelectedExercise(null);
                        setSelectedQuantity(1);
                    }}
                >
                    <Ionicons name="add" size={24} color="green" />
                </TouchableOpacity>

            </View>
        </View>
                
        {/* Save Button */}
        <TouchableOpacity style={style.saveButton} onPress={() => {
            saveRoutine();
        }
        }>
            <Text>Save</Text>
        </TouchableOpacity>

        {/* Exercise Select Modal */}
        <Modal
            animationPreset="slide"
            isOpen={showExerciseSelectModal}
            size='full'
            onClose={() => {
                setSearchTerm('');
                setShowExerciseSelectModal(false);
            }}
        >
            <Modal.Content 
                style={[style.exerciseSelectModalView, {
                    backgroundColor: colorScheme ? Colors[colorScheme].background : Colors.light.background,
                }]}
                marginBottom={0}
                marginTop={'auto'}
            >
                <TextInput 
                    style={[style.searchBar, {
                        backgroundColor: colorScheme ? Colors[colorScheme].tabBackgroundColor : Colors.light.tabBackgroundColor,
                    }]}
                    placeholder="Search Exercises..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                {filteredExercises.map((exercise) => (
                    <TouchableOpacity 
                        key={exercise.id} 
                        style={[style.button, {
                            backgroundColor: colorScheme ? Colors[colorScheme].tabBackgroundColor : Colors.light.tabBackgroundColor,
                        }]}
                        onPress={() => {
                            setSelectedExercise(exercise);
                            setShowExerciseSelectModal(false);
                            setSearchTerm('');
                        }
                    }>
                        <Text style={[style.exerciseSelectItem, {
                            color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
                        }]}>
                            {exercise.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Modal.Content>
        </Modal>
        
   </ScrollView>
    }