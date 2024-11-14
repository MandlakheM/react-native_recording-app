import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import RecordingButton from "../../components/recordingButton/recordingButton";

export default function home() {
  return (
    <View style={styles.container}>
      <Text> do your recordings and listen to them later!! </Text>
      <RecordingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
});
