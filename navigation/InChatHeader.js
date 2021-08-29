import React, { useState, useEffect } from "react";
import {
  ColorSchemeName,
  View,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { Auth, DataStore } from "aws-amplify";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ChatRoomUser } from "../src/models";

function InChatHeader({ id, children }) {
  const { width } = useWindowDimensions();
  //console.log(props);
  const [user, setUser] = useState(null); //the diasplay user

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
      console.log(user);
    };
    fetchUsers();
  }, []);

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
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ width: 110, marginLeft: 10, fontWeight: "bold" }}
        >
          {user?.name}
        </Text>
      </View>
      <FontAwesome name="camera-retro" size={24} color="#595959" style={{}} />
    </View>
  );
}
export default InChatHeader;
