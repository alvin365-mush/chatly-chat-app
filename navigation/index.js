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
import { DataStore } from "aws-amplify";
import { ChatRoomUser } from "../src/models";
import InChatHeader from "./InChatHeader";

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
        options={({ route, navigation }) => ({
          headerShown: true,
          headerTitle: () => <InChatHeader id={route.params?.id} />,
          headerBackTitleVisible: false,
        })}
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

const ChatRoomHeader = ({ id, children }) => {
  const { width } = useWindowDimensions();
  //console.log(props);
  const [user, setUser] = React.useState(null); //the diasplay user

  React.useEffect(() => {
    if (!id) {
      return;
    }
    const fetchUsers = async () => {
      const fetchedRoomUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatroom.id === id)
        .map((chatRoomUser) => chatRoomUser.user);
      //console.log(fetchedRoomUsers);
      //setUsers(fetchedRoomUsers);
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(
        fetchedRoomUsers.find((user) => user.id !== authUser.attributes.sub) ||
          null
      );
    };
    fetchUsers();
  }, []);
  console.log(user);
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
          uri: user?.imageUrl,
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />
      <Text style={{ flex: 1, marginLeft: 10, fontWeight: "bold" }}>
        {user?.name}
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
