import React, { JSX } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './screen'
import SplashScreen from '../screens/SplashScreen'
import OnboardingScreen from '../screens/OnBoarding'
import HomeScreen from '../screens/HomeScreen'
import AddExpenseScreen from '../screens/AddExpenseScreen'
import TransactionHistoryScreen from '../screens/TransactionScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator(): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name={"SplashScreen"} component={SplashScreen} />
                <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="AddExpenseScreen" component={AddExpenseScreen} />
                <Stack.Screen name="TransactionHistoryScreen" component={TransactionHistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}