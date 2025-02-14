import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import tailwind from "twrnc";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_TICKET} from '@env';
import { useNavigation } from "@react-navigation/native";
export default function CreateTicket() {
  const navigation = useNavigation();
  const [title, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price,setPrice] = useState("");['=[[=l']
  const [imageFile, setImageFile] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
async function handleSubmit() {
  if (!title || !description || !price || !location || !date || !time || !imageFile) {
    console.log("Please fill all fields and select an image.");
    return;
  }

  try {
    // Retrieve auth token from AsyncStorage
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token found");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("image", {
      uri: imageFile.uri,
      name: "ticket_image.jpg", // Cloudinary will rename it
      type: imageFile.type || "image/jpeg", // Ensure correct MIME type
    });
    // console.log(formData);
    const url = `${API_TICKET}/tickets/create`;
    console.log(token);
    let response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, 
      },
    });
    if (response) {
      Alert.alert("Ticket Created!");
      navigation.navigate('MyTicket');
    }
    console.log("Server Response:", response?.data);
  } catch (error) {
     console.log(error.response);
  }
}

  // Handle Image Selection
  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageFile(response.assets[0]);
        }
      }
    );
  };

  // Handle Date Selection
  const handleConfirmDate = (selectedDate: Date) => {
    setDate(selectedDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    setDatePickerVisible(false);
  };

  // Handle Time Selection
  const handleConfirmTime = (selectedTime: Date) => {
    let hours = selectedTime.getHours();
    let minutes = selectedTime.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setTime(formattedTime);
    setTimePickerVisible(false);
  };

  return (
   <ScrollView>
     <View style={tailwind`flex-1 bg-gray-100 p-4`}>
      {/* Header */}
      <Text style={tailwind`text-2xl font-bold text-center text-gray-800 mb-4`}>
        Create Ticket
      </Text>

      {/* Event Title */}
      <TextInput
        style={tailwind`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
        placeholder="Event Title"
        value={title}
        onChangeText={setEventTitle}
      />

      {/* Description */}
      <TextInput
        style={tailwind`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Date Picker */}
      <TouchableOpacity
        style={tailwind`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
        onPress={() => setDatePickerVisible(true)}
      >
        <Text style={tailwind`text-gray-500`}>
          {date ? `Date: ${date}` : "Select Date"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />

      {/* Time Picker */}
      <TouchableOpacity
        style={tailwind`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
        onPress={() => setTimePickerVisible(true)}
      >
        <Text style={tailwind`text-gray-500`}>
          {time ? `Time: ${time}` : "Select Time"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        is24Hour={false}
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisible(false)}
      />
      <TextInput
        style={tailwind`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
      />
      {/* Location */}
      <TextInput
        style={tailwind`border border-gray-300 rounded-lg p-3 mb-4 bg-white`}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      {/* Image Upload */}
      <TouchableOpacity
        style={tailwind`flex-row items-center justify-center bg-blue-500 rounded-lg p-3 mb-4`}
        onPress={pickImage}
      >
        <Icon name="image-outline" size={24} color="white" />
        <Text style={tailwind`text-white font-bold ml-2`}>
          {imageFile ? "Image Selected" : "Upload Ticket Image"}
        </Text>
      </TouchableOpacity>

      {/* Show Selected Image */}
      {imageFile && (
        <Image
          source={{ uri: imageFile.uri }}
          style={tailwind`w-full h-40 rounded-lg mb-4`}
          resizeMode="cover"
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={tailwind`bg-green-500 rounded-lg p-3`} 
      onPress={handleSubmit}
      >
        <Text style={tailwind`text-white text-center font-bold`}>Create Ticket</Text>
      </TouchableOpacity>
    </View>
   </ScrollView>
  );
}
