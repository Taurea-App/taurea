import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  TouchableHighlight,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { Routine } from "@/types";

export default function MyRoutinesScreen() {
  const colorScheme = useColorScheme();
  const auth = FIREBASE_AUTH;

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load routines from Firestore, routines, userid, routines
    const routinesRef = collection(
      FIRESTORE_DB,
      "users/" + auth.currentUser?.uid + "/routines",
    );
    const unsubscribe = onSnapshot(routinesRef, (snapshot) => {
      const loadedRoutines: Routine[] = [];
      snapshot.docs.forEach((doc) => {
        loadedRoutines.push({
          id: doc.id,
          ...doc.data(),
        } as Routine);
      });
      setRoutines(loadedRoutines);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderRoutine = ({ item }: { item: Routine }) => {
    return (
      <View
        style={[
          styles.routineContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].tabBackgroundColor,
          },
        ]}
      >
        <Link
          href={{
            pathname: "/routine/[routineId]",
            params: { routineId: item.id },
          }}
          asChild
        >
          <TouchableOpacity>
            <Text style={[styles.routineText, { color: Colors["primary"] }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text
        style={[
          styles.title,
          {
            color: Colors.primary,
          },
        ]}
      >
        My Routines
      </Text>
      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      )}

      {!loading && routines.length === 0 && (
        <View>
          <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
            You have no routines yet
          </Text>
          <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
            Click the + button to add one.
          </Text>
        </View>
      )}

      {!loading && (
        <FlatList
          style={{ width: "100%" }}
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={renderRoutine}
        />
      )}
      {!loading && (
        <Link href="/routine/new" asChild>
          <TouchableHighlight
            style={styles.addRoutineButton}
            underlayColor="darkorange"
          >
            <Ionicons name="add" size={24} color="black" />
          </TouchableHighlight>
        </Link>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 20,
  },
  routineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginVertical: 5,
    padding: 10,
    width: "100%",
  },
  routineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  exercisesList: {
    padding: 10,
    backgroundColor: "#444",
  },
  routineText: {
    // color: 'white',
  },
  exerciseText: {
    color: "lightgrey",
  },
  addRoutineButton: {
    alignSelf: "flex-end",
    backgroundColor: "orange",
    margin: 10,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
  },
});
