import { Modal, Text } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useColorScheme } from "./useColorScheme";

import { EXERCISE_UNITS, SUBROUTINE_UNITS } from "@/constants";
import Colors from "@/constants/Colors";

export default function UnitSelectModal({
  showModal,
  closeModal,
  selectedUnit,
  setSelectedUnit,
  isSubroutine = false,
}: {
  showModal: boolean;
  closeModal: () => void;
  selectedUnit: string;
  setSelectedUnit: (unit: string) => void;
  isSubroutine?: boolean;
}) {
  const colorScheme = useColorScheme();
  const UNITS = isSubroutine ? SUBROUTINE_UNITS : EXERCISE_UNITS;

  return (
    <Modal
      animationPreset="slide"
      isOpen={showModal}
      size="full"
      onClose={closeModal}
    >
      <Modal.Content
        style={[
          style.exerciseSelectModalView,
          {
            backgroundColor: colorScheme
              ? Colors[colorScheme].background
              : Colors.light.background,
          },
        ]}
        marginBottom={0}
        marginTop="auto"
      >
        {UNITS.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[
              style.button,
              {
                backgroundColor: colorScheme
                  ? Colors[colorScheme].tabBackgroundColor
                  : Colors.light.tabBackgroundColor,
              },
            ]}
            onPress={() => {
              setSelectedUnit(unit);
              closeModal();
            }}
          >
            <Text
              style={[
                style.exerciseSelectItem,
                {
                  color: colorScheme
                    ? Colors[colorScheme].text
                    : Colors.light.text,
                },
              ]}
            >
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </Modal.Content>
    </Modal>
  );
}

const style = StyleSheet.create({
  exerciseSelectModalView: {
    borderRadius: 20,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  exerciseSelectItem: {
    fontSize: 16,
  },
});
