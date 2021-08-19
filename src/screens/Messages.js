import React, { useEffect, useState } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import Constants from "expo-constants";
import { Feather, Fontisto, Entypo, FontAwesome } from "@expo/vector-icons";
import TopBar from "../../components/TopBar";
import Chat from "../../components/Chat";
import chatRoomData from "../../assets/ChatroomData";
import Stories from "../../components/Stories";

const chatRoom1 = chatRoomData[0];
const chatRoom2 = chatRoomData[1];
export default function Messages() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar />

      <View style={{}}>
        <FlatList
          data={chatRoomData}
          renderItem={({ item }) => <Chat chatRoom={item} />}
          ListHeaderComponent={() => (
            <FlatList
              style={{ height: "13%" }}
              data={chatRoomData}
              renderItem={({ item }) => <Stories chatRoom={item} />}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
