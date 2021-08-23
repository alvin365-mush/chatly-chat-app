import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
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
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { Feather, Fontisto, Entypo, FontAwesome } from "@expo/vector-icons";
import Navigation from "./navigation";

import Amplify, { Hub, Auth, DataStore } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import config from "./src/aws-exports";
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

function App() {
  let [fontLoaded] = useFonts({
    Bold: require("./fonts/Montserrat-ExtraBold.otf"),
    Medium: require("./fonts/Montserrat-Medium.otf"),
    Regular: require("./fonts/Montserrat-Regular.otf"),
  });

  Auth.currentAuthenticatedUser().then(console.log);
  const routes = [
    {
      key: "first",
      title: "All Messages",
    },
    {
      key: "second",
      title: "Groups",
    },
  ];
  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigation />
    </SafeAreaView>
  );
}
export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    flexDirection: "row",

    backgroundColor: "#1D50F8",
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    color: "#fff",
  },
});

const FirstRoute = () => (
  <View style={[styles.container, { backgroundColor: "#ff4081" }]} />
);
const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: "#673ab7" }]} />
);
/**const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={{ borderBottomRadius: 10 }}>
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
            <Fontisto name="hipchat" size={24} color="white" />
            <Text
              style={{
                color: "#fff",
                fontFamily: "Bold",
                fontSize: 20,
                paddingHorizontal: 5,
              }}
            >
              Chatly
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather
              name="search"
              size={22}
              color="white"
              style={{ paddingHorizontal: 8 }}
            />
            <Fontisto
              name="bell"
              size={22}
              color="white"
              style={{ paddingHorizontal: 8 }}
            />
            <Image
              source={{ uri: "https://links.papareact.com/4u4" }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                marginHorizontal: 8,
              }}
            />
          </View>
        </View>
        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map((inputIndex) =>
                inputIndex === i ? 1 : 0.5
              ),
            });

            return (
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setIndexState({ i })}
              >
                {route.icon}
                <Animated.Text style={{ opacity, color: "#fff" }}>
                  {route.title}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );} */
