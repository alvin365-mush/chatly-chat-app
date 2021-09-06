import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ChatRoomUser } from "../src/models";

const Stories = ({ chatRoom }) => {
  const [user, setUser] = useState(null); //the diasplay user
  const [lastMessage, setLastMessage] = useState();
  //console.log(user);
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
  return (
    <View style={styles.container}>
      <Image source={{ uri: user?.imageUrl }} style={styles.image} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        {user?.name}
      </Text>
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: 70,
    margin: 6,
    borderWidth: 3,
    borderRadius: 40,
    padding: 1,
    borderColor: "#1D50F8",
  },

  image: {
    height: "100%",
    width: "100%",
    borderRadius: 30,
    marginRight: 11,
  },
  name: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    color: "gray",
  },
});
