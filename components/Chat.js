import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Chat = ({ chatRoom }) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate("ChatRoom", { id: chatRoom?.id });
  };
  const user = chatRoom.users[1];
  return (
    <TouchableOpacity onPress={onPress}>
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
  },
  time: { color: "gray" },
  message: { color: "gray", flex: 1, paddingBottom: 2 },
});
