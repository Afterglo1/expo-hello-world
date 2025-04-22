import { View, Text, StyleSheet } from "react-native";

const settingsList = ["Airplane Mode", "SIM 1",'SIM 2'];

export default function Cellular() {
  return (
    <View>
      <View style={styles.container}>
        {settingsList.map((item) => (
          <Text style={styles.settingsText} key={item} >{item}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
  },

  settingsText: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#cfcecc",
  },
});
