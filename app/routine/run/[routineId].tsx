import { View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { ExerciseInRoutine, Routine } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Timer from "@/components/Timer";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function Page() {
    const { routineId } = useLocalSearchParams<{ routineId: string }>();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [currentExercise, setCurrentExercise] = useState<ExerciseInRoutine | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [waitingForTimer, setWaitingForTimer] = useState<boolean>(false);

    const colorScheme = useColorScheme();

    // Fetch routine from API
    useEffect(() => {
        const fetchRoutine = async () => {
            // Fetch the routine details
            const routineRef = doc(FIRESTORE_DB, 'Routines', routineId);
            const routineSnap = await getDoc(routineRef);

            if (routineSnap.exists()) {
                setRoutine({
                    id: routineSnap.id,
                    ...routineSnap.data(),
                } as Routine);
            }
        }
        fetchRoutine();
    }, [routineId]);

    useEffect(() => {
        if (routine && currentIndex !== -1) {
            setCurrentExercise(routine.exercises[currentIndex]);
        }
    }, [routine, currentIndex]);

    useEffect(() => {
        console.log('Current Exercise:', currentExercise);
        if (currentExercise && (['Secs.', 'Mins.'] as const).includes(currentExercise.unit as any)) {
            setWaitingForTimer(true);
            console.log('Waiting for timer');
        }}, [currentExercise]);

    const handleNext = () => {
        if (waitingForTimer) {
            return;
        }
        if (routine && currentIndex === routine?.exercises.length ) {
            setCurrentIndex(-1);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    }

    return (
        <View style={[styles.container, {
            backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background,
        }]} >
            <Stack.Screen options={{ title: '', headerBackTitleVisible: false, headerTransparent: true }} />

            {/* Start Menu */}
            { currentIndex === -1 &&
               <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    gap: 20,
                }}>
                    <Text style={[styles.title,{
                        color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                    }]}>{routine?.name}</Text>

                    <Pressable
                        style={[styles.button, {
                            backgroundColor:  Colors.primary,
                        }]}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>Start</Text>
                    </Pressable>
                </View>}
                
                {/* Exercise */}
                { ( routine && currentIndex !== -1 && (currentIndex < routine.exercises.length)) &&
                <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        gap: 20,
                    }}>

                    <View>
                        {/* Title */}
                        <Text style={[styles.title,{
                            color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                        }]}>
                            {currentExercise?.name}
                        </Text>
                        
                        {/* Description */}
                        <Text style={[styles.description,{
                            color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                        }]}>
                            {currentExercise?.description}
                        </Text>
                            
                        {/* Quantity */}
                        <Text style={[styles.description,{
                            color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                        }]}>
                            {currentExercise?.quantity} {currentExercise?.unit}
                        </Text>

                        {/* Timer */}
                        {(currentExercise?.unit === 'Secs.') && 
                            <Timer 
                                initialMilliseconds={currentExercise?.quantity * 1000}
                                callback={() => setWaitingForTimer(false)}
                            />
                        }

                        {(currentExercise?.unit === 'Mins.') && 
                            <Timer 
                                initialMilliseconds={currentExercise?.quantity * 60000}
                                callback={() => setWaitingForTimer(false)}
                            />
                        }

                    </View>

                    {/* Next Button */}
                    <Pressable 
                        onPress={handleNext}
                        style={[styles.button, {
                            backgroundColor: waitingForTimer ? Colors.grey : Colors.primary,
                            shadowOpacity: waitingForTimer ? 0 : 0.25,
                        }]}
                        disabled={waitingForTimer}
                    >
                        <Text style={styles.buttonText}>
                            Next
                        </Text>
                    </Pressable> 
                </View>
            }

            {/* End Menu */}
            { (routine && currentIndex === routine.exercises.length) &&
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    gap: 20,
                }}>
                    <Text style={[styles.title,{
                        color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                    }]}>
                        Routine Completed!
                    </Text>
                    <Pressable
                        style={[styles.button, {
                            backgroundColor: Colors.primary,
                        }]}
                        onPress={() => setCurrentIndex(-1)}
                    >
                        <Text style={styles.buttonText}>Restart</Text>
                    </Pressable>
                </View>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
    },
    button: {
        color: 'white',
        padding: 10,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.25,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
    },
});
