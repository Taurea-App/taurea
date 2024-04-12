import * as AppleAuthentication from "expo-apple-authentication";
import { Link, Redirect } from "expo-router";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  OAuthProvider,
  OAuthCredential,
  signInWithCredential,
} from "firebase/auth";
import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { UserContext } from "./_layout";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/firebaseConfig";

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

function AppleSignIn() {
  async function onAppleButtonPress() {
    // Start the sign-in request
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const credentials = appleProvider.credential({
        idToken: appleCredential.identityToken || "",
      });
      // Sign the user in with the credential
      return signInWithCredential(FIREBASE_AUTH, credentials);
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // Show alert to the user
        Alert.alert("Apple Sign-In", "User canceled the sign-in request");
      } else {
        Alert.alert("Apple Sign-In", "An error occurred. Please try again or use a different sign-in method.");
      }
    }
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
      cornerRadius={5}
      style={{
        width: 200,
        height: 44,
      }}
      onPress={onAppleButtonPress}
    />
  );
}

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

      <TouchableOpacity
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
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: Colors.grey,
            },
          ]}
        />
        <Text
          style={{
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            marginHorizontal: 10,
          }}
        >
          or
        </Text>

        <View
          style={[
            styles.separator,
            {
              backgroundColor: Colors.grey,
            },
          ]}
        />
      </View>

      <AppleSignIn />

      <Link
        href="/signup"
        style={{
          color: Colors.primary,
        }}
      >
        Register
      </Link>
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

