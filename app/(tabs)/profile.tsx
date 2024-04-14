import { Button, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser } from "@/types";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

export default function ProfileScreen() {
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
      <Text style={styles.title}>Profile</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>{firebaseUser?.displayName}</Text>
      <Text>{firebaseUser?.email}</Text>
      <Text>{dbUser?.username}</Text>

      <Button title="Sign Out" onPress={() => auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
