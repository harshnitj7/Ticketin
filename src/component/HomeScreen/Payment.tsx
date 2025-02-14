import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import RazorpayCheckout from 'react-native-razorpay';
export default function Payment(){
    let razorpaykeyid = 'abc';
    const handlePayment=()=>{
        const options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: 'rzp_test_lNMFpTdzymdSFT',
            amount: 5000,
            name: 'Acme Corp',
            order_id: 'order_PjCZffB6cs54Vk',//Replace this with an order_id created using Orders API.
            prefill: {
              email: 'gaurav.kumar@example.com',
              contact: '9191919191',
              name: 'Gaurav Kumar'
            },
            theme: {color: '#53a20e'}
          }
          RazorpayCheckout.open(options).then((data:any) => {
            // handle success
            Alert.alert(`Success: ${data.razorpay_payment_id}`);
          }).catch((error:any) => {
            // handle failure
            Alert.alert('Error occured');
          });
        }
      
    return(
        <View>
          <TouchableOpacity onPress={handlePayment}>
            <Text>PAY NOW</Text>
            </TouchableOpacity>
        </View>
    )
}
