import React, { useEffect, useState } from "react";
import { Animated, View, SafeAreaView, FlatList } from "react-native";
import Constants from "expo-constants";
import { Feather, Fontisto, Entypo, FontAwesome } from "@expo/vector-icons";
import TopBar from "../../components/TopBar";
import Chat from "../../components/Chat";

import { DataStore } from "@aws-amplify/datastore";
import { User } from "../models";
import UserItem from "../../components/UserItem";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    DataStore.query(User).then(setUsers);
  }, []);
  /* useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await DataStore.query(User);
      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, []); */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fefefe" }}>
      <View style={{ backgroundColor: "#fefefe", paddingVertical: 10 }}>
        <FlatList
          data={users}
          renderItem={({ item }) => <UserItem user={item} />}
        />
      </View>
    </SafeAreaView>
  );
}
