import { View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { ExerciseInRoutine, Routine } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Timer from "@/components/Timer";

export default function Page() {
    const { routineId } = useLocalSearchParams<{ routineId: string }>();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [currentExercise, setCurrentExercise] = useState<ExerciseInRoutine | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

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
        console.log('Current Exercise:', currentExercise);
    }, [routine, currentIndex]);

    return (
        <View style={styles.container}>
            { currentIndex === -1 ?
               <View>
                    <Text style={styles.title}>{routine?.name}</Text>
                    <Pressable
                        style={styles.startButton}
                        onPress={() => setCurrentIndex(0)}
                    >
                        <Text style={{color: 'white'}}>Start Routine</Text>
                    </Pressable>
                </View>
                    :
                <View>
                    <Text style={styles.title}>{currentExercise?.name}</Text>
                    <Text style={styles.description}>{currentExercise?.description}</Text>
                    <Text style={styles.description}>{currentExercise?.quantity} {currentExercise?.unit}</Text>
                    {(currentExercise?.unit === 'Secs.') && 
                        <Timer initialTime={currentExercise?.quantity} />
                    }
                </View>
            }
            { currentIndex !== -1 && <Pressable onPress={() => setCurrentIndex(currentIndex + 1)}>
                <Text>Next</Text>
            </Pressable> }
            
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    startButton: {
        backgroundColor: 'blue',
        color: 'white',
    },
    description: {
        fontSize: 16,
    },
});
