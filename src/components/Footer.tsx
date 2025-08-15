import React, { JSX, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Footer = ({ navigation }: any): JSX.Element => {

    const [selectedItem, setSelectedItem] = useState<string>('')
    const route = useRoute()

    useEffect(() => {
        const routeName = route.name
        switch (routeName) {
            case 'HomeScreen':
                setSelectedItem('Home')
                break
            case 'AddExpenseScreen':
                setSelectedItem('Expense')
                break
            case 'TransactionHistoryScreen':
                setSelectedItem('Transaction')
                break
            default:
                setSelectedItem('')
        }
    }, [route, selectedItem])

    const DATA = [
        { id: 0, Title: "Home", Screen: "HomeScreen" },
        { id: 1, Title: "Expense", Screen: "AddExpenseScreen" },
        { id: 2, Title: "Transaction", Screen: "TransactionHistoryScreen" }
    ]

    const RenderItem = ({ item }: { item: any }) => {
        const isSelected = selectedItem == item.Title
        return (
            <TouchableOpacity style={[
                styles.footerItem,
                isSelected && styles.selectedItem
            ]} onPress={() => {
                setSelectedItem(item.Title)
                if (item.Screen) navigation.navigate(item.Screen)
            }}>
                <View style={{}}>
                    <Text style={styles.itemText}>{item.Title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.footer}>
            <FlatList
                horizontal
                data={DATA}
                renderItem={RenderItem}
                contentContainerStyle={styles.footerList}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 50,
        elevation: 10,
        marginHorizontal: 10,
        marginBottom: 15,
        height: 50,
        justifyContent: 'center',
    },
    footerList: {
        justifyContent: 'space-around',
        flexGrow: 1,
    },
    footerItem: {
        paddingHorizontal: 15,
        // paddingVertical: 13,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: 'transparent',
    },
    selectedItem: {
        backgroundColor: 'silver',
    },
    itemText: {
        fontSize: 16,
        color: 'black',
        fontWeight: '500',
    }
})

export default Footer
