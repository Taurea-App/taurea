import { Link } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser } from "@/types";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  const auth = FIREBASE_AUTH;
  const firebaseUser = auth.currentUser;

  // dbUser is the user object from Firestore. Ith has the same uid as the firebaseUser
  const [dbUser, setDbUser] = useState<DBUser | null>(null);

  useEffect(() => {
    if (firebaseUser) {
      const userRef = doc(FIRESTORE_DB, "users", firebaseUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setDbUser(doc.data() as DBUser);
        }
      });

      return () => unsubscribe();
    }
  }, [firebaseUser]);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-end" }}>
        <Link
          push
          style={{
            alignItems: "center",
            color: Colors[colorScheme ?? "light"].greyText,
            borderWidth: 1,
            padding: 10,
            borderRadius: 20,
            borderColor: Colors[colorScheme ?? "light"].greyText,
            marginBottom: 20,
          }}
          href="/edit-profile"
        >
          Edit profile
        </Link>
      </View>

      <Text
        style={[
          styles.title,
          {
            color: Colors[colorScheme ?? "light"].text,
          },
        ]}
      >
        {firebaseUser?.displayName}
      </Text>
      <Text style={{ color: Colors[colorScheme ?? "light"].greyText }}>
        @{dbUser?.username}
      </Text>

      <Text>{firebaseUser?.email}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Pressable
        style={{ alignItems: "center" }}
        onPress={() => auth.signOut()}
      >
        <Text
          style={{
            color: Colors.primary,
            marginTop: 20,
          }}
        >
          Sign Out
        </Text>
      </Pressable>
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
