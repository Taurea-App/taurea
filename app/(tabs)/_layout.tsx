import { FontAwesome5 } from "@expo/vector-icons";
import { Link, Redirect, Tabs } from "expo-router";
import React, { useContext } from "react";
import { Pressable } from "react-native";

import { UserContext } from "@/app/context/userContext";
import { WaitingForEmailVerification } from "@/components/WaitingForEmailVerification";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { TranslationContext } from "../context/translationProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(UserContext);
  const headerShown = useClientOnlyValue(true, false);

  const { translate } = useContext(TranslationContext);

  if (!user) {
    return <Redirect href="/login" />;
  }
  if (user.emailVerified === false) {
    return <WaitingForEmailVerification />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown,
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: translate("tabs.search.title"),
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-routines"
        options={{
          title: translate("tabs.myRoutines.title"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="dumbbell" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome5
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: translate("tabs.profile.title"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user-alt" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
