import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  FlatList,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Card from "@/components/Card";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Chat from "@/components/Chat";

const data = [
  {
    id: 1,
    first_name: "Aldric",
  },
  {
    id: 2,
    first_name: "Minta",
  },
  {
    id: 3,
    first_name: "Papagena",
  },
  {
    id: 4,
    first_name: "Lucio",
  },
  {
    id: 5,
    first_name: "Querida",
  },
  {
    id: 6,
    first_name: "Tiffie",
  },
  {
    id: 7,
    first_name: "Georgie",
  },
  {
    id: 8,
    first_name: "Sayer",
  },
  {
    id: 9,
    first_name: "Demetre",
  },
  {
    id: 10,
    first_name: "Elijah",
  },
];

const App = () => {
  const [swipedList, setSwipedList] = useState<number[] | []>([]);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        // pan.extractOffset();
      },
    })
  ).current;

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            className="flex-1 w-full"
            contentContainerStyle={{ alignItems: "center" }}
            data={data}
            renderItem={({ item }) => (
              <View className="my-10">
                <Card id={item.id} name={item.first_name} />
              </View>
            )}
          />
          <Chat />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
