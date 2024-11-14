import { useState } from "react";
import { View, StyleSheet, Button, FlatList, Pressable } from "react-native";
import { Audio } from "expo-av";

export default function RecordingButton() {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordings, setRecordings] = useState([]);

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordings(() => [uri, ...recordings]);
    // console.log("Recording stopped and stored at", uri);
  }

  return (
    <View style={styles.container}>
      <FlatList />
      {/* <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      /> */}
      <View style={styles.footer}>
        <Pressable
          style={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        >
          <View style={styles.redCircle} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "black",
    height: 10,
    width: "100%",
    // padding: 10,
  },
  footer: {
    backgroundColor: "white",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,

    borderWidth: 3,
    borderColor: "gray",
    padding: 3,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  redCircle: {
    backgroundColor: "orangered",
    aspectRatio: 1,
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});
