import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { Colors } from '../constants/styles';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.chatHome },
                contentStyle: { backgroundColor: Colors.chatDrawer },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerTitle: () => <View style={{ flex: 1, alignItems: 'center', marginRight: 25 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Login</Text>
                </View>
            }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{
                headerTitle: () => <View style={{ flex: 1, alignItems: 'center', marginRight: 25 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Signup</Text>
                </View>
            }} />
        </Stack.Navigator>
    );
}

export default AuthStack;