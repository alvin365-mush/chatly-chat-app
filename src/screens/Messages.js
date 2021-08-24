import React, { useEffect, useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import { Feather, Fontisto, Entypo, FontAwesome } from "@expo/vector-icons";
import TopBar from "../../components/TopBar";
import Chat from "../../components/Chat";

import Stories from "../../components/Stories";
import { ChatRoom, ChatRoomUser } from "../models";
import { Auth, DataStore } from "aws-amplify";

export default function Messages() {
  const [chatRoomData, setChatRoomData] = useState([]);
  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter(
          (chatRoomUser) => chatRoomUser.user.id === userData.attributes.sub
        )
        .map((chatRoomUser) => chatRoomUser.chatroom);

      setChatRoomData(chatRooms);
    };
    fetchChatRooms();
  }, []);
  console.log(chatRoomData);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fefefe" }}>
      <TopBar />

      <View style={{ backgroundColor: "#fefefe" }}>
        <FlatList
          data={chatRoomData}
          renderItem={({ item }) => <Chat chatRoom={item} />}
          ListHeaderComponent={() => (
            <FlatList
              style={{ height: "15%" }}
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
