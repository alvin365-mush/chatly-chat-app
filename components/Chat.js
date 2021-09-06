import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { ChatRoomUser, Message } from "../src/models";
import moment from "moment";

const Chat = ({ chatRoom }) => {
  //const [users, setUsers] = useState([]); //users in chat room
  const [user, setUser] = useState(null); //the diasplay user
  const [lastMessage, setLastMessage] = useState();
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedRoomUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatroom.id === chatRoom.id)
        .map((chatRoomUser) => chatRoomUser.user);
      //console.log(fetchedRoomUsers);
      //setUsers(fetchedRoomUsers);
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(
        fetchedRoomUsers.find((user) => user.id !== authUser.attributes.sub) ||
          null
      );
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    if (!chatRoom.chatRoomLastMessageId) {
      return;
    }
    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
      setLastMessage
    );
  }, []);
  /* useEffect(() => {
    const subscription = DataStore.observe(Message).subscribe((msg) => {
      //console.log(msg.model, msg.opType, msg.element);
      if (msg.model === Message && msg.opType === "INSERT") {
        console.log("change");
        DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
          setLastMessage
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [lastMessage]); */
  //console.log(lastMessage.createdAt);
  const navigation = useNavigation();
  const onPress = () => {
    //console.warn(user);
    navigation.navigate("ChatRoom", { id: chatRoom?.id, user: user });
  };
  if (!user) {
    return <ActivityIndicator />;
  }

  const time = moment(lastMessage?.createdAt).from(moment());
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {!!chatRoom.newMessages && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
          </View>
        )}
        <Image source={{ uri: user.imageUrl }} style={styles.image} />

        <View style={styles.right}>
          <View style={styles.row}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {user.name}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.message}>
            {lastMessage?.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#1D50F8",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    left: 35,
    top: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "white",
  },
  badgeText: { color: "white", fontSize: 11, textAlign: "center" },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "auto",
    alignItems: "center",
    paddingVertical: 5,
  },
  right: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 3,
  },
  name: {
    color: "#454545",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 3,
    maxWidth: "50%",
  },
  time: { color: "gray" },
  message: { color: "gray", flex: 1, paddingBottom: 2 },
});
