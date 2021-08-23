import React from "react";
import { StyleSheet, Text, View } from "react-native";
const blue = "#1D50F8";
const gray = "lightgrey";

const myId = "u1";
const MessageComponent = ({ message }) => {
  const isMe = message?.user?.id === myId;
  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
      ]}
    >
      <Text style={{ color: isMe ? "black" : "white" }}>
        {message?.content}
      </Text>
    </View>
  );
};

export default MessageComponent;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  text: {
    color: "white",
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: gray,
    marginLeft: "auto",
    marginRight: 10,
  },
});
