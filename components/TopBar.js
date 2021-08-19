import React, { useEffect, useState } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { Feather, Fontisto, Entypo, FontAwesome } from "@expo/vector-icons";

const TopBar = () => {
  return (
    <View
      style={{
        marginTop: Constants.statusBarHeight,
        backgroundColor: "#1D50F8",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        flexDirection: "row",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Feather name="more-vertical" size={24} color="white" />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            color: "#fff",
            fontFamily: "Bold",
            fontSize: 22,
          }}
        >
          Ch
        </Text>
        <Fontisto name="hipchat" size={16} color="white" />
        <Text
          style={{
            color: "#fff",
            fontFamily: "Bold",
            fontSize: 22,
          }}
        >
          tly
        </Text>
        <Image
          source={{ uri: "https://links.papareact.com/4u4" }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 20,
            marginHorizontal: 4,
          }}
        />
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({});
