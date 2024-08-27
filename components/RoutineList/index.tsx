import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { View, Pressable, FlatList, ColorSchemeName, Text } from "react-native";
import Collapsible from "react-native-collapsible";

import { styles } from "./styles";

import { TranslationContext } from "@/app/context/translationProvider";
import Colors from "@/constants/Colors";
import { ExerciseInRoutine, Subroutine } from "@/types";
import { getName } from "@/utils/exercises";

export default function RoutineList({
  routineItems,
  colorScheme,
  currentExercise,
}: {
  routineItems: (ExerciseInRoutine | Subroutine)[];
  colorScheme: ColorSchemeName;
  currentExercise?: ExerciseInRoutine | null;
}) {
  function isExerciseInRoutine(
    item: ExerciseInRoutine | Subroutine,
  ): item is ExerciseInRoutine {
    return (item as ExerciseInRoutine).exerciseId !== undefined;
  }

  const [collapsedSubroutines, setCollapsedSubroutines] = useState<
    Map<string, boolean>
  >(new Map());

  const { language } = useContext(TranslationContext);

  useEffect(() => {
    if (!routineItems) return;

    routineItems.forEach((item) => {
      if (!(item as Subroutine).exercises) return;

      setCollapsedSubroutines((prevState) => {
        const newState = new Map(prevState);
        newState.set(item.id, false);
        return newState;
      });
    });
  }, [routineItems]);

  const toggleSubroutine = (subroutineId: string) => {
    setCollapsedSubroutines((prevState) => {
      const newState = new Map(prevState);
      newState.set(subroutineId, !newState.get(subroutineId));
      return newState;
    });
  };

  const renderRoutineItem = ({
    item,
  }: {
    item: ExerciseInRoutine | Subroutine;
  }) => (
    <View>
      {isExerciseInRoutine(item) ? (
        <View
          style={[
            styles.exerciseContainer,
            {
              backgroundColor:
                currentExercise?.id === item.id
                  ? Colors[colorScheme === "dark" ? "dark" : "light"]
                      .highlightedTabBackgroundColor
                  : Colors[colorScheme === "dark" ? "dark" : "light"]
                      .tabBackgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.exerciseName,
              {
                color: Colors[colorScheme === "dark" ? "dark" : "light"].text,
              },
            ]}
          >
            {getName(item, language)}
          </Text>
          <Text
            style={{
              color: Colors[colorScheme === "dark" ? "dark" : "light"].text,
            }}
          >
            {item.quantity} {item.unit}
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor:
              Colors[colorScheme === "dark" ? "dark" : "light"]
                .primaryBackground,
            borderBottomWidth: 1,
            borderBottomColor: "#888888",
          }}
        >
          <Pressable onPress={() => toggleSubroutine(item.id)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                gap: 10,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={
                  collapsedSubroutines.get(item.id)
                    ? "chevron-forward"
                    : "chevron-down"
                }
                size={24}
                color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
              />
              <View>
                <Text
                  style={{
                    color:
                      Colors[colorScheme === "dark" ? "dark" : "light"].text,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                />

                <Text
                  style={{
                    color:
                      Colors[colorScheme === "dark" ? "dark" : "light"].text,
                  }}
                >
                  {item.quantity} {item.unit}
                </Text>
              </View>
            </View>
          </Pressable>

          <Collapsible
            collapsed={collapsedSubroutines.get(item.id)}
            align="center"
          >
            <FlatList
              data={item.exercises}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRoutineItem}
              style={{ marginLeft: 20, marginBottom: 5 }}
            />
          </Collapsible>
        </View>
      )}
    </View>
  );
  return (
    <FlatList
      data={routineItems}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRoutineItem}
    />
  );
}
