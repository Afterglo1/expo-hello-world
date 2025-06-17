import { View, Text, GestureResponderEvent, TextInput, Pressable, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [chatOpen, setChatOpen] = useState(false);
  const [inputText, setInputText] = useState<string>("");
  const [messageList, setMessageList] = useState<{ user: string; system: string }[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const handleInputChange = (msg: string) => {
    setInputText(msg);
  };

  const sendMessage = () => {
    setMessageList([...messageList, { user: inputText, system: "System reply" }]);

    setInputText("");
  };

  const handleChatOpen = (e: GestureResponderEvent) => {
    setChatOpen((prev) => !prev);
  };

  useEffect(() => {
    if (messageList.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messageList]);

  return (
    <View className="relative w-full">
      <Modal
        visible={chatOpen}
        animationType="slide"
        transparent
      >
        <View className=" flex-1 w-full h-3/4 absolute justify-between bottom-6 bg-white box-border">
          <View className="flex-row justify-between box-border p-4 py-2 border-b border-gray-400">
            <Text className="text-xl font-semibold ">Chat</Text>
            <Pressable onPress={() => setChatOpen(false)}>
              <Text className="p-1 text-xl font-semibold">
                <Ionicons
                  name="close"
                  size={24}
                  color={"gray"}
                />
              </Text>
            </Pressable>
          </View>
          {/* Chat Messsages list */}
          <FlatList
            ref={flatListRef}
            className="px-2"
            data={messageList}
            renderItem={({ item: el, index }) => (
              <View key={index}>
                <Text className=" bg-gray-200 ml-auto max-w-[70%] my-8  p-2 rounded-lg">{el.user}</Text>

                <Text className="bg-green-200 max-w-[70%]  p-2 rounded-lg">{el.system}</Text>
              </View>
            )}
          />
          {/* Chat Input */}
          <View className="flex-row p-2 m-4 items-center border border-gray-200 rounded-md mb-4">
            <TextInput
              className="bottom-0 h-10 flex-1"
              placeholder="Enter message"
              value={inputText}
              onChangeText={handleInputChange}
            />
            <Pressable onPress={sendMessage}>
              <Ionicons
                name="send"
                size={20}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Chat Icon */}
      <View className="absolute bottom-10 right-2">
        <View
          onTouchStart={handleChatOpen}
          className="bottom-0 right-4 border border-gray-400
          rounded-full p-2 bg-slate-200"
        >
          <Ionicons
            name={chatOpen ? "close" : "chatbubble-ellipses-outline"}
            size={28}
          />
        </View>
      </View>
    </View>
  );
}
