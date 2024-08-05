import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DrawerPressedChat = ({ item, handlePress, selectedItemId }) => {
    return (
        <Pressable key={item.conversationId}
            onPress={() => {
                handlePress(item.conversationId)
            }}
            style={[styles.pressable, selectedItemId === item.conversationId && styles.pressableClicked]} >
            <Text style={styles.text}>{item.conversationTitle}</Text>
        </Pressable>
    )
}

export default DrawerPressedChat

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 5,
    },
    pressableClicked: {
        backgroundColor: "#3f3b3b",
        color: 'white',
    },
    text: {
        marginLeft: 15,
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 5
    }
})

