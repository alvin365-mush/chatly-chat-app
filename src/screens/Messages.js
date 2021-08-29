import React, { useEffect, useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import { Feather, Fontisto, Entypo, FontAwesome5 } from "@expo/vector-icons";
import TopBar from "../../components/TopBar";
import Chat from "../../components/Chat";

import Stories from "../../components/Stories";
import { ChatRoom, ChatRoomUser } from "../models";
import { Auth, DataStore } from "aws-amplify";
import { FloatingAction } from "react-native-floating-action";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Messages() {
  const navigation = useNavigation();
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

  //console.log(chatRoomData);
  /* useEffect(() => {
    const subscription = DataStore.observe(ChatRoomUser).subscribe(
      (chatRoom) => {
        //console.log(chatRoom.model, chatRoom.opType, chatRoom.element);
        if (chatRoom.model === ChatRoomUser && chatRoom.opType === "INSERT") {
          fetchChatRooms();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fefefe" }}>
      <TopBar />

      <View style={{ backgroundColor: "#fefefe", marginTop: 5 }}>
        <FlatList
          data={chatRoomData}
          renderItem={({ item }) => <Chat chatRoom={item} />}
          /* ListHeaderComponent={() => (
            <FlatList
              style={{ height: "35%" }}
              data={chatRoomData}
              renderItem={({ item }) => <Stories chatRoom={item} />}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          )} */
        />
      </View>
      <FloatingAction
        onPressMain={() => navigation.navigate("UsersScreen")}
        color="#1D50F8"
        showBackground={false}
        floatingIcon={
          <FontAwesome5 name="pencil-alt" size={22} color="white" />
        }
      />
    </SafeAreaView>
  );
}
