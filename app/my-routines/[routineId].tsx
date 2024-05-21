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
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from "react-native";

import RoutineList from "@/components/RoutineList";
import SlideUpModal from "@/components/SlideUpModal";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig"; // Adjust the import path as necessary
import { Routine, ExerciseInRoutine, Subroutine } from "@/types"; // Adjust the import path as necessary

export default function Page() {
  const colorScheme = useColorScheme();

  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [routineItems, setRoutineItems] =
    useState<(ExerciseInRoutine | Subroutine)[]>();
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [showOptions, setShowOptions] = useState(false);

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

        setRoutineItems(routineSnap.data().routineItems);
        setLoading(false);
      }
    };

    fetchRoutineDetails();
  }, [routineId]);

  const handleEdit = () => {
    setShowOptions(false);
    // navigate to the edit screen
    if (!routineId) return;

    router.push({
      pathname: "/my-routines/edit/[routineId]",
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
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color={Colors["primary"]}
                />
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
      {!loading && routineItems && (
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={[styles.title, { color: Colors["primary"] }]}>
            {routine?.name}
          </Text>
          <Text style={styles.description}>{routine?.description}</Text>
          <RoutineList routineItems={routineItems} colorScheme={colorScheme} />
          {/* Implement navigation or state change for editing here */}
          <View style={styles.buttonsContainer}>
            <Link
              href={{
                pathname: "/my-routines/run/[routineId]",
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

      <SlideUpModal
        visible={showOptions}
        // animationType="slide"
        onClose={() => setShowOptions(false)}
        colorScheme={colorScheme}
        // transparent
        // onRequestClose={() => setShowOptions(false)}
        // size="full"
        // avoidKeyboard
      >
        <Button title="Edit" onPress={handleEdit} />
        <Button title="Delete" onPress={handleDelete} color={Colors["red"]} />
      </SlideUpModal>
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
    borderBottomWidth: 1,
    borderBottomColor: "#888888",
    borderLeftWidth: 5,
    borderLeftColor: "#FFA500",
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
