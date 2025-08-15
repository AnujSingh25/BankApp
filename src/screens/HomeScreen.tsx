import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import Footer from '../components/Footer'
import { PieChart } from 'react-native-svg-charts'
import { Text as SVGText } from 'react-native-svg'
import moment from 'moment'
import { fetchAllExpenses, getLastFiveExpenses } from '../db/db'
import { useFocusEffect } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/screen'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Expense } from '../types/expense'

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>

export default function HomeScreen({ navigation }: Props) {

    const [data, setData] = useState<any[]>([])

    const [pieData, setPieData] = useState<Expense[]>([])
    const [totalBalance, setTotalBalance] = useState<number>(0)
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0)

    useFocusEffect(
        useCallback(() => {
            getLastTransactions()
            getBalance()
        }, [])
    )

    const getLastTransactions = async () => {
        try {
            const transactions = await getLastFiveExpenses()
            const categoryData: Record<string, number> = {}
            const debitData: Expense[] = []

            transactions.forEach((txn: any) => {
                if (txn && txn.type === 'debit') {
                    const category = txn.category?.trim().toLowerCase() || 'N/A'
                    const amount = parseFloat(txn.amount)
                    if (!isNaN(amount) && amount > 0) {
                        categoryData[category] = (categoryData[category] || 0) + amount
                        debitData.push(txn)
                    }
                }
            })

            const colors = ['red', 'blue', 'yellow', 'green', 'pink', 'violet', 'teal']

            const pieRes: any = Object.entries(categoryData).map(([key, value], index) => ({
                key,
                value,
                svg: { fill: colors[index % colors.length] },
                arc: { outerRadius: '100%', cornerRadius: 4 },
                label: key.charAt(0).toUpperCase() + key.slice(1)
            }))

            setData(debitData)
            setPieData(pieRes)
        } catch (error) {
            console.log("error-->", error)
        }
    }

    const getBalance = async () => {
        try {
            const allTxns = await fetchAllExpenses()

            let balance = 0
            let monthlyExp = 0
            const categoryTotals: Record<string, number> = {}

            const currentMonth = moment().month()
            const currentYear = moment().year()

            allTxns.forEach((txn: any) => {
                const amount = parseFloat(txn.amount)
                if (txn.type == 'credit') {
                    balance += amount
                } else if (txn.type == 'debit') {
                    balance -= amount

                    const txnDate = moment(txn.date, "YYYY-MM-DD")
                    if (txnDate.month() == currentMonth && txnDate.year() == currentYear) {
                        monthlyExp += amount
                    }
                    const cat = txn.category?.trim().toLowerCase() || 'N/A'
                    categoryTotals[cat] = (categoryTotals[cat] || 0) + amount
                }
            })

            setTotalBalance(balance)
            setMonthlyExpenses(monthlyExp)

        } catch (error) {
            console.error("error----------", error)
        }
    }

    const Labels = ({ slices }: any) => {
        return slices.map((slice: any, index: number) => {
            const { pieCentroid, data } = slice
            return (
                <SVGText
                    key={index}
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill="white"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={12}
                    stroke="black"
                    strokeWidth={0.2}
                >
                    {data.label}
                </SVGText>
            )
        })
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.5 }}>

                <Text style={styles.balance}>Total Balance: ₹{totalBalance.toFixed(2)}</Text>

                <Text style={styles.monthly}>Monthly Expenses: ₹{monthlyExpenses.toFixed(2)}</Text>

                <Text style={styles.title}>Last 5 Transactions</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }: { item: Expense, index: number }) => {
                        return (
                            <Text>
                                {index + 1} :-  {moment(item.date).format("DD-MMM-YYYY")}: - ₹{item.amount.toFixed(2)} - ({item.category})
                            </Text>
                        )
                    }}
                />
            </View>

            <View style={{ flex: 0.5 }}>
                <Text style={styles.header}>PIE CHART</Text>

                {pieData.length > 0 ? (
                    <PieChart
                        style={{ height: 250, color: "black" }}
                        data={pieData}
                        valueAccessor={({ item }: { item: any }) => item.value}
                    >
                        <Labels />
                    </PieChart>
                ) : (
                    <Text style={styles.noData}>N/A</Text>
                )}
            </View>
            <Footer navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
    item: { paddingVertical: 6 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    noData: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
    balance: { fontSize: 17, fontWeight: 'bold', marginBottom: 12, color: 'green' },
    monthly: { fontSize: 17, marginBottom: 15, color: 'red' },
})