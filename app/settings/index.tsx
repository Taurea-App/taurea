import { Picker } from "@react-native-picker/picker";
import { useContext } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { TranslationContext } from "../context/translationProvider";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { translate, language, setLanguage, availableLanguages } =
    useContext(TranslationContext);

  return (
    <View style={styles.container}>
      {/* Language Selector */}
      <Text style={styles.title}>{translate("settings.language")}</Text>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
      >
        {Object.keys(availableLanguages).map((lang) => (
          <Picker.Item
            key={lang}
            label={availableLanguages[lang]}
            value={lang}
            color={Colors[colorScheme ?? "light"].text}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
