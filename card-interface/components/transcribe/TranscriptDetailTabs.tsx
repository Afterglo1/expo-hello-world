import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

const tabs = [{ title: "Notes" }, { title: "Transcript" }, { title: "Speaker Sections" }];

const TranscriptDetailTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View className="mt-4">
      <View className="bg-slate-200 rounded-full p-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row" }}
        >
          {tabs.map((tab, idx) => (
            <Pressable
              key={tab.title}
              onPress={() => setActiveTab(idx)}
              className={[
                "px-5 py-1 mx-1 rounded-2xl ",
                activeTab === idx ? "bg-slate-100 border border-slate-200" : "bg-transparent",
                "justify-center items-center",
              ].join(" ")}
            >
              <Text
                className={["text-base", "text-[#005f73]", activeTab === idx ? "font-bold" : "font-normal"].join(" ")}
              >
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {/* Tab Content */}
      <View className="p-4">
        {activeTab === 0 && <Text>Notes content goes here.</Text>}
        {activeTab === 1 && <Text>Transcript content goes here.</Text>}
        {activeTab === 2 && <Text>Speaker sections content goes here.</Text>}
      </View>
    </View>
  );
};

export default TranscriptDetailTabs;
