// src/screens/ProfileScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useContext } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";

import { TranslationContext } from "../context/translationProvider";
import { UserContext } from "../context/userContext";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/firebaseConfig";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const auth = FIREBASE_AUTH;
  const { user, dbUser } = useContext(UserContext);
  const { translate, language, setLanguage, availableLanguages } =
    useContext(TranslationContext);

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

      {/* Settings button, redirects to settings page */}
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
        href="/settings"
      >
        Settings
      </Link>


      {/* Title */}
      <Text
        style={[
          styles.title,
          {
            color: Colors[colorScheme ?? "light"].text,
          },
        ]}
      >
        {translate("hello", { name: user?.displayName })}
      </Text>

      {/* Username */}
      <Text style={{ color: Colors[colorScheme ?? "light"].greyText }}>
        @{dbUser?.username}
      </Text>

      {/* Bio  */}
      <Text style={{ paddingTop: 10 }}>{dbUser?.bio}</Text>

      {/* Join Date */}
      {user?.metadata.creationTime && (
        <Text
          style={{
            paddingTop: 10,
            color: Colors[colorScheme ?? "light"].greyText,
          }}
        >
          <Ionicons
            name="calendar"
            size={16}
            color={Colors[colorScheme ?? "light"].greyText}
          />{" "}
          {/* Show month and year */}
          Joined on{" "}
          {new Date(user?.metadata.creationTime).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </Text>
      )}

      {/* Separator */}
      <View
        style={styles.separator}
        lightColor={Colors.light.border}
        darkColor={Colors.dark.border}
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
