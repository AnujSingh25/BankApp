import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, TouchableOpacity, StyleSheet } from 'react-native';

export default function SwipeableTransactionItem({ item, onDelete, onEdit }: any) {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dx) > 10,
            onPanResponderMove: (_, gesture) => {
                translateX.setValue(gesture.dx)
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -100) {
                    Animated.spring(translateX, {
                        toValue: -100,
                        useNativeDriver: false,
                    }).start();
                } else if (gesture.dx > 100) {
                    Animated.spring(translateX, {
                        toValue: 100,
                        useNativeDriver: false,
                    }).start();
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={{ marginBottom: 10 }}>
            <View style={styles.hiddenActions}>
                {/* <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => onEdit(item.id)}>
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[styles.item, { transform: [{ translateX }] }]}
                {...panResponder.panHandlers}
            >
                <Text>{item.date} - ₹{item.amount} ({item.category})</Text>
                <Text style={styles.note}>{item.notes}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    hiddenActions: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 6,
    },
    actionBtn: {
        padding: 10,
        borderRadius: 6,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
        backgroundColor: 'red',
    },
    editBtn: {
        backgroundColor: 'blue',
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    item: {
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 8,
        borderRadius: 6,
    },
    note: { color: 'gray', fontSize: 12 },
    deleteBox: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 6,
    },
    deleteText: { color: 'white', fontWeight: 'bold' },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', marginTop: 20 },

})