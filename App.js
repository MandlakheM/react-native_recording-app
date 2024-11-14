import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import RecordingButton from "./src/components/recordingButton/recordingButton";

export default function App() {
  const background = {
    uri: "https://img.freepik.com/premium-vector/sound-wave-icon-vector-illustration-symbol-design_609277-7318.jpg?w=740",
  };
  // const assignRecordings = (recs) => {
  //   setRecordings(() => [recs, ...recordings]);
  // };

  // useEffect(() => {
  //   console.log("all records", recordings);
  // }, [recordings]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <RecordingButton />
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  // background: { },
  container: {
    flex: 1,
    // backgroundColor: 'blue',
    // alignItems: "center",
    // justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});

