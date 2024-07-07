import React from "react";
import { useInfiniteHits } from "react-instantsearch-core";
import { StyleSheet, View, FlatList } from "react-native";

export function InfiniteHits({
  hitComponent: Hit,
  ...props
}: {
  hitComponent: any;
  [key: string]: any;
}) {
  const { hits, isLastPage, showMore } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });

  return (
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      // ItemSeparatorComponent={() => <View/>}
      onEndReached={() => {
        if (!isLastPage) {
          showMore();
        }
      }}
      renderItem={({ item }) => (
        <View>
          <Hit hit={item} />
        </View>
      )}
    />
  );
}

