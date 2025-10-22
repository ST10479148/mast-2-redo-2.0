import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
} from "react-native";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  course: string;
  price: number;
}

export default function App() {
  const [screen, setScreen] = useState("Home");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [orders, setOrders] = useState<{ item: MenuItem; quantity: number }[]>(
    []
  );
  const [orderQuantity, setOrderQuantity] = useState<{ [key: number]: number }>(
    {}
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Truffle Arancini",
      description: "Golden risotto balls with black truffle and parmesan.",
      course: "Starter",
      price: 140,
    },
    {
      id: 2,
      name: "Lobster Bisque",
      description: "Creamy lobster soup with cognac and herbs.",
      course: "Starter",
      price: 120,
    },
    {
      id: 3,
      name: "Filet Mignon",
      description: "Tender beef medallion with red wine jus.",
      course: "Main",
      price: 290,
    },
    {
      id: 4,
      name: "Seared Salmon",
      description: "Atlantic salmon with citrus beurre blanc.",
      course: "Main",
      price: 260,
    },
    {
      id: 5,
      name: "Chocolate Soufflé",
      description: "Warm and airy soufflé served with vanilla cream.",
      course: "Dessert",
      price: 150,
    },
    {
      id: 6,
      name: "Crème Brûlée",
      description: "Classic French custard with caramelized sugar.",
      course: "Dessert",
      price: 130,
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const orderItem = (item: MenuItem) => {
    const quantity = orderQuantity[item.id] || 1;
    setOrders([...orders, { item, quantity }]);
    alert(`You ordered ${quantity} x ${item.name}`);
  };

  const averagePriceByCourse = (course: string) => {
    const items = menuItems.filter((item) => item.course === course);
    if (!items.length) return 0;
    return (
      items.reduce((sum, i) => sum + i.price, 0) / items.length
    ).toFixed(2);
  };

  const averageMenuPrice = (
    menuItems.reduce((sum, i) => sum + i.price, 0) / menuItems.length
  ).toFixed(2);

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.Image
        source={require("./assets/logo.jpeg")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Text style={styles.headerText}>Michelin Chef</Text>
    </View>
  );

  const HomeScreen = () => (
    <View style={styles.screen}>
      {renderHeader()}
      <Text style={styles.title}>Welcome to Michelin Chef</Text>
      <Text style={styles.subtitle}>Fine Dining • Refined Taste</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen("Menu")}
      >
        <Text style={styles.buttonText}>View Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setScreen("Dashboard")}
      >
        <Text style={styles.buttonText}>Chef Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  const MenuScreen = () => (
    <ScrollView style={styles.screen}>
      {renderHeader()}
      <Text style={styles.pageTitle}>Our Menu</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search dishes..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />

      {["Starter", "Main", "Dessert"].map((course) => (
        <View key={course}>
          <Text style={styles.sectionHeading}>{course}s</Text>
          <FlatList
            data={filteredMenu.filter((i) => i.course === course)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardText}>{item.description}</Text>
                <Text style={styles.cardPrice}>R{item.price.toFixed(2)}</Text>

                <View style={styles.qtyRow}>
                  <Text>Qty:</Text>
                  <TextInput
                    style={styles.qtyInput}
                    keyboardType="numeric"
                    value={orderQuantity[item.id]?.toString() || "1"}
                    onChangeText={(value) =>
                      setOrderQuantity({
                        ...orderQuantity,
                        [item.id]: parseInt(value) || 1,
                      })
                    }
                  />
                </View>

                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={() => orderItem(item)}
                >
                  <Text style={styles.buttonText}>Place Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => {
                    setSelectedItem(item);
                    setScreen("Details");
                  }}
                >
                  <Text style={styles.exploreText}>Explore More</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );

  const DetailsScreen = () => {
    if (!selectedItem) return null;
    const relatedItems = menuItems.filter(
      (i) => i.course === selectedItem.course && i.id !== selectedItem.id
    );
    return (
      <ScrollView style={styles.screen}>
        {renderHeader()}
        <Text style={styles.pageTitle}>{selectedItem.name}</Text>
        <Text style={styles.detailText}>{selectedItem.description}</Text>
        <Text style={styles.cardPrice}>R{selectedItem.price.toFixed(2)}</Text>
        <Text style={styles.sectionHeading}>Other {selectedItem.course}s</Text>
        {relatedItems.map((i) => (
          <TouchableOpacity
            key={i.id}
            style={styles.relatedItem}
            onPress={() => setSelectedItem(i)}
          >
            <Text style={styles.relatedText}>{i.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() => setScreen("Menu")}
        >
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const DashboardScreen = () => (
    <View style={styles.screen}>
      {renderHeader()}
      <Text style={styles.pageTitle}>Chef Dashboard</Text>
      <Text style={styles.infoText}>Average Menu Price: R{averageMenuPrice}</Text>
      {["Starter", "Main", "Dessert"].map((course) => (
        <Text key={course} style={styles.infoText}>
          {course}s Average: R{averagePriceByCourse(course)}
        </Text>
      ))}
      <TouchableOpacity
        style={[styles.button, { marginTop: 30 }]}
        onPress={() => setScreen("Home")}
      >
        <Text style={styles.buttonText}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {screen === "Home" && <HomeScreen />}
      {screen === "Menu" && <MenuScreen />}
      {screen === "Details" && <DetailsScreen />}
      {screen === "Dashboard" && <DashboardScreen />}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f0",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b8860b",
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#b8860b",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#222",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b8860b",
    marginTop: 15,
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e0d5b9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  cardPrice: {
    fontSize: 16,
    color: "#b8860b",
    fontWeight: "bold",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  qtyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: 8,
    width: 60,
    height: 30,
  },
  orderButton: {
    backgroundColor: "#222",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  exploreButton: {
    alignItems: "center",
    paddingVertical: 6,
  },
  exploreText: {
    color: "#b8860b",
    fontWeight: "500",
  },
  relatedItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: "#eee",
    borderWidth: 1,
  },
  relatedText: {
    color: "#444",
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
});
