import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from "react-native";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  course: string;
  price: number;
  image?: string;
}

export default function App() {
  const [screen, setScreen] = useState("Welcome");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<MenuItem[]>([]);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starter");
  const [price, setPrice] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [filter, setFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [orderQuantity, setOrderQuantity] = useState<{ [key: number]: number }>({});

  const courses = ["Starter", "Main", "Dessert"];

  // ---------- Functions ----------
  const addItem = () => {
    if (!dishName || !description || !price) {
      alert("Please fill all fields.");
      return;
    }
    const newItem: MenuItem = {
      id: Date.now(),
      name: dishName,
      description,
      course,
      price: parseFloat(price),
      image: "https://via.placeholder.com/300",
    };
    setMenu([...menu, newItem]);
    setDishName("");
    setDescription("");
    setPrice("");
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const removeItem = (id: number) => {
    setMenu(menu.filter((item) => item.id !== id));
  };

  const orderItem = (item: MenuItem, quantity: number) => {
    const totalPrice = item.price * quantity;
    setOrders([...orders, { ...item, price: totalPrice }]);
    alert(`You ordered ${quantity} x ${item.name} for R${totalPrice.toFixed(2)}`);
  };

  const filteredMenu = menu
    .filter((m) => (filter ? m.course === filter : true))
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const getAveragePrice = (courseName: string) => {
    const items = menu.filter((m) => m.course === courseName);
    if (items.length === 0) return "0.00";
    const total = items.reduce((sum, i) => sum + i.price, 0);
    return (total / items.length).toFixed(2);
  };

  const getOverallAveragePrice = () => {
    if (menu.length === 0) return "0.00";
    const total = menu.reduce((sum, i) => sum + i.price, 0);
    return (total / menu.length).toFixed(2);
  };

  const getTotalOrder = () => {
    return orders.reduce((sum, i) => sum + i.price, 0).toFixed(2);
  };

  // ---------- Screens ----------
  if (screen === "Welcome") {
    return (
      <View style={styles.container}>
        <View style={styles.logoPlaceholder}>
          <Text style={{ color: "#ccc" }}>[ App Logo Here ]</Text>
        </View>
        <Text style={styles.header}>Welcome to Chef's Menu App</Text>
        <Text style={styles.textCenter}>
          Explore today's menu or learn more about our chef.
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={() => setScreen("Today")}>
          <Text style={styles.navText}>Today's Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButtonSecondary} onPress={() => setScreen("About")}>
          <Text style={styles.navText}>About Chef</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButtonSecondary} onPress={() => setScreen("PlaceOrder")}>
          <Text style={styles.navText}>View Order ({orders.length})</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "Today") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Today's Menu</Text>
        {courses.map((c) => {
          const items = menu.filter((m) => m.course === c);
          if (items.length === 0) return null;
          return (
            <View key={c}>
              <Text style={styles.subHeader}>{c}</Text>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => {
                    setSelectedDish(item);
                    setScreen("DishDetails");
                  }}
                >
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardInfo}>Price: R{item.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        <TouchableOpacity style={styles.navButton} onPress={() => setScreen("Explore")}>
          <Text style={styles.navText}>Explore More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButtonSecondary} onPress={() => setScreen("Change")}>
          <Text style={styles.navText}>Change Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("Welcome")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "Explore") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Explore More</Text>
        <TextInput
          style={styles.input}
          placeholder="Search for a dish..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, filter === null && styles.selectedType]}
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.typeText, filter === null && styles.selectedText]}>All</Text>
          </TouchableOpacity>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.typeButton, filter === c && styles.selectedType]}
              onPress={() => setFilter(filter === c ? null : c)}
            >
              <Text style={[styles.typeText, filter === c && styles.selectedText]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredMenu.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
              setSelectedDish(item);
              setScreen("DishDetails");
            }}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardInfo}>Price: R{item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("Today")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "DishDetails" && selectedDish) {
    const quantity = orderQuantity[selectedDish.id] || 1;
    return (
      <ScrollView style={styles.container}>
        <Image source={{ uri: selectedDish.image }} style={styles.detailImage} />
        <Text style={styles.header}>{selectedDish.name}</Text>
        <Text style={styles.cardDesc}>{selectedDish.description}</Text>
        <Text style={styles.cardInfo}>Course: {selectedDish.course}</Text>
        <Text style={styles.cardInfo}>Price: R{selectedDish.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <Text style={{ color: "#fff" }}>Qty:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={(val) =>
              setOrderQuantity({ ...orderQuantity, [selectedDish.id]: parseInt(val) || 1 })
            }
          />
        </View>
        <TouchableOpacity
          style={styles.navButtonSecondary}
          onPress={() => {
            orderItem(selectedDish, quantity);
            setScreen("Today");
          }}
        >
          <Text style={styles.navText}>Add to Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("Today")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "PlaceOrder") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Your Order</Text>
        {orders.length === 0 ? (
          <Text style={styles.textCenter}>No items in order yet.</Text>
        ) : (
          orders.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.name} x {orderQuantity[item.id] || 1}
              </Text>
              <Text style={styles.cardInfo}>R{item.price.toFixed(2)}</Text>
            </View>
          ))
        )}
        <Text style={styles.subHeader}>Total: R{getTotalOrder()}</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            alert("Order Placed Successfully!");
            setOrders([]);
            setScreen("Welcome");
          }}
        >
          <Text style={styles.navText}>Place Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("Welcome")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "Change") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Change Menu (Chef Only)</Text>
        <TextInput
          style={styles.input}
          placeholder="Dish name"
          placeholderTextColor="#bbb"
          value={dishName}
          onChangeText={setDishName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#bbb"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Price (R)"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <View style={styles.typeContainer}>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.typeButton, course === c && styles.selectedType]}
              onPress={() => setCourse(c)}
            >
              <Text style={[styles.typeText, course === c && styles.selectedText]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Submit Dish" color="#FFD700" onPress={addItem} />
        <Text style={styles.subHeader}>Average Price by Course:</Text>
        {courses.map((c) => (
          <Text key={c} style={{ color: "#fff" }}>
            {c}: R{getAveragePrice(c)}
          </Text>
        ))}
        <Text style={{ color: "#fff", fontWeight: "bold", marginTop: 8 }}>
          Overall Average: R{getOverallAveragePrice()}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("Today")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "About") {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>About the Chef</Text>
        <View style={styles.logoPlaceholder}>
          <Text style={{ color: "#ccc" }}>[ Chef Image Here ]</Text>
        </View>
        <Text style={styles.textCenter}>
          Welcome to Chef Amahle’s kitchen — where taste meets creativity!
          Every dish is made with passion and the finest ingredients.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen("Welcome")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1c1c1c" },
  header: { fontSize: 24, fontWeight: "bold", color: "#FFD700", marginBottom: 10, textAlign: "center" },
  subHeader: { fontSize: 20, fontWeight: "bold", marginVertical: 5, color: "#FFD700" },
  textCenter: { textAlign: "center", marginVertical: 10, color: "#fff" },
  input: { borderWidth: 1, borderColor: "#555", borderRadius: 8, padding: 10, marginVertical: 5, color: "#fff" },
  logoPlaceholder: {
    height: 120, width: "100%", borderWidth: 2, borderColor: "#555", borderStyle: "dashed",
    alignItems: "center", justifyContent: "center", borderRadius: 12, marginVertical: 20
  },
  typeContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  typeButton: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "#555" },
  selectedType: { backgroundColor: "#FFD700" },
  typeText: { color: "#fff" },
  selectedText: { color: "#000", fontWeight: "bold" },
  card: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginVertical: 6 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#FFD700" },
  cardDesc: { color: "#fff", marginVertical: 4 },
  cardInfo: { color: "#ccc" },
  cardImage: { width: "100%", height: 180, borderRadius: 10, marginBottom: 8 },
  detailImage: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10 },
  navButton: { backgroundColor: "#FFD700", padding: 12, borderRadius: 8, marginVertical: 5 },
  navButtonSecondary: { backgroundColor: "#FFA500", padding: 12, borderRadius: 8, marginVertical: 5 },
  navText: { color: "#000", textAlign: "center", fontWeight: "bold" },
  backButton: { marginTop: 15, borderWidth: 1, borderColor: "#777", padding: 10, borderRadius: 8 },
  backText: { textAlign: "center", color: "#fff" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  quantityInput: { borderWidth: 1, borderColor: "#555", borderRadius: 6, width: 60, marginLeft: 5, padding: 5, color: "#fff" },
});
