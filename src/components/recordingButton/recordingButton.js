import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Text,
} from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecordItem from "../listItem/RecordItem";
import CrudMenu from "../crudMenu/crudMenu";
import NamingModal from "../modal/NamingModal";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RecordingButton() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [isNamingModalVisible, setIsNamingModalVisible] = useState(false);
  const [isRenamingModalVisible, setIsRenamingModalVisible] = useState(false);
  const [tempUri, setTempUri] = useState(null);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    filterRecordings();
  }, [searchQuery, recordings]);

  const loadRecordings = async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem("recordings");
      if (savedRecordings) {
        const parsedRecordings = JSON.parse(savedRecordings);
        setRecordings(parsedRecordings);
        setFilteredRecordings(parsedRecordings);
      }
    } catch (error) {
      console.error("Failed to load recordings", error);
    }
  };

  const filterRecordings = () => {
    if (!searchQuery) {
      setFilteredRecordings(recordings);
    } else {
      const filtered = recordings.filter((recording) =>
        recording.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecordings(filtered);
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

  const animatedRedCircle = {
    width: recording ? "60%" : "85%",
    borderRadius: recording ? 5 : 35,
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome5
          name="search"
          size={20}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recordings"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <FontAwesome5 name="times-circle" size={20} color="gray" />
          </Pressable>
        ) : null}
      </View>
      {filteredRecordings.length > 0 ? (
        <FlatList
          data={filteredRecordings}
          renderItem={({ item }) => (
            <RecordItem rec={item} showMenu={showMenu} />
          )}
          keyExtractor={(item) => item.uri}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No recordings match your search"
                  : "No recordings yet"}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No recordings match your search"
              : "No recordings yet"}
          </Text>
        </View>
      )}

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
          <View style={[styles.redCircle, animatedRedCircle]} />
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
    height: 150,
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
    top: -25,
  },
  redCircle: {
    backgroundColor: "orangered",
    width: 40,
    height: 45,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});
