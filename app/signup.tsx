import { Link, Redirect, Stack } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
} from "react-native";

import { UserContext } from "./_layout";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/firebaseConfig";

export default function Signup() {
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  const auth = FIREBASE_AUTH;

  const user = useContext(UserContext);

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      alert("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordMessage("Passwords do not match");
    } else {
      setPasswordMessage("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (email === "") {
      setInvalidEmail(false);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setInvalidEmail(!emailRegex.test(email));
    }
  }, [email]);

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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
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

      <Pressable
        onPress={signUp}
        disabled={
          loading ||
          email === "" ||
          password === "" ||
          password !== confirmPassword
        }
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      >
        <Text>Register</Text>
      </Pressable>

      {invalidEmail && <Text style={styles.error}>Invalid email</Text>}
      {passwordMessage !== "" && (
        <Text style={{ color: Colors.red }}>{passwordMessage}</Text>
      )}
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
