import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666666",
  },
  exerciseContainer: {
    // marginBottom: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    // borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#888888",
    borderLeftWidth: 5,
    borderLeftColor: "#FFA500",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    alignItems: "center",
  },
  button: {
    padding: 15,
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "30%",
  },
});
