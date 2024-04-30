import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ColorSchemeName,
} from "react-native";

import Colors from "@/constants/Colors"; // Adjust the import path as necessary

const SlideUpModal = ({
  visible,
  onClose,
  children,
  colorScheme,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  colorScheme: ColorSchemeName;
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for position

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const slideUpStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [200, 0], // Adjust these values based on your modal's height
        }),
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Animated.View
          style={[
            {
              marginTop: "auto",
              marginBottom: 0,
              backgroundColor:
                Colors[colorScheme === "dark" ? "dark" : "light"]
                  .tabBackgroundColor,
            },
            slideUpStyle,
          ]}
        >
          <SafeAreaView>{children}</SafeAreaView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default SlideUpModal;
