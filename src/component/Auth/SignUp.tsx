import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image, FlatList, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import tailwind from "twrnc";
import {API_AUTH} from '@env';

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  async function handleSignUp(){
    try{
      const form = {firstName,lastName,email,password}
      console.log(form);
      const url = `${API_AUTH}/user/signup`;
      let response  = await axios.post(url,form);
      if (response) {
        Alert.alert("Account Created!");
        navigation.navigate("Login");
      }
      console.log(response?.data);
    }catch(error){
      console.log(error.response);
    }
}
  return (
   <ScrollView>
     <View style={tailwind`flex-1 bg-gradient-to-b from-blue-100 to-blue-200 px-6`}>
      {/* Header Section */}
      <View style={tailwind`items-center mt-4`}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTETglZQOWx5pVIdX_8G0opMFoFLSupZBFQ1Q&s"}}
          style={tailwind`w-20 h-20`}
          resizeMode="contain"
        />
        <Text style={tailwind`text-6.8 font-bold text-blue-900 mt-4`}>Welcome to Ticketing!</Text>
        <Text style={tailwind`text-lg text-blue-700 mt-2`}>Sign up to get started</Text>
      </View>

      {/* Form Section */}
      <View style={tailwind`mt-9`}>
        <View style={tailwind`flex-row justify-between`}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={tailwind`flex-1 h-12 bg-white rounded-full pl-6 pr-4 shadow-md mr-2`}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={tailwind`flex-1 h-12 bg-white rounded-full pl-6 pr-4 shadow-md`}
          />
        </View>

        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          style={tailwind`h-12 bg-white rounded-full pl-6 pr-4 shadow-md mt-7`}
        />

        <View style={tailwind`relative mt-7`}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={tailwind`h-12 bg-white rounded-full pl-6 pr-12 shadow-md`}
          />
          <TouchableOpacity
            style={tailwind`absolute inset-y-0 right-0 flex justify-center pr-4`}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#4A4A4A" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tailwind`mt-10 bg-blue-600 py-4 rounded-full shadow-lg`}
          onPress={handleSignUp}
        >
          <Text style={tailwind`text-white text-center text-lg font-semibold`}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={tailwind`mt-3 items-center`}>
        <Text style={tailwind`text-gray-600`}>
          Already have an account?{" "}
          <Text style={tailwind`text-blue-600 font-semibold`} onPress={()=>{navigation.navigate('Login')}}>Login</Text>
        </Text>
      </View>
    </View>
   </ScrollView>
  );
}
