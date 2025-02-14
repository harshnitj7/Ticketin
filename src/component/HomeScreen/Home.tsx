import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tailwind from "twrnc";
import axios from "axios";
import { Ticket } from "../../interfaces/ticket";
import { API_TICKET } from "@env";

export default function Home() {
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("TICKET" + API_TICKET);

  // Fetch token from AsyncStorage when the component mounts
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        setToken(storedToken);
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    checkToken();
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setError(null); // Clear any previous error
      const response = await axios.get(`${API_TICKET}/tickets/available-tickets`);
      setTickets(response.data.tickets); // Assuming response contains { tickets: [...] }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refresh indicator
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle Profile Icon Click
  const handleProfileNavigation = () => {
    if (token) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Show the refresh indicator
    await fetchTickets(); // Fetch tickets again
  };

  return (
    <View style={tailwind`flex-1 bg-gray-100`}>
      {/* Header Section */}
      <View style={tailwind`flex-row items-center justify-between px-4 py-3 bg-gray-500 shadow-md`}>
        {/* Title */}
        <Text style={tailwind`text-2xl font-extrabold text-white`}>🎟 Event Tickets</Text>
  
        {/* Profile Icon */}
        <TouchableOpacity onPress={handleProfileNavigation}>
          <Icon name="person-circle-outline" size={32} style={tailwind`text-white`} />
        </TouchableOpacity>
      </View>
  
      {/* Loading Indicator */}
      {loading ? (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={tailwind`text-gray-600 mt-2`}>Loading events...</Text>
        </View>
      ) : error ? (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <Text style={tailwind`text-red-500 text-lg`}>{error}</Text>
        </View>
      ) : tickets.length === 0 ? (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <Text style={tailwind`text-gray-600 text-lg`}>No tickets available.</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item: Ticket) => item._id.toString()}
          contentContainerStyle={tailwind`p-4`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tailwind`bg-white rounded-lg shadow-md mb-4 overflow-hidden`}
              onPress={() => navigation.navigate("Details", { item })}
            >
              {/* Ticket Image */}
              <Image source={{ uri: item.image.url }} style={tailwind`w-full h-48`} resizeMode="cover" />
  
              {/* Ticket Content */}
              <View style={tailwind`p-4`}>
                {/* Title */}
                <View style={tailwind`flex-row justify-between items-center mb-2`}>
                  <Text style={tailwind`text-lg font-bold text-gray-800 flex-1`}>{item.title}</Text>
                </View>
  
                {/* Price */}
                <Text style={tailwind`text-base font-semibold text-green-600`}>₹ {item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4CAF50" />
          }
        />
      )}
    </View>
  );
}
