import Colors from "@/constants/Colors";
import { SearchBoxConnectorParams } from "instantsearch.js/es/connectors/search-box/connectSearchBox";
import React, { useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch-core";
import { StyleSheet, View, TextInput, useColorScheme } from "react-native";

export function SearchBox(props: SearchBoxConnectorParams | undefined) {
  const colorScheme = useColorScheme();
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<TextInput>(null); // Add type for inputRef

  function setQuery(newQuery: string) {
    // Update the parameter type to string
    setInputValue(newQuery);
    refine(newQuery);
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[styles.input, { 
          color: Colors[colorScheme ?? "light"].text,
          backgroundColor: Colors[colorScheme ?? "light"].tabBackgroundColor,
        }]}
        value={inputValue}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    // color: Colors[colorScheme ?? "light"].text,
    // backgroundColor: Colors[colorScheme ?? "light"].tabBackgroundColor,
    height: 48,
    padding: 12,
    fontSize: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
