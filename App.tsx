// App.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  BackHandler,
  ScrollView,
} from "react-native";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "Starter" | "Main" | "Dessert";
}

export default function App() {
  const [screen, setScreen] = useState("Home");
  const [menu, setMenu] = useState<Dish[]>([
    { id: 1, name: "Truffle Soup", description: "Creamy soup infused with truffle oil", price: 120, category: "Starter" },
    { id: 2, name: "Lobster Risotto", description: "Rich risotto with lobster tail", price: 250, category: "Main" },
    { id: 3, name: "Chocolate Soufflé", description: "Soft-centered dark chocolate dessert", price: 100, category: "Dessert" },
  ]);
  const [search, setSearch] = useState("");
  const [newDish, setNewDish] = useState({ name: "", description: "", price: "", category: "Starter" });

  const averagePrice =
    menu.length > 0 ? menu.reduce((sum, d) => sum + d.price, 0) / menu.length : 0;

  const filteredMenu = menu.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase())
  );

  const addDish = () => {
    if (newDish.name && newDish.price) {
      const newEntry: Dish = {
        id: menu.length + 1,
        name: newDish.name,
        description: newDish.description,
        price: parseFloat(newDish.price),
        category: newDish.category as Dish["category"],
      };
      setMenu([...menu, newEntry]);
      setNewDish({ name: "", description: "", price: "", category: "Starter" });
    }
  };

  const Header = ({ title }: { title: string }) => (
    <View style={styles.header}>
      <Image source={require("./assets/logo.jpeg")} style={styles.logo} />
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  const ExitApp = () => {
    BackHandler.exitApp();
  };

  // Screens
  if (screen === "Home")
    return (
      <View style={styles.container}>
        <Header title="Michelin Chef App" />
        <View style={styles.homeContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setScreen("TodaysMenu")}>
            <Text style={styles.buttonText}>Today's Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setScreen("ChangeMenu")}>
            <Text style={styles.buttonText}>Change Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setScreen("AboutChef")}>
            <Text style={styles.buttonText}>About Chef</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={ExitApp}>
            <Text style={styles.buttonText}>Exit App</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  if (screen === "TodaysMenu")
    return (
      <View style={styles.container}>
        <Header title="Today's Menu" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search dish..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        <ScrollView>
          {["Starter", "Main", "Dessert"].map((cat) => (
            <View key={cat}>
              <Text style={styles.subHeading}>{cat}</Text>
              <FlatList
                data={filteredMenu.filter((d) => d.category === cat)}
                renderItem={({ item }) => (
                  <View style={styles.menuItem}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                    <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.homeNav} onPress={() => setScreen("Home")}>
          <Text style={styles.homeText}>← Home</Text>
        </TouchableOpacity>
      </View>
    );

  if (screen === "ChangeMenu")
    return (
      <ScrollView style={styles.container}>
        <Header title="Change Menu" />
        <Text style={styles.sectionTitle}>Add or Edit Dishes</Text>

        <TextInput
          style={styles.input}
          placeholder="Dish name"
          value={newDish.name}
          onChangeText={(v) => setNewDish({ ...newDish, name: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newDish.description}
          onChangeText={(v) => setNewDish({ ...newDish, description: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={newDish.price}
          onChangeText={(v) => setNewDish({ ...newDish, price: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Category (Starter/Main/Dessert)"
          value={newDish.category}
          onChangeText={(v) => setNewDish({ ...newDish, category: v as Dish["category"] })}
        />

        <TouchableOpacity style={styles.button} onPress={addDish}>
          <Text style={styles.buttonText}>Add Dish</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Average Menu Price: R{averagePrice.toFixed(2)}</Text>

        <TouchableOpacity style={styles.homeNav} onPress={() => setScreen("Home")}>
          <Text style={styles.homeText}>← Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );

  if (screen === "AboutChef")
    return (
      <View style={styles.container}>
        <Header title="About the Chef" />
        <Text style={styles.aboutText}>
          Chef Alwande Sibiya is a visionary culinary artist known for fusing luxury with creativity.  
          Every dish tells a story — crafted with precision, passion, and perfection.
        </Text>
        <TouchableOpacity style={styles.homeNav} onPress={() => setScreen("Home")}>
          <Text style={styles.homeText}>← Home</Text>
        </TouchableOpacity>
      </View>
    );

  return null;
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  headerText: {
    color: "gold",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  homeContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  button: {
    backgroundColor: "gold",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 10,
    width: "70%",
  },
  exitButton: {
    backgroundColor: "#b30000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  subHeading: {
    color: "gold",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  menuItem: {
    backgroundColor: "#1f1f1f",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  itemTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDesc: {
    color: "#bbb",
    marginVertical: 5,
  },
  itemPrice: {
    color: "gold",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  sectionTitle: {
    color: "gold",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  homeNav: {
    marginTop: 20,
    alignSelf: "center",
  },
  homeText: {
    color: "gold",
    fontSize: 16,
  },
  aboutText: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
    textAlign: "center",
  },
});

