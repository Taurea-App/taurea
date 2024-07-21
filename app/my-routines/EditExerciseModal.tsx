import { Modal } from "native-base";
import React, { useContext } from "react";
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { ExerciseInRoutine, FlatRoutineItem } from "@/types";
import { TranslationContext } from "../context/translationProvider";

export default function EditExerciseModal({
  exercise,
  setExercise,
  isOpen,
  closeModal,
  showUnitSelectModal,
  showExerciseSelectModal,
  onSave,
  isSubroutine = false,
}: {
  exercise: null | FlatRoutineItem;
  setExercise: (exercise: FlatRoutineItem) => void;
  isOpen: boolean;
  closeModal: () => void;
  showUnitSelectModal: () => void;
  showExerciseSelectModal: () => void;
  onSave: () => void;
  isSubroutine?: boolean;
}) {
  const colorScheme = useColorScheme();
  const { translate } = useContext(TranslationContext);

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {exercise && (
        <Modal.Content
          maxWidth="400px"
          style={{
            backgroundColor:
              Colors[colorScheme ? colorScheme : "light"].popupBackground,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Modal.CloseButton />

          <Modal.Body>
            <Text
              style={[
                styles.title,
                {
                  color: Colors[colorScheme ? colorScheme : "light"].text,
                },
              ]}
            >
              Edit Exercise
            </Text>

            {!isSubroutine && (
              <View>
                <TextInput
                  value={exercise?.name}
                  onPressIn={() => {
                    showExerciseSelectModal();
                    Keyboard.dismiss();
                  }}
                  readOnly
                  style={[
                    styles.input,
                    {
                      backgroundColor:
                        Colors[colorScheme ? colorScheme : "light"]
                          .tabBackgroundColor,
                      color: Colors[colorScheme ? colorScheme : "light"].text,
                    },
                  ]}
                />
              </View>
            )}

            <View>
              <TextInput
                value={
                  exercise?.quantity === 0 ? "" : exercise?.quantity?.toString()
                }
                onChangeText={(text: string) =>
                  setExercise({
                    ...exercise,
                    quantity: isNaN(parseInt(text, 10))
                      ? 0
                      : parseInt(text, 10),
                  })
                }
                inputMode="numeric"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      Colors[colorScheme ? colorScheme : "light"]
                        .tabBackgroundColor,
                    color: Colors[colorScheme ? colorScheme : "light"].text,
                  },
                ]}
              />
            </View>
            <View>
              <TextInput
                value={exercise?.unit}
                onPressIn={() => {
                  showUnitSelectModal();
                  Keyboard.dismiss();
                }}
                readOnly
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      Colors[colorScheme ? colorScheme : "light"]
                        .tabBackgroundColor,
                    color: Colors[colorScheme ? colorScheme : "light"].text,
                  },
                ]}
              />
            </View>
          </Modal.Body>
          <Modal.Footer
            style={{
              justifyContent: "flex-end",
              backgroundColor:
                Colors[colorScheme ? colorScheme : "light"].popupBackground,
            }}
          >
            <Button title={translate("general.save")} onPress={onSave} />
          </Modal.Footer>
        </Modal.Content>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  input: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
