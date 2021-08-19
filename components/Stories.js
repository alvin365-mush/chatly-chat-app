import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const Stories = ({ chatRoom }) => {
  const user = chatRoom.users[1];
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.imageUri }} style={styles.image} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        {user.name}
      </Text>
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: 70,
    margin: 6,
    borderWidth: 3,
    borderRadius: 40,
    padding: 1,
    borderColor: "#1D50F8",
  },

  image: {
    height: "100%",
    width: "100%",
    borderRadius: 30,
    marginRight: 11,
  },
  name: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    color: "gray",
  },
});
