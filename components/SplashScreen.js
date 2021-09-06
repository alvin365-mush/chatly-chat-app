import React from "react";
import { View, Text } from "react-native";
import { Feather, Fontisto, Entypo, FontAwesome5 } from "@expo/vector-icons";

const SplashScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            color: "#1D50F8",
            fontFamily: "Bold",
            fontSize: 33,
          }}
        >
          Ch
        </Text>
        <Fontisto
          name="hipchat"
          size={23}
          color="#1D50F8"
          style={{ marginRight: 1 }}
        />
        <Text
          style={{
            color: "#1D50F8",
            fontFamily: "Bold",
            fontSize: 33,
          }}
        >
          tly
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
