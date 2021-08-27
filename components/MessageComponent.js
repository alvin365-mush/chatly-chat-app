import { Auth, DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "../src/models";
const blue = "#1D50F8";
const gray = "lightgrey";

const myId = "u1";
const MessageComponent = ({ message }) => {
  const [user, setUser] = useState();
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    const checkIfMe = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    };
    checkIfMe();
  }, [user]);
  //const isMe = message?.user?.id === myId;
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
