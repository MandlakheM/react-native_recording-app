import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import RecordingButton from "./src/components/recordingButton/recordingButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function App() {
  const background = {
    uri: "https://img.freepik.com/premium-vector/gray-equalizer-isolated-white-background-vector-illustration-pulse-music-player-audio-wave-logo-vector-design-element-poster-sound-wave-template-visualization-signal-illustration-eps-10_299644-7588.jpg?w=740",
  };

  // const assignRecordings = (recs) => {
  //   setRecordings(() => [recs, ...recordings]);
  // };

  // useEffect(() => {
  //   console.log("all records", recordings);
  // }, [recordings]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Ionicons name="recording-sharp" size={28} color="black" />
          <Text>logo</Text>
        </View>
        <View>
        <MaterialIcons name="menu" size={28} color="black" />
        </View>
      </View>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        <RecordingButton />
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue',
    // alignItems: "center",
    // justifyContent: "center",
  },
  header: {
    // backgroundColor: 'blue',
    height: 100,
    width: "100%",
    marginTop: 25,
    marginLeft: 10,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
