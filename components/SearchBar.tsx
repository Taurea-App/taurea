import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";

import "@react-native-firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser } from "@/types";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<DBUser[]>([]);

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      setUsers([]);
      return;
    }

    const usersRef = collection(FIRESTORE_DB, "users");
    const usernameQuery = query(usersRef, where("username", ">=", search));
    const querySnapshot = await getDocs(usernameQuery);

    const queryResults = querySnapshot.docs.map((doc) =>
      doc.data(),
    ) as DBUser[];

    // Combine and remove duplicates
    // const results = [...displayNameResults, ...usernameResults].reduce(
    //   (acc, user) => {
    //     if (!acc.find((u) => u.id === user.id)) {
    //       acc.push(user);
    //     }
    //     return acc;
    //   },
    //   [],
    // );

    setUsers(queryResults);
  };

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          paddingLeft: 8,
        }}
        placeholder="Search by username or display name"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>
            {item.username} (@{item.username})
          </Text>
        )}
      />
    </View>
  );
};

export default SearchBar;
