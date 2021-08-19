import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const Chat = ({ chatRoom }) => {
  const user = chatRoom.users[1];
  return (
    <View style={styles.container}>
      {chatRoom.newMessages && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
        </View>
      )}
      <Image source={{ uri: user.imageUri }} style={styles.image} />

      <View style={styles.right}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.time}>{chatRoom.lastMessage.createdAt}</Text>
        </View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.message}>
          {chatRoom.lastMessage.content}
        </Text>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    paddingBottom: 9,
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
    marginRight: 11,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "auto",
  },
  right: { flex: 1, justifyContent: "center" },
  name: { color: "blue", fontWeight: "bold", fontSize: 17, marginBottom: 3 },
  time: { color: "gray" },
  message: { color: "gray", flex: 1 },
});
