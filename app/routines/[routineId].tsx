import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, Stack, router } from "expo-router";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import RoutineList from "@/components/RoutineList";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig"; // Adjust the import path as necessary
import { PublicRoutine, ExerciseInRoutine, Subroutine } from "@/types"; // Adjust the import path as necessary

export default function Page() {
  const colorScheme = useColorScheme();

  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [routine, setRoutine] = useState<PublicRoutine | null>(null);
  const [routineItems, setRoutineItems] =
    useState<(ExerciseInRoutine | Subroutine)[]>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutineDetails = async () => {
      if (!routineId) return;

      // Fetch the routine details
      const routineRef = doc(FIRESTORE_DB, "Routines", routineId);
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        setRoutine({
          id: routineSnap.id,
          ...routineSnap.data(),
        } as PublicRoutine);

        setRoutineItems(routineSnap.data().routineItems);
        setLoading(false);
      }
    };

    fetchRoutineDetails();
  }, [routineId]);

  const handleAddToMyRoutines = async () => {
    // Copy the routine to the user's routines
    try {
      const newRoutine = {
        name: routine?.name,
        description: routine?.description,
        isPublic: false,
        routineItems,
        modifyDate: new Date(),
      };
      await addDoc(
        collection(
          FIRESTORE_DB,
          "users/" + FIREBASE_AUTH.currentUser?.uid + "/routines",
        ),
        newRoutine,
      );
      // Redirect to the user's routines
      router.push("/");
    } catch (error) {
      console.error("Error adding routine to My Routines: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text style={[styles.title, { color: Colors["primary"] }]}>
                {routine?.name}
              </Text>
              <Text style={styles.description}>{routine?.description}</Text>
            </View>
            <TouchableOpacity onPress={handleAddToMyRoutines}>
              <Ionicons
                name="add-circle-outline"
                size={32}
                color={Colors["primary"]}
              />
            </TouchableOpacity>
          </View>
          <RoutineList routineItems={routineItems} colorScheme={colorScheme} />
          {/* Implement navigation or state change for editing here */}
          <View style={styles.buttonsContainer}>
            <Link
              href={{
                pathname: "/routines/run/[routineId]",
                params: { routineId },
              }}
              asChild
            >
              <TouchableOpacity
                style={{ backgroundColor: Colors["primary"], ...styles.button }}
              >
                {/* <Ionicons name="play" size={24} /> */}
                <Text style={{  fontSize: 18 }}>Run</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      )}
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
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    padding: 15,
    margin: 10,
    borderRadius: 30,
    alignItems: "center",
  },
});
