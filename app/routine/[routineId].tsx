import { Ionicons } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Link,
  useLocalSearchParams,
  useRouter,
  Stack,
  useNavigation,
} from "expo-router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { Modal } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Collapsible from "react-native-collapsible";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig"; // Adjust the import path as necessary
import { Routine, ExerciseInRoutine, Subroutine } from "@/types"; // Adjust the import path as necessary

export default function Page() {
  const colorScheme = useColorScheme();

  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<
    ExerciseInRoutine[] | Subroutine[]
  >();
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [showOptions, setShowOptions] = useState(false);
  const [collapsedSubroutines, setCollapsedSubroutines] = useState<
    Map<string, boolean>
  >(new Map());

  const [loading, setLoading] = useState(true);

  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const fetchRoutineDetails = async () => {
      if (!routineId) return;

      // Fetch the routine details
      const routineRef = doc(
        FIRESTORE_DB,
        "users/" + auth.currentUser?.uid + "/routines",
        routineId,
      );
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        setRoutine({
          id: routineSnap.id,
          ...routineSnap.data(),
        } as Routine);

        setExercises(routineSnap.data().exercises);
        setLoading(false);
      }
    };

    fetchRoutineDetails();
  }, [routineId]);

  useEffect(() => {
    if (!exercises) return;

    exercises.forEach((item) => {
      if (!(item as Subroutine).exercises) return;

      setCollapsedSubroutines((prevState) => {
        const newState = new Map(prevState);
        newState.set(item.id, true);
        return newState;
      });
    });
  }, [exercises]);

  const toggleSubroutine = (subroutineId: string) => {
    setCollapsedSubroutines((prevState) => {
      const newState = new Map(prevState);
      newState.set(subroutineId, !newState.get(subroutineId));
      return newState;
    });
  };

  const handleEdit = () => {
    setShowOptions(false);
    // navigate to the edit screen
    if (!routineId) return;

    router.push({
      pathname: "/routine/edit/[routineId]",
      params: { routineId },
    });
  };

  const handleDelete = async () => {
    setShowOptions(false);
    if (!routineId) return;

    await deleteDoc(
      doc(
        FIRESTORE_DB,
        "users/" + auth.currentUser?.uid + "/routines",
        routineId,
      ),
    );
    // After deletion, navigate back or to another screen as needed
    navigation.navigate("index");
  };

  function isExerciseInRoutine(
    item: ExerciseInRoutine | Subroutine,
  ): item is ExerciseInRoutine {
    return (item as ExerciseInRoutine).exerciseId !== undefined;
  }

  const renderRoutineItem = ({
    item,
  }: {
    item: ExerciseInRoutine | Subroutine;
  }) => (
    <View>
      {isExerciseInRoutine(item) ? (
        <View
          style={[
            styles.exerciseContainer,
            {
              backgroundColor:
                Colors[colorScheme === "dark" ? "dark" : "light"]
                  .tabBackgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.exerciseName,
              {
                color: Colors[colorScheme === "dark" ? "dark" : "light"].text,
              },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={{
              color: Colors[colorScheme === "dark" ? "dark" : "light"].text,
            }}
          >
            {item.quantity} {item.unit}
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor:
              Colors[colorScheme === "dark" ? "dark" : "light"]
                .tabBackgroundColor,
            // borderRadius: 10,
            borderTopWidth: 1,
            borderTopColor: "#888888",
          }}
        >
          <Pressable onPress={() => toggleSubroutine(item.id)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={
                  collapsedSubroutines.get(item.id)
                    ? "chevron-down"
                    : "chevron-up"
                }
                size={24}
                color={Colors["primary"]}
              />
              <Text
                style={{
                  color: Colors["primary"],
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {item.quantity} {item.unit}
              </Text>
            </View>
          </Pressable>

          <Collapsible
            collapsed={collapsedSubroutines.get(item.id)}
            align="center"
          >
            <FlatList
              data={item.exercises}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRoutineItem}
              style={{ marginLeft: 20 }}
            />
          </Collapsible>
        </View>
      )}
    </View>
  );

  // Consider adding a function for editing that navigates to an edit screen or opens an edit mode

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Pressable onPress={() => setShowOptions(true)}>
              <Text
                style={{
                  color: Colors["primary"],
                  marginRight: 10,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                ...
              </Text>
            </Pressable>
          ),
        }}
      />
      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme === "dark" ? "dark" : "light"].tint}
          />
        </View>
      )}
      {!loading && (
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={[styles.title, { color: Colors["primary"] }]}>
            {routine?.name}
          </Text>
          <Text style={styles.description}>{routine?.description}</Text>
          <FlatList
            data={exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRoutineItem}
          />
          {/* Implement navigation or state change for editing here */}
          <View style={styles.buttonsContainer}>
            <Link
              href={{
                pathname: "/routine/run/[routineId]",
                params: { routineId },
              }}
              asChild
            >
              <TouchableOpacity
                style={{ backgroundColor: Colors["primary"], ...styles.button }}
              >
                <Text>Run</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      )}

      <Modal
        isOpen={showOptions}
        animationPreset="slide"
        onClose={() => setShowOptions(false)}
        size="full"
        avoidKeyboard
      >
        <Modal.Content
          marginBottom={0}
          marginTop="auto"
          style={{
            backgroundColor:
              Colors[colorScheme === "dark" ? "dark" : "light"]
                .tabBackgroundColor,
          }}
        >
          <Modal.Body>
            <Button title="Edit" onPress={handleEdit} />
            <Button
              title="Delete"
              onPress={handleDelete}
              color={Colors["red"]}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666",
  },
  exerciseContainer: {
    // marginBottom: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    // borderRadius: 10,
    borderTopWidth: 1,
    borderTopColor: "#888888",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    alignItems: "center",
  },
  button: {
    padding: 15,
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "30%",
  },
});
