import { router } from "expo-router";
import { updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { DataTable } from "react-native-paper";

import { UserContext } from "./context/userContext";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();

  const auth = FIREBASE_AUTH;
  const firebaseUser = auth.currentUser;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { dbUser, refreshUserData } = useContext(UserContext);

  useEffect(() => {
    if (dbUser) {
      console.log(dbUser);
      setEmail(dbUser.email ?? "");
      setDisplayName(dbUser.displayName ?? "");
      setUsername(dbUser.username ?? "");
    }
  }, [firebaseUser]);

  const isUsernameValid = (username: string) => {
    // Username must be between 1 and 15 characters long and can only contain letters, numbers and underscores
    return /^[a-zA-Z0-9_]{1,15}$/.test(username);
  };

  const usernameExists = async (username: string) => {
    const usersRef = collection(FIRESTORE_DB, "users");
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const saveChanges = async () => {
    setError(null);
    setLoading(true);
    if (firebaseUser) {
      const userRef = doc(FIRESTORE_DB, "users", firebaseUser.uid);
      if (dbUser) {
        // Modify the username
        if (dbUser.username !== username) {
          if (!isUsernameValid(username)) {
            setError(
              "Username must be between 1 and 15 characters long and can only contain letters, numbers and underscores",
            );
          } else if (await usernameExists(username)) {
            setError("Username already exists");
            return;
          } else {
            await setDoc(
              userRef,
              { username: username.toLowerCase() },
              { merge: true },
            );
            refreshUserData();
            router.back();
          }
        }
        // Modify the display name
        if (firebaseUser.displayName !== displayName) {
          await updateProfile(firebaseUser, { displayName });
          await setDoc(userRef, { displayName }, { merge: true });
          // Go to the last screen
          router.back();
          refreshUserData();
        }
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <DataTable style={styles.table}>
        <DataTable.Row>
          <DataTable.Cell
            textStyle={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Email
          </DataTable.Cell>
          <DataTable.Cell>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={{ color: Colors[colorScheme ?? "light"].text }}
              editable={false}
            />
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            textStyle={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Username
          </DataTable.Cell>
          <DataTable.Cell>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                @
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                style={{ color: Colors[colorScheme ?? "light"].text }}
              />
            </View>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell
            textStyle={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Display Name
          </DataTable.Cell>
          <DataTable.Cell>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Display Name"
              style={{ color: Colors[colorScheme ?? "light"].text }}
            />
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: loading ? "grey" : Colors.primary },
        ]}
        onPress={saveChanges}
        disabled={loading}
      >
        {loading && <Text style={{ color: "black" }}>Loading...</Text>}
        {!loading && <Text style={{ color: "black" }}>Save changes</Text>}
      </TouchableOpacity>

      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 20,
  },
  button: {
    alignItems: "center",
    // backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 20,
    width: "80%",
  },
  table: {
    marginBottom: 20,
  },
});
