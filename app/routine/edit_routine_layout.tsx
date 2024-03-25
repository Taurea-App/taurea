import { Exercise, ExerciseInRoutine } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from "react-native";
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

import {Picker} from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { Input, Modal } from "native-base";
const meassurementUnits = [
    'Reps.',
    'Secs.',
    'Mins.',
    'Meters',
    'Km',
];

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

    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);

    const [showAddExercise, setShowAddExercise] = useState(false);

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

    return <View style={[style.container, {
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
    ]}>
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
                multiline={true} 
                numberOfLines={4}
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
        <View style={style.exerciseList}>
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
                    style={style.exerciseListItemQuantity}
                    placeholder="Quantity"
                    value={selectedQuantity.toString()}
                    onChangeText={(text) => setSelectedQuantity(parseInt(text))}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (!selectedExercise) return;
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
        <View>
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
        </View>
   </View>

    }

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
      },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width   : '100%',
      },
      description: {
        fontSize: 18,
        marginBottom: 10,
        color: '#666666',
      },
      exerciseList: {
        width: '100%',
        // padding: 10,
        // backgroundColor: '#f9f9f9',
        // borderRadius: 10,
        marginBottom: 5,
    },
    exerciseListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        // backgroundColor: '#f9f9f9',
        width: '100%',
        // borderRadius: 10,
        marginBottom: 5,
    },
    exerciseListItemName: {
        fontSize: 16,
        width: '40%',
    },
    exerciseListItemQuantity: {
        fontSize: 16,
        width: '20%',
    },
    searchBar: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        width: '100%',
        borderRadius: 10,
    },

    newExerciseForm: {
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        margin: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 10,
    },
    newExercisePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exerciseSelect: {
        width: '45%',
        textAlign: 'center',
    },
    quantityInput: {
        width: '25%',
    },
    unitSelect: {
        width: '30%',
    },

    exerciseSelectModalView: {
        // marginTop: 100,
        // backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '100%',
    },
    button: {
        alignItems: 'center',
        padding: 10,
        width: '100%',
    },
    exerciseSelectItem: {
        fontSize: 16,
    },
    pickerItem: {
        fontSize: 12,
        },
    showAddExerciseButton: {
        padding: 10,
        // backgroundColor: '#50f950',
        borderRadius: 10,
        width: '100%',
        // alignItems: 'flex-end',
        // justifyContent: 'center',
    },
    saveButton: {
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addExerciseButton: {
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

