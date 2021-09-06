import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  Fontisto,
} from "@expo/vector-icons";
import { DataStore } from "@aws-amplify/datastore";
import { Auth, Storage } from "aws-amplify";
import { ChatRoom, Message } from "../src/models";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Audio, AVPlaybackStatus } from "expo-av";
import { FloatingAction } from "react-native-floating-action";
import AudioPlayer from "./AudioPlayer";

const blue = "#1D50F8";
const gray = "lightgrey";

const MessageInput = ({ chatRoom }) => {
  const [message, setMessage] = useState("");
  const [emojiKey, setEmojiKey] = useState(false);
  const [image, setImage] = useState(null);
  const [fab, setFab] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(null);
  const [soundURI, setSoundURI] = useState(null);

  const actions = [
    {
      icon: <FontAwesome5 name="microphone" size={24} color="white" />,
      name: "bt_mic",
      position: 1,
      buttonSize: 50,
      color: "#1D50F8",
      margin: 2,
    },
  ];
  const renderMic = () => {
    return (
      <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording}>
        <FontAwesome name="camera-retro" size={24} color="white" style={{}} />
      </TouchableOpacity>
    );
  };
  //console.log("MI CHat", chatRoom);
  const sendMessage = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
        status: "SENT",
      })
    ).then(console.warn("sending"));
    //console.warn(newMessage);
    updateLastMsg(newMessage);
    //console.warn("sending");
    setEmojiKey(false);
    setMessage("");
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,

      quality: 0.5,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const updateLastMsg = async (newMessage) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = newMessage;
      })
    );
    setImage(null);
    console.warn("Updating ");
  };
  const onPress = () => {
    if (image) {
      sendImage();
    } else if (message) {
      sendMessage();
    } else if (soundURI) {
      sendAudio();
    }
  };
  const resetFields = () => {
    setMessage("");
    setIsEmojiPickerOpen(false);
    setImage(null);
    setProgress(0);
    //setSoundURI(null); */
  };
  const progressCallback = (progress) => {
    setProgress(progress.loaded / progress.total);
  };
  const sendImage = async () => {
    const blob = await getBlob(image);
    const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
      progressCallback,
    });

    // send message
    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        image: key,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
      })
    );

    updateLastMsg(newMessage);
    resetFields();
  };
  const getBlob = async (uri) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };

  //Audio
  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    if (!recording) {
      return;
    }

    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    if (!uri) {
      return;
    }
    setSoundURI(uri);
  }

  const sendAudio = async () => {
    if (!soundURI) {
      return;
    }
    const uriParts = soundURI.split(".");
    const extenstion = uriParts[uriParts.length - 1];
    const blob = await getBlob(soundURI);
    const { key } = await Storage.put(`${uuidv4()}.${extenstion}`, blob, {
      progressCallback,
    });
    // send message
    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        audio: key,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
      })
    );

    updateLastMsg(newMessage);

    resetFields();
  };
  return (
    <KeyboardAvoidingView
      style={[styles.root, { height: emojiKey ? "50%" : "auto" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {image && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{ uri: image }}
            style={{ width: 150, height: 100, right: 0, borderRadius: 10 }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignSelf: "flex-end",
            }}
          >
            <View
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: "#3777f0",
                width: `${progress * 100}%`,
              }}
            />
          </View>
          <TouchableOpacity onPress={() => setImage(null)}>
            <Fontisto
              name="close-a"
              size={18}
              color="black"
              style={{ margin: 10 }}
            />
          </TouchableOpacity>
        </View>
      )}

      {soundURI && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "auto",
            flexDirection: "row",
          }}
        >
          <AudioPlayer soundURI={soundURI} />
          <TouchableOpacity onPress={() => setSoundURI(null)}>
            <Fontisto
              name="close-a"
              size={18}
              color="black"
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setEmojiKey((currentValue) => !currentValue)}
          >
            <FontAwesome5
              name="smile"
              size={24}
              color="#595959"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Message..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity onPress={pickImage}>
            <Ionicons
              name="images"
              size={24}
              color="#595959"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="camera-retro"
              size={24}
              color="#595959"
              style={{}}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          {message || image || soundURI ? (
            <TouchableOpacity onPress={onPress}>
              <View style={styles.buttonContainer}>
                <Ionicons
                  name="ios-send-sharp"
                  size={24}
                  color="white"
                  style={{ marginRight: -4 }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonContainer}>
              <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                <FontAwesome5 name={"microphone"} size={24} color="white" />
              </Pressable>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {emojiKey && (
        <EmojiSelector
          category={Categories.symbols}
          showHistory={true}
          onEmojiSelected={(emoji) =>
            setMessage((currentMessage) => currentMessage + emoji)
          }
          columns={8}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  root: { flexDirection: "column", marginTop: 7 },
  row: { flexDirection: "row" },
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
  sendImageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
  },
});
/* <FloatingAction
                /* onPressMain={() => navigation.navigate("UsersScreen")} */
/* actions={actions}
                onPressItem={() => {
                  console.log("click");
                }}
                color="#1D50F8"
                showBackground={false}
                distanceToEdge={{ vertical: 1, horizontal: 1 }}
                buttonSize={50}
                actionsPaddingTopBottom={5}
              /> */
