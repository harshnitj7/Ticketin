import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity, Modal, Alert, BackHandler } from "react-native";
import { API_ORDER, API_PAY } from "@env";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import tailwind from "twrnc";
import { Order } from "../../interfaces/order";
import RazorpayCheckout from "react-native-razorpay";
import { useNavigation } from "@react-navigation/native";

export default function Booking() {
  const [orders, setOrders] = useState([]); // State to store the orders
  const [loading, setLoading] = useState(true); // State to show loading status
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, SetOrderId] = useState("");
  const [razorpay, SetRazorId] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${API_ORDER}/orders/created-by-user`;
        const authToken = await AsyncStorage.getItem("authToken");

        if (!authToken) {
          console.log("No authToken found!");
          setLoading(false);
          return;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response?.data);
        setOrders(response?.data.orders || []); // Set the orders data
        setLoading(false); // Stop the loading indicator
      } catch (error) {
        console.log(error.response);
        setLoading(false);
      }
    }

    fetchData();
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
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <ActivityIndicator size="large" color="#4B5563" />
        <Text style={tw`text-lg text-gray-500 mt-2`}>Loading...</Text>
      </View>
    );
  }
  async function handleContinuePayment(_id: any) {
    console.log(_id);
    SetOrderId(_id);
    console.log(orderId);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const url = `http://192.168.0.104:3003/v1/api/payment/${_id}/checkout`;
      const response = await axios.post(url, { _id }, {
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
        amount: 1 * 100,
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
          await verifyPayment(data.razorpay_payment_id, _id);
          setModalVisible(false);
        })
        .catch((error: any) => {
          Alert.alert('Error occurred');
          // navigation.navigate('Booking');
        });
    } catch (error) {
      console.error("Error in handlePayment:", error.response || error);
    }
  }
  async function Cancel(id:any) {
    try{
      const authToken = await await AsyncStorage.getItem("authToken");
      console.log(authToken);
      if (!authToken) {
        console.error("Auth token is not available!");
        return;
      }
      const url = `${API_ORDER}/orders/${id}/cancel`;
      let response = await axios.post(
        url, 
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if(response){
        Alert.alert("Order Canceled!");
      }
      console.log("Response Data:", response?.data);
    }catch(error){
      console.log(error.response);
    }
  }
  async function verifyPayment(paymentId: string, orderID: string) {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const url = `${API_PAY}/payment/${orderID}/verify-payment`;
      console.log(orderID);
      console.log(url);
      let response = await axios.post(url, { orderID }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Payment verified successfully:", response?.data);
      if (response) {
        Alert.alert("Ticket Booked!");
        //   navigation.navigate('Home');
      }
    } catch (error) {
      console.log("Error verifying payment:", error.response);
      Alert.alert("Payment Verification Failed", "Please contact support.");
    }
  }
  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Booking Page</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item, index) =>
            item.ticket_id?._id ? `${item.ticket_id._id}-${index}` : index.toString()
          }
          renderItem={({ item }) => (
            <View style={tw`bg-white rounded-lg p-4 mb-4 shadow`}>
              <Text
                style={tw`font-medium ${item.status === "Completed" ? "text-green-600" : "text-red-500"
                  }`}
              >
                Status: {item.status}
              </Text>
              <Text style={tw`text-gray-600`}>
                Ticket Title: {item.ticket_id?.title || "N/A"}
              </Text>
              <Text style={tw`text-gray-600`}>
                Ticket ID: {item.ticket_id?._id || "N/A"}
              </Text>
              <Text style={tw`text-gray-600`}>
                Ticket Price: {item.ticket_price || "N/A"}
              </Text>
              {/* Render Continue Payment button if status is Awaiting Payment */}
              {item.status === "Awaiting payment" && (
                <View style={tw`mt-4 flex-row justify-between`}>
                  <TouchableOpacity
                    style={tw`flex-1 bg-blue-500 p-3 rounded-lg mr-2`}
                    onPress={() => handleContinuePayment(item._id)}
                  >
                    <Text style={tw`text-white text-center font-bold`}>
                      Pay
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`flex-1 bg-red-500 p-3 rounded-lg ml-2`}
                    onPress={()=>{Cancel(item._id)}}
                  >
                    <Text style={tw`text-white text-center font-bold`}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>
          )}
        />
      ) : (
        <Text style={tw`text-gray-500 text-center mt-4`}>No orders found.</Text>
      )}

    </View>
  );
}

// Function to handle Continue Payment button press

