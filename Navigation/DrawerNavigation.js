import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/styles';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import DrawerPressedChat from '../components/DrawerPressedChat/DrawerPressedChat';
import IconButton from '../components/UI/IconButton';
import { AuthContext } from '../Store/Auth-context';
import ModelDropDown from '../components/UI/ModelDropDown';
import { getAllConversations } from '../util/DataBase/Functions';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const navigation = useNavigation();
    const authCtx = useContext(AuthContext);
    const [dataToday, setDataToday] = useState([]);
    const [dataYesterday, setDataYesterday] = useState([]);
    const [data7days, setData7days] = useState([]);
    useEffect(() => {
        const getChatHistory = async () => {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

            const response = await getAllConversations();
            const todayData = response
                .filter(item => item.date.split('T')[0] === today)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const yesterdayData = response
                .filter(item => item.date.split('T')[0] === yesterdayStr)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const sevenDaysData = response
                .filter(item => {
                    const itemDate = new Date(item.date).toISOString().split('T')[0];
                    return itemDate < yesterdayStr && itemDate >= sevenDaysAgoStr;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setDataToday(todayData);
            setDataYesterday(yesterdayData);
            setData7days(sevenDaysData);
        }
        getChatHistory();
    }, [authCtx.lastDocId]);
    const handlePress = (itemId) => {
        setSelectedItemId(itemId);
        const item = {
            id: itemId
        }
        // console.log("item", item);
        navigation.navigate('Home', item);
    };
    const logoutHandler = () => {
        authCtx.logout();
    }
    return (
        <Drawer.Navigator initialRouteName='Home' screenOptions={{
            drawerStyle: { backgroundColor: Colors.chatDrawer },
            headerTitle: () => <ModelDropDown />,
            headerTintColor: 'white',
            headerStyle: { backgroundColor: Colors.chatHome },
            headerRight: () => <IconButton icon={'chatbubble-ellipses'} color={"white"} size={24} onPress={() => {
                const item = {
                    id: 0
                }
                setSelectedItemId(null);
                navigation.navigate('Home', item);
            }} />,
        }}
            drawerContent={(props) => {
                return (
                    <>
                        <View style={styles.HeaderBrandName}>
                            <Text style={[styles.textHeader, { textAlign: 'center' }]}> Query Master</Text>
                        </View>
                        <DrawerContentScrollView {...props} style={styles.root}>
                            <View style={styles.HeaderToday}>
                                <Text style={styles.textHeader}>Today</Text>
                                {dataToday.length > 0 && dataToday.map((item) =>
                                    <DrawerPressedChat
                                        item={item}
                                        handlePress={handlePress}
                                        selectedItemId={selectedItemId}
                                        key={item.conversationId}
                                    />
                                )}
                            </View>
                            <View style={styles.HeaderYesterday}>
                                <Text style={styles.textHeader}>Yesterday</Text>
                                {dataYesterday.length > 0 && dataYesterday.map((item) =>
                                    <DrawerPressedChat
                                        item={item}
                                        handlePress={handlePress}
                                        selectedItemId={selectedItemId}
                                        key={item.conversationId}
                                    />
                                )}
                            </View>
                            <View style={styles.Header7Days}>
                                <Text style={styles.textHeader}>Previous 7 days</Text>
                                {data7days.length > 0 && data7days.map((item) =>
                                    <DrawerPressedChat
                                        item={item}
                                        handlePress={handlePress}
                                        selectedItemId={selectedItemId}
                                        key={item.conversationId}
                                    />
                                )}
                            </View>
                        </DrawerContentScrollView>
                        <View style={styles.User}>
                            <IconButton icon={'person-circle-sharp'} color={"white"} size={24} onPress={() => { }} />
                            <Text style={styles.textLogout}>Sahan R Inc.</Text>
                            <IconButton icon={'log-out'} color={"white"} size={24} onPress={logoutHandler} />
                        </View>
                    </>
                )
            }}>
            <Drawer.Screen name="Home" component={HomeScreen} />

        </Drawer.Navigator>
    )
}

export default DrawerNavigation;

const styles = StyleSheet.create({
    root: {
        minWidth: '80%',
        paddingHorizontal: 18,
    },
    HeaderBrandName: {
        marginTop: 30,
        marginHorizontal: 18,
        paddingVertical: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#484848',
        borderRadius: 5,
    },
    HeaderToday: {
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#484848',
        borderRadius: 5
    },
    HeaderYesterday: {
        paddingVertical: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#484848',
        borderRadius: 5
    },
    Header7Days: {
        paddingVertical: 10,
    },
    User: {
        paddingVertical: 20,
        marginHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textHeader: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16
    },
    textLogout: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
        paddingTop: 5,
        marginRight: 70,
        marginLeft: 10
    },
});