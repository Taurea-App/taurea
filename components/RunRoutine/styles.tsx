import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "space-between",
    width: "100%",
    // padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 24,
  },
  button: {
    color: "white",
    padding: 10,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
  },
  nextButton: {
    color: "white",
    padding: 10,
    borderRadius: 40,
    // width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
  quantity: {
    fontSize: 20,
  },
});
