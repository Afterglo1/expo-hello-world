import { Box } from "@/components/ui/box";
import { Text } from "react-native";

// export default function Profile() {
//   return (
//     <Box>
//       <Text className="text-primary-main">Welcome to Profile view</Text>
//     </Box>
//   );
// }

import React from "react";
import { View, StyleSheet } from "react-native";

const OnboardingProgress = () => {
  const totalSteps = 20;
  const currentStep = 4;
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, currentStep === index && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    marginTop: 70,
  },
  dot: {
    height: 6,
    width: 2,
    borderRadius: 5,
    backgroundColor: "#ff6600",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#ff6600",
    height: 20,
  },
});

export default OnboardingProgress;
