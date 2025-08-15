import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid, Modal, FlatList } from 'react-native'
import { useDispatch } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import uuid from 'react-native-uuid'
import { addExpense } from '../store/slices/expenseSlice'
import Footer from '../components/Footer'
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { RootStackParamList } from '../navigation/screen'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

const validationSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required'),
    category: Yup.string().required('Category is required'),
    notes: Yup.string(),
    date: Yup.date().required('Date is required'),
})

const categoryOptions = ['Bank', 'Manual']

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpenseScreen'>

export default function AddExpenseScreen({ navigation }: Props) {
    const dispatch = useDispatch()
    const [viewCalendar, setViewCalendar] = useState<boolean>(false)
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false)

    const handleSubmit = (values: any) => {
        dispatch(addExpense({
            id: uuid.v4().toString(),
            amount: parseFloat(values.amount),
            category: values.category,
            notes: values.notes,
            date: values.date,
            type: 'debit',
            source: 'manual',
        }))
        ToastAndroid.show("Transaction added succesfully", 15)
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <Text style={styles.header}>Add Expenses</Text>
            <Formik
                initialValues={{ amount: '', category: '', notes: '', date: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View style={styles.container}>
                        <TextInput
                            placeholder="Amount"
                            placeholderTextColor="silver"
                            keyboardType="numeric"
                            value={values.amount}
                            onChangeText={handleChange('amount')}
                            onBlur={handleBlur('amount')}
                            style={styles.input}
                        />
                        {touched.amount && errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

                        <TouchableOpacity
                            onPress={() => setShowCategoryModal(true)}
                            style={styles.input}
                        >
                            <Text style={{ color: values.category ? 'black' : 'silver' }}>
                                {values.category || 'Select a category'}
                            </Text>
                        </TouchableOpacity>
                        {touched.category && errors.category && (
                            <Text style={styles.error}>{errors.category}</Text>
                        )}

                        <TextInput
                            placeholder="Notes"
                            placeholderTextColor="silver"
                            value={values.notes}
                            onChangeText={handleChange('notes')}
                            onBlur={handleBlur('notes')}
                            style={styles.input}
                        />

                        <TouchableOpacity onPress={() => setViewCalendar(true)}>
                            <TextInput
                                placeholder="Date (DD-MMM-YYYY)"
                                placeholderTextColor="silver"
                                value={values.date}
                                onChangeText={handleChange('date')}
                                onBlur={handleBlur('date')}
                                style={styles.input}
                                pointerEvents="none"
                                editable={false}
                            />
                        </TouchableOpacity>

                        {touched.date && errors.date && <Text style={styles.error}>{errors.date}</Text>}

                        {viewCalendar ?
                            <DateTimePickerModal
                                mode={'date'}
                                date={
                                    values.date
                                        ? moment(values.date, 'YYYY-MM-DD').toDate()
                                        : new Date()
                                }
                                isVisible={viewCalendar}
                                onConfirm={(date: Date) => {
                                    const formattedDate: any = moment(date).format("YYYY-MM-DD")
                                    setFieldValue('date', formattedDate)
                                    setViewCalendar(false)
                                }}
                                onCancel={() => { setViewCalendar(false) }}
                            /> : null
                        }

                        {showCategoryModal ?
                            <Modal
                                visible={showCategoryModal}
                                transparent
                                animationType="slide"
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>Select Category</Text>
                                        <FlatList
                                            data={categoryOptions}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.modalItem}
                                                    onPress={() => {
                                                        setFieldValue('category', item)
                                                        setShowCategoryModal(false)
                                                    }}
                                                >
                                                    <Text style={styles.modalItemText}> {item} </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                        <Button
                                            title="Cancel"
                                            onPress={() => setShowCategoryModal(false)}
                                        />
                                    </View>
                                </View>
                            </Modal>
                            : null}

                        <Button title="Save Expense" onPress={() => handleSubmit()} />
                    </View>
                )}
            </Formik>
            <Footer navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: 'white' },
    input: {
        borderWidth: 1,
        borderColor: 'silver',
        color: 'black',
        marginBottom: 12,
        padding: 10,
        borderRadius: 6,
        elevation: 8,
        backgroundColor: 'white'
    },
    error: { color: 'red', marginBottom: 8 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', marginTop: 20 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        marginHorizontal: 40,
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'silver',
    },
    modalItemText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
})