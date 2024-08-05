import { StyleSheet, Text, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useContext, useState } from 'react'
import { Colors } from '../../constants/styles';
import { AuthContext } from '../../Store/Auth-context';

const ModelDropDown = () => {
    const userCtx = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'GPT - 3.5 Turbo', value: 'gpt-3.5-turbo' },
        { label: 'GPT - 4o', value: 'gpt-4o' },
        { label: 'GPT - 4o mini', value: 'gpt-4o-mini' },
        { label: 'Claude', value: 'Claude', disabled: true },
    ]);
    const [value, setValue] = useState(items[0].value);
    const handleChnaged = (value) => {
        userCtx.setModelNameHandler(value)
    }
    return (

        <View style={{ flex: 1 }}>
            <View
                style={styles.root}>
                <DropDownPicker
                    style={styles.dropdown}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    containerStyle={styles.container}
                    textStyle={styles.text}
                    dropDownContainerStyle={styles.dropdownContainer}
                    arrowIconStyle={styles.arrowIcon}
                    listItemContainerStyle={styles.listItemContainer}
                    listItemLabelStyle={styles.listItemLabel}
                    tickIconStyle={styles.tickIcon}
                    onChangeValue={handleChnaged}
                />
            </View>
        </View>
    );
}

export default ModelDropDown;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginBottom: 15,
        marginLeft: 20
    },
    container: {
        height: 40,
    },
    dropdown: {
        backgroundColor: Colors.chatInput,
        borderRadius: 15,
        height: 40,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
    dropdownContainer: {
        backgroundColor: Colors.chatInput,
        borderRadius: 15,
    },
    arrowIcon: {
        tintColor: 'white',
    },
    listItemContainer: {
        height: 40,
    },
    listItemLabel: {
        color: 'white',
    },
    tickIcon: {
        tintColor: 'white',
    }
})