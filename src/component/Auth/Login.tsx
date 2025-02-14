import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TextInput, TouchableOpacity, View, Image, Alert } from "react-native";
import tailwind from "twrnc";
import {API_AUTH} from '@env';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
 
  async function handleLogin(){
    try{
      const form = {email,password};
      const url = `${API_AUTH}/user/signin`;
      console.log(url);
      console.log(form);
      let response = await axios.post(url,form);
      
      console.log(response?.data);
      const token = response?.data?.token;
      
    if (token) {
      await AsyncStorage.setItem('authToken', token);
      navigation.navigate('Home');
      console.log('Token stored successfully');
    } else {
      console.log('No token received');
    }
    }catch(error){
      console.log(error.response);
      // console.log(error?.response?.data);
    }
  }
  return (
    <View style={tailwind`flex-1 bg-gradient-to-b from-blue-100 to-blue-200 px-6`}>
      <View style={tailwind`items-center mt-4`}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTETglZQOWx5pVIdX_8G0opMFoFLSupZBFQ1Q&s" }} // Replace with your logo URL
          style={tailwind`w-24 h-24`}
          resizeMode="contain"
        />
        <Text style={tailwind`text-6.8 font-bold text-blue-900 mt-4`}>Welcome Back!</Text>
        <Text style={tailwind`text-lg text-blue-700 mt-2`}>Login to your account</Text>
      </View>
      <View style={tailwind`mt-8`}>
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          style={tailwind`h-12 bg-white rounded-full pl-6 pr-4 shadow-md mb-4`}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          style={tailwind`h-12 bg-white rounded-full pl-6 pr-4 shadow-md`}
        />
        <TouchableOpacity
          onPress={() => Alert.alert("Forgot Password feature coming soon!")} // Replace with actual logic
          style={tailwind`mt-2 self-end`}
        >
          <Text style={tailwind`text-blue-600 font-semibold`}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleLogin} // Replace with actual logic
        style={tailwind`mt-5 bg-blue-600 py-4 rounded-full shadow-lg`}
      >
        <Text style={tailwind`text-white text-center text-lg font-semibold`}>Login</Text>
      </TouchableOpacity>
      <View style={tailwind`flex-row justify-center items-center mt-5`}>
        <Text style={tailwind`text-gray-700`}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={tailwind`text-blue-600 font-bold`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
