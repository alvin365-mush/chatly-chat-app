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
import { Feather, Fontisto, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { Auth } from "aws-amplify";
import { useRoute, useNavigation } from "@react-navigation/native";

const TopBar = () => {
  const navigation = useNavigation();
  const signOut = () => {
    Auth.signOut();
  };
  return (
    <View
      style={{
        marginTop: Constants.statusBarHeight,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        flexDirection: "row",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <TouchableOpacity onPress={signOut}>
          <FontAwesome5 name="sign-out-alt" size={24} color="black" />
        </TouchableOpacity> */}

        <Image
          source={{ uri: "https://links.papareact.com/4u4" }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 20,
            marginHorizontal: 8,
          }}
        />
        <TouchableOpacity onPress={() => navigation.navigate("UsersScreen")}>
          <FontAwesome5 name="pencil-alt" size={22} color="#1D50F8" />
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({});
