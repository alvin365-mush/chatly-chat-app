import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  ColorSchemeName,
  View,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TopBar from "../components/TopBar";
import Messages from "../src/screens/Messages";
import InChatScreen from "../src/screens/InChatScreen";
import UsersScreen from "../src/screens/UsersScreen";

export default function Navigation({ colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
    /* theme={colorScheme === "dark" ? DarkTheme : DefaultTheme} */
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Messages} />
      <Stack.Screen
        name="ChatRoom"
        component={InChatScreen}
        options={{
          headerShown: true,
          headerTitle: ChatRoomHeader,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="UsersScreen"
        component={UsersScreen}
        options={{
          title: "Users",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

const HomeHeader = (props) => {
  const { width } = useWindowDimensions();

  return <TopBar />;
};

const ChatRoomHeader = (props) => {
  const { width } = useWindowDimensions();
  //console.log(props);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width - 25,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg",
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />
      <Text style={{ flex: 1, marginLeft: 10, fontWeight: "bold" }}>
        {props.children}
      </Text>
      <Feather
        name="camera"
        size={24}
        color="black"
        style={{ marginHorizontal: 10 }}
      />
      <Feather
        name="edit-2"
        size={21}
        color="black"
        style={{ marginHorizontal: 10 }}
      />
    </View>
  );
};
