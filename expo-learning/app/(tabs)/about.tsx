import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Screen</Text>
      <Pressable style={styles.button}>
        <Link href={"/settings"} style={{}}>
          <Text style={styles.text}>Go to Settings</Text>
        </Link>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    padding: 10,
    backgroundColor: "#4067f5",
    marginTop: 10,
    borderRadius: 4,
    paddingHorizontal: 16,
  },
});
