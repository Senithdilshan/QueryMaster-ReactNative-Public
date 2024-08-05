import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import DrawerNavigation from './DrawerNavigation';
const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeDrawer" component={DrawerNavigation} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default AuthenticatedStack;