import { StyleSheet } from "react-native";

export const editRoutineLayoutStyle = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    width: "100%",
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666",
  },
  exerciseList: {
    width: "100%",
    marginBottom: 5,
  },
  exerciseListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    // marginBottom: 5,
    borderRadius: 10,
    borderBottomWidth: 1,
  },
  exerciseListItemName: {
    fontSize: 16,
    width: "40%",
  },
  exerciseListItemQuantity: {
    fontSize: 16,
    width: "20%",
  },
  searchBar: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    width: "100%",
    borderRadius: 10,
  },

  newExerciseForm: {
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  newExercisePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseSelect: {
    width: "45%",
    textAlign: "center",
  },
  quantityInput: {
    width: "25%",
  },
  unitSelect: {
    width: "30%",
  },

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
  pickerItem: {
    fontSize: 12,
  },
  showAddExerciseButton: {
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  saveButton: {
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  addExerciseButton: {
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteSwipe: {
    backgroundColor: "red",
    alignItems: "flex-start",
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
  },
  leftActionText: {
    color: "white",
  },
  duplicateSwipe: {
    backgroundColor: "blue",
    alignItems: "flex-end",
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
  },
  createSwipe: {
    backgroundColor: "green",
    alignItems: "flex-start",
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
  },
  rightActionText: {
    color: "white",
  },
  subroutineListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    borderBottomWidth: 1,
    gap: 10,
  },

  subroutineName: {
    fontSize: 16,
    width: "40%",
  },
  openSubroutineElement: {
    borderTopWidth: 4,
    // borderTopColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginTop: 5,
    // borderBottomWidth: 1,
  },
  closeSubroutineElement: {
    borderBottomWidth: 4,
    // borderBottomColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginBottom: 5,
  },
  isPublicSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 10,
    width: "100%",
    // borderRadius: 10,
    // borderBottomWidth: 1,
  },
});
