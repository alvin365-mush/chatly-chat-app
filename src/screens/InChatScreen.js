import React from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import MessageComponent from "../../components/MessageComponent";
import textMsg from "../../assets/TextMsg";
import MessageInput from "../../components/MessageInput";
import { useRoute, useNavigation } from "@react-navigation/native";
const InChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.warn("Displaying", route?.params?.id);
  navigation.setOptions({ title: "Elon" });
  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={textMsg.messages}
        renderItem={({ item }) => <MessageComponent message={item} />}
        inverted
        style={{}}
      />
      <MessageInput />
    </SafeAreaView>
  );
};

export default InChatScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});
