import React, { useState, useEffect } from "react";
import {
  ColorSchemeName,
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ChatRoomUser } from "../src/models";
import * as ImagePicker from "expo-image-picker";
import MessageInput from "../components/MessageInput";
import moment from "moment";

function InChatHeader({ id, children }) {
  const { width } = useWindowDimensions();
  //console.log(props);
  const [user, setUser] = useState(null); //the diasplay user
  const [image, setImage] = useState(null);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,

      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      return <MessageInput image={image} />;
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchUsers = async () => {
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatroom.id === id)
        .map((chatRoomUser) => chatRoomUser.user);

      // setUsers(fetchedUsers);

      const authUser = await Auth.currentAuthenticatedUser();
      setUser(
        fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
      );
      //console.log(user);
    };
    fetchUsers();
  }, []);
  const getLastOnline = () => {
    if (!user?.lastOnlineAt) {
      return null;
    }
    console.log(user?.lastOnlineAt);
    const lastOnlineDiff = moment().diff(moment(user?.lastOnlineAt));
    if (lastOnlineDiff < 5 * 6 * 1000) {
      //less than 5 minutes
      return "online";
    } else {
      return `last seen ${moment(user?.lastOnlineAt).fromNow()}`;
    }
  };
  //console.log(moment(user?.lastOnlineAt).from(moment()));
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width - 80,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri: user?.imageUrl,
          }}
          style={{ width: 30, height: 30, borderRadius: 30 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ width: 110, fontWeight: "bold" }}
          >
            {user?.name}
          </Text>
          <Text style={{ color: "gray", fontSize: 12 }}>{getLastOnline()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={pickImage}>
        <FontAwesome name="camera-retro" size={24} color="#595959" style={{}} />
      </TouchableOpacity>
    </View>
  );
}
export default InChatHeader;
