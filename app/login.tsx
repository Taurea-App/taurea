import { FIREBASE_AUTH } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAvoidingView } from "react-native";
import { useContext, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { UserContext } from "./_layout";
import { Redirect } from "expo-router";

export default function Login() {
  const colorScheme = useColorScheme

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const user = useContext(UserContext);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error);
      alert('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password
      );
    } catch (error: any) {
      console.error(error);
      alert('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <KeyboardAvoidingView behavior="padding"style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          onPress={signIn}
          disabled={loading}
          style={styles.button}
        >
          <Text>Login</Text>
        </Pressable>

        <Pressable
          onPress={signUp}
          disabled={loading}
          style={styles.button}
        >
          <Text>Sign Up</Text>
        </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    padding: 8,
    borderWidth: 1,
  },
  button: {
    width: '80%',
    margin: 12,
  },
  error: {
    color: 'red',
  },
});
