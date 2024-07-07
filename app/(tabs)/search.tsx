import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Configure } from "react-instantsearch-core";
import {
  StyleSheet,
  View,
  useColorScheme,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InfiniteHits } from "@/components/InfiniteHits";
import { SearchBox } from "@/components/SearchBox";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/firebaseConfig";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const auth = FIREBASE_AUTH;
  const firebaseUser = auth.currentUser;

  // dbUser is the user object from Firestore. Ith has the same uid as the firebaseUser

  return (
    <SafeAreaView style={styles.container}>
      <Configure filters="type:user OR type:routine" />
      {/* Search bar */}
      <View style={styles.searchBar}>
        <SearchBox />
      </View>

      <View>
        {/* Search results */}
        <InfiniteHits hitComponent={Hit} />
      </View>
    </SafeAreaView>
  );
}

const Hit = ({ hit }: { hit: any }) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={() => {
        // id is the document id starting from the 4th character
        const objectId = hit.objectID.substring(4);
        // router.navigate(item  .href);
        router.navigate(`/${hit.type}s/${objectId}`);
      }}
      style={{
        padding: 10,
        backgroundColor: Colors[colorScheme ?? "light"].tabBackgroundColor,
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Icon depending on the type */}
      <Ionicons
        name={hit.type === "user" ? "person" : "barbell"}
        size={24}
        color={Colors[colorScheme ?? "light"].text}
        style={{
          marginRight: 10,
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            color: Colors[colorScheme ?? "light"].text,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {hit.title}
        </Text>
        <Text
          style={{
            color: Colors[colorScheme ?? "light"].text,
            fontSize: 12,
          }}
        >
          {hit.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "stretch",
    justifyContent: "center",
    padding: 10,
    marginTop: 40,
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
