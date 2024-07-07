import { Modal } from "native-base";
import React from "react";
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
import { FlatRoutineItem, Subroutine } from "@/types";

export default function EditSubroutineModal({
  subroutine,
  setSubroutine,
  isOpen,
  closeModal,
  showUnitSelectModal,
  onSave,
}: {
  subroutine: FlatRoutineItem | null;
  setSubroutine: (subroutine: FlatRoutineItem) => void;
  isOpen: boolean;
  closeModal: () => void;
  showUnitSelectModal: () => void;
  onSave: () => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {subroutine && (
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
              Edit Subroutine
            </Text>

            <View>
              <TextInput
                value={subroutine?.quantity?.toString()}
                onChangeText={(text: string) =>
                  setSubroutine({
                    ...subroutine,
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
                value={subroutine?.unit}
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
            <Button title="Save" onPress={onSave} />
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
