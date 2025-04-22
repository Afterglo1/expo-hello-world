import { View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

const settingsList = ["Airplane Mode", "SIM 1", "SIM 2"];

export default function Cellular() {
  return (
    <View>
      <View className="m-3 bg-white p-3 rounded-md text-base font-semibold ">
        {settingsList.map((item) => (
          <View className="flex-row  items-center mt-4 justify-between">
            <Text className="text-xl" key={item}>
              {item}
            </Text>
            <Text>
              <Ionicons name="chevron-forward" />
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // margin: 10,
    // padding: 10,
    // backgroundColor: "#fff",
    // borderRadius: 10,
    // fontSize: 16,
    // fontWeight: 600,
  },

  settingsText: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#cfcecc",
  },
});
