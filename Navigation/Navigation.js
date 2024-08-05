import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { AuthContext } from '../Store/Auth-context';
import AuthenticatedStack from './AuthenticatedStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const Navigation = () => {
    const [isTryingLogin, setIsTryingLogin] = useState(true);
    const authCtx = useContext(AuthContext);
    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                authCtx.authenticate(storedToken)
            }

            setIsTryingLogin(false);
            await SplashScreen.hideAsync();
        }
        fetchToken();
    }, []);
    if (isTryingLogin) {
        return null;
    }
    return (
        <NavigationContainer>
            {!authCtx.isAuthenicatied ? <AuthStack /> : <AuthenticatedStack />}
        </NavigationContainer>
    );
}

export default Navigation;