import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tailwind from "twrnc";
import Ic from 'react-native-vector-icons/AntDesign';
import Home from "./src/component/HomeScreen/Home";
import Login from "./src/component/Auth/Login";
import SignUp from "./src/component/Auth/SignUp";
import Details from "./src/component/HomeScreen/Details";
import Payment from "./src/component/HomeScreen/Payment";
import Profile from "./src/component/HomeScreen/Profile";
import CreateTicket from "./src/Data/CreateTicket";
import MyTicket from "./src/Data/MyTicket";
import Booking from "./src/component/HomeScreen/Booking";
import AddedDetail from "./src/Data/AddedDetail";

const Stack = createStackNavigator();
export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="Details" component={Details} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
        <Stack.Screen name="CreateTicket" component={CreateTicket} options={{headerShown:false}}/>
        <Stack.Screen name="MyTicket" component={MyTicket} options={{headerShown:false}}/>
        <Stack.Screen name="Booking" component={Booking} options={{headerShown:true}}/>
        <Stack.Screen name="Added" component={AddedDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}