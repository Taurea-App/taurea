import { Redirect, Stack } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { UserContext } from "@/app/context/userContext";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";

// Check the name + number with the smaller number available in the database
async function createUsername(displayName: string) {
  const usersRef = collection(FIRESTORE_DB, "users");
  // Get all usernames that start with the formated display name
  const formatedDisplayName = displayName.toLowerCase().replace(/ /g, "");
  const q = query(
    usersRef,
    where("username", ">=", formatedDisplayName),
    where("username", "<", formatedDisplayName + "\uf8ff"),
  );
  const querySnapshot = await getDocs(q);
  const usedUsernames: string[] = [];
  querySnapshot.forEach((doc) => {
    usedUsernames.push(doc.data().username);
  });
  // Find the smallest number that is not used
  let username = formatedDisplayName;
  let i = 1;
  while (usedUsernames.includes(username)) {
    username = formatedDisplayName + i;
    i++;
  }
  return username;
}

export default function Signup() {
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const auth = FIREBASE_AUTH;

  const { user } = useContext(UserContext);

  const signUp = async () => {
    if (displayName === "") {
      setError("Name cannot be empty");
      return;
    }
    if (email === "") {
      setError("Email cannot be empty");
      return;
    }
    if (password === "") {
      setError("Password cannot be empty");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
        });
        await sendEmailVerification(auth.currentUser);
        const username = await createUsername(displayName);
        await setDoc(
          doc(FIRESTORE_DB, "users", auth.currentUser.uid),
          {
            username,
            displayName,
          },
          { merge: true },
        );
        auth.signOut();
      } else {
        alert("Error creating account. Please try again.");
      }
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (e.code === "auth/weak-password") {
        setError("Password is too weak");
      } else if (e.code === "auth/invalid-email") {
        setError("Invalid email");
      } else if (e.code === "auth/operation-not-allowed") {
        setError("Operation not allowed");
      } else {
        setError("Error creating account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Stack.Screen options={{ title: "Register" }} />

      <Text
        style={[
          styles.title,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
          },
        ]}
      >
        Enter your details
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"]
                .tabBackgroundColor,
          },
        ]}
        placeholder="Name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"]
                .tabBackgroundColor,
          },
        ]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"]
                .tabBackgroundColor,
          },
        ]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"]
                .tabBackgroundColor,
          },
        ]}
        placeholder="Repeat Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={signUp}
        disabled={
          loading || displayName === "" || email === "" || password === ""
        }
        style={[
          styles.button,
          {
            backgroundColor:
              loading || displayName === "" || email === "" || password === ""
                ? Colors.gray
                : Colors.primary,
          },
        ]}
      >
        <Text>Register</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    margin: 6,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    width: "80%",
    margin: 6,
    padding: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  error: {
    color: "red",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "40%",
    marginHorizontal: 10,
  },
});
