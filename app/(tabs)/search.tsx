import { Link } from "expo-router";
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
import { FlatList } from "native-base";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser } from "@/types";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const auth = FIREBASE_AUTH;
  const firebaseUser = auth.currentUser;

  // dbUser is the user object from Firestore. Ith has the same uid as the firebaseUser
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<DBUser[]>([]);

  const handleSearch = async (text: string) => {

    setSearch(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }
    const usersRef = collection(FIRESTORE_DB, "users");
    const usernameQuery = query(
      usersRef,
      or(
        and(
          where("username", ">=", text.toLowerCase()),
          where("username", "<=", text.toLowerCase() + "\uf8ff"),
        ),
        and(
          where("displayName", ">=", text.toLowerCase()),
          where("displayName", "<=", text.toLowerCase() + "\uf8ff"),
        ),
      ),
    );

    try {
      const querySnapshot = await getDocs(usernameQuery);

      const queryResults = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      }) as DBUser[];
      // Filter out the current user
      const filteredResults = queryResults.filter(
        (user) => user.id !== firebaseUser?.uid,
      );
      setSearchResults(filteredResults);
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
            <Link
              href={{
                pathname: "/users/[userId]",
                params: { userId: item.id },
              }}
              style={{
                padding: 10,
                backgroundColor:
                  Colors[colorScheme ?? "light"].tabBackgroundColor,
                marginBottom: 10,
                borderRadius: 5,
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              {item.username}
            </Link>
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
