
# 📱 React Native Components Explained 

## 🧱 Basic Layout and View Components

These components are part of the core React Native library.

### 1. `View`

- Acts like a `<div>` in web development.
- Used to **group other components** or apply layout styles.

```jsx
<View style={{ padding: 10 }}>
  <Text>Hello World</Text>
</View>
```

---

### 2. `Text`

- Used to **display text** on the screen.

```jsx
<Text style={{ fontSize: 20 }}>Welcome to React Native!</Text>
```

---

### 3. `StyleSheet`

- Helps you write **clean and organized styles** for components.

```jsx
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
});
```

---

### 4. `Pressable`

- A **touchable component** that responds to user presses (clicks).
- Replaces older components like `TouchableOpacity`.

```jsx
<Pressable onPress={() => alert('Pressed!')}>
  <Text>Click Me</Text>
</Pressable>
```

---

### 5. `FlatList`

- Used to **render lists** of data efficiently.
- Handles large data sets by rendering only visible items.

```jsx
<FlatList
  data={[{ key: 'Item 1' }, { key: 'Item 2' }]}
  renderItem={({ item }) => <Text>{item.key}</Text>}
/>
```

---

### 6. `Modal`

- Creates a **popup window** or dialog.
- Useful for alerts, forms, or additional info.

```jsx
<Modal visible={true} animationType="slide">
  <Text>This is a modal!</Text>
</Modal>
```

---

## 📦 Components from External Libraries

These components are not built-in, but come from libraries like **expo** and **expo-router**.

### 1. `Image` from `expo-image`

- Advanced and performant image component.
- Works better than React Native’s default `Image`.

```js
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>
```

> `ImageSource` is a TypeScript type that helps define what kind of image you’re using (local file or URL).

---

### 2. `Link`, `Stack`, `Tabs` from `expo-router`

- These are used for **navigation** in your app (moving between screens).

```js
import { Link } from 'expo-router';

// Link to another screen
<Link href="/profile">Go to Profile</Link>
```

- `Stack` is used for **stack navigation** (like a back button).
- `Tabs` helps you create a **bottom tab bar** like many mobile apps.

---

## 🎨 Icons from `@expo/vector-icons`

Icons make your app visually appealing and user-friendly. These are libraries containing thousands of icons.

### 1. `Ionicons`

```js
import { Ionicons } from "@expo/vector-icons";

<Ionicons name="home" size={24} color="black" />
```

### 2. `MaterialIcons`

```js
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

<MaterialIcons name="email" size={24} color="blue" />
```

### 3. `FontAwesome`

```js
import { FontAwesome } from '@expo/vector-icons';

<FontAwesome name="user" size={24} color="green" />
```
