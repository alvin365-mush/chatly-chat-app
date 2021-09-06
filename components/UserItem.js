import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { ChatRoom, ChatRoomUser, User } from "../src/models";

const UserItem = ({ user }) => {
  const navigation = useNavigation();
  //console.log(user);
  const onPress = async () => {
    // TODO if there is already a chat room between these 2 users
    // then redirect to the existing chat room
    // otherwise, create a new chatroom with these users.

    // Create a chat room
    const newChatRoom = await DataStore.save(new ChatRoom({ newMessages: 0 }));

    // connect authenticated user with the chat room
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    await DataStore.save(
      new ChatRoomUser({
        user: dbUser,
        chatroom: newChatRoom,
      })
    );

    // connect clicked user with the chat room
    await DataStore.save(
      new ChatRoomUser({
        user,
        chatroom: newChatRoom,
      })
    );

    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: user.imageUrl }} style={styles.image} />

        <View style={styles.right}>
          <View style={styles.row}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
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
  },
  time: { color: "gray" },
  message: { color: "gray", flex: 1, paddingBottom: 2 },
});
