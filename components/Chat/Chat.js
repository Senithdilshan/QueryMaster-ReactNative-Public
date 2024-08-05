import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/styles';
import IconButton from '../UI/IconButton';

const Chat = ({ item }) => {
    return (
        <View style={{ padding: 10 }}>
            {item.isAi ?
                <View style={[styles.chat, { alignItems: 'flex-start', marginRight: 50 }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <IconButton icon={'bulb'} color={"white"} size={24} onPress={() => { }} />
                        <Text style={styles.text}>{item.message}</Text>
                    </View>
                </View>
                :
                <View style={[styles.chat, {
                    alignItems: 'flex-end',
                    marginLeft: item.message.length < 8 ? '80%'
                        : item.message.length < 15 ? '60%'
                            : item.message.length < 26 ? '30%' : 50
                }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.text, { backgroundColor: Colors.chatInput }]}>{item.message}</Text>
                    </View>
                    {item.document != null &&
                        <View style={styles.attachmentContainer}>
                            <IconButton icon={'document'} color={"white"} size={24} onPress={() => { }} />
                            <Text style={styles.attachmentText}>{item.document.name}</Text>
                        </View>
                    }
                </View>}
        </View>
    )
}

export default Chat;

const styles = StyleSheet.create({
    chat: {
    },
    text: {
        color: "white",
        borderRadius: 20,
        padding: 10,
    },
    attachmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#aca8a8',
        borderRadius: 30,
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    attachmentText: {
        color: 'white',
    },
})