import { Exercise, ExerciseInRoutine } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import Colors from '@/constants/Colors';
import { useColorScheme } from "react-native";
import { useNavigation } from 'expo-router'
import {
    SafeAreaProvider,
    useSafeAreaInsets,
  } from 'react-native-safe-area-context';

import {Picker} from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
const meassurementUnits = [
    'Reps.',
    'Secs.',
    'Mins.',
    'Meters',
    'Km',
];

export default function Page() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

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
        const docRef = await addDoc(collection(FIRESTORE_DB, 'Routines'), routine);
        console.log('Document written with ID: ', docRef.id);
        navigation.navigate('index');
    }

    useEffect(() => {
        fetchExercises();
    }
    , []);
    useEffect(() => {
        setFilteredExercises(fetchedExercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    , [searchTerm]);


    return <View style={[style.container, {
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    }
    ]}>
        {/* Title and description */}
        <View>
            <TextInput
                style={[
                    style.title,
                    {
                        color: Colors[colorScheme].text
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
            renderItem={({item, drag, isActive }) => (
                <ScaleDecorator>      
                    <TouchableOpacity 
                        style={[style.exerciseListItem, {
                            backgroundColor: Colors[colorScheme].tabBackgroundColor
                        }]}
                        onLongPress={drag}
                        disabled={isActive}    
                    >
                        <Text style={[style.exerciseListItemName, {
                            color: Colors[colorScheme].text,
                        }]}>
                            {item.name}
                        </Text>
                        <Text style={[style.exerciseListItemQuantity, {
                                color: Colors[colorScheme].text,
                            }]}>
                            {item.quantity} {item.unit}
                        </Text>
                        <TouchableOpacity
                            style={style.exerciseListItemDelete}
                            onPress={() => setExercises(exercises.filter((exercise) => exercise.id !== item.id))}
                        >
                            <Ionicons name="trash" size={24} color="red" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </ScaleDecorator>
            )}
            keyExtractor={(item, index) => index.toString() + item.id}
        />

        {/* Save Button */}
        <TouchableOpacity style={style.saveButton} onPress={() => {
            saveRoutine();
        }
        }>
            <Text>Save</Text>
        </TouchableOpacity>
            
        {/* Add Exercise Button */}
        <TouchableOpacity style={[style.showAddExerciseButton,
        ]} onPress={() => setShowAddExercise(!showAddExercise)}>
            <Text
                style={{
                    color: Colors[colorScheme].text,
                    fontSize: 24,
                    // fontWeight: 'bold',
                }}>{showAddExercise ? '-' : '+'}</Text>
        </TouchableOpacity>

        {/* New Exercise Form */}
        {showAddExercise && 
            <View style={style.newExerciseForm}>

                <View style={style.newExercisePicker}>

                    <TextInput 
                        style={style.exerciseSelect}
                        placeholder="Select an exercise"
                        value={selectedExercise?.name}
                        onPressIn={() => setShowExerciseSelectModal(true)}
                        readOnly
                        />

                    <Picker
                        selectedValue={selectedQuantity}
                        onValueChange={(itemValue, itemIndex) => setSelectedQuantity(itemValue)}
                        style={style.quantityInput}
                        itemStyle={style.pickerItem}
                        >
                        {[...Array(99).keys()].map((i) => (
                            <Picker.Item label={(i + 1).toString()} value={i + 1} style={style.pickerItem} key={i} />
                            ))}
                    </Picker>


                    <Picker
                        selectedValue={selectedUnit}
                        onValueChange={(itemValue, itemIndex) => setSelectedUnit(itemValue)}
                        style={style.unitSelect}
                        itemStyle={style.pickerItem}
                        >
                        {meassurementUnits.map((unit) => (
                            <Picker.Item label={unit} value={unit} style={style.pickerItem} key={unit} />
                            ))}
                    </Picker>
            
                </View>

                {/* Add Exercise Button */} 
                <TouchableOpacity style={style.addExerciseButton} onPress={() => {
                    if (selectedExercise) {
                        setExercises([...exercises, {...selectedExercise, quantity: selectedQuantity, unit: selectedUnit}]);
                        setSelectedExercise(null);
                        setSelectedQuantity(1);
                        setSelectedUnit(meassurementUnits[0]);
                    }
                }
                }>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
        }    

        {/* Exercise Select Modal */}
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showExerciseSelectModal}
                onRequestClose={() => {
                    setSearchTerm('');
                    setShowExerciseSelectModal(false);
                }}
            >
                <View style={style.exerciseSelectModalView}>
                    <TextInput 
                        style={style.searchBar}
                        placeholder="Search Exercises..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    {filteredExercises.map((exercise) => (
                        <TouchableOpacity key={exercise.id} style={style.button} onPress={() => {
                            setSelectedExercise(exercise);
                            setShowExerciseSelectModal(false);
                            setSearchTerm('');
                        }
                        }>
                            <Text style={style.exerciseSelectItem}>
                                {exercise.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
   </View>

    }

const style = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'beginning',
        justifyContent: 'center',
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
    exerciseListItemDelete: {
        fontSize: 16,
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
        marginTop: 100,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
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
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#50f950',
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addExerciseButton: {
        padding: 10,
        backgroundColor: '#50f950',
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

