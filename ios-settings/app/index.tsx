import { IconProps } from "@expo/vector-icons/build/createIconSet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { ComponentProps } from "react";
import { Link, LinkProps } from "expo-router";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type SettingsData = {
  name: string;
  icon: IoniconName;
  color: string;
  path: LinkProps["href"];
};

export default function Settings() {
  const settingsData: { [key: string]: SettingsData[] } = {
    list1: [
      { name: "Airplane Mode", icon: "airplane", color: "#d49904", path: "/" },
      { name: "Wifi", icon: "wifi", color: "#456cf7", path: "/" },
      { name: "Bluetooth", icon: "bluetooth", color: "#456cf7", path: "/" },
      {
        name: "Cellular",
        icon: "radio",
        color: "#499647",
        path: "/cellular",
      },
      { name: "Battery", icon: "battery-full", color: "#499647", path: "/" },
    ],
    list2: [
      { name: "General", icon: "settings", color: "#939596", path: "/" },
      {
        name: "Accessibility",
        icon: "accessibility",
        color: "#456cf7",
        path: "/",
      },
      { name: "Camera", icon: "camera", color: "#939596", path: "/" },
      {
        name: "Control Center",
        icon: "toggle-sharp",
        color: "#939596",
        path: "/",
      },
      {
        name: "Display & Brightness",
        icon: "sunny",
        color: "#456cf7",
        path: "/",
      },
    ],
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Settings</Text>
        <View style={styles.settingsContainer}>
          <FlatList
            data={settingsData.list1}
            renderItem={({ index, item }) => (
              <Link href={item.path}>
                <View style={styles.settingsTextContainer}>
                  <View
                    style={{
                      backgroundColor: item.color,
                      padding: 4,
                      borderRadius: 4,
                      alignItems: "center",
                      // borderWidth: 1,
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      // color={item.color}
                      color="#fff"
                      size={22}
                    />
                  </View>
                  <View
                    style={[
                      styles.listItem,
                      index < settingsData.list1.length - 1 && {
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <Text style={styles.listText}>{item.name}</Text>
                    {/* <Text style={styles.listText}>{index,settingsData.length }</Text> */}
                    <Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#a7a7ab"
                      />
                    </Text>
                  </View>
                </View>
              </Link>
            )}
          ></FlatList>
        </View>
        
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 10,
  },
  settingsContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  listText: {
    fontSize: 16,
    fontWeight: 500,
  },
  listItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#d6d4d4",
    height: 50,
    alignItems: "center",
  },
  settingsTextContainer: {
    gap: 16,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderColor: "#c3c4c7",
    flexDirection: "row",
    alignItems: "center",
  },
});
