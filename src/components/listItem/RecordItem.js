import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RecordItem({ rec, showMenu }) {
  const [sound, setSound] = useState(null);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: rec.uri });
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(()=>{
  },[sound])

  return (
    <Pressable onLongPress={() => showMenu(rec)}>
      <View style={styles.container}>
        <FontAwesome5
          onPress={playSound }
          name={sound ? 'pause' : 'play'}
          size={20}
          color={"gray"}
        />
        <View style={styles.recordingInfo}>
          <View style={styles.playbackContainer}>
            <View style={styles.playbackBackground} />
          </View>
          <Text style={styles.recordingName}>{rec.name}</Text>
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
    borderWidth: 3,
    borderColor: "orangered",
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
    marginTop: 15,
    height: 40,
    justifyContent: "center",
    // backgroundColor:'blue',
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
    // backgroundColor:'blue',
    fontSize: 12,
    // marginBottom: 5,
  },
});
