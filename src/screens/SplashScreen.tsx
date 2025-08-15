import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../navigation/screen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>

const SplashScreen = ({ navigation }: Props) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('OnboardingScreen')
        }, 2000);
        return () => clearTimeout(timer)
    }, [navigation])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Expense Tracker</Text>
            <ActivityIndicator size="large" color="black" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});

export default SplashScreen