import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { deleteExpense as deleteExpenseRedux } from '../store/slices/expenseSlice'
import { deleteExpense as deleteExpenseSQLite } from '../db/db'
import Footer from '../components/Footer'
import SwipeableTransactionItem from './SwipeTransaction'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/screen'
import { Expense } from '../types/expense'

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionHistoryScreen'>

export default function TransactionHistoryScreen({ navigation }: Props) {

    const dispatch = useDispatch<AppDispatch>()
    const transactions = useSelector((state: RootState) => state.expenses.transactions)
    const [search, setSearch] = useState('')

    const filtered = transactions.filter((txn: Expense) =>
        txn.category.toLowerCase().includes(search.toLowerCase()) ||
        txn.notes.toLowerCase().includes(search.toLowerCase()) ||
        txn.type.toLowerCase().includes(search.toLowerCase()) ||
        txn.date.includes(search)
    )

    const handleDelete = (id: string) => {
        dispatch(deleteExpenseRedux(id))
        deleteExpenseSQLite(id)
    }

    return (
        <View style={styles.container} >
            <Text style={styles.header}>All Transaction</Text>

            <TextInput
                placeholder="Search by category, note, or date"
                placeholderTextColor={"grey"}
                style={styles.input}
                value={search}
                onChangeText={setSearch}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: Expense }) => {
                    return (
                        <SwipeableTransactionItem
                            item={item}
                            onDelete={handleDelete}
                            onEdit={(id: any) => alert(`Edit ${id}`)}
                        />
                    )
                }}
            />

            <Footer navigation={navigation} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: {
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', marginTop: 20 },
})