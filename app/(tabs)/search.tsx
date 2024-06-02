import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  and,
  collection,
  doc,
  getDocs,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import levenshtein from "js-levenshtein";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser, PublicRoutine, SearchResult } from "@/types";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const auth = FIREBASE_AUTH;
  const firebaseUser = auth.currentUser;

  // dbUser is the user object from Firestore. Ith has the same uid as the firebaseUser
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }
    const usersRef = collection(FIRESTORE_DB, "users");
    const routinesRef = collection(FIRESTORE_DB, "Routines");

    const usernameQuery = query(
      usersRef,
      or(
        and(
          where("username_lowercase", ">=", text.toLowerCase()),
          where("username_lowercase", "<=", text.toLowerCase() + "\uf8ff"),
        ),
        and(
          where("displayName_lowercase", ">=", text.toLowerCase()),
          where("displayName_lowercase", "<=", text.toLowerCase() + "\uf8ff"),
        ),
      ),
    );

    const routineQuery = query(
      routinesRef,
      or(
        and(
          where("name_lowercase", ">=", text.toLowerCase()),
          where("name_lowercase", "<=", text.toLowerCase() + "\uf8ff"),
        ),
        and(
          where("description_lowercase", ">=", text.toLowerCase()),
          where("description_lowercase", "<=", text.toLowerCase() + "\uf8ff"),
        ),
      ),
    );

    try {
      const usernameQuerySnapshot = await getDocs(usernameQuery);
      const routineQuerySnapshot = await getDocs(routineQuery);

      const usernameQueryResults = usernameQuerySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      }) as DBUser[];
      // Filter out the current user
      const filteredUserResults = usernameQueryResults.filter(
        (user) => user.id !== firebaseUser?.uid,
      );

      const routineQueryResults = routineQuerySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      }) as PublicRoutine[];

      // Combine results and create SearchResult objects
      const combinedResults: SearchResult[] = [...filteredUserResults].map(
        (user) => {
          return {
            id: "usr-" + user.id,
            data: user,
            type: "user",
            score: levenshtein(user.username, text),
            title: user.displayName ?? user.username,
            subtitle: user.username,
            href: "/users/" + user.id,
          };
        },
      );

      routineQueryResults.forEach((routine) => {
        combinedResults.push({
          id: "rtn-" + routine.id,
          data: routine,
          type: "routine",
          score: levenshtein(routine.name, text),
          title: routine.name,
          subtitle: "by @" + routine.user.username,
          href: "/routines/" + routine.id,
        });
      });

      // Sort by score
      combinedResults.sort((a, b) => a.score - b.score);
      setSearchResults(combinedResults);
      // setSearchResults(queryResults);
    } catch (error) {
      console.error("Error searching", error);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      const userRef = doc(FIRESTORE_DB, "users", firebaseUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setDbUser(doc.data() as DBUser);
        }
      });

      return () => unsubscribe();
    }
  }, [firebaseUser]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor:
                Colors[colorScheme ?? "light"].tabBackgroundColor,
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
          placeholder="Search"
          onChangeText={handleSearch}
          value={search}
        />
      </View>

      <View>
        {/* Search results */}
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.navigate(item.href);
              }}
              style={{
                padding: 10,
                backgroundColor:
                  Colors[colorScheme ?? "light"].tabBackgroundColor,
                marginBottom: 10,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Icon depending on the type */}
              <Ionicons
                name={item.type === "user" ? "person" : "barbell"}
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
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: Colors[colorScheme ?? "light"].text,
                    fontSize: 12,
                    // marginLeft: 12,
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
            // <Text>{item.username}</Text>
          )}
        />
      </View>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.light.tabBackgroundColor,
    color: Colors.light.text,
    borderRadius: 5,
  },
  searchButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: Colors.light.text,
  },
});
