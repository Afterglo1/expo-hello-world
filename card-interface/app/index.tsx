import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  FlatList,
  Touchable,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Card from "@/components/Card";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Chat from "@/components/Chat";
import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "expo-router";

const App = () => {
  // const pan = useRef(new Animated.ValueXY()).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
  //       useNativeDriver: false,
  //     }),
  //     onPanResponderRelease: () => {
  //       Animated.spring(pan, {
  //         toValue: { x: 0, y: 0 },
  //         useNativeDriver: false,
  //       }).start();
  //       // pan.extractOffset();
  //     },
  //   })
  // ).current;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemeToggle />
        <Pressable className="my-2 p-2 bg-slate-400  rounded-md">
          <Link asChild href={"/feeds"}>
            <Text className="text-white ">Go To Chats</Text>
          </Link>
        </Pressable>
        <Pressable className="my-2 p-2 bg-slate-400  rounded-md">
          <Link asChild href={"/voice"}>
            <Text className="text-white ">Go To Recorder</Text>
          </Link>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
