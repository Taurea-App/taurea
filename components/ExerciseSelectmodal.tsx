import { collection, getDocs } from "firebase/firestore";
import { Modal, ScrollView } from "native-base";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Text,
  StyleSheet,
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

import Colors from "@/constants/Colors";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { Exercise } from "@/types";

export default function ExerciseSelectModal({
  showModal,
  closeModal,
  setSelectedExercise,
}: {
  showModal: boolean;
  closeModal: () => void;
  setSelectedExercise: (exercise: Exercise) => void;
}) {
  const colorScheme = useColorScheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      const exercisesRef = collection(FIRESTORE_DB, "Exercises");
      const exercisesSnap = await getDocs(exercisesRef);

      const exercisesData = exercisesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Exercise[];

      setExercises(exercisesData);
      setLoading(false);
    };
    fetchExercises();
  }, []);

  return (
    <Modal
      animationPreset="slide"
      isOpen={showModal}
      size="full"
      onClose={closeModal}
    >
      <Modal.Content
        style={[
          style.exerciseSelectModalView,
          {
            backgroundColor: colorScheme
              ? Colors[colorScheme].background
              : Colors.light.background,
          },
        ]}
        marginBottom={0}
        marginTop="auto"
      >
        <TextInput
          style={[
            style.searchBar,
            {
              backgroundColor: colorScheme
                ? Colors[colorScheme].tabBackgroundColor
                : Colors.light.tabBackgroundColor,
              color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
            },
          ]}
          placeholder="Search Exercises..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView style={{ width: "100%" }}>
            {exercises
              .filter((exercise) =>
                exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    style.button,
                    {
                      backgroundColor: colorScheme
                        ? Colors[colorScheme].tabBackgroundColor
                        : Colors.light.tabBackgroundColor,
                    },
                  ]}
                  onPress={() => {
                    setSelectedExercise(exercise);
                    console.log("Selected exercise", exercise);
                    setSearchTerm("");
                    closeModal();
                  }}
                >
                  <Text
                    style={[
                      style.exerciseSelectItem,
                      {
                        color: colorScheme
                          ? Colors[colorScheme].text
                          : Colors.light.text,
                      },
                    ]}
                  >
                    {exercise.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
        <KeyboardSpacer />
      </Modal.Content>
    </Modal>
  );
}

const style = StyleSheet.create({
  exerciseSelectModalView: {
    borderRadius: 20,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  exerciseSelectItem: {
    fontSize: 16,
  },
  searchBar: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    width: "100%",
    borderRadius: 10,
  },
});
