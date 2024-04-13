import { Redirect, useRouter } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/firebaseConfig";

export function WaitingForEmailVerification() {
  const colorScheme = useColorScheme();
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: Colors[colorScheme === "light" ? "light" : "dark"].text,
          width: "80%",
          marginBottom: 10,
        }}
      >
        Your email has not been verified. Please check your email for a
        verification link. Check your spam folder too.
      </Text>
      <Text
        style={{
          color: Colors[colorScheme === "light" ? "light" : "dark"].text,
          marginBottom: 10,
          width: "80%",
        }}
      >
        If you did not receive an email, you can resend the verification email
        by clicking the button below.
      </Text>
      <Text
        style={{
          color: Colors[colorScheme === "light" ? "light" : "dark"].text,
          marginBottom: 10,
          width: "80%",
        }}
      >
        After veryfiying your email, try logging in again.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={() => {
          if (auth.currentUser) {
            sendEmailVerification(auth.currentUser);
            // router.replace("/login");
            FIREBASE_AUTH.signOut();
          } else {
            // redirect to login using expo-router
            // router.replace("/login");
            FIREBASE_AUTH.signOut();
          }
        }}
      >
        <Text>Resend Verification Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={() => {
          FIREBASE_AUTH.signOut();
        }}
      >
        <Text>Try with another account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
