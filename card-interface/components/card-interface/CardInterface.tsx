import { useState } from "react";
import { FlatList, View } from "react-native";
import Card from "../Card";
import Chat from "../Chat";
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

export default function CardInterface() {
  const [cardList, setCardList] =
    useState<{ id: number; first_name: string }[]>(data);

  const handleSwipe = (id: number) => {
    const updatedList = cardList.filter((item) => item.id !== id);
    setCardList(updatedList);
  };
  return (
    <View>
      <FlatList
        className="flex-1 w-full"
        contentContainerStyle={{ alignItems: "center" }}
        data={cardList}
        renderItem={({ item, index }) => (
          <View className="my-10">
            <Card
              id={item.id}
              name={item.first_name}
              removeCard={handleSwipe}
            />
          </View>
        )}
      />
      <Chat />
    </View>
  );
}
