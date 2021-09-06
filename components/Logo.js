import React from "react";
import { View, Text } from "react-native";
import { Feather, Fontisto, Entypo, FontAwesome5 } from "@expo/vector-icons";

const Logo = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text
        style={{
          color: "#1D50F8",
          fontFamily: "Bold",
          fontSize: 22,
        }}
      >
        Ch
      </Text>
      <Fontisto name="hipchat" size={16} color="#1D50F8" />
      <Text
        style={{
          color: "#1D50F8",
          fontFamily: "Bold",
          fontSize: 22,
        }}
      >
        tly
      </Text>
    </View>
  );
};

export default Logo;
