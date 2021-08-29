import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import MessageComponent from "../../components/MessageComponent";
//import textMsg from "../../assets/TextMsg";
import MessageInput from "../../components/MessageInput";
import { useRoute, useNavigation } from "@react-navigation/native";
import { DataStore, SortDirection } from "aws-amplify";
import { ChatRoom, Message } from "../models";
const InChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  //console.warn("Displaying", route?.params?.id);
  /* navigation.setOptions({
    title: route?.params,
  }); */
  //console.warn(route?.params);
  useEffect(() => {
    fetchChatRooms();
  }, []);
  useEffect(() => {
    fetchMessages();
  }, [chatRoom]);
  useEffect(() => {
    const subscription = DataStore.observe(Message).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      if (msg.model === Message && msg.opType === "INSERT") {
        setMessages((existingMessage) => [msg.element, ...existingMessage]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  /* useEffect(() => {
    const fetchChatRoomUser = async () => {
      if (!route.params?.id) {
        return;
      }
      const userCurrent = await DataStore.query(ChatRoom, route.params.id);
      if (!chatRoom) {
        console.error("Couldnt find User room with id");
      } else {
        setUser(userCurrent);
      }
    };
    fetchChatRoomUser;
  }, [chatRoom]); */
  const fetchChatRooms = async () => {
    if (!route.params?.id) {
      return;
    }
    const chatRoom = await DataStore.query(ChatRoom, route.params.id);
    if (!chatRoom) {
      console.error("Couldnt find chat room with id");
    } else {
      setChatRoom(chatRoom);
      //console.warn(chatRoom);
    }
  };
  const fetchMessages = async () => {
    if (!chatRoom) {
      //console.error("Couldnt find chat room with id");
      return;
    }
    const fetchedMessages = await DataStore.query(
      Message,
      /* filter on db side */ (message) =>
        message.chatroomID("eq", chatRoom?.id),
      {
        sort: (message) => message.createdAt(SortDirection.DESCENDING),
      }
    );
    //console.log(fetchedMessages);
    setMessages(fetchedMessages);
  };
  if (!chatRoom) {
    <ActivityIndicator />;
  }
  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageComponent message={item} />}
        inverted
        style={{}}
      />
      <MessageInput chatRoom={chatRoom} />
    </SafeAreaView>
  );
};

export default InChatScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});
