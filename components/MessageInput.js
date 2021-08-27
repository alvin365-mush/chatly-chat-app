import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import { ChatRoom, Message } from "../src/models";

const blue = "#1D50F8";
const gray = "lightgrey";

const MessageInput = ({ chatRoom }) => {
  const [message, setMessage] = useState("");
  //console.log("MI CHat", chatRoom);
  const sendMessage = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
      })
    ).then(console.warn("sending"));
    //console.warn(newMessage);
    updateLastMsg(newMessage);
    //console.warn("sending");
    setMessage("");
  };
  const updateLastMsg = async (newMessage) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = newMessage;
      })
    );
    console.warn("Updating ");
  };
  const onPress = () => {
    if (message) {
      sendMessage();
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inputContainer}>
        <FontAwesome
          name="camera-retro"
          size={24}
          color="#595959"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />

        <FontAwesome5 name="microphone" size={24} color="#595959" />
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
          {message ? (
            <Ionicons
              name="ios-send-sharp"
              size={24}
              color="white"
              style={{ marginRight: -4 }}
            />
          ) : (
            <Ionicons
              name="md-add"
              size={29}
              color="white"
              style={{ justifyContent: "center" }}
            />
          )}
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  root: { flexDirection: "row" },
  inputContainer: {
    backgroundColor: "#f2f2f2",
    borderColor: "lightgrey",
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  icon: { marginRight: 5 },
  textInput: { flex: 1 },
  buttonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: blue,
    justifyContent: "center",
    alignItems: "center",
  },
});
