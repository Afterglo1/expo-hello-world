import React, { useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder, FlatList, Touchable, Pressable, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Card from "@/components/Card";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Chat from "@/components/Chat";
import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "expo-router";
import Transcribe from "./transcribe";

const App = () => {
  return (
    <View style={styles.container}>
      <Transcribe />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold",
  },
  box: {
    height: 350,
    width: 350,
    backgroundColor: "gray",
    borderRadius: 5,
  },
});

export default App;
