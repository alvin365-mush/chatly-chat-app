import React, { useEffect, useState } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { Feather, Fontisto, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { useRoute, useNavigation } from "@react-navigation/native";
import { User } from "../src/models";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import Logo from "./Logo";

const TopBar = () => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  const navigation = useNavigation();
  const [user, setUser] = useState("");
  const signOut = async () => {
    /* await DataStore.clear(); */
    Auth.signOut();
  };
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const fetchedUsers = await DataStore.query(User, userData.attributes.sub);
      setUser(fetchedUsers);
    };
    fetchUser();
  }, []);
  //console.log("user", user?.imageUrl);
  return (
    <View
      style={{
        marginTop: Constants.statusBarHeight,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        flexDirection: "row",
        elevation: 0.2,
      }}
    >
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 38,
                borderWidth: 2,
                borderColor: "#1D50F8",
                alignItems: "center",
                justifyContent: "center",
                padding: 1,
              }}
            >
              <Image
                source={{ uri: user?.imageUrl }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 20,
                }}
              />
              {/* <TouchableOpacity onPress={() => navigation.navigate("UsersScreen")}>
          <FontAwesome5 name="pencil-alt" size={22} color="#1D50F8" />
        </TouchableOpacity> */}
            </View>
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={hideMenu}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <TouchableOpacity onPress={signOut}>
              <FontAwesome5 name="sign-out-alt" size={24} color="#1D50F8" />
            </TouchableOpacity>
            <Text style={{ marginLeft: 5 }}>Log out</Text>
          </View>
        </MenuItem>
        {/* <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
        <MenuItem disabled>Disabled item</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Menu item 4</MenuItem> */}
      </Menu>

      {/* <TouchableOpacity onPress={signOut}>
        <FontAwesome5 name="sign-out-alt" size={24} color="#1D50F8" />
      </TouchableOpacity> */}

      <Logo />
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({});
