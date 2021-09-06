import { Auth, Storage } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Message, User } from "../src/models";
import { S3Image } from "aws-amplify-react-native";
import AudioPlayer from "./AudioPlayer";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
/* import Lightbox from "react-native-lightbox"; */
const blue = "#1D50F8";
const gray = "lightgrey";

const myId = "u1";
const MessageComponent = (props) => {
  const [message, setMessage] = useState(props.message);
  const [user, setUser] = useState();
  const [isMe, setIsMe] = useState(false);
  const [soundURI, setSoundURI] = useState(null);
  const { width } = useWindowDimensions();

  //console.log(message);
  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);
  useEffect(() => {
    const subscription = DataStore.observe(Message, message.id).subscribe(
      (msg) => {
        //console.log(msg.model, msg.opType, msg.element);
        if (msg.model === Message && msg.opType === "UPDATE") {
          setMessage((existingMessage) => ({ ...message, ...msg.element }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setSoundURI);
    }
  }, [message]);
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
  useEffect(() => {
    setAsRead();
  }, [isMe, message]);
  const setAsRead = async () => {
    if (isMe === false && message.status !== "READ") {
      await DataStore.save(
        Message.copyOf(message, (updated) => {
          updated.status = "READ";
        })
      );
    }
  };
  //const isMe = message?.user?.id === myId;
  const time = moment(message?.createdAt).format("LT");
  return (
    <View
      style={[
        { maxWidth: "70%" },
        isMe ? styles.rightContainer2 : styles.leftContainer2,
      ]}
    >
      <View
        style={[
          styles.container,
          isMe ? styles.rightContainer : styles.leftContainer,
        ]}
      >
        {message.image && (
          /* {/* <Lightbox key={message.image}   navigator={navigator} ></Lightbox> } */
          <S3Image
            imgKey={message.image}
            style={{ width: width * 0.6, aspectRatio: 4 / 3, elevation: 10 }}
            resizeMode="cover"
          />
        )}
        {soundURI && (
          <AudioPlayer
            soundURI={soundURI}
            style={{ width: width * 0.6, elevation: 10 }}
          />
        )}
        {!!message.content && (
          <Text style={{ color: isMe ? "black" : "white", elevation: 10 }}>
            {message.content}
          </Text>
        )}
        <View style={isMe ? styles.rightArrow : styles.leftArrow}></View>
        <View
          style={isMe ? styles.rightArrowOverlap : styles.leftArrowOverlap}
        ></View>
      </View>
      <View
        style={[
          {
            flexDirection: "row",
            marginHorizontal: 9,
            alignItems: "center",
          },
          isMe
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" },
        ]}
      >
        <Text style={{ color: "gray", fontSize: 10, marginHorizontal: 5 }}>
          {time}
        </Text>
        {isMe && !!message.status && message.status !== "SENT" && (
          <FontAwesome5
            name={message.status === "DELIVERED" ? "check" : "check-double"}
            size={10}
            color="#34e5eb"
          />
        )}
      </View>
    </View>
  );
};

export default MessageComponent;

const styles = StyleSheet.create({
  container: {
    padding: 7,
    marginVertical: 2,
    borderRadius: 9,
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
  leftContainer2: {
    marginLeft: 0,
    marginRight: "auto",
  },
  rightContainer2: {
    marginLeft: "auto",
    marginRight: 0,
  },
  leftArrow: {
    position: "absolute",
    backgroundColor: blue,
    //backgroundColor:"red",
    width: 24,
    height: 20,
    bottom: -3,
    borderBottomRightRadius: 25,
    left: -10,
  },
  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#fff",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -10,
    borderBottomRightRadius: 18,
    left: -20,
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: gray,
    //backgroundColor:"red",
    width: 24,
    height: 20,
    bottom: -3,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#fff",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -10,
    borderBottomLeftRadius: 18,
    right: -20,
  },
});
