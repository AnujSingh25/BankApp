import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useDispatch } from 'react-redux';
import { clearAllExpenses, createTable, getAllExpenses, insertExpense } from '../db/db';
import { readBankSMS, requestSMSPermission } from '../services/smsReader';
import uuid from 'react-native-uuid';
import { resetExpenses } from '../store/slices/expenseSlice'
import { RootStackParamList } from '../navigation/screen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Expense } from '../types/expense';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingScreen'>

export default function OnboardingScreen({ navigation }: Props) {

    const dispatch = useDispatch()
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    const initApp = async () => {
        try {

            dispatch(resetExpenses())
            clearAllExpenses()

            const rnBiometrics = new ReactNativeBiometrics()
            const { available, biometryType } = await rnBiometrics.isSensorAvailable()

            if (available && biometryType) {
                const result = await rnBiometrics.simplePrompt({ promptMessage: 'Put your finger to unlock' })
                if (!result.success) {
                    alert('Authentication failed')
                    setAuthenticated(false)
                    return
                }
            } else {
                alert('Something went wrong')
                setAuthenticated(false)
                return
            }

            setAuthenticated(true)
            createTable()
            getAllExpenses(dispatch)

            const granted = await requestSMSPermission()
            if (granted) {
                try {
                    const messages: any = await readBankSMS()
                    console.log("mmmmmmmm", JSON.stringify(messages))

                    const parsedExpenses: Expense[] = messages.map((msg: any) => {
                        console.log("Parsed result --->>", msg);

                        if (msg && msg.amount) {
                            return {
                                id: uuid.v4().toString(),
                                amount: msg.amount,
                                category: 'Bank',
                                date: msg.date,
                                notes: msg.description,
                                type: msg.type,
                                source: 'sms',
                            };
                        }

                        return null
                    }).filter((expense: Expense) => expense !== null)

                    console.log("parsedExpenses---------", JSON.stringify(parsedExpenses))

                    for (const expense of parsedExpenses) {
                        console.log(JSON.stringify(expense))
                        insertExpense(expense)
                    }

                    getAllExpenses(dispatch)
                    navigation.replace('HomeScreen')
                } catch (error) {
                    console.log(error);
                }
            } else {
                alert('Something went wrong!')
            }
        } catch (error) {
            alert('Something went wrong!')
        }
    }

    if (!authenticated) return (
        <View style={styles.container}>
            <Text style={styles.heading}>Please Unlock</Text>
            <Button title="Please unlock" onPress={initApp} />
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome to Expense Tracker</Text>
            <Button title="Let's Go  -->  " onPress={initApp} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
})