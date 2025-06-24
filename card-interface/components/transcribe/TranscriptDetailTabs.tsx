import React, { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Animated, LayoutChangeEvent } from "react-native";
import { Recording } from "@/types/recording";
import DisplayTranscription from "@/components/transcribe/DisplayTranscription";

const tabs = [{ title: "Notes" }, { title: "Transcript" }, { title: "Speaker Sections" }];

interface TranscriptDetailTabsProps {
  recording: Recording;
}

const TranscriptDetailTabs = (props: TranscriptDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>([]);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const [processing, setProcessing] = useState<{ id: string } | null>(null);
  const { recording } = props;

  // Handle tab layout measurement
  const handleTabLayout = (idx: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const next = [...prev];
      next[idx] = { x, width };
      return next;
    });
  };

  // Set initial indicator position after all tabs are measured
  React.useEffect(() => {
    if (tabLayouts.length === tabs.length && tabLayouts[activeTab]) {
      indicatorX.setValue(tabLayouts[activeTab].x);
      indicatorWidth.setValue(tabLayouts[activeTab].width);
    }
  }, [tabLayouts.length]);

  // Animate indicator when activeTab changes
  React.useEffect(() => {
    if (tabLayouts.length === tabs.length && tabLayouts[activeTab]) {
      Animated.spring(indicatorX, {
        toValue: tabLayouts[activeTab].x,
        useNativeDriver: false,
      }).start();
      Animated.spring(indicatorWidth, {
        toValue: tabLayouts[activeTab].width,
        useNativeDriver: false,
      }).start();
    }
  }, [activeTab, tabLayouts]);

  return (
    <View className="mt-4">
      <View className="bg-slate-200 rounded-full p-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row relative"
        >
          {/* Animated Indicator */}
          {tabLayouts.length === tabs.length && (
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                transform: [{ translateX: indicatorX }],
                width: indicatorWidth,
                backgroundColor: "#f1f5f9",
                borderColor: "#e2e8f0",
                borderWidth: 1,
                borderRadius: 999,
                zIndex: 0,
              }}
            />
          )}
          {tabs.map((tab, idx) => (
            <Pressable
              key={tab.title}
              onPress={() => setActiveTab(idx)}
              onLayout={(e) => handleTabLayout(idx, e)}
              style={{ zIndex: 1 }}
              className="px-5 py-1 mx-1 rounded-2xl justify-center items-center"
            >
              <Text
                className={["text-base", "text-[#005f73]", activeTab === idx ? "font-semibold" : "font-normal"].join(
                  " "
                )}
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
        {activeTab === 1 && (
          <DisplayTranscription
            recording={recording}
            processing={processing}
            setProcessing={setProcessing}
          />
        )}
        {activeTab === 2 && <Text>Speaker sections content goes here.</Text>}
      </View>
    </View>
  );
};

export default TranscriptDetailTabs;
