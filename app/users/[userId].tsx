import { Link, Stack, useLocalSearchParams } from "expo-router";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, useColorScheme } from "react-native";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser, Routine } from "@/types";

export default function Page() {
  const colorScheme = useColorScheme();

  const auth = FIREBASE_AUTH;
  const firebaseUser = auth.currentUser;

  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);

  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    if (firebaseUser && userId) {
      const userRef = doc(FIRESTORE_DB, "users", userId);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setDbUser(doc.data() as DBUser);
        }
      });

      return () => unsubscribe();
    }
  }, [firebaseUser, userId]);

  useEffect(() => {
    if (firebaseUser && userId) {
      const routinesRef = collection(FIRESTORE_DB, "users", userId, "routines");
      // handle case where it doesn't exist
      const unsubscribe = onSnapshot(routinesRef, (snapshot) => {
        const routines: Routine[] = [];
        snapshot.forEach((doc) => {
          routines.push(doc.data() as Routine);
        });
        setUserRoutines(routines);
      });

      return () => unsubscribe();
    }
  }, [firebaseUser, userId]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: dbUser?.username ?? "User" }} />
      <Text
        style={[
          styles.title,
          {
            color: Colors[colorScheme ?? "light"].text,
          },
        ]}
      >
        {dbUser?.displayName}
      </Text>
      <Text style={{ color: Colors[colorScheme ?? "light"].greyText }}>
        @{dbUser?.username}
      </Text>
      {/* Routine list (from collection of the user) */}
      <Text
        style={[
          styles.title,
          {
            marginTop: 20,
            color: Colors[colorScheme ?? "light"].text,
          },
        ]}
      >
        Routines
      </Text>
      <FlatList
        data={userRoutines}
        renderItem={({ item }) => (
          <Link
            href={`/routines/${item.publicRoutineId}`}
            style={{
              padding: 10,
              backgroundColor:
                Colors[colorScheme ?? "light"].tabBackgroundColor,
              marginBottom: 10,
              borderRadius: 5,
              color: Colors[colorScheme ?? "light"].text,
            }}
          >
            {item.name}
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
