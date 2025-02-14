import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // React Native Vector Icons
import tailwind from "twrnc";
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Order } from "../../interfaces/order";
import {API_ORDER,API_PAY} from "@env";
export default function DetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { item }: any = route.params; // Get the item passed from the Home screen
  const [orderId, SetOrderId] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [razorpayorder,SetRazorId] = useState("");
  const fetchAuthToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error fetching auth token:", error);
      throw error;
    }
  };
  async function handleCancel(){
    setModalVisible(false);
    try{
      const authToken = await fetchAuthToken();
      console.log(authToken);
      if (!authToken) {
        console.error("Auth token is not available!");
        return;
      }
      const url = `${API_ORDER}/orders/${orderId}/cancel`;
      let response = await axios.post(
        url, 
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Response Data:", response?.data);
    }catch(error){
      console.log(error.response);
    }
  }
  async function handlebooking() {
    try {
      const authToken = await fetchAuthToken();
      console.log(authToken);
      const ticketId = item._id;
      // console.log(form);
      console.log(ticketId)
      const url = `${API_ORDER}/orders/create`;
      let response = await axios.post(url, { ticketId }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response?.data);
      const order = response.data.newOrder as Order;
      SetOrderId(order._id);
      console.log(order._id);
      setModalVisible(true);
    } catch (error) {
      console.log(error.response);
    }
  }
  async function verifyPayment(paymentId: string) {
    try {
        const authToken = await AsyncStorage.getItem("authToken");
        const url = `${API_PAY}/payment/${orderId}/verify-payment`;
        let response = await axios.post(url, { orderId }, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log("Payment verified successfully:", response?.data);
        if (response) {
          Alert.alert("Ticket Booked!");
          navigation.navigate('Booking');
        }
    } catch (error) {
        console.error("Error verifying payment:", error.response || error);
        Alert.alert("Payment Verification Failed", "Please contact support.");
    }
}

  async function handlePayment() {
    try {
        const authToken = await fetchAuthToken();
        const url = `http://192.168.0.104:3003/v1/api/payment/${orderId}/checkout`;
        const response = await axios.post(url, { orderId }, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        const rzpOrderId = response.data.order.rzp_order_id;
        SetRazorId(rzpOrderId);

        // Open Razorpay only after the order ID is set
        const options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: 'rzp_test_lNMFpTdzymdSFT',
            amount: item.price * 100,
            name: "kallol",
            order_id: rzpOrderId, // Pass the correct order_id
            prefill: {
                email: 'gaurav.kumar@example.com',
                contact: '9191919191',
                name: 'Gaurav Kumar',
            },
            theme: { color: '#53a20e' },
        };

        console.log(options);

        RazorpayCheckout.open(options)
            .then(async (data: any) => {
                console.log(data.razorpay_payment_id);
                await verifyPayment(data.razorpay_payment_id);
                setModalVisible(false);
            })
            .catch((error: any) => {
                Alert.alert('Error occurred');
                navigation.navigate('Booking');
            });
    } catch (error) {
        console.error("Error in handlePayment:", error.response || error);
    }
}

  

  return (
    <View style={tailwind`flex-1 bg-gray-50`}>
      {/* Scrollable Content */}
      <ScrollView>
        {/* Header */}
        <View style={tailwind`relative`}>
          <Image
            source={{ uri: item.image.url}}
            style={tailwind`w-full h-72`}
            resizeMode="cover"
          />
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tailwind`absolute top-6 left-6 bg-black/50 p-3 rounded-full`}
          >
            <Icon name="arrow-back" size={24} style={tailwind`text-white`} />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={tailwind`p-6 bg-white rounded-t-2xl -mt-12 shadow-lg`}>
          {/* Title and Location in Same Row */}
          <View style={tailwind`flex-row justify-between items-center mb-4`}>
            <Text style={tailwind`text-2xl font-semibold text-gray-800`}>{item.title}</Text>

            <View style={tailwind`flex-row items-center`}>
              <Icon name="location-sharp" size={20} style={tailwind`text-gray-700 mr-2`} />
              <Text style={tailwind`text-sm text-gray-600`}>{item.location}</Text>
            </View>
          </View>
          {/* Price */}
          <Text style={tailwind`text-2xl font-bold text-green-600 mb-4`}>
            ₹ {item.price}
          </Text>

          {/* Description */}
          <Text style={tailwind`text-lg font-semibold text-gray-800 mb-3`}>Description:</Text>
          <Text style={tailwind`text-base text-gray-600 mb-6 leading-relaxed`}>
            {item.description || "No description available for this event."}
          </Text>

          {/* Date and Time */}
          <View style={tailwind`mb-6`}>
            <Text style={tailwind`text-lg font-semibold text-gray-800`}>Date:</Text>
            <Text style={tailwind`text-sm text-gray-600`}>{item.date || "N/A"}</Text>
          </View>
          <View style={tailwind`mb-6`}>
            <Text style={tailwind`text-lg font-semibold text-gray-800`}>Time:</Text>
            <Text style={tailwind`text-sm text-gray-600`}>{item.time || "N/A"}</Text>
          </View>
          {/* Venue Info */}
          <View style={tailwind`mb-6`}>
            <Text style={tailwind`text-lg font-semibold text-gray-800`}>Venue:</Text>
            <Text style={tailwind`text-sm text-gray-600`}>{item.location || "N/A"}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={tailwind`p-6 bg-white shadow-2xl`}>
        <TouchableOpacity
          onPress={handlebooking} // Show modal on button press
          style={tailwind`bg-blue-600 rounded-xl py-3`}
        >
          <Text style={tailwind`text-center text-white font-semibold text-lg`}>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tailwind`flex-1 justify-center items-center bg-black/50`}>
          <View style={tailwind`bg-white p-8 rounded-lg w-80 shadow-lg`}>
            <Text style={tailwind`text-2xl font-bold text-gray-800 mb-4`}>
              Confirm Payment
            </Text>
            <Text style={tailwind`text-base text-gray-600 mb-6`}>
              Do you want to proceed with the payment?
            </Text>
            <View style={tailwind`flex-row justify-between`}>
              <TouchableOpacity
                onPress={handleCancel} // Close modal on cancel
                style={tailwind`bg-gray-300 rounded-xl px-6 py-2`}
              >
                <Text style={tailwind`text-gray-800 font-semibold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePayment} // Call payment function
                style={tailwind`bg-blue-600 rounded-xl px-6 py-2`}
              >
                <Text style={tailwind`text-white font-semibold`}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
