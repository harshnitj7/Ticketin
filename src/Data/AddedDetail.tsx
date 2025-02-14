import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, Image } from "react-native";
import tailwind from "twrnc";

export default function AddedDetail() {
  const route = useRoute();
  const { image, name, orderId }: any = route.params;

  return (
    <View style={tailwind`flex-1 bg-gray-100 p-4`}>
      <Text style={tailwind`text-2xl font-bold text-gray-800 mb-4`}>Ticket Details</Text>
      <Image
        source={{ uri: image }}
        style={tailwind`w-full h-64 rounded-lg mb-4`}
        resizeMode="cover"
      />
      <Text style={tailwind`text-lg text-gray-800`}>Name: {name}</Text>
      <Text style={tailwind`text-lg text-gray-800`}>Order ID: {orderId || "N/A"}</Text>

      {/* Conditional Text Based on orderId */}
      <Text style={tailwind`text-lg mt-4 font-semibold ${
        orderId ? "text-green-600" : "text-red-600"
      }`}>
        {orderId ? "Ticket is Booked" : "Not Booked Yet"}
      </Text>
    </View>
  );
}
