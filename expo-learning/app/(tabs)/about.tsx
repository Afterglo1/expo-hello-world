import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Screen</Text>
      <Link href={"/settings"} style={{ marginTop: 15 }}>
        <View style={styles.button}>
          <Pressable>
            <Text style={styles.text}>Go to Settings</Text>
          </Pressable>
        </View>
      </Link>
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
    color: "#fff",
    padding: 10,
    backgroundColor: "#4067f5",
    borderRadius: 4,
    paddingHorizontal: 16,
  },
});
