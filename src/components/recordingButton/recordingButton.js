import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecordItem from "../listItem/RecordItem";
import CrudMenu from "../crudMenu/crudMenu";
import NamingModal from "../modal/NamingModal";

export default function RecordingButton() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [isNamingModalVisible, setIsNamingModalVisible] = useState(false);
  const [isRenamingModalVisible, setIsRenamingModalVisible] = useState(false);
  const [tempUri, setTempUri] = useState(null);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem("recordings");
      if (savedRecordings) {
        setRecordings(JSON.parse(savedRecordings));
      }
    } catch (error) {
      console.error("Failed to load recordings", error);
    }
  };

  const saveRecordings = async (updatedRecordings) => {
    try {
      await AsyncStorage.setItem(
        "recordings",
        JSON.stringify(updatedRecordings)
      );
    } catch (error) {
      console.error("Failed to save recordings", error);
    }
  };

  async function startRecording() {
    setToggleMenu(false);
    setSelectedRec(null);
    try {
      if (!permissionResponse || permissionResponse.status !== "granted") {
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
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(undefined);
    if (uri) {
      setTempUri(uri);
      setIsNamingModalVisible(true);
    }
  }

  const handleSaveRecording = async (name) => {
    if (tempUri) {
      const newRecording = {
        uri: tempUri,
        name: name || `Recording ${recordings.length + 1}`,
        timestamp: new Date().toISOString(),
      };
      const updatedRecordings = [newRecording, ...recordings];
      setRecordings(updatedRecordings);
      await saveRecordings(updatedRecordings);
      setIsNamingModalVisible(false);
      setTempUri(null);
    }
  };

  const handleRenameRecording = async (newName) => {
    const updatedRecordings = recordings.map((rec) =>
      rec.uri === selectedRec.uri ? { ...rec, name: newName } : rec
    );
    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);
    setIsRenamingModalVisible(false);
    setToggleMenu(false);
  };

  const handleDeleteRecording = async (recordingToDelete) => {
    const updatedRecordings = recordings.filter(
      (rec) => rec.uri !== recordingToDelete.uri
    );
    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);
    setToggleMenu(false);
  };

  const showMenu = (rec) => {
    setToggleMenu(!toggleMenu);
    setSelectedRec(rec);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        renderItem={({ item }) => <RecordItem rec={item} showMenu={showMenu} />}
        keyExtractor={(item) => item.uri}
      />
      <NamingModal
        visible={isNamingModalVisible}
        onClose={() => setIsNamingModalVisible(false)}
        onSave={handleSaveRecording}
        title="Name your recording"
      />

      <NamingModal
        visible={isRenamingModalVisible}
        onClose={() => setIsRenamingModalVisible(false)}
        onSave={handleRenameRecording}
        initialValue={selectedRec?.name}
        title="Rename recording"
      />
      <View style={styles.footer}>
        <Pressable
          style={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        >
          <View style={styles.redCircle} />
        </Pressable>
        {toggleMenu && (
          <CrudMenu
            selectedRec={selectedRec}
            onDelete={handleDeleteRecording}
            onRename={() => setIsRenamingModalVisible(true)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "orangered",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  footer: {
    backgroundColor: "white",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    gap: 70,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
});
