import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import RecordingButton from "./src/components/recordingButton/recordingButton";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SupportServices from "./src/components/modal/supportServices";
import * as Font from 'expo-font'
import { useEffect, useState } from "react";
export default function App() {
  const background = {
    uri: "https://img.freepik.com/premium-vector/gray-equalizer-isolated-white-background-vector-illustration-pulse-music-player-audio-wave-logo-vector-design-element-poster-sound-wave-template-visualization-signal-illustration-eps-10_299644-7588.jpg?w=740",
  };
  const [fontsLoaded,setFontsLoaded] =useState(false)
  const [support,setSupport] =useState(false)

  // const assignRecordings = (recs) => {
  //   setRecordings(() => [recs, ...recordings]);
  // };

  useEffect(() => {
    loadFonts()
  }, []);

async function loadFonts(){
  await Font.loadAsync({
    Outfit:require('./assets/fonts/Outfit-VariableFont_wght.ttf')
  });
setFontsLoaded(true)
}

if(!fontsLoaded) return null;

const showSupport = () => {
  setSupport(!support)
}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Entypo name="modern-mic" size={24} color="black" />
          <Text>Audio Rec</Text>
        </View>
        <View style={styles.menu}>
          {/* <MaterialIcons name="menu" size={28} color="black" /> */}
          <FontAwesome5 name="info" size={24} color="black" onPress={showSupport} />
        </View>
      </View>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        {support && <SupportServices showSupport={showSupport}/>}
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
    // backgroundColor: 'black',
    height: 70,
    width: "100%",
    marginTop: 25,
    marginLeft: 10,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  logo:{
    flexDirection:'row'
  },
  menu: {
    marginRight: 20,
  },
});
