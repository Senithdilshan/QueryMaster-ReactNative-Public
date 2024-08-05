import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext({
    token: '',
    userId: '',
    lastDocId: '',
    isAuthenicatied: false,
    modelName: 'gpt-3.5-turbo',
    setLastDocIdHandler: () => { },
    setModelNameHandler: () => { },
    authenticate: () => { },
    logout: () => { },
})

const AuthContextProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState();
    const [userId, setUserId] = useState();
    const [lastDocId, setLastDocId] = useState();
    const [modelName, setModelName] = useState('gpt-3.5-turbo');

    const setLastDocIdHandler = (lastDocId) => {
        setLastDocId(lastDocId);
    }

    const setModelNameHandler = (modelName) => {
        setModelName(modelName);
    }
    const authenticate = async (token, userId) => {
        setAuthToken(token);
        setUserId(userId);
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', userId);
        } catch (error) {
            console.error('Failed to save the data to the storage', error);
        }
    }
    const logout = async () => {
        setAuthToken(null);
        setAuthToken(null);
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
        } catch (error) {
            console.error('Failed to remove the data from the storage', error);
        }
    }
    const value = {
        token: authToken,
        userId: userId,
        lastDocId: lastDocId,
        isAuthenicatied: !!authToken,
        modelName: modelName,
        setLastDocIdHandler: setLastDocIdHandler,
        setModelNameHandler: setModelNameHandler,
        authenticate: authenticate,
        logout: logout
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;