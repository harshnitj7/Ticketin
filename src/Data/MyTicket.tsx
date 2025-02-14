import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, FlatList, TouchableOpacity, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import tailwind from "twrnc";
import { API_TICKET } from "@env";

export default function MyTicket({ navigation }:any) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) {
          setError("No authentication token found.");
          return;
        }

        const response = await axios.get(`${API_TICKET}/tickets/created-by-user`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setTickets(response.data.tickets);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError("Failed to fetch tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
    const backAction = () => {
      navigation.navigate("Profile"); // Navigate to the Profile screen
      return true; // Prevent the default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); 
  }, []);

  

  if (loading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center bg-gray-100`}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={tailwind`text-gray-600 mt-2`}>Loading your tickets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tailwind`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tailwind`text-red-500 text-lg`}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={tailwind`flex-1 bg-gray-100 p-4`}>
      <Text style={tailwind`text-2xl font-bold text-gray-800 mb-4`}>My Tickets</Text>
      {tickets.length === 0 ? (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <Text style={tailwind`text-lg text-gray-500`}>No Ticket Added</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Added", {
                  image: item.image.url, // Replace with the correct property
                  name: item.title, // Replace with the correct property
                  orderId: item.order_id, // Replace with the correct property
                })
              }
            >
              <View
                style={tailwind`bg-white p-4 rounded-lg shadow-md mb-4 flex-row items-center`}
              >
                <Icon name="ticket" size={24} style={tailwind`text-blue-500 mr-4`} />
                <Text style={tailwind`text-lg font-semibold text-gray-800`}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
