import { Ionicons } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Stack, useNavigation } from "expo-router";
import {
  getDocs,
  collection,
  query,
  addDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { Modal } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { editRoutineLayoutStyle as style } from "./edit_routine_layout_style";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { Exercise, ExerciseInRoutine } from "@/types";
import { idGen } from "@/utils/idGen";
const meassurementUnits = ["Reps.", "Secs.", "Mins.", "Meters", "Km"];

export default function EditRoutineLayout({
  isNewRoutine,
  routineId,
}: {
  isNewRoutine: boolean;
  routineId?: string;
}) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");

  const [exercises, setExercises] = useState<ExerciseInRoutine[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedExercises, setFetchedExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [selectedUnit, setSelectedUnit] = useState(meassurementUnits[0]);

  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);
  const [showUnitSelectModal, setShowUnitSelectModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const auth = FIREBASE_AUTH;

  const loadRoutine = async () => {
    if (!routineId) return;
    const routineRef = doc(
      FIRESTORE_DB,
      "users/" + auth.currentUser?.uid + "/routines",
      routineId,
    );
    const routineSnap = await getDoc(routineRef);
    if (routineSnap.exists()) {
      setRoutineName(routineSnap.data().name);
      setRoutineDescription(routineSnap.data().description);
      setExercises(routineSnap.data().exercises);
      setLoading(false);
    } else {
      console.log("No such document!");
    }
  };

  const fetchExercises = async () => {
    const q = query(collection(FIRESTORE_DB, "Exercises"));
    const querySnapshot = await getDocs(q);
    const exercisesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercise[];
    setFetchedExercises(exercisesList);
    setFilteredExercises(exercisesList);
  };

  const saveRoutine = async () => {
    setLoading(true);
    const routine = {
      name: routineName,
      description: routineDescription,
      exercises,
    };
    if (isNewRoutine) {
      await addDoc(
        collection(
          FIRESTORE_DB,
          "users/" + auth.currentUser?.uid + "/routines",
        ),
        routine,
      );
    } else {
      if (!routineId) return;
      const routineRef = doc(
        FIRESTORE_DB,
        "users/" + auth.currentUser?.uid + "/routines",
        routineId,
      );
      await setDoc(routineRef, routine);
    }
    navigation.navigate("index");
  };

  useEffect(() => {
    if (!isNewRoutine) {
      loadRoutine();
    }

    fetchExercises();
  }, []);

  useEffect(() => {
    setFilteredExercises(
      fetchedExercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm]);

  const renderRoutineItem = ({
    item,
    drag,
    isActive,
  }: {
    item: ExerciseInRoutine;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={[
            style.exerciseListItem,
            {
              backgroundColor: colorScheme
                ? Colors[colorScheme].tabBackgroundColor
                : Colors.light.tabBackgroundColor,
            },
          ]}
          onLongPress={drag}
          disabled={isActive}
        >
          <Text
            style={[
              style.exerciseListItemName,
              {
                color: colorScheme
                  ? Colors[colorScheme].text
                  : Colors.light.text,
              },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              style.exerciseListItemQuantity,
              {
                color: colorScheme
                  ? Colors[colorScheme].text
                  : Colors.light.text,
              },
            ]}
          >
            {item.quantity} {item.unit}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setExercises(
                exercises.filter((exercise) => exercise.id !== item.id),
              )
            }
          >
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const SaveButton = () => {
    return (
      <TouchableOpacity
        style={style.saveButton}
        onPress={() => {
          saveRoutine();
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        style.container,
        {
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
          // height: '100%',
        },
      ]}
      // automaticallyAdjustKeyboardInsets={true}
    >
      <Stack.Screen
        options={{ title: isNewRoutine ? "New Routine" : "Edit Routine" }}
      />

      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ? colorScheme : "light"].tint}
          />
        </View>
      )}

      {!loading && (
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Title and Description */}
          <View style={{ width: "100%", padding: 10 }}>
            <TextInput
              style={[
                style.title,
                {
                  color: colorScheme
                    ? Colors[colorScheme].text
                    : Colors.light.text,
                },
              ]}
              onChangeText={setRoutineName}
              value={routineName}
              placeholder="Routine Name"
            />
            <TextInput
              style={style.description}
              onChangeText={setRoutineDescription}
              value={routineDescription}
              placeholder="Routine Description"
              blurOnSubmit
              multiline
              // numberOfLines={4}
            />
          </View>

          {/* Exercise List */}
          <DraggableFlatList
            style={style.exerciseList}
            data={exercises}
            containerStyle={{ flex: 1 }}
            onDragEnd={({ data }) => setExercises(data)}
            renderItem={({ item, drag, isActive }) =>
              renderRoutineItem({ item, drag, isActive })
            }
            keyExtractor={(item, index) => index.toString() + item.id}
            // ListHeaderComponent={TitleAndDescription}
            // ListFooterComponent={NewExerciseForm}
          />
          {/* <NewExerciseForm />
           */}
          <View style={style.newExerciseForm}>
            <View
              style={[
                style.exerciseListItem,
                {
                  backgroundColor: colorScheme
                    ? Colors[colorScheme].tabBackgroundColor
                    : Colors.light.tabBackgroundColor,
                },
              ]}
            >
              <TextInput
                style={[
                  style.exerciseListItemName,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Select Exercise"
                value={selectedExercise?.name}
                onPressIn={() => {
                  setShowExerciseSelectModal(true);
                  // Hide the keyboard
                  Keyboard.dismiss();
                }}
                readOnly
              />
              <TextInput
                style={[
                  style.exerciseListItemQuantity,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Quantity"
                value={selectedQuantity ? selectedQuantity.toString() : ""}
                onChangeText={(text) =>
                  setSelectedQuantity(
                    isNaN(parseInt(text, 10)) ? null : parseInt(text, 10),
                  )
                }
                inputMode="decimal"
              />
              <TextInput
                style={[
                  style.exerciseListItemQuantity,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Unit"
                value={selectedUnit}
                onPressIn={() => {
                  setShowUnitSelectModal(true);
                  // Hide the keyboard
                  Keyboard.dismiss();
                }}
                readOnly
              />
              <TouchableOpacity
                onPress={() => {
                  if (!selectedExercise || !selectedQuantity) return;
                  const newExercise = {
                    id: idGen(),
                    exerciseId: selectedExercise.id,
                    name: selectedExercise.name,
                    quantity: selectedQuantity,
                    unit: selectedUnit,
                  } as ExerciseInRoutine;
                  setExercises([...exercises, newExercise]);
                  setSelectedExercise(null);
                  setSelectedQuantity(null);
                  setSelectedUnit(meassurementUnits[0]);
                }}
              >
                <Ionicons name="add" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Exercise Select Modal */}
          <Modal
            animationPreset="slide"
            isOpen={showExerciseSelectModal}
            size="full"
            onClose={() => {
              setSearchTerm("");
              setShowExerciseSelectModal(false);
            }}
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
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Search Exercises..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              <ScrollView style={{ width: "100%" }}>
                {filteredExercises.map((exercise) => (
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
                      setShowExerciseSelectModal(false);
                      setSearchTerm("");
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
              <KeyboardSpacer />
            </Modal.Content>
          </Modal>

          <KeyboardSpacer />

          <SaveButton />

          {/* Unit Select Modal */}
          <Modal
            animationPreset="slide"
            isOpen={showUnitSelectModal}
            size="full"
            onClose={() => setShowUnitSelectModal(false)}
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
              {meassurementUnits.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    style.button,
                    {
                      backgroundColor: colorScheme
                        ? Colors[colorScheme].tabBackgroundColor
                        : Colors.light.tabBackgroundColor,
                    },
                  ]}
                  onPress={() => {
                    setSelectedUnit(unit);
                    setShowUnitSelectModal(false);
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
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </Modal.Content>
          </Modal>
        </View>
      )}
    </View>
  );
}
