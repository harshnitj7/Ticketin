import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tailwind from "twrnc";
import tw from "twrnc"; // Import twrnc

export default function Profile() {
  const navigation = useNavigation();
  async function handleLogout(){
    try{
      await AsyncStorage.removeItem("authToken");
      navigation.navigate('Home');
    } catch(error){
      console.log(error);
    }
  }
  useEffect(()=>{
    const backAction = () => {
      navigation.navigate("Home"); 
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  },[])
  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      {/* Profile Header */}
      <View style={tw`items-center mb-8`}>
        <Icon name="user-circle" size={80} color="#4F8EF7" />
        <Text style={tw`text-2xl font-bold mt-2 text-gray-800`}>Hello Kallol!</Text>
      </View>

      {/* Create A Ticket Button */}
      <TouchableOpacity style={tw`flex-row items-center bg-white p-4 rounded-lg mb-4 shadow-sm`}
      onPress={()=>{navigation.navigate('CreateTicket')}}
      >
        <Icon name="plus-square" size={24} color="#4F8EF7" />
        <Text style={tw`ml-3 text-lg text-gray-800`}>Create A Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex-row items-center bg-white p-4 rounded-lg mb-4 shadow-sm`}
      onPress={()=>{navigation.navigate('Booking')}}
      >
        <Icon name="bookmark" size={24} color={"#4F8EF7"}/>
        <Text style={tw`ml-3 text-lg text-gray-800`}>My Booking</Text>
      </TouchableOpacity>

      {/* My Tickets Button */}
      <TouchableOpacity style={tw`flex-row items-center bg-white p-4 rounded-lg mb-4 shadow-sm`}
      onPress={()=>{navigation.navigate('MyTicket')}}
      >
        <Icon name="ticket" size={24} color="#4F8EF7" />
        <Text style={tw`ml-3 text-lg text-gray-800`}>My Tickets</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={tw`flex-row items-center bg-white p-4 rounded-lg shadow-sm`} onPress={handleLogout}>
        <Icon name="sign-out" size={24} color="#FF3B30" />
        <Text style={tw`ml-3 text-lg text-red-600`}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}