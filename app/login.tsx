import { Redirect } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useContext, useState } from "react";
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

export default function Login() {
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const user = useContext(UserContext);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      alert("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
          },
        ]}
      >
        Login
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

      <Pressable
        onPress={signIn}
        disabled={loading}
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      >
        <Text>Login</Text>
      </Pressable>

      <Pressable
        onPress={signUp}
        disabled={loading}
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      >
        <Text>Sign Up</Text>
      </Pressable>
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
    margin: 12,
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
});
