import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RecordItem({ rec, showMenu }) {
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: rec.uri });
    setSound(sound);
    await sound.playAsync();
  }

  return (
    <Pressable onLongPress={() => showMenu(rec)}>
      <View style={styles.container}>
        <FontAwesome5
          onPress={playSound}
          name={"play"}
          size={20}
          color={"gray"}
        />
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingName}>{rec.name}</Text>
          <View style={styles.playbackContainer}>
            <View style={styles.playbackBackground} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  playbackContainer: {
    height: 50,
    justifyContent: "center",
  },
  playbackBackground: {
    height: 3,
    backgroundColor: "gainsboro",
    borderRadius: 5,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    marginBottom: 5,
  },
});
